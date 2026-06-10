import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function db() {
  return createClient(SUPABASE_URL, SERVICE_KEY || ANON_KEY);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return Response.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { person_name, company_name, whatsapp, website } = body;

  if (!person_name || !company_name || !whatsapp) {
    return Response.json({ error: 'Name, company and WhatsApp are required' }, { status: 400 });
  }

  const { data, error } = await db()
    .from('viral_vadodara_leads')
    .insert({
      person_name: String(person_name),
      company_name: String(company_name),
      whatsapp: String(whatsapp),
      website: website ? String(website) : null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('viral_vadodara_leads insert error:', error);
    return Response.json({ error: 'Failed to save' }, { status: 500 });
  }

  return Response.json({ success: true, id: data?.id });
}
