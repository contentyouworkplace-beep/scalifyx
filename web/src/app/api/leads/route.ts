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

// POST /api/leads — public, anyone can submit (from a user's website contact form)
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return Response.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { name, phone, email, message, website_id, user_id, source } = body;

  if (!phone && !email) {
    return Response.json({ error: 'Phone or email is required' }, { status: 400 });
  }

  const { data, error } = await db()
    .from('leads')
    .insert({
      website_id: website_id || null,
      user_id: user_id || null,
      name: name || null,
      phone: phone || null,
      email: email || null,
      message: message || null,
      source: source || 'website_form',
    })
    .select('id')
    .single();

  if (error) {
    console.error('Lead insert error:', error);
    return Response.json({ error: 'Failed to save lead' }, { status: 500 });
  }

  return Response.json({ success: true, id: data?.id });
}

// GET /api/leads — authenticated, returns leads for the logged-in user
export async function GET(req: Request) {
  const user = await getUser(req);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await db()
    .from('leads')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return Response.json({ error: 'Failed to fetch leads' }, { status: 500 });
  return Response.json({ success: true, leads: data || [] });
}
