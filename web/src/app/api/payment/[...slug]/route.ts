async function startTrialViaSupabase(authHeader: string | null) {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // Extract JWT and verify the user — must pass token directly to getUser()
    const jwt = authHeader?.replace(/^Bearer\s+/i, '').trim();
    if (!jwt) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const authClient = createClient(supabaseUrl, anonKey);
    const { data: { user }, error: authErr } = await authClient.auth.getUser(jwt);
    if (authErr || !user) {
      console.error('Trial auth error:', authErr?.message);
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use service role for writes if available (bypasses RLS), otherwise user's JWT
    const writeClient = serviceRoleKey
      ? createClient(supabaseUrl, serviceRoleKey)
      : createClient(supabaseUrl, anonKey, {
          global: { headers: { authorization: `Bearer ${jwt}` } },
        });

    // Check if trial already used
    const { data: existing } = await writeClient
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('plan', 'trial')
      .limit(1);

    if (existing && existing.length > 0) {
      return Response.json({ error: 'You have already used your free trial' }, { status: 400 });
    }

    const trialDays = 7;
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + trialDays);

    const { data: sub, error: subErr } = await writeClient
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan: 'trial',
        amount: 0,
        status: 'active',
        start_date: now.toISOString(),
        end_date: endDate.toISOString(),
        auto_renew: false,
      })
      .select()
      .maybeSingle();

    if (subErr) {
      console.error('Trial insert error:', subErr);
      return Response.json({ error: 'Failed to start trial' }, { status: 500 });
    }

    await writeClient.from('profiles').update({ plan: 'trial' }).eq('id', user.id);

    return Response.json({
      success: true,
      subscription: { id: sub?.id, plan: 'trial', trialDays, endDate: endDate.toISOString() },
    });
  } catch (err) {
    console.error('Supabase trial fallback error:', err instanceof Error ? err.message : String(err));
    return Response.json({ error: 'Failed to start trial' }, { status: 500 });
  }
}

async function createPaymentLinkDirect() {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return Response.json({ error: 'Payment service not configured. Contact support.' }, { status: 503 });
    }

    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const callbackUrl = 'https://scalifyapp.com/payment-success?payment=success';

    const response = await fetch('https://api.razorpay.com/v1/payment_links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        amount: 149900,
        currency: 'INR',
        description: 'Scalify Pro — ₹1499/month',
        customer_notify: 1,
        callback_url: callbackUrl,
        callback_method: 'get',
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Razorpay direct error:', data);
      return Response.json({ error: 'Failed to create payment link' }, { status: 502 });
    }

    return Response.json({ success: true, paymentLink: data.short_url, paymentLinkId: data.id });
  } catch (err) {
    console.error('Razorpay direct fallback error:', err instanceof Error ? err.message : String(err));
    return Response.json({ error: 'Failed to create payment link' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { slug: string[] } }) {
  const endpoint = `/${params.slug.join('/')}`;
  const authHeader = req.headers.get('authorization');
  const body = await req.json().catch(() => ({}));

  // Try backend if configured
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
  if (backendUrl) {
    try {
      const response = await fetch(`${backendUrl}/api/payment${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { authorization: authHeader }),
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) return Response.json(data);
      // Non-2xx from backend — return as-is (e.g. 400 "already used trial")
      return Response.json(data, { status: response.status });
    } catch (error) {
      console.error('Payment proxy error:', error instanceof Error ? error.message : String(error));
    }
  }

  // Fallbacks when backend is unavailable
  if (endpoint === '/start-trial') {
    return startTrialViaSupabase(authHeader);
  }

  if (endpoint === '/create-payment-link') {
    return createPaymentLinkDirect();
  }

  return Response.json({ error: 'Payment service unavailable' }, { status: 503 });
}

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

async function getStatusFromSupabase(authHeader: string | null) {
  try {
    if (!authHeader) return null;
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      { global: { headers: { authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get active subscription
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sub) {
      return { success: true, subscription: { status: 'free', plan: 'free', expiryDate: null, daysLeft: 0, startDate: null }, payments: [] };
    }

    const endDate = new Date(sub.end_date);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / 86400000));
    const status = daysLeft <= 0 ? 'expired' : sub.plan === 'trial' ? 'trial' : 'active';

    return {
      success: true,
      subscription: { status, plan: sub.plan, expiryDate: sub.end_date, daysLeft, startDate: sub.start_date },
      payments: [],
    };
  } catch {
    return null;
  }
}

export async function GET(req: Request, { params }: { params: { slug: string[] } }) {
  const endpoint = `/${params.slug.join('/')}`;
  const authHeader = req.headers.get('authorization');

  try {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const url = `${backendUrl}/api/payment${endpoint}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { authorization: authHeader }),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Payment proxy error for ${endpoint}: ${response.status}`, data);
      if (endpoint === '/offers') return Response.json({ offers: FALLBACK_OFFERS });
      if (endpoint === '/status') {
        const supabaseStatus = await getStatusFromSupabase(authHeader);
        return Response.json(supabaseStatus || { success: true, subscription: { status: 'free', plan: 'free', expiryDate: null, daysLeft: 0, startDate: null }, payments: [] });
      }
      return Response.json(data, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    console.error('Payment proxy error:', error instanceof Error ? error.message : String(error));

    if (endpoint === '/offers') return Response.json({ offers: FALLBACK_OFFERS });
    if (endpoint === '/status') {
      const supabaseStatus = await getStatusFromSupabase(authHeader);
      return Response.json(supabaseStatus || { success: true, subscription: { status: 'free', plan: 'free', expiryDate: null, daysLeft: 0, startDate: null }, payments: [] });
    }

    return Response.json({ error: 'Payment service unavailable' }, { status: 503 });
  }
}
