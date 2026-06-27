import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

export async function GET() {
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  const { data, error } = await supabase
    .from('seo_webinar_registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ leads: data });
}

export async function PUT(req: NextRequest) {
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const body = await req.json();
  const { id, pain_point } = body;

  if (!id || pain_point === undefined) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const { error } = await supabase
    .from('seo_webinar_registrations')
    .update({ pain_point })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const { id } = await req.json();

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const { error } = await supabase
    .from('seo_webinar_registrations')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
