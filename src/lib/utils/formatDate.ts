// ============================================
// Date Formatting Utilities
// ============================================

import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ar, enUS, de } from 'date-fns/locale';
import type { Locale } from '@/i18n/config';

const locales = {
  ar,
  en: enUS,
  de,
};

export function formatDate(
  date: string | Date,
  formatStr: string = 'PPP',
  locale: Locale = 'ar'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: locales[locale] });
}

export function formatRelativeDate(
  date: string | Date,
  locale: Locale = 'ar'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: locales[locale],
  });
}

export function formatShortDate(
  date: string | Date,
  locale: Locale = 'ar'
): string {
  return formatDate(date, 'dd MMM yyyy', locale);
}

export function formatMonthYear(
  date: string | Date,
  locale: Locale = 'ar'
): string {
  return formatDate(date, 'MMMM yyyy', locale);
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}