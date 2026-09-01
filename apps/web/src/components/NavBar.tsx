'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import {
  Menu, X, MessageCircle, ChevronDown,
  MonitorSmartphone, Layers, Sparkles, Wrench, Ruler, ShieldCheck,
  Building2, BookOpen, HelpCircle,
  type LucideIcon,
} from 'lucide-react'
import { SITE } from '@/lib/seo/site'
import { useSiteModals } from '@/components/modals/SiteModals'
import { BrandLogo } from '@/components/brand/BrandLogo'

interface NavChild {
  label: string
  desc: string
  href: string
  icon: LucideIcon
}
interface NavGroup {
  label: string
  href: string
  children: NavChild[]
}

const NAV: NavGroup[] = [
  {
    label: '디스플레이',
    href: '/products',
    children: [
      { label: '제품 라인업', desc: '실내·옥외 6종 표준 모델', href: '/products', icon: MonitorSmartphone },
      { label: '패키지 · 가격', desc: '베이직 · 스탠다드 · 프리미엄 · 렌탈', href: '/packages', icon: Layers },
      { label: '즉석 견적', desc: '사진 3장 · 30분 범위 견적', href: '/quote', icon: Sparkles },
    ],
  },
  {
    label: '솔루션',
    href: '/services',
    children: [
      { label: '서비스 전체', desc: '설계 · 시공 · CMS · AS를 한 파트너로', href: '/services', icon: Wrench },
      { label: '표준 시공', desc: '표준 캐비닛 · 3일 표준 설치', href: '/services#install', icon: Ruler },
      { label: 'CMS 콘텐츠 운영', desc: '원격 교체 · 스케줄 · 다점포', href: '/services#cms', icon: MonitorSmartphone },
      { label: 'AS · 유지보수', desc: '모듈 교체 · 정기 점검 · 긴급 AS', href: '/services#care', icon: ShieldCheck },
      { label: '인증 · 공공조달', desc: 'KC · 옥외광고물 · 나라장터', href: '/services#cert', icon: Building2 },
    ],
  },
  {
    label: '업종별',
    href: '/industries',
    children: [
      { label: '관공서 · 민원실', desc: '창구 · 부서 · 시정 안내', href: '/industries/public-office', icon: Building2 },
      { label: '학교 · 강당', desc: '급식표 · 행사 · 귀가 안내', href: '/industries/school', icon: BookOpen },
      { label: '전자현수막', desc: '재난 · 시정 홍보 · 계도 문구', href: '/industries/banner', icon: Layers },
      { label: '공공기관 · 시설관리', desc: '로비 · 층별 종합안내', href: '/industries/institution', icon: ShieldCheck },
    ],
  },
  {
    label: '회사',
    href: '/about',
    children: [
      { label: '회사 소개', desc: 'LED 전광판 설계 · 시공 안내', href: '/about', icon: Building2 },
      { label: 'FAQ', desc: '자주 묻는 질문', href: '/faq', icon: HelpCircle },
    ],
  },
]

export function NavBar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [mobileGroup, setMobileGroup] = useState<string | null>(null)
  const pathname = usePathname()
  const { openConsult } = useSiteModals()
  const closeTimer = useRef<number | null>(null)

  // 상단이 다크 히어로인 페이지 — 스크롤 전 투명 헤더 + 밝은 글자
  const DARK_HERO = ['/', '/about', '/services']
  const hasDarkHero = DARK_HERO.includes(pathname) || pathname.startsWith('/industries/')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onDark = hasDarkHero && !scrolled && !open && openGroup === null

  const enter = (label: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setOpenGroup(label)
  }
  const leave = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpenGroup(null), 120)
  }

  return (
    <header
      onMouseLeave={leave}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || open || openGroup
          ? 'border-b border-zinc-200 bg-white/85 shadow-sm backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      {/* 다크 히어로 위 투명 헤더일 때 상단 스크림 — 밝은 글자 가독성 보장 */}
      {onDark && (
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/50 to-transparent" aria-hidden="true" />
      )}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className={`flex items-center rounded-lg ${onDark ? 'text-white' : 'text-[#1F2937]'}`}
          aria-label={`${SITE.nameKo} 홈`}
        >
          <BrandLogo markSize={32} />
        </Link>

        {/* 데스크톱 메가메뉴 */}
        <nav aria-label="주요 메뉴" className="hidden items-center gap-1 md:flex">
          {NAV.map((g) => (
            <div key={g.label} className="relative" onMouseEnter={() => enter(g.label)}>
              <Link
                href={g.href}
                onFocus={() => enter(g.label)}
                aria-expanded={openGroup === g.label}
                className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  onDark ? 'text-zinc-100 hover:bg-white/10' : 'text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                {g.label}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${openGroup === g.label ? 'rotate-180' : ''} ${
                    onDark ? 'text-zinc-400' : 'text-zinc-400'
                  }`}
                />
              </Link>

              {/* 드롭다운 패널 */}
              {openGroup === g.label && (
                <div
                  className="absolute left-1/2 top-full w-[22rem] -translate-x-1/2 pt-3"
                  onMouseEnter={() => enter(g.label)}
                >
                  <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl ring-1 ring-black/5">
                    {g.children.map((c) => {
                      const Icon = c.icon
                      return (
                        <Link
                          key={c.label + c.href}
                          href={c.href}
                          onClick={() => setOpenGroup(null)}
                          className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-blue-50"
                        >
                          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                            <Icon size={17} />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-zinc-900">{c.label}</span>
                            <span className="block text-xs text-zinc-500">{c.desc}</span>
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => openConsult('navbar')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              onDark ? 'text-zinc-100 hover:bg-white/10' : 'text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <MessageCircle size={15} className="text-blue-500" />
            빠른 상담
          </button>
          <Link
            href="/quote"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-95 glow"
          >
            견적 요청하기
          </Link>
        </div>

        {/* 모바일 */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/quote"
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-all active:scale-95"
          >
            견적
          </Link>
          <button
            className={`rounded-lg p-2 ${onDark ? 'text-white' : 'text-zinc-700'}`}
            onClick={() => setOpen(!open)}
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 모바일 아코디언 */}
      {open && (
        <div id="mobile-nav" className="max-h-[80vh] overflow-y-auto border-t border-zinc-200 bg-white px-4 pb-4 pt-2 md:hidden">
          {NAV.map((g) => (
            <div key={g.label} className="border-b border-zinc-100">
              <button
                type="button"
                onClick={() => setMobileGroup(mobileGroup === g.label ? null : g.label)}
                aria-expanded={mobileGroup === g.label}
                className="flex w-full items-center justify-between py-3.5 text-left text-sm font-semibold text-zinc-800"
              >
                {g.label}
                <ChevronDown size={16} className={`text-zinc-400 transition-transform ${mobileGroup === g.label ? 'rotate-180' : ''}`} />
              </button>
              {mobileGroup === g.label && (
                <div className="pb-2">
                  {g.children.map((c) => (
                    <Link
                      key={c.label + c.href}
                      href={c.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg py-2.5 pl-2 pr-3 text-sm text-zinc-600 hover:bg-zinc-50"
                    >
                      <c.icon size={16} className="text-blue-600" />
                      <span>
                        <span className="font-medium text-zinc-800">{c.label}</span>
                        <span className="ml-2 text-xs text-zinc-400">{c.desc}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => { setOpen(false); openConsult('navbar-mobile') }}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-3 text-sm font-semibold text-zinc-700"
          >
            <MessageCircle size={15} className="text-blue-600" /> 빠른 상담
          </button>
          <Link
            href="/quote"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            견적 요청하기
          </Link>
        </div>
      )}
    </header>
  )
}
