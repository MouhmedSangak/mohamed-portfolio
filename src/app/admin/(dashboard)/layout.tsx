// ============================================
// Admin Dashboard Layout (Protected)
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { PageLoader } from '@/components/ui/Spinner';
import { ToastProvider } from '@/components/ui/Toast';
import { cn } from '@/lib/utils/cn';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated, admin } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated || !admin) {
    return <PageLoader />;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-dark-950">
        {/* Sidebar */}
        <AdminSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          admin={admin}
        />

        {/* Main Content */}
        <div className="lg:ml-64 min-h-screen flex flex-col">
          <AdminHeader 
            admin={admin}
            onMenuClick={() => setSidebarOpen(true)}
          />
          
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}