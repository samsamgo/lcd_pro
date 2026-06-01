'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Phone, MapPin, Briefcase, FileText, CreditCard } from 'lucide-react'

type Customer = {
  id: string
  created_at: string
  name: string
  business_name: string | null
  business_type: string
  phone: string
  email: string | null
  region: string
  address: string | null
  notes: string | null
}

const BUSINESS_TYPE_LABEL: Record<string, string> = {
  restaurant: '음식점',
  cafe: '카페',
  retail: '소매',
  academy: '학원',
  hospital: '병원',
  beauty: '미용',
  pharmacy: '약국',
  car_wash: '세차장',
  realtor: '부동산',
  other: '기타',
}

interface Props {
  initialCustomers: Customer[]
  stats: Record<string, { quotes: number; projects: number; activeSubs: number }>
  initialQuery: string
}

export function CustomersClient({ initialCustomers, stats, initialQuery }: Props) {
  const router = useRouter()
  const [q, setQ] = useState(initialQuery)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    router.push('/customers' + (params.toString() ? '?' + params.toString() : ''))
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">고객 관리</h1>
          <p className="mt-1 text-sm text-zinc-500">총 {initialCustomers.length}명 (최근 200건)</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-5 flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="이름, 사업체명, 전화번호 검색..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-9 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/60 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          검색
        </button>
        {initialQuery && (
          <Link
            href="/customers"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
          >
            전체
          </Link>
        )}
      </form>

      <div className="glass overflow-hidden rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-xs text-zinc-500">
              <th className="px-4 py-3 font-medium">고객</th>
              <th className="px-4 py-3 font-medium">연락처</th>
              <th className="px-4 py-3 font-medium">지역 / 주소</th>
              <th className="px-4 py-3 font-medium">활동</th>
              <th className="px-4 py-3 font-medium">가입일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {initialCustomers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-zinc-600">
                  {initialQuery ? '검색 결과 없음' : '고객 데이터 없음'}
                </td>
              </tr>
            ) : (
              initialCustomers.map((c) => {
                const s = stats[c.id] ?? { quotes: 0, projects: 0, activeSubs: 0 }
                return (
                  <tr key={c.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-zinc-100">
                        {c.business_name ?? c.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {c.business_name ? `${c.name} · ` : ''}
                        {BUSINESS_TYPE_LABEL[c.business_type] ?? c.business_type}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="flex items-center gap-1 text-sm text-zinc-300">
                        <Phone size={11} className="text-zinc-600" /> {c.phone}
                      </p>
                      {c.email && <p className="text-xs text-zinc-500">{c.email}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="flex items-start gap-1 text-sm text-zinc-300">
                        <MapPin size={11} className="mt-0.5 text-zinc-600" /> {c.region}
                      </p>
                      {c.address && <p className="text-xs text-zinc-500 line-clamp-1">{c.address}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-zinc-400" title="견적 수">
                          <FileText size={11} /> {s.quotes}
                        </span>
                        <span className="flex items-center gap-1 text-blue-400" title="프로젝트 수">
                          <Briefcase size={11} /> {s.projects}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400" title="활성 구독">
                          <CreditCard size={11} /> {s.activeSubs}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      {new Date(c.created_at).toLocaleDateString('ko-KR', { year: '2-digit', month: 'short', day: 'numeric' })}
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
