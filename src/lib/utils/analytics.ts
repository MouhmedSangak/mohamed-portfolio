// src/lib/utils/analytics.ts

// Generate a unique visitor ID
export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = generateUUID();
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
}

// Generate a session ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

// Simple UUID generator
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Track page view
export async function trackPageView(pagePath?: string): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        visitorId,
        sessionId,
        eventType: 'pageview',
        pagePath: pagePath || window.location.pathname,
        referrer: document.referrer,
      }),
    });
  } catch (error) {
    // Silently fail - analytics shouldn't break the app
    console.error('Analytics error:', error);
  }
}

// Track custom event
export async function trackEvent(
  eventType: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        visitorId,
        sessionId,
        eventType,
        pagePath: window.location.pathname,
        metadata,
      }),
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
}
