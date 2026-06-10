import { NextRequest, NextResponse } from 'next/server'
import { serverClient } from '@/lib/supabase'
import { features } from '@/lib/features'

// 구독 해지 API
// 정책 (04-finance-accounting/workspace/deposit-refund-policy.md):
//   - 가입 7일 이내, 사용 이력 없음 → 전액 환불 (별도 결재 필요, 본 API는 cancel만)
//   - 가입 7일 이후 → 다음 결제 사이클부터 중단, 당월 환불 없음
//
// 흐름:
//   1. subscription_id + customer_id 확인 (소유권)
//   2. status='cancelled' + canceled_at + cancel_reason 저장
//   3. next_billing_at은 null로 (Cron이 더 이상 청구 안 함)
//   4. billingKey 자체는 정책상 보관 (재가입 편의) — 완전 폐기 옵션 별도

export async function POST(req: NextRequest) {
  // MVP: 결제 기능 잠금(features.billing OFF) — 비활성 (파일은 보존)
  if (!features.billing) {
    return NextResponse.json({ error: 'billing disabled' }, { status: 404 })
  }

  let body: { subscriptionId?: string; customerId?: string; reason?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const { subscriptionId, customerId, reason } = body
  if (!subscriptionId) {
    return NextResponse.json({ error: 'subscriptionId 누락' }, { status: 400 })
  }

  const db = serverClient()

  // 1. 소유권 확인 (customer_id 매칭)
  const { data: sub, error: fetchError } = await db
    .from('subscriptions')
    .select('id, customer_id, status')
    .eq('id', subscriptionId)
    .single()

  if (fetchError || !sub) {
    return NextResponse.json({ error: '구독 없음' }, { status: 404 })
  }
  if (customerId && sub.customer_id !== customerId) {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }
  if (sub.status === 'cancelled') {
    return NextResponse.json({ ok: true, alreadyCanceled: true })
  }

  // 2. 해지 처리
  const update: Record<string, unknown> = {
    status: 'cancelled',
    canceled_at: new Date().toISOString(),
    next_billing_at: null,
  }
  if (reason) update.cancel_reason = reason

  const { error: updateError } = await db
    .from('subscriptions')
    .update(update as any)
    .eq('id', subscriptionId)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
