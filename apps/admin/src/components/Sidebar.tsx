import Link from 'next/link'
import { FileText, Briefcase, Users, Package, BarChart3, Settings, Monitor, CreditCard, Activity } from 'lucide-react'

const NAV = [
  { href: '/', icon: BarChart3, label: '대시보드' },
  { href: '/ops', icon: Activity, label: '전사 현황' },
  { href: '/quotes', icon: FileText, label: '견적 관리' },
  { href: '/projects', icon: Briefcase, label: '설치 프로젝트' },
  { href: '/customers', icon: Users, label: '고객 관리' },
  { href: '/installers', icon: Package, label: '파트너 관리' },
  { href: '/billing', icon: CreditCard, label: '결제 이력' },
  { href: '/devices', icon: Monitor, label: '디바이스 모니터' },
  { href: '/settings', icon: Settings, label: '설정' },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-white/[0.06] bg-[#080808]">
      <div className="flex h-14 items-center border-b border-white/[0.06] px-4">
        <span className="text-lg font-bold">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">LCD</span>
          <span className="text-white">PRO</span>
          <span className="ml-1.5 text-xs font-normal text-zinc-600">Admin</span>
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/[0.06] p-3">
        <div className="rounded-lg bg-blue-600/10 px-3 py-2">
          <p className="text-xs font-medium text-blue-400">서비스 운영 중</p>
          <p className="text-[10px] text-zinc-600">LCD PRO v0.1 MVP</p>
        </div>
      </div>
    </aside>
  )
}
