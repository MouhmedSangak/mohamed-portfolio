// ============================================
// Error Boundary for Locale Pages
// ============================================

'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useLocale } from '@/lib/hooks/useLocale';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const { locale, isRTL } = useLocale();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {isRTL ? 'حدث خطأ غير متوقع' : 'Something went wrong'}
        </h1>
        
        <p className="text-muted-foreground mb-8">
          {isRTL 
            ? 'نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى.'
            : 'We apologize for this error. Please try again.'}
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={reset}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            {isRTL ? 'حاول مرة أخرى' : 'Try again'}
          </Button>
          
          <Link href={`/${locale}`}>
            <Button variant="outline" leftIcon={<Home className="h-4 w-4" />}>
              {isRTL ? 'الرئيسية' : 'Go Home'}
            </Button>
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-dark-800 rounded-lg text-left">
            <p className="text-xs text-dark-400 mb-2">Error Details (Dev Only):</p>
            <pre className="text-xs text-red-400 overflow-auto">
              {error.message}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}