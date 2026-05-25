import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Service-key client — for auth.admin.* operations only (create/delete/update auth users).
// Falls back to anon if service key is absent; auth.admin calls will fail with a clear error.
function db() {
  return createClient(SUPABASE_URL, SERVICE_KEY || ANON_KEY);
}

// Authenticated client using the admin's JWT — activates admin RLS policies for all data queries.
// Works without the service key as long as the user is an admin in the profiles table.
function dbAuth(jwt: string) {
  return createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });
}

async function requireAdmin(req: Request): Promise<{ user: any; jwt: string } | Response> {
  const jwt = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  if (!jwt) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: { user } } = await createClient(SUPABASE_URL, ANON_KEY).auth.getUser(jwt);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: profile } = await dbAuth(jwt).from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') return Response.json({ error: 'Admin access required' }, { status: 403 });
  return { user, jwt };
}

// ── GET /api/admin/dashboard ───────────────────────────────────────────────────
async function handleDashboard(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  const adb = dbAuth(auth.jwt);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [allUsers, paidSubs, monthlyNewUsers, allPayments, monthlyPayments] = await Promise.all([
    adb.from('profiles').select('id', { count: 'exact', head: true }),
    adb.from('subscriptions').select('user_id').eq('plan', 'pro').in('status', ['active', 'expiring']),
    adb.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', monthStart.toISOString()),
    adb.from('payments').select('amount').eq('status', 'completed'),
    adb.from('payments').select('amount').eq('status', 'completed').gte('created_at', monthStart.toISOString()),
  ]);

  const uniquePaidUsers = new Set((paidSubs.data || []).map((s: any) => s.user_id)).size;
  const totalRevenue = (allPayments.data || []).reduce((s: number, p: any) => s + (parseFloat(p.amount) || 0), 0);
  const monthlyRevenue = (monthlyPayments.data || []).reduce((s: number, p: any) => s + (parseFloat(p.amount) || 0), 0);

  return Response.json({
    metrics: {
      uniquePaidUsers,
      monthly: { newUsers: monthlyNewUsers.count || 0, revenue: Math.round(monthlyRevenue) },
      totalRevenue: Math.round(totalRevenue),
    },
    totals: { totalUsers: allUsers.count || 0 },
  });
}

// ── GET /api/admin/users ───────────────────────────────────────────────────────
async function handleGetUsers(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  const adb = dbAuth(auth.jwt);

  const { data: profiles, error } = await adb
    .from('profiles')
    .select(`
      id, name, email, phone, plan, role,
      business_name, business_category, business_city,
      whatsapp_number, business_address, business_description,
      logo_url, instagram_url, facebook_url, existing_website_url,
      services, gallery_images, domain_purchased, domain_name,
      google_maps_link, onboarding_completed, created_at
    `)
    .order('created_at', { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const userIds = (profiles || []).map((u: any) => u.id);
  const { data: allSubs } = await adb
    .from('subscriptions')
    .select('user_id, plan, status, end_date, amount, start_date')
    .in('user_id', userIds)
    .order('created_at', { ascending: false });

  const subMap: Record<string, any> = {};
  (allSubs || []).forEach((sub: any) => {
    if (!subMap[sub.user_id]) subMap[sub.user_id] = sub;
  });

  const users = (profiles || []).map((u: any) => ({
    ...u,
    subscription: subMap[u.id] || { plan: 'free', status: 'inactive', end_date: null, amount: 0 },
  }));

  return Response.json({ success: true, users });
}

// ── DELETE /api/admin/users/:id ────────────────────────────────────────────────
async function handleDeleteUser(req: Request, userId: string) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  const adb = dbAuth(auth.jwt);

  if (!SERVICE_KEY) return Response.json({ error: 'Service key not configured' }, { status: 503 });

  // Delete auth user first — this prevents FK constraint errors on cascaded tables
  const { error: authErr } = await db().auth.admin.deleteUser(userId);
  if (authErr) {
    console.error('Auth delete error:', authErr);
    return Response.json({ error: authErr.message }, { status: 500 });
  }

  // Wipe all remaining rows (ON DELETE CASCADE handles most, this catches the rest)
  await Promise.allSettled([
    adb.from('website_progress').delete().eq('user_id', userId),
    adb.from('task_comments').delete().eq('user_id', userId),
    adb.from('subscriptions').delete().eq('user_id', userId),
    adb.from('payments').delete().eq('user_id', userId),
    adb.from('websites').delete().eq('user_id', userId),
    adb.from('notifications').delete().eq('user_id', userId),
    adb.from('profiles').delete().eq('id', userId),
  ]);

  return Response.json({ success: true });
}

// ── POST /api/admin/users/:id/set-password ────────────────────────────────────
async function handleSetPassword(req: Request, userId: string) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  let body: { password: string };
  try { body = await req.json(); } catch { return Response.json({ error: 'Invalid body' }, { status: 400 }); }

  const { password } = body;
  if (!password || password.length < 6) return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 });

  if (!SERVICE_KEY) return Response.json({ error: 'Service key not configured' }, { status: 503 });
  const { error } = await db().auth.admin.updateUserById(userId, { password });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ success: true });
}

// ── POST /api/admin/users — Create user ───────────────────────────────────────
async function handleCreateUser(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  const adb = dbAuth(auth.jwt);

  let body: any;
  try { body = await req.json(); } catch { return Response.json({ error: 'Invalid body' }, { status: 400 }); }

  const { email, password, name, phone, plan, amount } = body;
  if (!email || !password) return Response.json({ error: 'Email and password required' }, { status: 400 });
  if (!SERVICE_KEY) return Response.json({ error: 'Service key not configured' }, { status: 503 });

  const { data: authData, error: authError } = await db().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: name || '', phone: phone || '' },
  });
  if (authError) return Response.json({ error: authError.message }, { status: 400 });

  const userId = authData.user.id;
  const selectedPlan = plan || 'free';

  await adb.from('profiles').upsert({
    id: userId, email, name: name || '', phone: phone || '', plan: selectedPlan,
  });

  if (selectedPlan === 'pro') {
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + 30);
    const paidAmount = Number(amount) || 1499;

    await adb.from('subscriptions').insert({
      user_id: userId, plan: 'pro', amount: paidAmount, status: 'active',
      start_date: now.toISOString(), end_date: end.toISOString(), auto_renew: false,
    });
    await adb.from('payments').insert({
      user_id: userId, amount: paidAmount, status: 'completed', plan: 'pro', method: 'manual_admin',
    });
  }

  return Response.json({ success: true, userId });
}

// ── POST /api/admin/users/:id/set-plan ────────────────────────────────────────
async function handleSetPlan(req: Request, userId: string) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  const adb = dbAuth(auth.jwt);

  let body: any;
  try { body = await req.json(); } catch { return Response.json({ error: 'Invalid body' }, { status: 400 }); }

  const { plan, amount, months = 1 } = body;
  const selectedPlan = plan || 'free';
  const paidAmount = Number(amount) || 1499;

  await adb.from('subscriptions').update({ status: 'cancelled' }).eq('user_id', userId).eq('status', 'active');

  if (selectedPlan === 'pro') {
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + 30 * Number(months));

    await adb.from('subscriptions').insert({
      user_id: userId, plan: 'pro', amount: paidAmount, status: 'active',
      start_date: now.toISOString(), end_date: end.toISOString(), auto_renew: false,
    });
    await adb.from('payments').insert({
      user_id: userId, amount: paidAmount, status: 'completed', plan: 'pro', method: 'manual_admin',
    });
  }

  await adb.from('profiles').update({ plan: selectedPlan }).eq('id', userId);
  return Response.json({ success: true });
}

// ── POST /api/admin/users/:id/manual-upgrade ──────────────────────────────────
async function handleManualUpgrade(req: Request, userId: string) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  const adb = dbAuth(auth.jwt);

  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + 30);

  await adb.from('subscriptions').update({ status: 'cancelled' }).eq('user_id', userId).eq('status', 'active');
  await adb.from('subscriptions').insert({
    user_id: userId, plan: 'pro', amount: 1499, status: 'active',
    start_date: now.toISOString(), end_date: end.toISOString(), auto_renew: false,
  });
  await adb.from('profiles').update({ plan: 'pro' }).eq('id', userId);
  return Response.json({ success: true });
}

// ── GET /api/admin/subscriptions ──────────────────────────────────────────────
async function handleSubscriptions(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  const adb = dbAuth(auth.jwt);

  const { data, error } = await adb
    .from('subscriptions')
    .select(`
      id, user_id, plan, status, amount, start_date, end_date, auto_renew, created_at,
      profiles!inner(name, email, phone, whatsapp_number)
    `)
    .order('created_at', { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true, subscriptions: data || [] });
}

// ── GET /api/admin/payments ────────────────────────────────────────────────────
async function handlePayments(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  const adb = dbAuth(auth.jwt);

  const { data, error } = await adb
    .from('payments')
    .select(`
      id, user_id, amount, status, plan, method, created_at,
      razorpay_payment_id, transaction_id,
      profiles!inner(name, email, phone, whatsapp_number)
    `)
    .order('created_at', { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true, payments: data || [] });
}

// ── POST /api/admin/users/:id/extend (for subscriptions page) ────────────────
async function handleExtend(req: Request, subId: string) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  const adb = dbAuth(auth.jwt);

  let body: any = {};
  try { body = await req.json(); } catch { /* ok */ }
  const days = Number(body.days) || 30;

  const { data: sub } = await adb.from('subscriptions').select('end_date').eq('id', subId).maybeSingle();
  if (!sub) return Response.json({ error: 'Subscription not found' }, { status: 404 });

  const currentEnd = new Date(sub.end_date);
  const base = currentEnd > new Date() ? currentEnd : new Date();
  base.setDate(base.getDate() + days);

  await adb.from('subscriptions').update({ end_date: base.toISOString(), status: 'active' }).eq('id', subId);
  return Response.json({ success: true });
}

// ── GET /api/admin/offers ─────────────────────────────────────────────────────
async function handleGetOffers(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  const adb = dbAuth(auth.jwt);
  const { data, error } = await adb.from('offers').select('*').order('sort_order', { ascending: true });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true, offers: data || [] });
}

// ── POST /api/admin/offers ────────────────────────────────────────────────────
async function handleCreateOffer(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  const adb = dbAuth(auth.jwt);
  let body: any;
  try { body = await req.json(); } catch { return Response.json({ error: 'Invalid body' }, { status: 400 }); }
  const { data, error } = await adb.from('offers').insert(body).select().maybeSingle();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true, offer: data });
}

// ── PUT /api/admin/offers/:id ─────────────────────────────────────────────────
async function handleUpdateOffer(req: Request, offerId: string) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  const adb = dbAuth(auth.jwt);
  let body: any;
  try { body = await req.json(); } catch { return Response.json({ error: 'Invalid body' }, { status: 400 }); }
  const { error } = await adb.from('offers').update(body).eq('id', offerId);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}

// ── DELETE /api/admin/offers/:id ──────────────────────────────────────────────
async function handleDeleteOffer(req: Request, offerId: string) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  const adb = dbAuth(auth.jwt);
  const { error } = await adb.from('offers').delete().eq('id', offerId);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}

// ── POST /api/admin/users/:id/apply-coupon ────────────────────────────────────
async function handleApplyCoupon(req: Request, userId: string) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  const adb = dbAuth(auth.jwt);

  let body: { price: number; original_price?: number; minutes: number };
  try { body = await req.json(); } catch { return Response.json({ error: 'Invalid body' }, { status: 400 }); }

  const { price, original_price = 1499, minutes } = body;
  if (!price || price < 1) return Response.json({ error: 'Price required' }, { status: 400 });
  if (!minutes || minutes < 1) return Response.json({ error: 'Duration required' }, { status: 400 });

  const expiresAt = new Date(Date.now() + minutes * 60000).toISOString();

  await adb.from('admin_coupons').upsert(
    { user_id: userId, price, original_price, expires_at: expiresAt },
    { onConflict: 'user_id' }
  );

  return Response.json({ success: true, expires_at: expiresAt });
}

// ── DELETE /api/admin/users/:id/remove-coupon ─────────────────────────────────
async function handleRemoveCoupon(req: Request, userId: string) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  const adb = dbAuth(auth.jwt);
  await adb.from('admin_coupons').delete().eq('user_id', userId);
  return Response.json({ success: true });
}

// ── GET /api/admin/notifications ──────────────────────────────────────────────
async function handleNotifications(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  const adb = dbAuth(auth.jwt);

  const { data } = await adb.from('notifications').select('*').order('created_at', { ascending: false }).limit(50);
  return Response.json({ success: true, notifications: data || [] });
}

// ── GET /api/admin/ab-test ────────────────────────────────────────────────────
async function handleAbTest(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  const adb = dbAuth(auth.jwt);

  const { data: payments } = await adb
    .from('payments')
    .select('amount')
    .in('amount', [899, 999])
    .eq('status', 'completed');

  const count899 = (payments || []).filter((p: any) => Number(p.amount) === 899).length;
  const count999 = (payments || []).filter((p: any) => Number(p.amount) === 999).length;
  const total = count899 + count999;
  const revenue899 = count899 * 899;
  const revenue999 = count999 * 999;
  const winner = total >= 20 ? (revenue899 >= revenue999 ? 899 : 999) : null;

  return Response.json({
    success: true,
    ab: {
      total,
      threshold: 20,
      decided: total >= 20,
      winner,
      a: { price: 899, payments: count899, revenue: revenue899 },
      b: { price: 999, payments: count999, revenue: revenue999 },
    },
  });
}

// ── Router ────────────────────────────────────────────────────────────────────

export async function GET(req: Request, { params }: { params: { slug: string[] } }) {
  const endpoint = `/${params.slug.join('/')}`;

  if (endpoint === '/dashboard') return handleDashboard(req);
  if (endpoint === '/users') return handleGetUsers(req);
  if (endpoint === '/subscriptions') return handleSubscriptions(req);
  if (endpoint === '/payments') return handlePayments(req);
  if (endpoint === '/notifications') return handleNotifications(req);
  if (endpoint === '/offers') return handleGetOffers(req);
  if (endpoint === '/ab-test') return handleAbTest(req);

  return Response.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(req: Request, { params }: { params: { slug: string[] } }) {
  const slug = params.slug;
  const endpoint = `/${slug.join('/')}`;

  if (endpoint === '/users') return handleCreateUser(req);
  if (endpoint === '/offers') return handleCreateOffer(req);

  // /users/:id/set-plan
  if (slug.length === 3 && slug[0] === 'users' && slug[2] === 'set-plan') return handleSetPlan(req, slug[1]);
  // /users/:id/manual-upgrade
  if (slug.length === 3 && slug[0] === 'users' && slug[2] === 'manual-upgrade') return handleManualUpgrade(req, slug[1]);
  // /users/:id/set-password
  if (slug.length === 3 && slug[0] === 'users' && slug[2] === 'set-password') return handleSetPassword(req, slug[1]);
  // /users/:id/apply-coupon
  if (slug.length === 3 && slug[0] === 'users' && slug[2] === 'apply-coupon') return handleApplyCoupon(req, slug[1]);
  // /subscriptions/:id/extend
  if (slug.length === 3 && slug[0] === 'subscriptions' && slug[2] === 'extend') return handleExtend(req, slug[1]);

  return Response.json({ error: 'Not found' }, { status: 404 });
}

export async function PUT(req: Request, { params }: { params: { slug: string[] } }) {
  const slug = params.slug;
  // /offers/:id
  if (slug.length === 2 && slug[0] === 'offers') return handleUpdateOffer(req, slug[1]);
  return Response.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(req: Request, { params }: { params: { slug: string[] } }) {
  const slug = params.slug;
  // /users/:id
  if (slug.length === 2 && slug[0] === 'users') return handleDeleteUser(req, slug[1]);
  // /users/:id/remove-coupon
  if (slug.length === 3 && slug[0] === 'users' && slug[2] === 'remove-coupon') return handleRemoveCoupon(req, slug[1]);
  // /offers/:id
  if (slug.length === 2 && slug[0] === 'offers') return handleDeleteOffer(req, slug[1]);
  return Response.json({ error: 'Not found' }, { status: 404 });
}
