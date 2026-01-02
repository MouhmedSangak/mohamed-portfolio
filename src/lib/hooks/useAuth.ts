// ============================================
// Authentication Hook
// ============================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { Admin } from '@/types/database';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  admin: Admin | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    admin: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });
  
  const router = useRouter();
  const supabase = getSupabaseClient();

  const fetchAdmin = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('admins')
      .select('*')
      .eq('id', userId)
      .eq('is_active', true)
      .single();
    return data;
  }, [supabase]);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const admin = await fetchAdmin(session.user.id);
          setState({
            user: session.user,
            admin,
            session,
            isLoading: false,
            isAuthenticated: !!admin,
          });
        } else {
          setState({
            user: null,
            admin: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Auth error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const admin = await fetchAdmin(session.user.id);
          setState({
            user: session.user,
            admin,
            session,
            isLoading: false,
            isAuthenticated: !!admin,
          });
        } else {
          setState({
            user: null,
            admin: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchAdmin]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const hasPermission = (permission: keyof Admin['permissions']): boolean => {
    if (!state.admin) return false;
    if (state.admin.role === 'owner') return true;
    return state.admin.permissions?.[permission] ?? false;
  };

  return {
    ...state,
    signIn,
    signOut,
    hasPermission,
  };
}