import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

// Server component client (for use in Server Components)
export function createServerClient() {
  return createServerComponentClient<Database>({ cookies })
}

// API route client (for use in API routes)
export function createRouteClient() {
  return createRouteHandlerClient<Database>({ cookies })
}

// Admin client with service role (bypasses RLS - use carefully!)
// Use this for operations that need to insert/update data on behalf of users
export function createAdminClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase admin credentials')
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}