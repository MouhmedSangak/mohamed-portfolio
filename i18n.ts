// ============================================
// next-intl Configuration (Root)
// ============================================

import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from '@/i18n/config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    messages: (await import(`./src/i18n/messages/${locale}.json`)).default,
  };
});