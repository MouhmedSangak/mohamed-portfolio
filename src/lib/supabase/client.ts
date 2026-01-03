// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import { Database } from './types';

// Typed client for SELECT operations
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Untyped client for UPDATE/INSERT/DELETE operations (bypasses strict TypeScript)
export function createUntypedClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Alias for backward compatibility
export const getSupabaseClient = createClient;

// Export typed client type
export type SupabaseClient = ReturnType<typeof createClient>;
