// ============================================
// Analytics API Route
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      visitorId,
      sessionId,
      eventType = 'pageview',
      pagePath,
      referrer,
      deviceType,
      browser,
      os,
      metadata = {},
    } = body;

    if (!visitorId) {
      return NextResponse.json(
        { error: 'Visitor ID required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Get additional info from headers
    const userAgent = request.headers.get('user-agent') || '';
    const forwarded = request.headers.get('x-forwarded-for');
    const country = request.headers.get('cf-ipcountry') || null; // Cloudflare header

    // Insert analytics event
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        visitor_id: visitorId,
        session_id: sessionId,
        event_type: eventType,
        page_path: pagePath,
        referrer: referrer || null,
        user_agent: userAgent,
        device_type: deviceType,
        browser: browser,
        os: os,
        country: country,
        metadata: metadata,
      });

    if (error) {
      console.error('Analytics insert error:', error);
      return NextResponse.json(
        { error: 'Failed to log event' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get analytics data (admin only)
export async function GET(request: NextRequest) {
  try {
    // This endpoint should be protected - for now just returning basic stats
    const supabase = createAdminClient();
    
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get daily visitors
    const { data: dailyData, error: dailyError } = await supabase
      .from('analytics_events')
      .select('visitor_id, created_at')
      .gte('created_at', startDate.toISOString())
      .eq('event_type', 'pageview');

    if (dailyError) {
      throw dailyError;
    }

    // Process data
    const visitorsByDay: Record<string, Set<string>> = {};
    
    dailyData?.forEach((event) => {
      const date = new Date(event.created_at).toISOString().split('T')[0];
      if (!visitorsByDay[date]) {
        visitorsByDay[date] = new Set();
      }
      visitorsByDay[date].add(event.visitor_id);
    });

    const analytics = Object.entries(visitorsByDay).map(([date, visitors]) => ({
      date,
      visitors: visitors.size,
      pageviews: dailyData?.filter(
        (e) => new Date(e.created_at).toISOString().split('T')[0] === date
      ).length || 0,
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Get totals
    const uniqueVisitors = new Set(dailyData?.map((e) => e.visitor_id)).size;
    const totalPageviews = dailyData?.length || 0;

    return NextResponse.json({
      analytics,
      totals: {
        uniqueVisitors,
        totalPageviews,
      },
    });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}