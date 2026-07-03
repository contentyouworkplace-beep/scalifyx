import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const { name, company, phone, bizType, city, website, date, slot } = await req.json();

    if (!name || !company || !phone || !bizType || !date || !slot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Check if slot is already booked
    const { data: existing } = await supabase
      .from('special_audit_bookings')
      .select('id')
      .eq('date', date)
      .eq('slot', slot)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'This slot is already booked. Please choose another.' }, { status: 409 });
    }

    const { data: booking, error } = await supabase
      .from('special_audit_bookings')
      .insert({
        name,
        company,
        phone,
        biz_type: bizType,
        city: city || null,
        website: website || null,
        date,
        slot,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
    }

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (err) {
    console.error('Book audit error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
