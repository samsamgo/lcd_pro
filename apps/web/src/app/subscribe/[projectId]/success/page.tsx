import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { serverClient } from '@/lib/supabase'
import { features } from '@/lib/features'
import { issueBillingKey, executePayment, TossError } from '@/lib/toss'

export const dynamic = 'force-dynamic'

interface SearchParams {
  authKey?: string
  customerKey?: string
  monthlyKrw?: string
  tier?: string
}

// 빌링키 발급 + 구독 행 생성 + 첫 결제 실행
async function activate(projectId: string, params: SearchParams) {
  const { authKey, customerKey, monthlyKrw, tier } = params
  if (!authKey || !customerKey) return { ok: false as const, error: '인증 정보 누락' }

  const db = serverClient()

  // 1) 프로젝트 + 고객 확인 (서버에서 다시 조회 — 클라이언트가 보낸 가격 신뢰 X)
  const { data: project } = await db
    .from('projects')
    .select('id, customer_id')
    .eq('id', projectId)
    .single()
  if (!project) return { ok: false as const, error: '프로젝트 없음' }

  // 2) 빌링키 발급
  let billingKey: string
  try {
    const issued = await issueBillingKey({ authKey, customerKey })
    billingKey = issued.billingKey
  } catch (err) {
    return {
      ok: false as const,
      error: err instanceof TossError ? `빌링키 발급 실패: ${err.message}` : '빌링키 발급 실패',
    }
  }

  // 3) 가격 신뢰 — query string의 monthlyKrw를 받되, 사용자 조작 가능성 고려해 합리적 범위만 허용
  const amount = Number(monthlyKrw)
  if (!Number.isFinite(amount) || amount < 10000 || amount > 1_000_000) {
    return { ok: false as const, error: '월 결제 금액이 유효하지 않습니다.' }
  }

  // 4) subscriptions UPSERT — project_id 기준 (한 프로젝트당 활성 구독 1개 가정)
  const now = new Date().toISOString()
  const { data: existing } = await db
    .from('subscriptions')
    .select('id')
    .eq('project_id', projectId)
    .maybeSingle()

  let subscriptionId: string
  if (existing?.id) {
    subscriptionId = existing.id
    await db
      .from('subscriptions')
      .update({
        toss_billing_key: billingKey,
        toss_customer_key: customerKey,
        status: 'active',
        monthly_fee_krw: amount,
        package_tier: (tier as any) ?? 'standard',
      } as any)
      .eq('id', existing.id)
  } else {
    const { data: created, error: insertErr } = await db
      .from('subscriptions')
      .insert({
        customer_id: project.customer_id,
        project_id: projectId,
        package_tier: (tier as any) ?? 'standard',
        monthly_fee_krw: amount,
        started_at: now,
        toss_billing_key: billingKey,
        toss_customer_key: customerKey,
        status: 'active',
        billing_day: new Date(now).getUTCDate(),
      } as any)
      .select('id')
      .single()
    if (insertErr || !created) {
      return { ok: false as const, error: `구독 생성 실패: ${insertErr?.message ?? ''}` }
    }
    subscriptionId = created.id
  }

  // 5) 첫 결제 — orderId 컨벤션: sub_<subscriptionId>_<yyyymm>
  const yyyymm = now.slice(0, 7).replace('-', '')
  const orderId = `sub_${subscriptionId}_${yyyymm}`

  try {
    const payment = await executePayment({
      billingKey,
      customerKey,
      amount,
      orderId,
      orderName: 'LCD PRO CMS 정기결제 (첫 회)',
    })

    // billing_history insert (멱등 — payment_key UNIQUE)
    await db.from('billing_history' as any).upsert(
      {
        subscription_id: subscriptionId,
        customer_id: project.customer_id,
        payment_key: payment.paymentKey,
        order_id: orderId,
        amount_krw: amount,
        status: payment.status,
        method: payment.method,
        approved_at: payment.approvedAt ?? now,
        raw_payload: payment,
      },
      { onConflict: 'payment_key' },
    )

    // last_billed_at + next_billing_at (+1m)
    const next = new Date(now)
    next.setMonth(next.getMonth() + 1)
    await db
      .from('subscriptions')
      .update({ last_billed_at: now, next_billing_at: next.toISOString() })
      .eq('id', subscriptionId)

    return { ok: true as const, amount, orderId }
  } catch (err) {
    // 빌링키는 발급됐지만 첫 결제 실패 — 구독은 paused로
    await db.from('subscriptions').update({ status: 'paused' }).eq('id', subscriptionId)
    return {
      ok: false as const,
      error: err instanceof TossError ? `첫 결제 실패: ${err.message}` : '첫 결제 실패',
    }
  }
}

export default async function SubscribeSuccessPage({
  params,
  searchParams,
}: {
  params: { projectId: string }
  searchParams: SearchParams
}) {
  // MVP: 결제 기능 잠금(features.billing OFF) — 홈으로 redirect (파일은 보존)
  if (!features.billing) redirect('/')

  const result = await activate(params.projectId, searchParams)

  if (!result.ok) {
    return (
      <main className="mx-auto max-w-xl px-5 py-16 text-center">
        <AlertTriangle size={48} className="mx-auto text-red-600" />
        <h1 className="mt-5 text-xl font-bold text-zinc-900">결제 처리 중 문제가 발생했습니다</h1>
        <p className="mt-2 text-sm text-zinc-600">{result.error}</p>
        <Link
          href={`/subscribe/${params.projectId}`}
          className="mt-6 inline-block rounded-lg border border-zinc-300 px-5 py-2.5 text-sm text-zinc-800 hover:bg-zinc-100"
        >
          다시 시도하기
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-16 text-center">
      <CheckCircle2 size={48} className="mx-auto text-green-600" />
      <h1 className="mt-5 text-xl font-bold text-zinc-900">구독이 시작되었습니다</h1>
      <p className="mt-2 text-sm text-zinc-600">
        ₩{result.amount.toLocaleString('ko-KR')} 첫 결제 완료. 다음 결제는 한 달 뒤 자동 청구됩니다.
      </p>
      <p className="mt-1 text-xs text-zinc-500">주문번호: {result.orderId}</p>
    </main>
  )
}
