import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
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