// src/app/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create untyped Supabase client for analytics
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitorId, sessionId, eventType, pagePath, referrer, metadata } = body;

    if (!visitorId) {
      return NextResponse.json(
        { error: 'Visitor ID is required' },
        { status: 400 }
      );
    }

    // Get user agent info
    const userAgent = request.headers.get('user-agent') || '';
    
    // Simple device detection
    const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
    const isTablet = /tablet|ipad/i.test(userAgent);
    const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

    // Simple browser detection
    let browser = 'unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    // Simple OS detection
    let os = 'unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS') || userAgent.includes('iPhone')) os = 'iOS';

    // Insert analytics event
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        visitor_id: visitorId,
        session_id: sessionId,
        event_type: eventType || 'pageview',
        page_path: pagePath,
        referrer: referrer,
        user_agent: userAgent,
        device_type: deviceType,
        browser: browser,
        os: os,
        metadata: metadata || {},
      });

    if (error) {
      console.error('Analytics error:', error);
      return NextResponse.json(
        { error: 'Failed to record analytics' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get date range from query params
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get total visitors
    const { count: totalVisitors } = await supabase
      .from('analytics_events')
      .select('visitor_id', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString());

    // Get unique visitors
    const { data: uniqueVisitorsData } = await supabase
      .from('analytics_events')
      .select('visitor_id')
      .gte('created_at', startDate.toISOString());

    const uniqueVisitors = new Set(uniqueVisitorsData?.map(v => v.visitor_id)).size;

    // Get page views by path
    const { data: pageViewsData } = await supabase
      .from('analytics_events')
      .select('page_path')
      .eq('event_type', 'pageview')
      .gte('created_at', startDate.toISOString());

    const pageViews: Record<string, number> = {};
    pageViewsData?.forEach(pv => {
      const path = pv.page_path || '/';
      pageViews[path] = (pageViews[path] || 0) + 1;
    });

    // Get device breakdown
    const { data: deviceData } = await supabase
      .from('analytics_events')
      .select('device_type')
      .gte('created_at', startDate.toISOString());

    const devices: Record<string, number> = {};
    deviceData?.forEach(d => {
      const device = d.device_type || 'unknown';
      devices[device] = (devices[device] || 0) + 1;
    });

    // Get browser breakdown
    const { data: browserData } = await supabase
      .from('analytics_events')
      .select('browser')
      .gte('created_at', startDate.toISOString());

    const browsers: Record<string, number> = {};
    browserData?.forEach(b => {
      const browser = b.browser || 'unknown';
      browsers[browser] = (browsers[browser] || 0) + 1;
    });

    return NextResponse.json({
      totalPageViews: totalVisitors || 0,
      uniqueVisitors,
      pageViews: Object.entries(pageViews)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([path, count]) => ({ path, count })),
      devices: Object.entries(devices)
        .map(([device, count]) => ({ device, count })),
      browsers: Object.entries(browsers)
        .map(([browser, count]) => ({ browser, count })),
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
