import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

// Client component client
export function createClient() {
  return createClientComponentClient<Database>()
}

// Server component client
export function createServerClient() {
  return createServerComponentClient<Database>({ cookies })
}

// API route client
export function createRouteClient() {
  return createRouteHandlerClient<Database>({ cookies })
}
