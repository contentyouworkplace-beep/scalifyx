import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

// POST — capture step-1 form fill before payment
export async function POST(req: NextRequest) {
  try {
    const { name, company, phone, bizType, website } = await req.json();
    if (!name || !phone) return NextResponse.json({ ok: true });

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    await supabase.from('seo_course_leads').insert({
      name,
      company: company || null,
      phone,
      biz_type: bizType || null,
      website: website || null,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // never surface errors — lead capture is fire-and-forget
  }
}

// GET — admin: return all leads
export async function GET() {
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data, error } = await supabase
      .from('seo_course_leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ leads: [] });
    return NextResponse.json({ leads: data });
  } catch {
    return NextResponse.json({ leads: [] });
  }
}
