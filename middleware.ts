// ============================================
// middleware.ts - Next.js Middleware
// ============================================

import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const locales = ['ar', 'en', 'de'];
const defaultLocale = 'ar';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // استثناء مسارات معينة من الـ middleware
  const shouldSkip = 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico';

  if (shouldSkip) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  // تطبيق الـ middleware على جميع المسارات ما عدا المستثناة
  matcher: ['/((?!api|_next|admin|images|.*\\..*).*)'],
};