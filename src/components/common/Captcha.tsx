// ============================================
// Cloudflare Turnstile CAPTCHA Component
// ============================================

'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { useTheme } from '@/lib/hooks/useTheme';

interface CaptchaProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

declare global {
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: (error: string) => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact';
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

export function Captcha({ onVerify, onExpire, onError, className }: CaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    
    if (!siteKey) {
      console.warn('Turnstile site key not configured');
      // In development, auto-verify
      if (process.env.NODE_ENV === 'development') {
        onVerify('dev-token');
      }
      return;
    }

    // Load Turnstile script
    const loadScript = () => {
      if (document.getElementById('turnstile-script')) {
        if (window.turnstile) {
          renderWidget();
        }
        return;
      }

      const script = document.createElement('script');
      script.id = 'turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
      script.async = true;
      script.defer = true;

      window.onloadTurnstileCallback = () => {
        setIsLoaded(true);
        renderWidget();
      };

      document.head.appendChild(script);
    };

    const renderWidget = () => {
      if (!containerRef.current || !window.turnstile) return;

      // Remove existing widget
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Widget might already be removed
        }
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        'expired-callback': onExpire,
        'error-callback': onError,
        theme: resolvedTheme === 'dark' ? 'dark' : 'light',
        size: 'normal',
      });
    };

    loadScript();

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Cleanup error
        }
      }
    };
  }, [onVerify, onExpire, onError, resolvedTheme]);

  return (
    <div className={cn('flex justify-center', className)}>
      <div ref={containerRef} />
      {!isLoaded && !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <div className="h-[65px] flex items-center justify-center text-sm text-muted-foreground">
          CAPTCHA disabled in development
        </div>
      )}
    </div>
  );
}

// Reset function for external use
export function resetCaptcha(widgetId: string) {
  if (window.turnstile) {
    window.turnstile.reset(widgetId);
  }
}