'use client'

import { useState } from 'react'
import { CreditCard, AlertTriangle, CheckCircle2, X } from 'lucide-react'
import type { BillingRow } from './page'

interface Props {
  rows: BillingRow[]
  failureCounts: Record<string, number>
}

const STATUS_STYLE: Record<string, string> = {
  DONE: 'bg-emerald-500/20 text-emerald-300',
  CANCELED: 'bg-zinc-700/40 text-zinc-400',
  PARTIAL_CANCELED: 'bg-zinc-700/40 text-zinc-400',
  ABORTED: 'bg-red-500/20 text-red-300',
  EXPIRED: 'bg-red-500/20 text-red-300',
}

function fmtKrw(n: number | null): string {
  if (n == null) return '—'
  return `₩${(n / 10000).toFixed(0)}만`
}

function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function BillingClient({ rows, failureCounts }: Props) {
  const [selected, setSelected] = useState<BillingRow | null>(null)

  const total = rows.length
  const done = rows.filter((r) => r.status === 'DONE').length
  const failed = rows.filter((r) => r.status && (r.status === 'ABORTED' || r.status === 'EXPIRED')).length

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">결제 이력</h1>
        <p className="mt-1 text-sm text-zinc-500">최근 300건 · 구독·견적 결제 통합</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard icon={<CreditCard size={16} />} label="전체" value={total} tone="zinc" />
        <StatCard icon={<CheckCircle2 size={16} />} label="성공 (DONE)" value={done} tone="emerald" />
        <StatCard icon={<AlertTriangle size={16} />} label="실패 (ABORTED/EXPIRED)" value={failed} tone="red" />
      </div>

      <div className="glass overflow-hidden rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-xs text-zinc-500">
              <th className="px-4 py-3 font-medium">시각</th>
              <th className="px-4 py-3 font-medium">orderId</th>
              <th className="px-4 py-3 font-medium">금액</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium">수단</th>
              <th className="px-4 py-3 font-medium">실패 누적</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {total === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-zinc-600">
                  결제 이력 없음 · billing_history 마이그레이션(003) 적용 + 첫 결제 발생 시 표시됩니다.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const failures = r.subscription_id ? failureCounts[r.subscription_id] ?? 0 : 0
                return (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {fmtDate(r.webhook_received_at ?? r.approved_at)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-300">
                      {r.order_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-200">{fmtKrw(r.amount_krw)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge ${
                          STATUS_STYLE[r.status ?? ''] ?? 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {r.status ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{r.method ?? '—'}</td>
                    <td className="px-4 py-3 text-xs">
                      {failures >= 3 ? (
                        <span className="badge bg-red-500/20 text-red-300">{failures}회 (paused)</span>
                      ) : failures > 0 ? (
                        <span className="badge bg-yellow-500/20 text-yellow-300">{failures}회</span>
                      ) : (
                        <span className="text-zinc-600">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(r)}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        원본
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="glass max-h-[80vh] w-full max-w-2xl overflow-auto rounded-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-200">원본 페이로드 · {selected.order_id}</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <pre className="overflow-auto rounded-lg border border-white/[0.06] bg-black/40 p-3 text-xs text-zinc-300">
              {JSON.stringify(selected.raw_payload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: number
  tone: 'zinc' | 'emerald' | 'red'
}) {
  const toneClass =
    tone === 'emerald' ? 'text-emerald-400' : tone === 'red' ? 'text-red-400' : 'text-zinc-300'
  return (
    <div className="glass rounded-xl p-4">
      <div className={`flex items-center gap-2 text-xs ${toneClass}`}>
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-1 text-2xl font-bold text-zinc-100">{value}</p>
    </div>
  )
}
