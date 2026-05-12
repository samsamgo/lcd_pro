import { createClient } from '@supabase/supabase-js'
import type { Database } from './types.gen'

export type { Database }

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]

export function createSupabaseClient(url: string, key: string) {
  return createClient<Database>(url, key)
}

export function createServerClient(url: string, serviceKey: string) {
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false },
  })
}
