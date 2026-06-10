import { NextRequest, NextResponse } from 'next/server'
import { serverClient } from '@/lib/supabase'
import { executePayment, TossError } from '@/lib/toss'
import { features } from '@/lib/features'

// Vercel Cron — 매일 00:00 UTC (= 09:00 KST)
// next_billing_at <= now() AND status = 'active' 구독을 차례로 청구
// 멱등: orderId = sub_<id>_<yyyymm> — 같은 달 두 번 청구되면 Idempotency-Key로 거절됨
//
// 인증: Vercel Cron은 `Authorization: Bearer <CRON_SECRET>` 헤더 자동 부착
// 로컬 테스트 시 동일 헤더로 호출 가능

const MAX_RETRIES_BEFORE_PAUSE = 3

export async function GET(req: NextRequest) {
  // MVP: 결제 기능 잠금(features.billing OFF) — 비활성 (파일은 보존)
  if (!features.billing) {
    return NextResponse.json({ error: 'billing disabled' }, { status: 404 })
  }

  // Vercel Cron 인증 검증
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
  }

  const db = serverClient()
  const now = new Date()
  const nowIso = now.toISOString()

  const { data: due, error: queryErr } = await db
    .from('subscriptions')
    .select('id, customer_id, project_id, monthly_fee_krw, toss_billing_key, toss_customer_key, next_billing_at')
    .eq('status', 'active')
    .lte('next_billing_at', nowIso)
    .not('toss_billing_key', 'is', null)
    .limit(100) as { data: Array<{
      id: string
      customer_id: string
      project_id: string
      monthly_fee_krw: number
      toss_billing_key: string | null
      toss_customer_key: string | null
      next_billing_at: string | null
    }> | null; error: any }

  if (queryErr) {
    return NextResponse.json({ error: queryErr.message }, { status: 500 })
  }

  const results: Array<{ subscription_id: string; status: 'ok' | 'failed'; message?: string }> = []

  for (const sub of due ?? []) {
    if (!sub.toss_billing_key || !sub.toss_customer_key) {
      results.push({
        subscription_id: sub.id,
        status: 'failed',
        message: 'toss_billing_key 또는 toss_customer_key 누락 — 카드 재등록 필요',
      })
      continue
    }
    // 한 달이 어긋난 케이스 대비 — orderId는 next_billing_at 기준 yyyymm
    const billingMonth = sub.next_billing_at ? new Date(sub.next_billing_at) : now
    const yyyymm = `${billingMonth.getUTCFullYear()}${String(billingMonth.getUTCMonth() + 1).padStart(2, '0')}`
    const orderId = `sub_${sub.id}_${yyyymm}`

    const customerKey = sub.toss_customer_key

    try {
      const payment = await executePayment({
        billingKey: sub.toss_billing_key,
        customerKey,
        amount: sub.monthly_fee_krw,
        orderId,
        orderName: 'LCD PRO CMS 정기결제',
      })

      await db.from('billing_history' as any).upsert(
        {
          subscription_id: sub.id,
          customer_id: sub.customer_id,
          payment_key: payment.paymentKey,
          order_id: orderId,
          amount_krw: sub.monthly_fee_krw,
          status: payment.status,
          method: payment.method,
          approved_at: payment.approvedAt ?? nowIso,
          raw_payload: payment,
        },
        { onConflict: 'payment_key' },
      )

      const next = new Date(billingMonth)
      next.setMonth(next.getMonth() + 1)
      await db
        .from('subscriptions')
        .update({ last_billed_at: nowIso, next_billing_at: next.toISOString() })
        .eq('id', sub.id)

      results.push({ subscription_id: sub.id, status: 'ok' })
    } catch (err) {
      const message = err instanceof TossError ? err.message : '결제 실패'

      // 동일 달 재시도 카운트 — billing_history에 같은 orderId로 실패 row 누적
      const { count } = await db
        .from('billing_history' as any)
        .select('id', { count: 'exact', head: true })
        .eq('order_id', orderId)
        .neq('status', 'DONE')

      const failCount = (count ?? 0) + 1
      await db.from('billing_history' as any).insert({
        subscription_id: sub.id,
        customer_id: sub.customer_id,
        payment_key: `failed_${sub.id}_${yyyymm}_${failCount}_${Date.now()}`,
        order_id: orderId,
        amount_krw: sub.monthly_fee_krw,
        status: 'FAILED',
        raw_payload: { error: message, attempt: failCount },
      })

      if (failCount >= MAX_RETRIES_BEFORE_PAUSE) {
        await db.from('subscriptions').update({ status: 'paused' }).eq('id', sub.id)
      }

      results.push({ subscription_id: sub.id, status: 'failed', message })
    }
  }

  return NextResponse.json({
    processed: results.length,
    succeeded: results.filter((r) => r.status === 'ok').length,
    failed: results.filter((r) => r.status === 'failed').length,
    results,
  })
}
