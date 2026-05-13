export async function POST(req: Request, { params }: { params: { slug: string[] } }) {
  const endpoint = `/${params.slug.join('/')}`;

  try {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const url = `${backendUrl}/api/payment${endpoint}`;

    const authHeader = req.headers.get('authorization');
    const body = await req.json().catch(() => ({}));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { authorization: authHeader }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(data, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    console.error('Payment proxy error:', error instanceof Error ? error.message : String(error));
    return Response.json(
      { error: 'Payment service unavailable' },
      { status: 503 }
    );
  }
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
