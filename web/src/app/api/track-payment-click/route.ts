import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { timestamp } = await request.json();

    // Get user IP for analytics
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Insert into payment_clicks table
    const { error } = await supabase
      .from('payment_clicks')
      .insert({
        timestamp: timestamp || new Date().toISOString(),
        ip_address: ip,
        user_agent: userAgent,
        page: 'website_199',
      });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Error tracking payment click:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
