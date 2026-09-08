'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Menu, X, ChevronDown,
} from 'lucide-react'
import { SITE } from '@/lib/seo/site'
import { PRODUCT_CATEGORIES } from '@/lib/productCategories'
import { ABOUT_SECTIONS, SUPPORT_SECTIONS } from '@/lib/subnav'
import { BrandLogo } from '@/components/brand/BrandLogo'

interface NavChild {
  label: string
  desc: string
  href: string
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
/**
 * 🔴 2026-09-08 CEO 지시 "네비바 구조를 아예 바꿔라".
 *
 * 원칙 하나 — **메뉴에 적힌 이름 = 도착한 페이지의 이름(eyebrow/h1)**.
 * 이전에는 제품 이름 체계가 세 가지(네비바·홈·/products)라 누른 이름과 도착한 페이지가 달랐다.
 * 제품 하위는 lib/productCategories.ts 의 name 을 그대로 쓴다(손으로 적지 않는다).
 * 회사소개·고객지원은 **한 페이지**이고 하위 메뉴는 그 안의 섹션(#)으로 스크롤한다(CEO 지시 2026-09-08).
 * 제품·시공사례는 개별 페이지다. 두 경우 모두 머리 아래 SubNav 탭이 같은 모양으로 붙는다.
 */
/* 하위 메뉴 설명 한 줄 — 라벨·href 는 SubNav 의 섹션 정의와 같은 것을 쓴다(한 곳) */
const ABOUT_DESC: Record<string, string> = {
  '회사 소개': '법인·대표자·사업자등록',
  '설치 과정': '실측부터 A/S까지 여섯 공정',
  '인증 현황': 'KC 인증 제품만 공급합니다',
  '오시는 길': '대전 대덕구',
}
const SUPPORT_DESC: Record<string, string> = {
  'A/S 신청': '고장 접수와 원격 확인',
  '자주 묻는 질문': '예산·계약·전기·보증',
  '자료실': '규격서·시공사례집',
}

const NAV: NavGroup[] = [
  {
    label: '회사소개',
    href: '/about',
    children: ABOUT_SECTIONS.map((x) => ({ label: x.label, desc: ABOUT_DESC[x.label] ?? '', href: x.href })),
  },
  {
    label: '제품',
    href: '/products',
    children: [
      ...PRODUCT_CATEGORIES.map((c) => ({ label: c.name, desc: c.lead.split('.')[0] + '.', href: `/products/${c.slug}` })),
      { label: '규격 비교표', desc: '전 모델 규격 한 표', href: '/products/specs' },
    ],
  },
  {
    label: '시공사례',
    href: '/industries',
  },
  {
    label: '고객지원',
    href: '/support',
    children: SUPPORT_SECTIONS.map((x) => ({ label: x.label, desc: SUPPORT_DESC[x.label] ?? '', href: x.href })),
  },
]


/**
 * 다크 히어로 폴백 목록 — ⚠️ 속성 방식(data-wk-dark-hero)으로 전환 중.
 * 페이지 히어로가 data-wk-dark-hero 속성을 달면 그 페이지는 이 배열과 무관하게
 * IntersectionObserver 결과를 그대로 쓴다. 모든 페이지가 속성을 달면 이 배열은 지운다.
 * /products 는 히어로가 라이트라 제외한다.
 */
const FALLBACK_DARK_HERO = ['/', '/about', '/industries']

const HEADER_H = 64 // h-16

export function NavBar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [mobileGroup, setMobileGroup] = useState<string | null>(null)
  const [hasHeroAttr, setHasHeroAttr] = useState(false)
  const [heroDark, setHeroDark] = useState(false)
  const pathname = usePathname()
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
  // 🔴 2026-09-08 CEO 지시 — "네비바 진짜 좀 가시성 좋게".
  // 이전에는 다크 히어로 위에서 헤더가 투명해지고 글자가 흰색으로 뒤집혔다. 사진 위 흰 글씨는
  // 사진의 밝은 부분에서 그대로 묻힌다(스크림을 깔아도 사진마다 결과가 달랐다). 국내 전광판·
  // 시공 업체 사이트가 헤더를 항상 흰 배경으로 두는 이유가 이것이다. 메뉴는 장식이 아니라
  // 길찾기 도구라 어느 페이지에서든 같은 모습이어야 한다.
  // 다크 히어로 감지(hasHeroAttr/heroDark/FALLBACK_DARK_HERO)는 되돌릴 수 있게 남겨두되,
  // 헤더 색에는 더 이상 반영하지 않는다.
  const onDark = false
  const solid = true
  void heroDark
  void hasHeroAttr
  void scrolled
  void FALLBACK_DARK_HERO

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
                    {/* 🔴 2026-09-08 CEO: "이상한 기호 넣지 말고 글만." 아이콘 칩을 걷어냈다.
                        메뉴 항목마다 서로 다른 픽토그램을 붙이면 읽는 순서가 글자가 아니라
                        그림으로 흩어진다. 라벨 하나만 남기고 설명은 회색 한 줄로 붙인다. */}
                    {g.children.map((c) => (
                      <Link
                        key={c.label + c.href}
                        href={c.href}
                        onClick={() => setOpenGroup(null)}
                        className="block rounded-lg px-3.5 py-2.5 transition-colors duration-150 hover:bg-wk-bgFaint"
                      >
                        <span className="block text-sm font-semibold text-wk-ink">{c.label}</span>
                        <span className="mt-0.5 block text-xs text-wk-ink3">{c.desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* 🔴 2026-09-08 CEO 지시 — 헤더 우측은 비운다.
            '빠른 상담'·'견적 문의하기' 버튼을 뺐고, 그 자리에 잠시 뒀던 대표번호도 뺐다("헤더에 전화번호도 빼라").
            문의 동선은 우측 하단 플로팅(FloatingCta) 하나가 전담한다. 헤더는 길찾기만 한다.
            같은 요청이 화면에 두 번 있으면 둘 다 광고처럼 읽힌다. */}
        <div className="hidden w-[7.5rem] md:block" aria-hidden="true" />

        {/* 모바일 */}
        <div className="flex items-center gap-2 md:hidden">
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
        aria-hidden={!open}
        ref={mobilePanelRef}
        /**
         * 🔴 닫혔을 때 `opacity-0` 만 주면 안 된다(2026-09-07 QC 실측).
         * 투명할 뿐 여전히 렌더되므로 내부 링크·버튼 9개가 그대로 탭 순서에 남고
         * `aria-modal="true"` 인 dialog 가 상시 접근성 트리에 노출된다.
         * `invisible`(visibility:hidden)까지 걸어야 탭 순서와 AT 양쪽에서 빠진다.
         * visibility 는 전이 가능한 속성이라 페이드아웃 200ms 는 그대로 유지된다.
         */
        className={`fixed inset-0 z-[60] flex flex-col bg-white transition-[opacity,visibility] duration-200 ease-entrance md:hidden ${
          open ? 'pointer-events-auto visible opacity-100' : 'pointer-events-none invisible opacity-0'
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
                      className="block rounded-lg py-2.5 pl-2 pr-3 text-sm text-wk-ink2 hover:bg-wk-bgFaint"
                    >
                      <span className="font-medium text-wk-ink">{c.label}</span>
                      <span className="ml-2 text-xs text-wk-ink3">{c.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {/* 2026-09-08 — 여기 있던 '빠른 상담'·'견적 문의하기' 버튼을 뺐다. 모바일은 하단 바(MobileCtaBar)가 같은 일을 이미 한다. 두 번 두면 둘 다 광고처럼 보인다 */}
        </div>
      </div>
    </header>
  )
}
