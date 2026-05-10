import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get total click count
    const { count: totalClicks, error: countError } = await supabase
      .from('payment_clicks')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // Get recent clicks (last 10)
    const { data: recentClicks, error: recentError } = await supabase
      .from('payment_clicks')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);

    if (recentError) throw recentError;

    // Get today's clicks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: todayClicks, error: todayError } = await supabase
      .from('payment_clicks')
      .select('*', { count: 'exact', head: true })
      .gte('timestamp', today.toISOString());

    if (todayError) throw todayError;

    return NextResponse.json({
      totalClicks: totalClicks || 0,
      todayClicks: todayClicks || 0,
      recentClicks: recentClicks || [],
    });
  } catch (error) {
    console.error('Error fetching payment tracking data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment tracking data' },
      { status: 500 }
    );
  }
}
