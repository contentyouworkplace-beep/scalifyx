import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const { name, company, phone, bizType, website, date, slot } = await req.json();

    if (!name || !company || !phone || !bizType || !date || !slot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Check if slot is already booked
    const { data: existing } = await supabase
      .from('seo_course_bookings')
      .select('id')
      .eq('date', date)
      .eq('slot', slot)
      .eq('paid', true)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'This slot is already booked. Please choose another.' }, { status: 409 });
    }

    // Create Razorpay order via fetch (no SDK needed)
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
      body: JSON.stringify({
        amount: 9900, // Rs. 99 in paise
        currency: 'INR',
        notes: { name, company, phone, bizType, date, slot },
      }),
    });

    const order = await rzpRes.json();
    if (!order.id) {
      return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
    }

    // Save pending booking
    const { data: booking, error } = await supabase
      .from('seo_course_bookings')
      .insert({
        name,
        company,
        phone,
        biz_type: bizType,
        website: website || null,
        date,
        slot,
        razorpay_order_id: order.id,
        paid: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
    }

    return NextResponse.json({
      orderId: order.id,
      bookingId: booking.id,
      keyId: RAZORPAY_KEY_ID,
      amount: 9900,
    });
  } catch (err) {
    console.error('Create order error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
