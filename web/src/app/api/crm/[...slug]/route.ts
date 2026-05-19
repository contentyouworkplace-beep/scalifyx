import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function db() {
  return createClient(SUPABASE_URL, SERVICE_KEY || ANON_KEY);
}

async function getUser(req: Request) {
  const jwt = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  if (!jwt) return null;
  const { data: { user } } = await createClient(SUPABASE_URL, ANON_KEY).auth.getUser(jwt);
  return user ?? null;
}

const CRM_EMAIL = 'contentyouworkplace@gmail.com';

async function requireAdmin(req: Request) {
  const user = await getUser(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.email === CRM_EMAIL) return { user };
  const { data: profile } = await db().from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
  return { user };
}

// ── GET /api/crm/clients ──────────────────────────────────────────────────────
async function handleGetClients(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  const { data, error } = await db()
    .from('crm_clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ clients: data });
}

// ── POST /api/crm/clients ─────────────────────────────────────────────────────
async function handleCreateClient(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  const { name } = await req.json();
  if (!name?.trim()) return Response.json({ error: 'Name required' }, { status: 400 });

  const { data, error } = await db()
    .from('crm_clients')
    .insert({ name: name.trim() })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ client: data });
}

// ── DELETE /api/crm/clients ───────────────────────────────────────────────────
async function handleDeleteClient(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  const { id } = await req.json();
  await db().from('crm_clients').delete().eq('id', id);
  return Response.json({ ok: true });
}

// ── GET /api/crm/works?client_id=x ───────────────────────────────────────────
async function handleGetWorks(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  const url = new URL(req.url);
  const clientId = url.searchParams.get('client_id');

  let query = db()
    .from('crm_works')
    .select('*')
    .order('deadline', { ascending: true, nullsFirst: false });

  if (clientId) query = query.eq('client_id', clientId);

  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ works: data });
}

// ── POST /api/crm/works ───────────────────────────────────────────────────────
async function handleCreateWork(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  const { client_id, title, deadline } = await req.json();
  if (!client_id || !title?.trim()) return Response.json({ error: 'client_id and title required' }, { status: 400 });

  const { data, error } = await db()
    .from('crm_works')
    .insert({ client_id, title: title.trim(), deadline: deadline || null })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ work: data });
}

// ── PATCH /api/crm/works ──────────────────────────────────────────────────────
async function handleUpdateWork(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  const { id, title, deadline, done } = await req.json();
  const updates: any = {};
  if (title !== undefined) updates.title = title.trim();
  if (deadline !== undefined) updates.deadline = deadline || null;
  if (done !== undefined) updates.done = done;

  const { data, error } = await db()
    .from('crm_works')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ work: data });
}

// ── DELETE /api/crm/works ─────────────────────────────────────────────────────
async function handleDeleteWork(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  const { id } = await req.json();
  await db().from('crm_tasks').delete().eq('work_id', id);
  await db().from('crm_works').delete().eq('id', id);
  return Response.json({ ok: true });
}

// ── GET /api/crm/tasks?work_id=x ─────────────────────────────────────────────
async function handleGetTasks(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  const url = new URL(req.url);
  const workId = url.searchParams.get('work_id');
  if (!workId) return Response.json({ error: 'work_id required' }, { status: 400 });

  const { data, error } = await db()
    .from('crm_tasks')
    .select('*')
    .eq('work_id', workId)
    .order('created_at', { ascending: true });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ tasks: data });
}

// ── POST /api/crm/tasks ───────────────────────────────────────────────────────
async function handleCreateTask(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  const { work_id, title } = await req.json();
  if (!work_id || !title?.trim()) return Response.json({ error: 'work_id and title required' }, { status: 400 });

  const { data, error } = await db()
    .from('crm_tasks')
    .insert({ work_id, title: title.trim(), done: false })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ task: data });
}

// ── PATCH /api/crm/tasks ──────────────────────────────────────────────────────
async function handleUpdateTask(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  const { id, done, title } = await req.json();
  const updates: any = {};
  if (done !== undefined) updates.done = done;
  if (title !== undefined) updates.title = title.trim();

  const { data, error } = await db()
    .from('crm_tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ task: data });
}

// ── DELETE /api/crm/tasks ─────────────────────────────────────────────────────
async function handleDeleteTask(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  const { id } = await req.json();
  await db().from('crm_tasks').delete().eq('id', id);
  return Response.json({ ok: true });
}

// ── GET /api/crm/dashboard ────────────────────────────────────────────────────
async function handleDashboard(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  // All works with deadline, not done, sorted by deadline
  const { data: works } = await db()
    .from('crm_works')
    .select('id, title, deadline, done, client_id, crm_clients(name)')
    .eq('done', false)
    .not('deadline', 'is', null)
    .order('deadline', { ascending: true });

  const all = works || [];
  const urgent = all.slice(0, 5);
  const stressFree = all.slice(5, 10);

  return Response.json({ urgent, stressFree });
}

// ── Router ────────────────────────────────────────────────────────────────────
export async function GET(req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const [resource] = slug;

  if (resource === 'clients') return handleGetClients(req);
  if (resource === 'works') return handleGetWorks(req);
  if (resource === 'tasks') return handleGetTasks(req);
  if (resource === 'dashboard') return handleDashboard(req);

  return Response.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const [resource] = slug;

  if (resource === 'clients') return handleCreateClient(req);
  if (resource === 'works') return handleCreateWork(req);
  if (resource === 'tasks') return handleCreateTask(req);

  return Response.json({ error: 'Not found' }, { status: 404 });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const [resource] = slug;

  if (resource === 'works') return handleUpdateWork(req);
  if (resource === 'tasks') return handleUpdateTask(req);

  return Response.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const [resource] = slug;

  if (resource === 'clients') return handleDeleteClient(req);
  if (resource === 'works') return handleDeleteWork(req);
  if (resource === 'tasks') return handleDeleteTask(req);

  return Response.json({ error: 'Not found' }, { status: 404 });
}
