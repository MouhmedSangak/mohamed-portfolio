// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import { Database } from './types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Alias for backward compatibility
export const getSupabaseClient = createClient;

// Export typed client for direct use
export type SupabaseClient = ReturnType<typeof createClient>;
