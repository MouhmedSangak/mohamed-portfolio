// ============================================
// i18n.ts - Next-intl Configuration (Root)
// ============================================

import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// يمكن استيرادها من ملف config أو تعريفها هنا
export const locales = ['ar', 'en', 'de'] as const;
export const defaultLocale = 'ar' as const;

export default getRequestConfig(async ({ requestLocale }) => {
  // انتظار الـ locale من الـ request
  let locale = await requestLocale;

  // التحقق من صحة الـ locale
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./src/i18n/messages/${locale}.json`)).default,
  };
});