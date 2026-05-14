import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const FREE_STATUS = {
  success: true,
  subscription: { status: 'free', plan: 'free', expiryDate: null, daysLeft: 0, startDate: null },
  payments: [],
};

const FALLBACK_OFFERS = [
  {
    id: 'scalify-trial',
    name: '7-Day Free Trial',
    description: 'Try all features free for 7 days — no credit card required',
    plan_type: 'trial',
    price: 0,
    original_price: 0,
    trial_days: 7,
    features: [
      'Website + Search Engine Optimization',
      'Unlimited Pages Professional Website',
      'Add Your Custom Domain',
      'Free Hosting',
      'Website Maintenance',
    ],
    is_active: true,
    sort_order: -1,
  },
  {
    id: 'scalify-pro',
    name: 'Scalify Pro',
    description: 'Everything you need to grow your business online',
    plan_type: 'pro',
    price: 1499,
    original_price: 2499,
    trial_days: 0,
    features: [
      'Website + Search Engine Optimization',
      'Unlimited Pages Professional Website',
      'Add Your Custom Domain',
      'Free Hosting',
      'Website Maintenance',
      'On-Page & Technical SEO',
      'Google Search Console Setup',
      'Mobile Responsive Design',
      'SSL Certificate',
      'Priority Chat Support',
      'WhatsApp Chat Button',
      'Contact Form',
      'Social Media Integration',
      'Monthly Analytics & SEO Report',
    ],
    is_active: true,
    sort_order: 0,
  },
];

// Admin client bypasses RLS — used for all writes
function db() {
  return createClient(SUPABASE_URL, SERVICE_KEY || ANON_KEY);
}

// Verify JWT and return user; returns null if invalid
async function getUser(req: Request) {
  const jwt = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  if (!jwt) return null;
  const { data: { user } } = await createClient(SUPABASE_URL, ANON_KEY).auth.getUser(jwt);
  return user ?? null;
}

// ─── GET /payment/offers ───────────────────────────────────────────────────────
async function handleOffers() {
  try {
    const { data } = await db()
      .from('offers')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (data && data.length > 0) return Response.json({ offers: data });
  } catch (e) {
    console.error('offers fetch error:', e);
  }
  return Response.json({ offers: FALLBACK_OFFERS });
}

// ─── GET /payment/status ───────────────────────────────────────────────────────
async function handleStatus(req: Request) {
  const user = await getUser(req);
  if (!user) return Response.json(FREE_STATUS);

  const { data: sub } = await db()
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!sub) return Response.json(FREE_STATUS);

  const now = new Date();
  const endDate = new Date(sub.end_date);
  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / 86400000));
  const status = daysLeft <= 0 ? 'expired' : sub.plan === 'trial' ? 'trial' : 'active';

  const { data: payments } = await db()
    .from('payments')
    .select('id, amount, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  return Response.json({
    success: true,
    subscription: {
      status,
      plan: sub.plan,
      expiryDate: sub.end_date,
      daysLeft,
      startDate: sub.start_date,
    },
    payments: payments || [],
  });
}

// ─── POST /payment/start-trial ─────────────────────────────────────────────────
async function handleStartTrial(req: Request) {
  const user = await getUser(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Check for any existing trial subscription (active or not)
  const { data: existing } = await db()
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('plan', 'trial')
    .limit(1)
    .maybeSingle();

  if (existing) {
    const endDate = new Date(existing.end_date);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / 86400000));

    if (daysLeft <= 0) {
      return Response.json({ error: 'Your free trial has expired. Please subscribe to continue.' }, { status: 400 });
    }

    // Trial exists and is still valid — ensure profile is updated and return success
    await db().from('profiles').update({ plan: 'trial' }).eq('id', user.id);
    return Response.json({
      success: true,
      subscription: { id: existing.id, plan: 'trial', trialDays: daysLeft, endDate: existing.end_date },
    });
  }

  // Create new trial
  const trialDays = 7;
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + trialDays);

  const { data: sub, error: subErr } = await db()
    .from('subscriptions')
    .insert({
      user_id: user.id,
      plan: 'trial',
      amount: 0,
      status: 'active',
      start_date: now.toISOString(),
      end_date: end.toISOString(),
      auto_renew: false,
    })
    .select()
    .maybeSingle();

  if (subErr) {
    console.error('Trial insert error:', subErr);
    return Response.json({ error: 'Failed to start trial. Contact support.' }, { status: 500 });
  }

  await db().from('profiles').update({ plan: 'trial' }).eq('id', user.id);

  return Response.json({
    success: true,
    subscription: { id: sub?.id, plan: 'trial', trialDays, endDate: end.toISOString() },
  });
}

// ─── POST /payment/create-payment-link ────────────────────────────────────────
async function handleCreatePaymentLink(req: Request) {
  const user = await getUser(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    console.error('Razorpay keys missing from env');
    return Response.json({ error: 'Payment service not configured. Contact support.' }, { status: 503 });
  }

  try {
    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const rzRes = await fetch('https://api.razorpay.com/v1/payment_links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${credentials}` },
      body: JSON.stringify({
        amount: 149900,
        currency: 'INR',
        description: 'Scalify Pro — ₹1499/month',
        customer_notify: 1,
        notes: { userId: user.id, email: user.email || '' },
        callback_url: 'https://scalifyapp.com/payment-success?payment=success',
        callback_method: 'get',
      }),
    });

    const rzData = await rzRes.json();
    if (!rzRes.ok) {
      console.error('Razorpay API error:', rzData);
      return Response.json({ error: 'Failed to create payment link' }, { status: 502 });
    }

    return Response.json({ success: true, paymentLink: rzData.short_url, paymentLinkId: rzData.id });
  } catch (err) {
    console.error('Razorpay request failed:', err);
    return Response.json({ error: 'Failed to create payment link' }, { status: 500 });
  }
}

// ─── POST /payment/cancel ──────────────────────────────────────────────────────
async function handleCancel(req: Request) {
  const user = await getUser(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: sub } = await db()
    .from('subscriptions')
    .select('id, end_date')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!sub) return Response.json({ error: 'No active subscription found' }, { status: 404 });

  await db().from('subscriptions').update({ status: 'cancelled' }).eq('id', sub.id);
  await db().from('profiles').update({ plan: 'trial' }).eq('id', user.id);

  const accessUntil = new Date(sub.end_date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return Response.json({ success: true, message: `Subscription cancelled. Access continues until ${accessUntil}.` });
}

// ─── POST /payment/webhook ─────────────────────────────────────────────────────
async function handleWebhook(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature') || '';

  if (secret) {
    const { createHmac } = await import('crypto');
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    if (expected !== signature) {
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }
  }

  let event: { event: string; payload?: Record<string, unknown> };
  try { event = JSON.parse(rawBody); } catch { return Response.json({ ok: true }); }

  const paymentData =
    (event.payload?.payment as { entity?: Record<string, unknown> })?.entity ||
    (event.payload?.payment_link as { entity?: Record<string, unknown> })?.entity;

  if (
    (event.event === 'payment.captured' || event.event === 'payment_link.paid') &&
    paymentData
  ) {
    const userId = (paymentData.notes as Record<string, string>)?.userId;
    const amount = Number(paymentData.amount || 149900);
    const razorpayId = String(paymentData.id || '');

    if (userId) {
      const now = new Date();
      const end = new Date(now);
      end.setDate(end.getDate() + 30);

      await db().from('subscriptions').insert({
        user_id: userId,
        plan: 'pro',
        amount: amount / 100,
        status: 'active',
        start_date: now.toISOString(),
        end_date: end.toISOString(),
        auto_renew: false,
      });

      await db().from('profiles').update({ plan: 'pro' }).eq('id', userId);

      if (razorpayId) {
        await db().from('payments').upsert({
          user_id: userId,
          razorpay_payment_id: razorpayId,
          amount: amount / 100,
          status: 'completed',
          plan: 'pro',
        }, { onConflict: 'razorpay_payment_id' }).select();
      }
    }
  }

  return Response.json({ ok: true });
}

// ─── Router ────────────────────────────────────────────────────────────────────

export async function GET(req: Request, { params }: { params: { slug: string[] } }) {
  const endpoint = `/${params.slug.join('/')}`;
  if (endpoint === '/offers') return handleOffers();
  if (endpoint === '/status') return handleStatus(req);
  return Response.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(req: Request, { params }: { params: { slug: string[] } }) {
  const endpoint = `/${params.slug.join('/')}`;
  if (endpoint === '/start-trial') return handleStartTrial(req);
  if (endpoint === '/create-payment-link') return handleCreatePaymentLink(req);
  if (endpoint === '/cancel') return handleCancel(req);
  if (endpoint === '/webhook') return handleWebhook(req);
  return Response.json({ error: 'Not found' }, { status: 404 });
}
