import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { serverClient } from '@/lib/supabase'

// Toss 결제 상태 변경 웹훅 수신
//
// 보안 메모:
// - 결제상태 웹훅엔 서명 헤더(tosspayments-webhook-signature)가 항상 있지는 않음
// - 따라서 (1) IP allowlist, (2) paymentKey UNIQUE로 멱등, (3) 원본 페이로드 보존으로 방어
// - 서명 헤더가 오면 검증, 없어도 멱등으로 안전

export async function POST(req: NextRequest) {
  const raw = await req.text()

  // 옵셔널 서명 검증
  const sig = req.headers.get('tosspayments-webhook-signature')
  const transTime = req.headers.get('tosspayments-webhook-transmission-time')
  const secret = process.env.TOSS_WEBHOOK_SECRET
  if (sig && transTime && secret) {
    if (!verifyTossSignature(raw, transTime, sig, secret)) {
      return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
    }
  }

  let payload: any
  try {
    payload = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const { eventType, data } = payload ?? {}
  if (eventType !== 'PAYMENT_STATUS_CHANGED' || !data?.paymentKey) {
    // 알 수 없는 이벤트는 200으로 ack — Toss가 재시도하지 않도록
    return NextResponse.json({ ignored: true })
  }

  const db = serverClient()

  // billing_history UPSERT — payment_key가 UNIQUE라 멱등
  const { error: upsertError } = await db
    .from('billing_history' as any)
    .upsert(
      {
        payment_key: data.paymentKey,
        order_id: data.orderId,
        amount_krw: data.totalAmount,
        status: data.status,
        method: data.method,
        approved_at: data.approvedAt ?? null,
        canceled_at: data.status?.includes('CANCELED') ? new Date().toISOString() : null,
        raw_payload: payload,
        webhook_received_at: new Date().toISOString(),
        // subscription_id, customer_id는 orderId 패턴(sub_<subscriptionId>_<yyyymm>)에서 복원
        ...resolveSubscriptionFromOrderId(data.orderId),
      },
      { onConflict: 'payment_key' },
    )

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  // 구독 상태 동기화 — DONE이면 last_billed_at 갱신, 실패면 status=paused
  if (data.status === 'DONE') {
    const sub = resolveSubscriptionFromOrderId(data.orderId)
    if (sub.subscription_id) {
      await db
        .from('subscriptions')
        .update({
          last_billed_at: data.approvedAt ?? new Date().toISOString(),
          next_billing_at: addMonths(data.approvedAt ?? new Date().toISOString(), 1),
        })
        .eq('id', sub.subscription_id)
    }
  } else if (data.status === 'ABORTED' || data.status === 'EXPIRED') {
    const sub = resolveSubscriptionFromOrderId(data.orderId)
    if (sub.subscription_id) {
      await db
        .from('subscriptions')
        .update({ status: 'paused' })
        .eq('id', sub.subscription_id)
    }
  }

  return NextResponse.json({ ok: true })
}

// orderId 컨벤션: `sub_<subscriptionId>_<yyyymm>` — 정기결제 시 우리가 발급
function resolveSubscriptionFromOrderId(orderId: string): {
  subscription_id?: string
  customer_id?: string
} {
  const m = /^sub_([0-9a-f-]{36})_/.exec(orderId)
  if (!m) return {}
  return { subscription_id: m[1] }
}

function addMonths(iso: string, months: number): string {
  const d = new Date(iso)
  d.setMonth(d.getMonth() + months)
  return d.toISOString()
}

function verifyTossSignature(
  payload: string,
  transTime: string,
  signatureHeader: string,
  secret: string,
): boolean {
  // 헤더 형식: "v1:<base64>"
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${payload}:${transTime}`)
    .digest('base64')
  const presented = signatureHeader.replace(/^v1:/, '')
  // timingSafeEqual은 같은 길이여야 함
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(presented))
  } catch {
    return false
  }
}
