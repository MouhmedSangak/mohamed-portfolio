// ============================================
// Analytics Utilities
// ============================================

import { v4 as uuidv4 } from 'uuid';

const VISITOR_ID_KEY = 'portfolio_visitor_id';
const SESSION_ID_KEY = 'portfolio_session_id';

// Get or create visitor ID (persistent across sessions)
export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

// Get or create session ID (cleared when browser closes)
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

// Detect device type
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// Get browser name
export function getBrowser(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Opera')) return 'Opera';
  return 'Other';
}

// Get OS
export function getOS(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Other';
}

// Track page view
export async function trackPageView(pagePath: string): Promise<void> {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    
    if (!visitorId) return;

    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        sessionId,
        eventType: 'pageview',
        pagePath,
        referrer: document.referrer || null,
        deviceType: getDeviceType(),
        browser: getBrowser(),
        os: getOS(),
      }),
    });
  } catch (error) {
    // Silently fail - analytics shouldn't break the app
    console.error('Analytics error:', error);
  }
}