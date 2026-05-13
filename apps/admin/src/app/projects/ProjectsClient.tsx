'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, List, MapPin, Phone, AlertCircle } from 'lucide-react'

type Project = {
  id: string
  status: 'deposit_pending' | 'materials_order' | 'scheduled' | 'in_progress' | 'completed' | 'as_warranty'
  scheduled_date: string | null
  completed_date: string | null
  site_address: string
  installer_id: string | null
  notes: string | null
  deposit_paid_at: string | null
  customers: { name: string; business_name: string | null; phone: string; region: string } | null
  installers: { id: string; company_name: string; contact_name: string; phone: string } | null
}

type Installer = { id: string; company_name: string; contact_name: string }

const STATUS_MAP: Record<Project['status'], { label: string; color: string; order: number }> = {
  deposit_pending: { label: '계약금 대기',  color: 'bg-yellow-500/20 text-yellow-300', order: 1 },
  materials_order: { label: '자재 발주',    color: 'bg-blue-500/20 text-blue-300',     order: 2 },
  scheduled:       { label: '일정 확정',    color: 'bg-purple-500/20 text-purple-300', order: 3 },
  in_progress:     { label: '설치 진행',    color: 'bg-orange-500/20 text-orange-300', order: 4 },
  completed:       { label: '설치 완료',    color: 'bg-green-500/20 text-green-300',   order: 5 },
  as_warranty:     { label: 'AS 기간',      color: 'bg-emerald-500/20 text-emerald-300', order: 6 },
}

interface Props {
  initialProjects: Project[]
  installers: Installer[]
  statusFilter: string
  view: 'list' | 'calendar'
}

export function ProjectsClient({ initialProjects, installers, statusFilter, view }: Props) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return initialProjects
    return initialProjects.filter((p) => p.status === statusFilter)
  }, [initialProjects, statusFilter])

  async function patchProject(id: string, body: Partial<Pick<Project, 'status' | 'scheduled_date' | 'installer_id' | 'notes'>>) {
    setBusyId(id)
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: '저장 실패' }))
        alert(error)
        return
      }
      router.refresh()
    } finally {
      setBusyId(null)
    }
  }

  const setView = (v: 'list' | 'calendar') => {
    const u = new URL(window.location.href)
    u.searchParams.set('view', v)
    router.push(u.pathname + '?' + u.searchParams.toString())
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">설치 프로젝트</h1>
          <p className="mt-1 text-sm text-zinc-500">총 {initialProjects.length}건 (최근 200건)</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-1 rounded px-3 py-1.5 text-xs ${view === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
          >
            <List size={12} /> 목록
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`flex items-center gap-1 rounded px-3 py-1.5 text-xs ${view === 'calendar' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
          >
            <Calendar size={12} /> 캘린더
          </button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <Link href="/projects" className={`badge px-3 py-1.5 ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
          전체
        </Link>
        {(Object.entries(STATUS_MAP) as [Project['status'], { label: string; color: string; order: number }][])
          .sort((a, b) => a[1].order - b[1].order)
          .map(([key, { label, color }]) => (
            <Link
              key={key}
              href={`/projects?status=${key}`}
              className={`badge px-3 py-1.5 ${statusFilter === key ? color : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
            >
              {label}
            </Link>
          ))}
      </div>

      {view === 'calendar' ? (
        <CalendarView projects={filtered} />
      ) : (
        <div className="glass overflow-hidden rounded-xl">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-xs text-zinc-500">
                <th className="px-4 py-3 font-medium">일정</th>
                <th className="px-4 py-3 font-medium">고객 / 현장</th>
                <th className="px-4 py-3 font-medium">설치사</th>
                <th className="px-4 py-3 font-medium">상태</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-zinc-600">
                    해당 프로젝트 없음
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const status = STATUS_MAP[p.status]
                  const overdue =
                    p.scheduled_date &&
                    new Date(p.scheduled_date) < new Date() &&
                    p.status !== 'completed' &&
                    p.status !== 'as_warranty'
                  return (
                    <tr key={p.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <input
                          type="date"
                          value={p.scheduled_date ?? ''}
                          disabled={busyId === p.id}
                          onChange={(e) => patchProject(p.id, { scheduled_date: e.target.value || null })}
                          className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:border-blue-500/60 focus:outline-none"
                        />
                        {overdue && (
                          <p className="mt-1 flex items-center gap-1 text-[10px] text-red-400">
                            <AlertCircle size={10} /> 지연
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-zinc-100">
                          {p.customers?.business_name ?? p.customers?.name ?? '-'}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-zinc-500">
                          <Phone size={10} /> {p.customers?.phone ?? '-'}
                        </p>
                        <p className="flex items-start gap-1 text-xs text-zinc-500">
                          <MapPin size={10} className="mt-0.5 shrink-0" />
                          <span className="line-clamp-1">{p.site_address || p.customers?.region}</span>
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={p.installer_id ?? ''}
                          disabled={busyId === p.id}
                          onChange={(e) => patchProject(p.id, { installer_id: e.target.value || null })}
                          className="w-full rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:border-blue-500/60 focus:outline-none"
                        >
                          <option value="">미배정</option>
                          {installers.map((i) => (
                            <option key={i.id} value={i.id}>{i.company_name}</option>
                          ))}
                        </select>
                        {p.installers && (
                          <p className="mt-1 text-[10px] text-zinc-500">{p.installers.contact_name} · {p.installers.phone}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={p.status}
                          disabled={busyId === p.id}
                          onChange={(e) => patchProject(p.id, { status: e.target.value as Project['status'] })}
                          className={`w-full rounded border border-transparent px-2 py-1 text-xs font-medium focus:outline-none ${status.color}`}
                        >
                          {(Object.entries(STATUS_MAP) as [Project['status'], { label: string }][]).map(([k, v]) => (
                            <option key={k} value={k} className="bg-zinc-900 text-zinc-200">{v.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {p.notes && <span title={p.notes} className="line-clamp-1 max-w-[200px]">{p.notes}</span>}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function CalendarView({ projects }: { projects: Project[] }) {
  const scheduled = projects.filter((p) => p.scheduled_date)
  const grouped = useMemo(() => {
    const map = new Map<string, Project[]>()
    for (const p of scheduled) {
      const key = p.scheduled_date!.slice(0, 7) // YYYY-MM
      const arr = map.get(key) ?? []
      arr.push(p)
      map.set(key, arr)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [scheduled])

  if (grouped.length === 0) {
    return (
      <div className="glass rounded-xl p-10 text-center text-sm text-zinc-600">
        일정이 잡힌 프로젝트가 없습니다.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {grouped.map(([month, items]) => (
        <div key={month} className="glass rounded-xl p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            {month.replace('-', '년 ')}월 · {items.length}건
          </p>
          <div className="space-y-2">
            {items
              .sort((a, b) => a.scheduled_date!.localeCompare(b.scheduled_date!))
              .map((p) => {
                const status = STATUS_MAP[p.status]
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-zinc-900/50 px-3 py-2"
                  >
                    <div className="w-16 shrink-0 text-center">
                      <p className="text-xs text-zinc-500">{p.scheduled_date!.slice(5)}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-zinc-100">
                        {p.customers?.business_name ?? p.customers?.name}
                      </p>
                      <p className="text-xs text-zinc-500 line-clamp-1">{p.site_address}</p>
                    </div>
                    <div className="text-xs text-zinc-400">
                      {p.installers?.company_name ?? <span className="text-zinc-600">미배정</span>}
                    </div>
                    <span className={`badge ${status.color}`}>{status.label}</span>
                  </div>
                )
              })}
          </div>
        </div>
      ))}
    </div>
  )
}
