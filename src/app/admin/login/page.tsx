// ============================================
// Admin Login Page
// ============================================

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/supabase/server';
import { LoginForm } from '@/components/forms/LoginForm';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function AdminLoginPage() {
  const admin = await getAdminUser();
  
  if (admin) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-dark-900/80 backdrop-blur-xl rounded-2xl border border-dark-700 p-8 shadow-2xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}