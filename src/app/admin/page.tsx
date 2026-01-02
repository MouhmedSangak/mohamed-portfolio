// ============================================
// Admin Root - Redirect to Login or Dashboard
// ============================================

import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/supabase/server';

export default async function AdminPage() {
  const admin = await getAdminUser();
  
  if (admin) {
    redirect('/admin/dashboard');
  } else {
    redirect('/admin/login');
  }
}