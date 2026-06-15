import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/*
  Run this SQL once in your Supabase project (SQL Editor):

  CREATE TABLE reyyo_orders (
    id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id    TEXT        NOT NULL,
    name        TEXT        NOT NULL,
    whatsapp    TEXT        NOT NULL,
    business_name TEXT      NOT NULL,
    business_type TEXT,
    website     TEXT,
    address     TEXT        NOT NULL,
    city        TEXT        NOT NULL,
    state       TEXT        NOT NULL,
    pincode     TEXT        NOT NULL,
    status      TEXT        DEFAULT 'pending',
    created_at  TIMESTAMPTZ DEFAULT NOW()
  );
*/

function generateOrderId() {
  return 'REY-' + Math.random().toString(36).slice(2, 7).toUpperCase();
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Use separate Reyyo Supabase project (set REYYO_SUPABASE_URL + REYYO_SUPABASE_ANON_KEY in .env.local)
  const supabase = createClient(
    process.env.REYYO_SUPABASE_URL || process.env.NEXT_PUBLIC_REYYO_SUPABASE_URL!,
    process.env.REYYO_SUPABASE_SERVICE_KEY || process.env.REYYO_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_REYYO_SUPABASE_ANON_KEY!,
  );

  const { error } = await supabase.from('reyyo_orders').insert({
    order_id:      generateOrderId(),
    name:          body.name,
    whatsapp:      body.whatsapp,
    business_name: body.businessName,
    business_type: body.businessType || null,
    website:       body.website || null,
    address:       body.address,
    city:          body.city,
    state:         body.state,
    pincode:       body.pincode,
    status:        'pending',
  });

  if (error) {
    console.error('reyyo order insert error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
