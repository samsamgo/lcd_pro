import { adminDb } from '@/lib/supabase'
import { FileText, Briefcase, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const [quotes, projects, customers] = await Promise.all([
    adminDb.from('quotes').select('status', { count: 'exact' }),
    adminDb.from('projects').select('status', { count: 'exact' }),
    adminDb.from('customers').select('id', { count: 'exact' }),
  ])

  const pendingQuotes = await adminDb
    .from('quotes')
    .select('id', { count: 'exact' })
    .eq('status', 'pending')

  return {
    totalQuotes: quotes.count ?? 0,
    pendingQuotes: pendingQuotes.count ?? 0,
    totalProjects: projects.count ?? 0,
    totalCustomers: customers.count ?? 0,
  }
}

async function getRecentQuotes() {
  const { data } = await adminDb
    .from('quotes')
    .select(`
      id, created_at, status, environment, urgency,
      customers (name, phone, business_name, region, business_type)
    `)
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

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

export const revalidate = 30

export default async function DashboardPage() {
  const [stats, recentQuotes] = await Promise.all([getStats(), getRecentQuotes()])

  const STAT_CARDS = [
    { label: '신규 견적 (대기)', value: stats.pendingQuotes, icon: FileText, alert: stats.pendingQuotes > 0, href: '/quotes?status=pending' },
    { label: '전체 견적', value: stats.totalQuotes, icon: FileText, alert: false, href: '/quotes' },
    { label: '진행 중 프로젝트', value: stats.totalProjects, icon: Briefcase, alert: false, href: '/projects' },
    { label: '총 고객', value: stats.totalCustomers, icon: Users, alert: false, href: '/customers' },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">대시보드</h1>
        <p className="mt-1 text-sm text-zinc-500">LCD PRO 운영 현황</p>
      </div>

      {/* 통계 카드 */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, alert, href }) => (
          <Link key={label} href={href} className={`glass rounded-xl p-5 transition-all hover:bg-white/[0.05] ${alert ? 'border-yellow-500/30' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500">{label}</p>
                <p className={`mt-1 text-3xl font-bold ${alert ? 'text-yellow-300' : 'text-white'}`}>{value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${alert ? 'bg-yellow-500/10' : 'bg-zinc-800'}`}>
                <Icon size={20} className={alert ? 'text-yellow-400' : 'text-zinc-400'} />
              </div>
            </div>
            {alert && (
              <p className="mt-2 text-xs text-yellow-400">응답 필요</p>
            )}
          </Link>
        ))}
      </div>

      {/* 최근 견적 */}
      <div className="glass rounded-xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <h2 className="font-semibold text-white">최근 견적 요청</h2>
          <Link href="/quotes" className="text-xs text-blue-400 hover:text-blue-300">전체 보기 →</Link>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {recentQuotes.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-zinc-600">
              접수된 견적이 없습니다
            </div>
          ) : (
            recentQuotes.map((q: any) => {
              const status = STATUS_MAP[q.status] ?? { label: q.status, color: 'bg-zinc-800 text-zinc-400' }
              return (
                <Link key={q.id} href={`/quotes/${q.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-zinc-200">
                        {q.customers?.business_name ?? q.customers?.name}
                      </p>
                      <span className={`badge ${status.color}`}>{status.label}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {q.customers?.region} · {q.environment === 'indoor' ? '실내' : '옥외'} · {q.customers?.phone}
                    </p>
                  </div>
                  <p className="text-xs text-zinc-600">
                    {new Date(q.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
