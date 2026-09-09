'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Home } from 'lucide-react'

import type { SubNavItem } from '@/lib/subnav'

/**
 * 제품 하위 연동 바 — PageHeader 바로 아래, sticky.
 *
 * 🔴 2026-09-08 CEO 지시 "네비바 있는데 왜 본문 위에 또 만들었냐. 제품 페이지만 필요하다".
 *    회사소개·고객지원·시공사례에서는 걷어냈다. 제품만 남긴 이유는 그쪽이 **형제가 많고
 *    서로 오가며 비교하는 화면**이기 때문이다(카테고리 6 + 규격 비교표 + 모델 6).
 *    회사소개·고객지원은 한 페이지라 스크롤이 곧 이동이고, 시공사례는 목록이 그 역할을 한다.
 *    섹션(#) 모드와 스크롤 스파이는 쓸 곳이 없어져 제거했다 — 필요해지면 git 에서 꺼낸다.
 */
export function SubNav({
  back,
  items,
  current,
}: {
  /** 왼쪽 상위 링크. href 가 '/' 면 집 아이콘만 (CEO 지시 2026-09-08) */
  back?: SubNavItem
  items: SubNavItem[]
  /** 현재 페이지 href — items 중 하나와 같으면 진하게 */
  current?: string
}) {
  /**
   * 🔴 2026-09-09 CEO "네비바가 두 개 있는 것처럼 보인다. 처음엔 위 배너와 같은 색이다가
   *    스크롤해서 내리면 흰색으로." — 배너(다크) 바로 아래 붙어 있을 때는 같은 다크로 녹아 있고,
   *    헤더 아래에 고정되는 순간(stuck) 흰 바로 바뀐다. 판정은 바의 top 이 헤더 높이(64px)에 닿았는가.
   */
  const ref = useRef<HTMLElement>(null)
  const [stuck, setStuck] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => setStuck(el.getBoundingClientRect().top <= 64.5)
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])

  return (
    <nav
      ref={ref}
      aria-label="제품 하위 메뉴"
      data-stuck={stuck ? '' : undefined}
      className={`group/sub sticky top-16 z-30 border-b transition-colors duration-300 ${
        stuck
          ? 'border-wk-line bg-white/95 backdrop-blur-md'
          : 'border-white/10 bg-wk-night'
      }`}
    >
      <div className="wk-wrap flex items-center gap-2 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {back && (
          <>
            {back.href === '/' ? (
              <Link
                href="/"
                aria-label="홈"
                className={`mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-btn transition-colors duration-150 ${stuck ? 'text-wk-ink3 hover:bg-wk-bgFaint hover:text-wk-ink' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
              >
                <Home size={18} strokeWidth={1.9} aria-hidden="true" />
              </Link>
            ) : (
              <Link
                href={back.href}
                className={`mr-2 flex shrink-0 items-center gap-1 rounded-btn px-2.5 py-2 text-label font-semibold transition-colors duration-150 ${stuck ? 'text-wk-ink3 hover:bg-wk-bgFaint hover:text-wk-ink' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
              >
                <span aria-hidden="true">←</span> {back.label}
              </Link>
            )}
            <span aria-hidden="true" className={`mr-1 h-5 w-px shrink-0 ${stuck ? 'bg-wk-line2' : 'bg-white/20'}`} />
          </>
        )}
        {items.map((it) => {
          const on = it.href === current
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={on ? 'page' : undefined}
              className={`shrink-0 rounded-full px-3.5 py-2 text-label font-semibold transition-colors duration-150 ${
                stuck
                  ? on
                    ? 'bg-wk-ink text-white'
                    : 'text-wk-ink2 hover:bg-wk-bgFaint hover:text-wk-ink'
                  : on
                    ? 'bg-white text-wk-ink'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
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
