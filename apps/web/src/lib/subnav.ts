/**
 * SubNav 데이터 — 서버·클라이언트 양쪽에서 쓰는 순수 모듈.
 *
 * ⚠️ components/SubNav.tsx 는 'use client' 다. 그 파일에서 함수·상수를 export 하면
 *    서버 컴포넌트가 import 했을 때 "클라이언트 참조"로 바뀌어 호출이 안 된다
 *    (2026-09-08 실측: productSubNavItems is not a function). 데이터는 여기 둔다.
 */
export interface SubNavItem {
  label: string
  href: string
}

/** 제품 하위 탭 — 카테고리 전부 + 규격 비교표 */
export function productSubNavItems(categories: { name: string; slug: string }[]): SubNavItem[] {
  return [
    ...categories.map((c) => ({ label: c.name, href: `/products/${c.slug}` })),
    { label: '규격 비교표', href: '/products/specs' },
  ]
}

/**
 * 회사소개 — 한 페이지 안 섹션. **네비바 하위 메뉴 전용**(본문 탭은 2026-09-08 제거)
 *
 * 🔴 2026-09-09 회사소개 재설계에 맞춰 갈아 끼웠다. 항목은 `app/about/page.tsx` 의
 *    래퍼 id 와 1:1 이고 순서도 같다. '설치 과정'(#process)은 페이지에서 사라졌다
 *    (CEO "설치 과정 잡다한 설명·소요기간 없애라"). 링크를 되살리지 마라 — 죽은 앵커가 된다.
 */
export const ABOUT_SECTIONS: SubNavItem[] = [
  { label: '인사말', href: '/about#greeting' },
  { label: '회사 개요', href: '/about#company' },
  { label: '연혁', href: '/about#history' },
  { label: '인증 · 서류', href: '/about/certification' },
  { label: '오시는 길', href: '/about#location' },
]

/** 고객지원 — 세 페이지 (2026-09-09 CEO 지시로 분리). A/S 가 맨 위 */
export const SUPPORT_SECTIONS: SubNavItem[] = [
  { label: 'A/S 신청', href: '/support' },
  { label: '자주 묻는 질문', href: '/support/faq' },
  { label: '자료실', href: '/support/downloads' },
]
