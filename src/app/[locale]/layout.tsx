// ============================================
// Locale Layout
// ============================================

import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales, getDirection, type Locale } from '@/i18n/config';
import { ToastProvider } from '@/components/ui/Toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { LanguageToast } from '@/components/common/LanguageToast';
import { AnalyticsProvider } from '@/components/providers/AnalyticsProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const direction = getDirection(locale as Locale);
  const isRTL = direction === 'rtl';

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className={isRTL ? 'font-arabic' : 'font-english'}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <ToastProvider>
              <AnalyticsProvider>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <LanguageSwitcher />
                <LanguageToast />
              </AnalyticsProvider>
            </ToastProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}