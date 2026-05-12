/**
 * Supabase 마이그레이션 확인 스크립트
 * 실행: SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/run-migration.mjs
 * 또는 .env.local 파일이 있을 때: node -r dotenv/config scripts/run-migration.mjs
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''
const PROJECT_REF = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? ''

async function runSQL(sql, label) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    }
  )

  if (!res.ok) {
    console.error(`[${label}] Management API 미지원 — PostgREST RPC 시도`)
    return false
  }
  const data = await res.json()
  console.log(`[${label}] 성공:`, data)
  return true
}

// PostgREST를 통한 SQL 실행 (제한적)
async function checkConnection() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=sku&limit=1`,
    {
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
      }
    }
  )

  if (res.status === 200) {
    const data = await res.json()
    console.log('✅ DB 연결 성공. products 테이블 존재:', data)
    return true
  } else if (res.status === 404 || res.status === 400) {
    console.log('⚠️  products 테이블 없음 — 마이그레이션 필요')
    console.log('Status:', res.status)
    const text = await res.text()
    console.log('Response:', text.slice(0, 200))
    return false
  } else {
    console.log('DB 응답:', res.status, await res.text())
    return false
  }
}

async function main() {
  console.log('=== LCD PRO — Supabase 연결 확인 ===\n')

  const connected = await checkConnection()

  if (connected) {
    console.log('\n✅ 마이그레이션 완료 — 앱을 시작할 수 있습니다.')
    console.log('   pnpm --filter @lcd-pro/web dev')
  } else {
    console.log('\n📋 수동 마이그레이션 필요:')
    console.log('1. Supabase Dashboard → SQL Editor 접속')
    console.log('   https://supabase.com/dashboard/project/ktctppxsjtezzgzzywbz/sql')
    console.log('2. supabase/migrations/001_initial_schema.sql 내용 붙여넣기 → Run')
    console.log('3. supabase/migrations/002_storage_setup.sql 내용 붙여넣기 → Run')
    console.log('4. node scripts/run-migration.mjs 재실행으로 확인')
  }
}

main().catch(console.error)
