// ============================================
// src/i18n/request.ts - Request Configuration
// ============================================

import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  // انتظار الـ locale من الـ request
  let locale = await requestLocale;

  // التحقق من صحة الـ locale
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'Africa/Cairo',
    now: new Date(),
  };
});