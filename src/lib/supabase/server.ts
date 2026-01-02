// ============================================
// src/lib/supabase/server.ts - النسخة المصححة
// ============================================

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Component - ignore
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.delete({ name, ...options });
          } catch {
            // Server Component - ignore
          }
        },
      },
    }
  );
}

export async function getSession() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch {
    return null;
  }
}

export async function getUser() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export async function getAdminUser() {
  const supabase = createServerSupabaseClient();
  const user = await getUser();
  
  if (!user) return null;

  const { data: admin } = await supabase
    .from('admins')
    .select('*')
    .eq('id', user.id)
    .eq('is_active', true)
    .single();

  return admin;
}