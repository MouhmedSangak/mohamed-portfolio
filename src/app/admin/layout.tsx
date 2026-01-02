// ============================================
// Admin Layout
// ============================================

import { Metadata } from 'next';
import '@/styles/admin.css';

export const metadata: Metadata = {
  title: {
    default: 'Admin Panel',
    template: '%s | Admin',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="dark">
      <body className="font-english bg-dark-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}