// ============================================
// Analytics Hook
// ============================================

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/utils/analytics';

export function useAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view on route change
    trackPageView(pathname);
  }, [pathname]);
}

export function useTrackEvent() {
  const trackEvent = async (eventName: string, metadata?: Record<string, any>) => {
    try {
      const { getVisitorId, getSessionId } = await import('@/lib/utils/analytics');
      
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId: getVisitorId(),
          sessionId: getSessionId(),
          eventType: eventName,
          pagePath: window.location.pathname,
          metadata,
        }),
      });
    } catch (error) {
      console.error('Track event error:', error);
    }
  };

  return { trackEvent };
}