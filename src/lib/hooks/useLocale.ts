// ============================================
// Locale Hook
// ============================================

'use client';

import { useLocale as useNextIntlLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { 
  locales, 
  localeNames, 
  localeFlags, 
  isRTL, 
  getDirection,
  type Locale 
} from '@/i18n/config';

const LOCALE_DISMISSED_KEY = 'locale_suggestion_dismissed';

export function useLocale() {
  const locale = useNextIntlLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestedLocale, setSuggestedLocale] = useState<Locale | null>(null);

  // Check browser language on mount
  useEffect(() => {
    const dismissed = sessionStorage.getItem(LOCALE_DISMISSED_KEY);
    if (dismissed) return;

    const browserLang = navigator.language.split('-')[0];
    const matchedLocale = locales.find(l => l === browserLang);
    
    if (matchedLocale && matchedLocale !== locale) {
      setSuggestedLocale(matchedLocale);
      setShowSuggestion(true);
    }
  }, [locale]);

  const switchLocale = useCallback((newLocale: Locale) => {
    // Remove current locale from pathname
    const segments = pathname.split('/');
    const currentLocaleIndex = locales.findIndex(l => l === segments[1]);
    
    if (currentLocaleIndex !== -1) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    
    const newPath = segments.join('/') || '/';
    router.push(newPath);
  }, [pathname, router]);

  const dismissSuggestion = () => {
    setShowSuggestion(false);
    sessionStorage.setItem(LOCALE_DISMISSED_KEY, 'true');
  };

  const acceptSuggestion = () => {
    if (suggestedLocale) {
      switchLocale(suggestedLocale);
    }
    dismissSuggestion();
  };

  return {
    locale,
    locales,
    localeName: localeNames[locale],
    localeFlag: localeFlags[locale],
    localeNames,
    localeFlags,
    isRTL: isRTL(locale),
    direction: getDirection(locale),
    switchLocale,
    showSuggestion,
    suggestedLocale,
    suggestedLocaleName: suggestedLocale ? localeNames[suggestedLocale] : null,
    dismissSuggestion,
    acceptSuggestion,
    t,
  };
}