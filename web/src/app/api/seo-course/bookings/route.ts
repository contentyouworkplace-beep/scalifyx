import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

// GET /api/seo-course/bookings?date=YYYY-MM-DD — returns booked slots for a date
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const all = searchParams.get('all');

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  if (all === '1') {
    const { data, error } = await supabase
      .from('seo_course_bookings')
      .select('*')
      .order('date', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ bookings: data });
  }

  if (!date) return NextResponse.json({ bookedSlots: [] });

  const { data, error } = await supabase
    .from('seo_course_bookings')
    .select('slot')
    .eq('date', date)
    .eq('paid', true);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookedSlots: data?.map((b: any) => b.slot) || [] });
}
