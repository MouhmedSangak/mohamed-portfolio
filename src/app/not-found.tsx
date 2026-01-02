// ============================================
// 404 Not Found Page
// ============================================

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <html lang="en" dir="ltr">
      <body className="dark">
        <div className="min-h-screen flex items-center justify-center bg-dark-950 p-4">
          <div className="text-center">
            <h1 className="text-9xl font-bold text-primary-500 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-dark-400 mb-8 max-w-md">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/ar"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Home className="h-5 w-5" />
                الرئيسية
              </Link>
              <Link
                href="/en"
                className="inline-flex items-center gap-2 px-6 py-3 border border-dark-600 text-white rounded-lg hover:bg-dark-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}