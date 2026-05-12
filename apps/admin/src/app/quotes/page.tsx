import { adminDb } from '@/lib/supabase'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending:    { label: '접수됨', color: 'bg-yellow-500/20 text-yellow-300' },
  reviewing:  { label: '검토중', color: 'bg-blue-500/20 text-blue-300' },
  estimated:  { label: '견적발송', color: 'bg-purple-500/20 text-purple-300' },
  site_check: { label: '현장실사', color: 'bg-orange-500/20 text-orange-300' },
  confirmed:  { label: '확정', color: 'bg-green-500/20 text-green-300' },
  contracted: { label: '계약완료', color: 'bg-emerald-500/20 text-emerald-300' },
  rejected:   { label: '거절', color: 'bg-red-500/20 text-red-300' },
  expired:    { label: '만료', color: 'bg-zinc-500/20 text-zinc-400' },
}

const URGENCY_MAP: Record<string, string> = {
  low: '여유',
  normal: '보통',
  high: '빠름',
  urgent: '긴급',
}

async function getQuotes(status?: string) {
  let query = adminDb
    .from('quotes')
    .select(`
      id, created_at, status, environment, urgency, purpose,
      estimate_min_krw, estimate_max_krw,
      customers (name, phone, business_name, region, business_type)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  if (status) query = query.eq('status', status as any)

  const { data } = await query
  return data ?? []
}

export const revalidate = 0

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const quotes = await getQuotes(searchParams.status)

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">견적 관리</h1>
          <p className="mt-1 text-sm text-zinc-500">총 {quotes.length}건</p>
        </div>
      </div>

      {/* 상태 필터 */}
      <div className="mb-5 flex flex-wrap gap-2">
        <Link href="/quotes" className={`badge px-3 py-1.5 ${!searchParams.status ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
          전체
        </Link>
        {Object.entries(STATUS_MAP).map(([key, { label, color }]) => (
          <Link
            key={key}
            href={`/quotes?status=${key}`}
            className={`badge px-3 py-1.5 ${searchParams.status === key ? color : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* 견적 목록 테이블 */}
      <div className="glass overflow-hidden rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-xs text-zinc-500">
              <th className="px-4 py-3 font-medium">접수일시</th>
              <th className="px-4 py-3 font-medium">업체명</th>
              <th className="px-4 py-3 font-medium">지역</th>
              <th className="px-4 py-3 font-medium">환경</th>
              <th className="px-4 py-3 font-medium">긴급도</th>
              <th className="px-4 py-3 font-medium">범위 견적</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {quotes.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-zinc-600">
                  해당 견적 없음
                </td>
              </tr>
            ) : (
              quotes.map((q: any) => {
                const status = STATUS_MAP[q.status] ?? { label: q.status, color: 'bg-zinc-800 text-zinc-400' }
                return (
                  <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {new Date(q.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                      <br />
                      {new Date(q.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-zinc-200">{q.customers?.business_name ?? q.customers?.name}</p>
                      <p className="text-xs text-zinc-500">{q.customers?.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-400">{q.customers?.region}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${q.environment === 'indoor' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
                        {q.environment === 'indoor' ? '실내' : '옥외'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-400">
                      {URGENCY_MAP[q.urgency] ?? q.urgency}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-300">
                      {q.estimate_min_krw && q.estimate_max_krw
                        ? `₩${(q.estimate_min_krw / 10000).toFixed(0)}만 ~ ₩${(q.estimate_max_krw / 10000).toFixed(0)}만`
                        : <span className="text-zinc-600">미산정</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${status.color}`}>{status.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/quotes/${q.id}`} className="text-zinc-500 hover:text-white transition-colors">
                        <ExternalLink size={14} />
                      </Link>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
