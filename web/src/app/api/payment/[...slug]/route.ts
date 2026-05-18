import { createClient } from '@supabase/supabase-js';
import { sendCapiEvent } from '@/lib/metaCapi';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const WHATSAPP_SUPPORT = 'https://wa.me/916353583148?text=Hi%2C%20I%20want%20to%20subscribe%20to%20Scalify%20Pro%20%E2%80%94%20please%20share%20payment%20details';

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
      'Monthly Analytics & SEO Report',
      'Google Map Integration',
    ],
    is_active: true,
    sort_order: 0,
  },
];

function db() {
  return createClient(SUPABASE_URL, SERVICE_KEY || ANON_KEY);
}

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

// ─── A/B test: ₹299 vs ₹499 vs ₹899 welcome offer ───────────────────────────
// Assigns variant by hashing userId (3-way). After 30 AB payments, picks winner
// by total revenue. Winner sticks for all future users.
async function getWelcomeCoupon(user: { id: string; created_at?: string }) {
  if (!user.created_at) return null;
  const createdAt = new Date(user.created_at);
  const now = new Date();
  const mins = (now.getTime() - createdAt.getTime()) / 60000;
  const digits = user.id.replace(/[^0-9]/g, '').padEnd(6, '0');

  if (mins < 7) {
    // Query AB payment counts
    const { data: abPayments } = await db()
      .from('payments')
      .select('amount')
      .in('amount', [299, 499, 899])
      .eq('status', 'completed');

    const count299 = (abPayments || []).filter((p: any) => Number(p.amount) === 299).length;
    const count499 = (abPayments || []).filter((p: any) => Number(p.amount) === 499).length;
    const count899 = (abPayments || []).filter((p: any) => Number(p.amount) === 899).length;
    const total = count299 + count499 + count899;

    let price: 299 | 499 | 899;
    if (total >= 30) {
      // Winner decided by total revenue
      const rev299 = count299 * 299;
      const rev499 = count499 * 499;
      const rev899 = count899 * 899;
      const maxRev = Math.max(rev299, rev499, rev899);
      price = maxRev === rev299 ? 299 : maxRev === rev499 ? 499 : 899;
    } else {
      // 3-way deterministic split by user ID hash
      const hash = user.id.replace(/-/g, '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      price = hash % 3 === 0 ? 299 : hash % 3 === 1 ? 499 : 899;
    }

    return {
      tier: 1 as const,
      code: 'SCALE' + digits.slice(0, 3),
      price,
      discount: 1499 - price,
      expiresAt: new Date(createdAt.getTime() + 7 * 60000).toISOString(),
      label: 'Welcome Offer',
      userCreatedAt: user.created_at,
      ab: { count299, count499, count899, total, winner: total >= 30 ? price : null },
    };
  }

  if (mins < 24 * 60) {
    return {
      tier: 2 as const,
      code: 'DEAL' + digits.slice(3, 6),
      price: 1199,
      discount: 300,
      expiresAt: new Date(createdAt.getTime() + 24 * 3600000).toISOString(),
      label: '24-Hour Exclusive',
      userCreatedAt: user.created_at,
    };
  }
  return null;
}

// ─── GET /payment/status ───────────────────────────────────────────────────────
async function handleStatus(req: Request) {
  const user = await getUser(req);
  if (!user) return Response.json(FREE_STATUS);

  // Admin-applied coupon takes priority over auto-generated one
  let coupon = null;
  const { data: adminCoupon } = await db()
    .from('admin_coupons')
    .select('price, original_price, expires_at')
    .eq('user_id', user.id)
    .maybeSingle();

  if (adminCoupon && new Date(adminCoupon.expires_at) > new Date()) {
    const discount = (adminCoupon.original_price || 1499) - adminCoupon.price;
    coupon = {
      tier: 1 as const,
      code: 'SPECIAL' + user.id.replace(/[^0-9]/g, '').slice(0, 3).padEnd(3, '0'),
      price: adminCoupon.price,
      discount,
      expiresAt: adminCoupon.expires_at,
      label: 'Special Offer',
    };
  } else {
    coupon = await getWelcomeCoupon(user);
  }

  const { data: sub } = await db()
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!sub) return Response.json({ ...FREE_STATUS, coupon });

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
    subscription: { status, plan: sub.plan, expiryDate: sub.end_date, daysLeft, startDate: sub.start_date },
    payments: payments || [],
    coupon,
  });
}

// ─── POST /payment/start-trial ─────────────────────────────────────────────────
async function handleStartTrial(req: Request) {
  const user = await getUser(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

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
    await db().from('profiles').update({ plan: 'trial' }).eq('id', user.id);
    return Response.json({
      success: true,
      subscription: { id: existing.id, plan: 'trial', trialDays: daysLeft, endDate: existing.end_date },
    });
  }

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

// ─── POST /payment/create-order ────────────────────────────────────────────────
// Creates a Razorpay order — frontend opens the checkout modal with the order ID
async function handleCreateOrder(req: Request) {
  const user = await getUser(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) {
    console.error('Razorpay keys not configured');
    return Response.json({
      success: false,
      error: 'Online payment not configured. Please pay via WhatsApp.',
      whatsappFallback: WHATSAPP_SUPPORT,
    });
  }

  // Check admin coupon first, then auto-generated
  let coupon = null;
  const { data: adminCouponOrder } = await db()
    .from('admin_coupons')
    .select('price, original_price, expires_at')
    .eq('user_id', user.id)
    .maybeSingle();
  if (adminCouponOrder && new Date(adminCouponOrder.expires_at) > new Date()) {
    const discount = (adminCouponOrder.original_price || 1499) - adminCouponOrder.price;
    coupon = { price: adminCouponOrder.price, discount, label: 'Special Offer' };
  } else {
    coupon = await getWelcomeCoupon(user);
  }

  const amount = coupon ? coupon.price * 100 : 149900;
  const description = coupon
    ? `Scalify Pro — ₹${coupon.price} first month (${coupon.label})`
    : 'Scalify Pro — ₹1,499/month';

  try {
    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rzRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${credentials}` },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        notes: { userId: user.id, email: user.email || '', description },
      }),
    });

    const rzData = await rzRes.json();
    if (!rzRes.ok) {
      console.error('Razorpay create-order error:', JSON.stringify(rzData));
      return Response.json({
        success: false,
        error: rzData?.error?.description || 'Failed to create payment order',
        whatsappFallback: WHATSAPP_SUPPORT,
      });
    }

    return Response.json({
      success: true,
      orderId: rzData.id,
      amount: rzData.amount,
      currency: rzData.currency,
      keyId,
      description,
      displayPrice: coupon ? coupon.price : 1499,
    });
  } catch (err) {
    console.error('Razorpay request exception:', err);
    return Response.json({
      success: false,
      error: 'Payment service unavailable. Please pay via WhatsApp.',
      whatsappFallback: WHATSAPP_SUPPORT,
    });
  }
}

// ─── POST /payment/verify ──────────────────────────────────────────────────────
// Verifies Razorpay payment signature and activates subscription
async function handleVerifyPayment(req: Request) {
  const user = await getUser(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
  const ua = req.headers.get('user-agent') || '';
  const fbc = req.headers.get('cookie')?.match(/_fbc=([^;]+)/)?.[1] || '';
  const fbp = req.headers.get('cookie')?.match(/_fbp=([^;]+)/)?.[1] || '';

  let body: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; event_id?: string; amount?: number };
  try { body = await req.json(); } catch {
    return Response.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (keySecret) {
    const { createHmac } = await import('crypto');
    const expected = createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    if (expected !== razorpay_signature) {
      console.error('Razorpay signature mismatch');
      return Response.json({ error: 'Payment verification failed' }, { status: 400 });
    }
  }

  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + 30);

  const { error: subErr } = await db().from('subscriptions').insert({
    user_id: user.id,
    plan: 'pro',
    amount: 1499,
    status: 'active',
    start_date: now.toISOString(),
    end_date: end.toISOString(),
    auto_renew: false,
  });

  if (subErr) {
    console.error('Subscription insert error:', subErr);
    return Response.json({ error: 'Subscription activation failed. Contact support.' }, { status: 500 });
  }

  await db().from('profiles').update({ plan: 'pro' }).eq('id', user.id);

  if (razorpay_payment_id) {
    await db().from('payments').upsert({
      user_id: user.id,
      razorpay_payment_id,
      amount: 1499,
      status: 'completed',
      plan: 'pro',
    }, { onConflict: 'razorpay_payment_id' });
  }

  // Server-side Purchase event — deduplicates with client fbq('track','Purchase')
  const paidAmount = body.amount || 1499;
  sendCapiEvent({
    eventName: 'Purchase',
    eventId: body.event_id || razorpay_payment_id || `purchase_${user.id}`,
    eventSourceUrl: 'https://scalifyapp.com/dashboard/plans',
    userData: {
      email: user.email || '',
      client_ip_address: ip,
      client_user_agent: ua,
      fbc,
      fbp,
    },
    customData: { value: paidAmount, currency: 'INR', content_name: 'Scalify Pro' },
  }).catch(() => {});

  return Response.json({ success: true });
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

// ─── POST /payment/initiate-checkout ──────────────────────────────────────────
async function handleInitiateCheckout(req: Request) {
  const user = await getUser(req);
  if (!user) return Response.json({ ok: true }); // fire-and-forget, don't block

  let body: { event_id?: string; amount?: number } = {};
  try { body = await req.json(); } catch { /* ok */ }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
  const ua = req.headers.get('user-agent') || '';
  const fbc = req.headers.get('cookie')?.match(/_fbc=([^;]+)/)?.[1] || '';
  const fbp = req.headers.get('cookie')?.match(/_fbp=([^;]+)/)?.[1] || '';

  sendCapiEvent({
    eventName: 'InitiateCheckout',
    eventId: body.event_id || `checkout_${user.id}_${Date.now()}`,
    eventSourceUrl: 'https://scalifyapp.com/dashboard/plans',
    userData: {
      email: user.email || '',
      client_ip_address: ip,
      client_user_agent: ua,
      fbc: fbc || undefined,
      fbp: fbp || undefined,
    },
    customData: { value: body.amount || 1499, currency: 'INR' },
  }).catch(() => {});

  return Response.json({ ok: true });
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
        }, { onConflict: 'razorpay_payment_id' });
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
  if (endpoint === '/create-order') return handleCreateOrder(req);
  if (endpoint === '/verify') return handleVerifyPayment(req);
  if (endpoint === '/initiate-checkout') return handleInitiateCheckout(req);
  if (endpoint === '/cancel') return handleCancel(req);
  if (endpoint === '/webhook') return handleWebhook(req);
  return Response.json({ error: 'Not found' }, { status: 404 });
}
