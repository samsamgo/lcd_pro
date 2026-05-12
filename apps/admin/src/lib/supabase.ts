import { createClient } from '@supabase/supabase-js'
import type { Database } from '@lcd-pro/db'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_KEY!

// Admin app은 항상 service role 사용 (RLS 우회)
export const adminDb = createClient<Database>(url, serviceKey, {
  auth: { persistSession: false },
})
