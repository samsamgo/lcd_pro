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

/**
 * 제품 하위 탭 — 네 개뿐이다.
 *
 * 🔴 2026-09-09 CEO 지시 "제품 저렇게 잡다하게 해놓지 말고 그냥 전 제품 다 꺼내 놓고
 *    필터로 실내용/실외용만 구분 가능하게끔만".
 *    전에는 카테고리 6종(실내·실외·전자현수막·미디어파사드·스포츠·교통)이 각각 페이지를 갖고
 *    탭에 6개가 늘어서 있었다. 같은 물건을 용도 이름만 바꿔 여섯 번 판 셈이라, 담당자는
 *    '내 자리가 어느 칸인지'부터 골라야 했다. 이제 **전 시리즈 12종이 한 페이지**에 있고
 *    구분은 실내/실외 필터 하나뿐이다.
 *
 *    `/products/indoor` · `/products/outdoor` 는 같은 화면에 필터가 미리 걸린 주소다.
 *    banner/facade/sports/traffic 라우트는 삭제하고 next.config.mjs 에서 /products 로 301 한다.
 */
export const PRODUCT_SUBNAV: SubNavItem[] = [
  { label: '전체', href: '/products' },
  { label: '실내용', href: '/products/indoor' },
  { label: '실외용', href: '/products/outdoor' },
  { label: '규격 비교표', href: '/products/specs' },
]

/** 제품 하위 탭 (호출부가 함수 형태를 쓰고 있어 유지) */
export function productSubNavItems(): SubNavItem[] {
  return PRODUCT_SUBNAV
}

/**
 * 회사소개 — 한 페이지 안 섹션. **네비바 하위 메뉴 전용**(본문 탭은 2026-09-08 제거)
 *
 * 🔴 2026-09-09 회사소개 재설계에 맞춰 갈아 끼웠다. 항목은 `app/about/page.tsx` 의
 *    래퍼 id 와 1:1 이고 순서도 같다. '설치 과정'(#process)은 페이지에서 사라졌다
 *    (CEO "설치 과정 잡다한 설명·소요기간 없애라"). 링크를 되살리지 마라 — 죽은 앵커가 된다.
 *
 * 🔴 2026-09-09 CEO "회사소개에서 회사 개요 없애고" — '회사 개요'(#company) 제거.
 *    `app/about/page.tsx` 에서 `CompanyOverview` 배선을 풀었으니 되살리면 죽은 앵커가 된다.
 */
export const ABOUT_SECTIONS: SubNavItem[] = [
  { label: '인사말', href: '/about#greeting' },
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
