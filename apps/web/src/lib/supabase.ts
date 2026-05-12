import { createClient } from '@supabase/supabase-js'
import type { Database } from '@lcd-pro/db'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const serviceKey = process.env.SUPABASE_SERVICE_KEY!

export const supabase = createClient<Database>(url, anonKey)

export function serverClient() {
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false },
  })
}
