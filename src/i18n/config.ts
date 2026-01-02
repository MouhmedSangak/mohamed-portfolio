// ============================================
// i18n Configuration
// ============================================

export const locales = ['ar', 'en', 'de'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ar';

export const localeNames: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
  de: 'Deutsch',
};

export const localeFlags: Record<Locale, string> = {
  ar: '🇪🇬',
  en: '🇬🇧',
  de: '🇩🇪',
};

export const localeDirections: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  en: 'ltr',
  de: 'ltr',
};

export const localeFonts: Record<Locale, string> = {
  ar: 'font-arabic',
  en: 'font-english',
  de: 'font-german',
};

export function isRTL(locale: Locale): boolean {
  return localeDirections[locale] === 'rtl';
}

export function getDirection(locale: Locale): 'rtl' | 'ltr' {
  return localeDirections[locale];
}