'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Menu, X, MessageCircle, ChevronDown,
  MonitorSmartphone, Layers, Wrench, Ruler, ShieldCheck,
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
  /** 하위 항목이 없으면 드롭다운 없이 바로 이동한다 */
  children?: NavChild[]
}

/**
 * 상단 메뉴.
 *
 * 라벨은 담당자가 쓰는 말로 적는다. "디스플레이", "솔루션" 같은 업계 용어는
 * 결재 문서에 그대로 옮겨 적을 수 없어서 뺐다.
 *
 * ⚠️ 하위 항목의 앵커는 실제 페이지에 있는 id 여야 한다.
 *    services 페이지를 다시 쓰면서 #install·#controller·#cms·#care·#cert 가 전부 사라졌는데
 *    메뉴만 옛날 그대로 남아 링크 다섯 개가 죽어 있었다. 페이지를 고칠 때 여기도 같이 본다.
 */
const NAV: NavGroup[] = [
  {
    label: '제품',
    href: '/products',
    children: [
      { label: '설치 환경별', desc: '실내·준실외·옥외로 나눠서', href: '/products#lineup', icon: MonitorSmartphone },
      { label: '규격 비교', desc: '화소 간격·밝기·시야각', href: '/products#spec', icon: Ruler },
      { label: '포함 범위와 가격', desc: '어디까지 들어가는지', href: '/products#price', icon: Layers },
    ],
  },
  {
    label: '공급 범위',
    href: '/services',
    children: [
      { label: '6공정', desc: '실측부터 사후관리까지', href: '/services#process', icon: Wrench },
      { label: '우리 몫과 기관 몫', desc: '예산 범위를 가르는 경계', href: '/services#scope', icon: Layers },
      { label: '제출 서류', desc: '결재에 붙일 문서와 시점', href: '/services#documents', icon: HelpCircle },
    ],
  },
  {
    label: '업종별',
    href: '/industries',
    children: [
      { label: '관공서 · 민원실', desc: '창구 안내, 부서 이전, 시정 소식', href: '/industries?type=public-office', icon: Building2 },
      { label: '학교 · 강당', desc: '급식표, 행사, 귀가 안내', href: '/industries?type=school', icon: BookOpen },
      { label: '전자현수막', desc: '재난 문구와 계도 안내', href: '/industries?type=banner', icon: Layers },
      { label: '공공기관 · 시설', desc: '로비 종합안내, 층별 표시', href: '/industries?type=institution', icon: ShieldCheck },
    ],
  },
  {
    label: '회사소개',
    href: '/about',
    children: [
      { label: '회사 정보', desc: '법인·대표자·사업자등록', href: '/about', icon: Building2 },
      { label: '오시는 길', desc: '주소와 길찾기', href: '/about#location', icon: Ruler },
    ],
  },
  {
    label: '고객센터',
    href: '/support',
    children: [
      { label: 'A/S 신청', desc: '고장 접수와 원격 확인', href: '/support#as', icon: ShieldCheck },
      { label: '자주 묻는 질문', desc: '예산·계약·전기·관리', href: '/faq', icon: HelpCircle },
    ],
  },
]

/**
 * 다크 히어로 폴백 목록 — ⚠️ 속성 방식(data-wk-dark-hero)으로 전환 중.
 * 페이지 히어로가 data-wk-dark-hero 속성을 달면 그 페이지는 이 배열과 무관하게
 * IntersectionObserver 결과를 그대로 쓴다. 모든 페이지가 속성을 달면 이 배열은 지운다.
 * /products 는 히어로가 라이트라 제외한다.
 */
const FALLBACK_DARK_HERO = ['/', '/about', '/services', '/industries']

const HEADER_H = 64 // h-16

export function NavBar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [mobileGroup, setMobileGroup] = useState<string | null>(null)
  const [hasHeroAttr, setHasHeroAttr] = useState(false)
  const [heroDark, setHeroDark] = useState(false)
  const pathname = usePathname()
  const { openConsult } = useSiteModals()
  const closeTimer = useRef<number | null>(null)
  const triggerRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const mobilePanelRef = useRef<HTMLDivElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)

  // 1순위: data-wk-dark-hero 속성 — 그 요소가 헤더 아래(화면 상단)에 걸쳐 있는 동안만 다크
  useEffect(() => {
    const el = document.querySelector('[data-wk-dark-hero]')
    if (!el) {
      setHasHeroAttr(false)
      return
    }
    setHasHeroAttr(true)
    setHeroDark(true) // 대부분 히어로는 페이지 최상단이라 낙관적으로 시작, IO가 즉시 보정
    const io = new IntersectionObserver(
      ([entry]) => setHeroDark(entry.isIntersecting),
      { rootMargin: `-${HEADER_H}px 0px 0px 0px`, threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [pathname])

  // rAF 스로틀 스크롤 — 리렌더는 8px 경계를 넘을 때만
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        setScrolled(window.scrollY > 8)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  // 2순위(폴백): 속성이 없는 페이지는 경로 목록 + 스크롤 여부로 판단
  const fallbackDark = !hasHeroAttr && FALLBACK_DARK_HERO.includes(pathname) && !scrolled
  const heroActive = hasHeroAttr ? heroDark : fallbackDark
  const onDark = heroActive && !open && openGroup === null
  const solid = !heroActive || open || openGroup !== null

  const enter = (label: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setOpenGroup(label)
  }
  const leave = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpenGroup(null), 120)
  }
  const closeGroup = useCallback((refocus?: string) => {
    setOpenGroup(null)
    if (refocus) {
      const i = NAV.findIndex((g) => g.label === refocus)
      triggerRefs.current[i]?.focus()
    }
  }, [])

  // 모바일 전체화면 메뉴 — 배경 스크롤 잠금 + 포커스 트랩 + ESC
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const FOCUSABLE =
      'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuBtnRef.current?.focus()
        return
      }
      if (e.key !== 'Tab') return
      const panel = mobilePanelRef.current
      if (!panel) return
      const nodes = panel.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown, true)
    const t = window.setTimeout(() => {
      mobilePanelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
    }, 0)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeyDown, true)
      window.clearTimeout(t)
    }
  }, [open])

  return (
    <header
      onMouseLeave={leave}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ease-state ${
        solid
          ? 'border-b border-wk-line bg-white/90 shadow-wk-1 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      {/* 다크 히어로 위 투명 헤더일 때 상단 스크림 — 흰 글자 가독성 보장 */}
      {onDark && (
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/45 to-transparent" aria-hidden="true" />
      )}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className={`flex items-center rounded-lg ${onDark ? 'text-white' : 'text-wk-ink'}`}
          aria-label={`${SITE.nameKo} 홈`}
        >
          <BrandLogo markSize={32} dark={onDark} />
        </Link>

        {/* 데스크톱 메가메뉴 */}
        <nav aria-label="주요 메뉴" className="hidden items-center gap-1 md:flex">
          {NAV.map((g, i) => (
            <div key={g.label} className="relative" onMouseEnter={() => enter(g.label)}>
              <Link
                href={g.href}
                ref={(el) => { triggerRefs.current[i] = el }}
                onFocus={() => enter(g.label)}
                aria-expanded={openGroup === g.label}
                aria-haspopup={g.children ? 'true' : undefined}
                onKeyDown={(e) => {
                  if (e.key === 'Escape' && openGroup === g.label) {
                    e.preventDefault()
                    closeGroup()
                  } else if (e.key === 'ArrowDown' && g.children) {
                    e.preventDefault()
                    enter(g.label)
                    window.requestAnimationFrame(() => {
                      panelRefs.current[g.label]?.querySelector<HTMLElement>('a')?.focus()
                    })
                  } else if (e.key === 'ArrowRight') {
                    e.preventDefault()
                    triggerRefs.current[(i + 1) % NAV.length]?.focus()
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault()
                    triggerRefs.current[(i - 1 + NAV.length) % NAV.length]?.focus()
                  }
                }}
                className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                  onDark ? 'text-white hover:bg-white/10' : 'text-wk-ink2 hover:bg-wk-bgFaint'
                }`}
              >
                {g.label}
                {g.children && (
                  <ChevronDown
                    size={14}
                    aria-hidden="true"
                    className={`transition-transform duration-200 ease-state ${openGroup === g.label ? 'rotate-180' : ''} ${
                      onDark ? 'text-white/70' : 'text-wk-ink3'
                    }`}
                  />
                )}
              </Link>

              {/* 드롭다운 패널 */}
              {g.children && (
                <div
                  ref={(el) => { panelRefs.current[g.label] = el }}
                  onMouseEnter={() => enter(g.label)}
                  onKeyDown={(e) => {
                    const panel = panelRefs.current[g.label]
                    if (!panel) return
                    const items = Array.from(panel.querySelectorAll<HTMLElement>('a'))
                    const idx = items.indexOf(document.activeElement as HTMLElement)
                    if (e.key === 'Escape') {
                      e.preventDefault()
                      closeGroup(g.label)
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault()
                      items[(idx + 1 + items.length) % items.length]?.focus()
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault()
                      if (idx <= 0) {
                        closeGroup(g.label)
                      } else {
                        items[idx - 1]?.focus()
                      }
                    }
                  }}
                  className={`absolute left-1/2 top-full w-[22rem] -translate-x-1/2 pt-3 transition-all duration-200 ease-entrance ${
                    openGroup === g.label
                      ? 'pointer-events-auto visible translate-y-0 opacity-100'
                      : 'pointer-events-none invisible -translate-y-1.5 opacity-0'
                  }`}
                >
                  <div className="overflow-hidden rounded-card-m border border-wk-line bg-white p-2 shadow-wk-2">
                    {g.children.map((c) => {
                      const Icon = c.icon
                      return (
                        <Link
                          key={c.label + c.href}
                          href={c.href}
                          onClick={() => setOpenGroup(null)}
                          className="flex items-start gap-3 rounded-xl p-3 transition-colors duration-150 hover:bg-wk-blueWeak"
                        >
                          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-wk-blueWeak text-wk-blue">
                            <Icon size={17} aria-hidden="true" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-wk-ink">{c.label}</span>
                            <span className="block text-xs text-wk-ink3">{c.desc}</span>
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
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
              onDark ? 'text-white hover:bg-white/10' : 'text-wk-ink2 hover:bg-wk-bgFaint'
            }`}
          >
            <MessageCircle size={15} className="text-wk-blue" aria-hidden="true" />
            빠른 상담
          </button>
          <Link
            href="/quote"
            className="rounded-btn bg-wk-cta px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-wk-ctaHover active:bg-wk-ctaActive"
          >
            견적 요청하기
          </Link>
        </div>

        {/* 모바일 */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/quote"
            className="rounded-btn bg-wk-cta px-3 py-2 text-sm font-semibold text-white transition-colors duration-150 active:bg-wk-ctaActive"
          >
            견적
          </Link>
          <button
            ref={menuBtnRef}
            className={`rounded-lg p-2 ${onDark ? 'text-white' : 'text-wk-ink2'}`}
            onClick={() => setOpen(true)}
            aria-label="메뉴 열기"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* 모바일 — 전체화면 오버레이 */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="주요 메뉴"
        ref={mobilePanelRef}
        className={`fixed inset-0 z-[60] flex flex-col bg-white transition-opacity duration-200 ease-entrance md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-wk-line px-4">
          <Link href="/" className="flex items-center text-wk-ink" onClick={() => setOpen(false)} aria-label={`${SITE.nameKo} 홈`}>
            <BrandLogo markSize={32} />
          </Link>
          <button
            className="rounded-lg p-2 text-wk-ink2"
            onClick={() => setOpen(false)}
            aria-label="메뉴 닫기"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2">
          {NAV.map((g) => (
            <div key={g.label} className="border-b border-wk-line">
              {!g.children ? (
                <Link
                  href={g.href}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 text-sm font-semibold text-wk-ink"
                >
                  {g.label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setMobileGroup(mobileGroup === g.label ? null : g.label)}
                  aria-expanded={mobileGroup === g.label}
                  className="flex w-full items-center justify-between py-3.5 text-left text-sm font-semibold text-wk-ink"
                >
                  {g.label}
                  <ChevronDown size={16} aria-hidden="true" className={`text-wk-ink3 transition-transform duration-200 ${mobileGroup === g.label ? 'rotate-180' : ''}`} />
                </button>
              )}
              {mobileGroup === g.label && g.children && (
                <div className="pb-2">
                  {g.children.map((c) => (
                    <Link
                      key={c.label + c.href}
                      href={c.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg py-2.5 pl-2 pr-3 text-sm text-wk-ink2 hover:bg-wk-bgFaint"
                    >
                      <c.icon size={16} className="text-wk-blue" aria-hidden="true" />
                      <span>
                        <span className="font-medium text-wk-ink">{c.label}</span>
                        <span className="ml-2 text-xs text-wk-ink3">{c.desc}</span>
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
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-btn border border-wk-line2 px-4 py-3 text-sm font-semibold text-wk-ink2"
          >
            <MessageCircle size={15} className="text-wk-blue" aria-hidden="true" /> 빠른 상담
          </button>
          <Link
            href="/quote"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-btn bg-wk-cta px-4 py-3 text-center text-sm font-semibold text-white"
          >
            견적 요청하기
          </Link>
        </div>
      </div>
    </header>
  )
}
