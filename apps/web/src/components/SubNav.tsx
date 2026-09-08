'use client'

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
  return (
    <nav
      aria-label="제품 하위 메뉴"
      className="sticky top-16 z-30 border-b border-wk-line bg-white/95 backdrop-blur-md"
    >
      <div className="wk-wrap flex items-center gap-2 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {back && (
          <>
            {back.href === '/' ? (
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
          const on = it.href === current
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={on ? 'page' : undefined}
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
