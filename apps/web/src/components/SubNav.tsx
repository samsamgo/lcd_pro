import Link from 'next/link'

/**
 * 하위 페이지 연동 바 — PageHeader 바로 아래에 붙는다.
 *
 * 🔴 2026-09-08 CEO 지적 "페이지를 나누니 더 보기 힘들다 · 뒤로 가기나 연동이 있어야 한다".
 *    페이지를 쪼갠 대가로 형제 페이지 사이를 오가는 길이 없어졌다. 여기서 준다.
 *    왼쪽 = 상위로 돌아가는 링크(← 제품 전체), 오른쪽 = 형제 탭. 현재 페이지는 진하게.
 *    스크롤해도 따라오게 sticky — 아래까지 읽고 다른 탭으로 넘어갈 때 위로 올라오지 않아도 된다.
 */
export interface SubNavItem {
  label: string
  href: string
}

export function SubNav({
  back,
  items,
  current,
}: {
  /** 상위 페이지. 예: { label: '제품 전체', href: '/products' } */
  back: SubNavItem
  /** 형제 페이지 탭. 현재 페이지도 포함해서 넘긴다 */
  items: SubNavItem[]
  /** 현재 페이지 href — items 중 하나와 같아야 진하게 표시된다 */
  current: string
}) {
  return (
    <nav
      aria-label="하위 메뉴"
      className="sticky top-16 z-30 border-b border-wk-line bg-white/95 backdrop-blur-md"
    >
      <div className="wk-wrap flex items-center gap-2 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link
          href={back.href}
          className="mr-2 flex shrink-0 items-center gap-1 rounded-btn px-2.5 py-2 text-label font-semibold text-wk-ink3 transition-colors duration-150 hover:bg-wk-bgFaint hover:text-wk-ink"
        >
          <span aria-hidden="true">←</span> {back.label}
        </Link>
        <span aria-hidden="true" className="mr-1 h-5 w-px shrink-0 bg-wk-line2" />
        {items.map((it) => {
          const active = it.href === current
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? 'page' : undefined}
              className={`shrink-0 rounded-full px-3.5 py-2 text-label font-semibold transition-colors duration-150 ${
                active
                  ? 'bg-wk-ink text-white'
                  : 'text-wk-ink2 hover:bg-wk-bgFaint hover:text-wk-ink'
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

/** 제품 하위 페이지 공통 탭 — 카테고리 3종 + 규격 비교표 */
export function productSubNavItems(categories: { name: string; slug: string }[]): SubNavItem[] {
  return [
    ...categories.map((c) => ({ label: c.name, href: `/products/${c.slug}` })),
    { label: '규격 비교표', href: '/products/specs' },
  ]
}
