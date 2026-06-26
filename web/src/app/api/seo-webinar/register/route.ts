import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, whatsapp, company, pain_point } = body;

  if (!name || !whatsapp || !company || !pain_point) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  const { error } = await supabase.from('seo_webinar_registrations').insert([{
    name: name.trim(),
    whatsapp: whatsapp.replace(/\s/g, '').trim(),
    company: company.trim(),
    pain_point: pain_point.trim(),
  }]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
