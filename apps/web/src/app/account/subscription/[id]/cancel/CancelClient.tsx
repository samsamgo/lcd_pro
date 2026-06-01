'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  subscriptionId: string
  customerId: string | null
  status: string | null
  createdAt: string | null
  nextBillingAt: string | null
}

const REASONS = [
  '비용 부담',
  '서비스 사용 빈도 낮음',
  '매장 운영 중단',
  '경쟁사로 이전',
  '기능 부족',
  '기타',
] as const

export function CancelClient({ subscriptionId, customerId, status, createdAt, nextBillingAt }: Props) {
  const router = useRouter()
  const [reason, setReason] = useState<string>('')
  const [detail, setDetail] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const alreadyCanceled = status === 'cancelled'
  const daysSinceCreated = createdAt
    ? Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000)
    : null
  const within7Days = daysSinceCreated != null && daysSinceCreated <= 7

  async function submit() {
    if (!reason) {
      setError('해지 사유를 선택해주세요.')
      return
    }
    if (!confirmed) {
      setError('해지 안내를 확인해주세요.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const r = await fetch('/api/billing/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId,
          customerId,
          reason: detail ? `${reason} — ${detail}` : reason,
        }),
      })
      if (!r.ok) {
        const j = await r.json().catch(() => ({}))
        throw new Error(j?.error ?? '해지 실패')
      }
      setDone(true)
    } catch (e: any) {
      setError(e?.message ?? '오류')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md p-6">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <h2 className="text-lg font-semibold text-emerald-200">해지 완료</h2>
          <p className="mt-2 text-sm text-zinc-300">
            구독이 해지되었습니다. 다음 결제 사이클부터 청구되지 않습니다.
            언제든 다시 가입하실 수 있습니다.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 rounded-lg border border-emerald-400/50 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-500/20"
          >
            홈으로
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">구독 해지</h1>
      <p className="mt-2 text-sm text-zinc-500">구독 ID: {subscriptionId.slice(0, 8)}…</p>

      {alreadyCanceled ? (
        <div className="mt-6 rounded-xl border border-zinc-700 bg-zinc-900/40 p-5">
          <p className="text-sm text-zinc-400">이 구독은 이미 해지된 상태입니다.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5 text-sm">
            <p className="font-semibold text-yellow-200">해지 안내</p>
            <ul className="space-y-1 text-zinc-300">
              <li>· 해지 후 <span className="text-zinc-100">다음 결제 사이클부터 청구가 중단</span>됩니다.</li>
              {within7Days ? (
                <li>· 가입 7일 이내({daysSinceCreated}일 경과)이므로 <span className="text-emerald-200">사용 이력 검토 후 환불 가능</span>합니다. 처리 1~3영업일.</li>
              ) : (
                <li>· 가입 7일 이후이므로 당월 환불은 없습니다. 다음 결제일까지는 서비스가 계속 동작합니다.</li>
              )}
              {nextBillingAt && (
                <li>· 다음 결제 예정일: <span className="text-zinc-100">{new Date(nextBillingAt).toLocaleDateString('ko-KR')}</span></li>
              )}
              <li>· 등록된 카드 빌링키는 보관됩니다 (재가입 편의). 완전 폐기 원하시면 별도 문의.</li>
            </ul>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">해지 사유</label>
              <div className="space-y-2">
                {REASONS.map((r) => (
                  <label key={r} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                    />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">추가 의견 (선택)</label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900/40 p-3 text-sm text-zinc-100 placeholder:text-zinc-600"
                placeholder="개선이 필요한 부분이나 의견을 알려주세요."
              />
            </div>

            <label className="flex cursor-pointer items-start gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1"
              />
              <span>위 해지 안내를 모두 확인했으며, 해지에 동의합니다.</span>
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1 rounded-lg border border-zinc-700 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
              >
                돌아가기
              </button>
              <button
                onClick={submit}
                disabled={loading || !reason || !confirmed}
                className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
              >
                {loading ? '처리 중…' : '해지하기'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
