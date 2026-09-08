'use client'

import Link from 'next/link'
import { Home } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * 하위 연동 바 — PageHeader 바로 아래, sticky.
 *
 * 두 가지 모드를 같은 모양으로 쓴다 (CEO 지시 2026-09-08 "방식 통일").
 *  - 페이지 모드: 탭이 형제 페이지로 이동 (제품·시공사례). `current` 와 같은 href 가 진하게
 *  - 섹션 모드: 탭이 같은 페이지 안의 섹션(#id)으로 스크롤 (회사소개·고객지원).
 *    스크롤 위치에 따라 현재 섹션이 진하게 (스크롤 스파이)
 *
 * 왼쪽 `back` 은 상위로 가는 링크. 섹션 모드에서는 보통 홈.
 */
import type { SubNavItem } from '@/lib/subnav'

export function SubNav({
  back,
  items,
  current,
}: {
  back?: SubNavItem
  items: SubNavItem[]
  /** 페이지 모드에서 현재 페이지 href. 섹션 모드(#)에서는 생략 — 스크롤로 정한다 */
  current?: string
}) {
  const anchorMode = items.every((it) => it.href.includes('#'))
  const [active, setActive] = useState<string>(current ?? '')

  // 섹션 모드 — 화면 상단(헤더+바 아래)을 지난 마지막 섹션을 현재로 본다
  useEffect(() => {
    if (!anchorMode) return
    const ids = items.map((it) => it.href.slice(it.href.indexOf('#') + 1))
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e)
    if (els.length === 0) return
    let raf = 0
    const pick = () => {
      raf = 0
      const line = 64 + 56 + 8 // 헤더 + 바 + 여유
      let cur = els[0]
      for (const el of els) {
        if (el.getBoundingClientRect().top - line <= 0) cur = el
      }
      setActive(`#${cur.id}`)
    }
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(pick)
    }
    pick()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [anchorMode, items])

  const isActive = (href: string) =>
    anchorMode ? href.slice(href.indexOf('#')) === active : href === current

  return (
    <nav
      aria-label="하위 메뉴"
      className="sticky top-16 z-30 border-b border-wk-line bg-white/95 backdrop-blur-md"
    >
      <div className="wk-wrap flex items-center gap-2 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {back && (
          <>
            {back.href === '/' ? (
              /* 홈은 화살표 없이 집 아이콘만 (CEO 지시 2026-09-08) */
              <Link
                href="/"
                aria-label="홈"
                className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-btn text-wk-ink3 transition-colors duration-150 hover:bg-wk-bgFaint hover:text-wk-ink"
              >
                <Home size={18} strokeWidth={1.9} aria-hidden="true" />
              </Link>
            ) : (
              <Link
                href={back.href}
                className="mr-2 flex shrink-0 items-center gap-1 rounded-btn px-2.5 py-2 text-label font-semibold text-wk-ink3 transition-colors duration-150 hover:bg-wk-bgFaint hover:text-wk-ink"
              >
                <span aria-hidden="true">←</span> {back.label}
              </Link>
            )}
            <span aria-hidden="true" className="mr-1 h-5 w-px shrink-0 bg-wk-line2" />
          </>
        )}
        {items.map((it) => {
          const on = isActive(it.href)
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={on ? (anchorMode ? 'location' : 'page') : undefined}
              className={`shrink-0 rounded-full px-3.5 py-2 text-label font-semibold transition-colors duration-150 ${
                on ? 'bg-wk-ink text-white' : 'text-wk-ink2 hover:bg-wk-bgFaint hover:text-wk-ink'
              }`}
            >
              {it.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
