'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { CreditCard, ShieldCheck, AlertCircle } from 'lucide-react'

interface Props {
  projectId: string
  customerKey: string
  clientKey: string
  monthlyKrw: number
  tier: string
  customerName: string
  customerEmail: string
  businessName: string
}

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => any
  }
}

const TIER_LABEL: Record<string, string> = {
  basic: '베이직',
  standard: '스탠다드',
  premium: '프리미엄',
  rental: '렌탈',
}

export function SubscribeClient({
  projectId,
  customerKey,
  clientKey,
  monthlyKrw,
  tier,
  customerName,
  customerEmail,
  businessName,
}: Props) {
  const [sdkReady, setSdkReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.TossPayments) setSdkReady(true)
  }, [])

  async function handleRegisterCard() {
    setError(null)
    if (!clientKey) {
      setError('NEXT_PUBLIC_TOSS_CLIENT_KEY 환경변수가 설정되지 않았습니다.')
      return
    }
    if (!window.TossPayments) {
      setError('Toss SDK 로드 실패. 페이지를 새로고침해주세요.')
      return
    }

    setSubmitting(true)
    try {
      const tossPayments = window.TossPayments(clientKey)
      const payment = tossPayments.payment({ customerKey })

      const origin = window.location.origin
      await payment.requestBillingAuth({
        method: 'CARD',
        successUrl: `${origin}/subscribe/${projectId}/success?customerKey=${encodeURIComponent(customerKey)}&monthlyKrw=${monthlyKrw}&tier=${tier}`,
        failUrl: `${origin}/subscribe/${projectId}/fail`,
        customerEmail: customerEmail || undefined,
        customerName: customerName || undefined,
      })
    } catch (err: any) {
      setError(err?.message ?? '카드 인증 요청에 실패했습니다.')
      setSubmitting(false)
    }
  }

  return (
    <>
      <Script
        src="https://js.tosspayments.com/v2/standard"
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
      />

      <main className="mx-auto max-w-xl px-5 py-12">
        <h1 className="text-2xl font-bold text-zinc-100">CMS 정기결제 가입</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {businessName || customerName} 고객님의 콘텐츠 관리 서비스 구독
        </p>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <p className="text-xs text-zinc-500">패키지</p>
              <p className="mt-0.5 text-lg font-semibold text-zinc-100">
                {TIER_LABEL[tier] ?? tier}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500">월 정기결제</p>
              <p className="mt-0.5 text-2xl font-bold text-zinc-100">
                ₩{monthlyKrw.toLocaleString('ko-KR')}
              </p>
            </div>
          </div>

          <ul className="mt-4 space-y-2 text-sm text-zinc-400">
            <li className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-blue-400" />
              매월 자동 결제 (등록 카드)
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-blue-400" />
              언제든지 해지 가능
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-blue-400" />
              카드 정보는 Toss Payments에 직접 저장 — 당사 서버에는 저장되지 않음
            </li>
          </ul>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleRegisterCard}
          disabled={submitting || !sdkReady || !clientKey}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CreditCard size={16} />
          {submitting ? '카드 인증 중...' : !sdkReady ? 'SDK 로드 중...' : '카드 등록하고 구독 시작'}
        </button>

        <p className="mt-3 text-center text-xs text-zinc-600">
          첫 결제는 카드 인증 직후 진행되며, 다음 결제는 한 달 뒤 동일 카드로 자동 청구됩니다.
        </p>
      </main>
    </>
  )
}
