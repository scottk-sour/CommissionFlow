import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

// Client component client (for use in 'use client' components)
export function createClient() {
  return createClientComponentClient<Database>()
}