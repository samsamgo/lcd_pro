import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@lcd-pro/db'

/**
 * Lazy Supabase 클라이언트.
 *
 * MVP 모드(features.quotePersistence/billing OFF)에서는 이 모듈을 임포트해도
 * env 누락으로 throw 하지 않는다. 클라이언트는 실제 호출 시점에만 생성된다.
 * (이전: 모듈 로드 시 process.env...! 평가로 throw)
 */

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) {
    throw new Error(
      `[supabase] 환경변수 ${name} 누락 — quotePersistence/billing 플래그를 켰다면 .env 설정 필요`,
    )
  }
  return v
}

let _browserClient: SupabaseClient<Database> | null = null

/** 브라우저/anon 클라이언트 (lazy singleton) */
export function browserClient(): SupabaseClient<Database> {
  if (!_browserClient) {
    _browserClient = createClient<Database>(
      requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
      requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    )
  }
  return _browserClient
}

/** 서버(service-role) 클라이언트 — 호출 시점에만 생성 */
export function serverClient(): SupabaseClient<Database> {
  return createClient<Database>(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_KEY'),
    { auth: { persistSession: false } },
  )
}
