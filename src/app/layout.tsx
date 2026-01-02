// ============================================
// Root Layout
// ============================================

import type { Metadata } from 'next';
import { Inter, Tajawal } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Mohamed Sayed Sangak | محمد سيد سنجق',
    template: '%s | Mohamed Sangak',
  },
  description: 'Medical Student at Sohag University - Personal Portfolio',
  keywords: ['Mohamed Sangak', 'Medical Student', 'Developer', 'Portfolio'],
  authors: [{ name: 'Mohamed Sayed Sangak' }],
  creator: 'Mohamed Sayed Sangak',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    alternateLocale: ['en_US', 'de_DE'],
    siteName: 'Mohamed Sangak',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@msangak27',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className={`${inter.variable} ${tajawal.variable}`}>
        {children}
      </body>
    </html>
  );
}