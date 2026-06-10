/**
 * 사이트 전역 상수 (브랜드·도메인·SEO 기본값)
 *
 * 도메인은 CEO 결재 전 placeholder. NEXT_PUBLIC_SITE_URL 환경변수로 override 가능.
 * 운영 도메인 확정 시 03-marketing-sales ORDER 처리 후 env 갱신.
 */

const RAW_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ||
  'https://wktech.co.kr' // TODO(COO): 도메인 확정 후 정식 URL 주입

export const SITE = {
  // 브랜드
  nameKo: '우강테크',
  nameEn: 'WK Tech',
  legalName: '우강테크',
  shortName: 'WK Tech',
  sloganKo: '함께 가는 길, 더 나은 내일. 우강테크가 파트너가 되겠습니다.',
  sloganEn: 'A trusted partner for smarter signage operations.',
  taglineKo: 'LED 사이니지 B2B 플랫폼 — 표준화 시공 + CMS 구독',

  // URL·연락
  url: RAW_URL,
  locale: 'ko_KR',
  defaultLanguage: 'ko',
  email: 'contact@wktech.co.kr',
  // 실제 대표번호 미확정 — 가짜 번호 노출 금지. CEO가 실제 번호 제공 시 채운다.
  // 빈 값이면 UI는 전화 링크/번호를 omit하고 견적 폼만 노출한다.
  phone: '' as string,

  // 비즈니스
  industry: 'LED 사이니지 / 디지털 사이니지 / 전광판',
  controllerStandard: 'NovaStar Taurus + VNNOX',
  cityKo: '서울',
  countryCode: 'KR',
  founded: '2026',
} as const

export function absoluteUrl(path: string = '/'): string {
  if (!path.startsWith('/')) path = `/${path}`
  return `${SITE.url}${path}`
}

/** 페이지 메타데이터 빌더 — 페이지마다 generateMetadata에서 사용 */
export interface BuildMetaInput {
  title: string
  description: string
  path?: string
  ogImage?: string
  noindex?: boolean
  publishedTime?: string
  modifiedTime?: string
  type?: 'website' | 'article'
  authors?: string[]
  tags?: string[]
}

export function buildMetadata(input: BuildMetaInput) {
  const path = input.path ?? '/'
  const url = absoluteUrl(path)
  const ogImage = input.ogImage ?? '/opengraph-image'
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE.nameKo,
      locale: SITE.locale,
      type: input.type ?? 'website',
      images: [{ url: ogImage, width: 1200, height: 630 }],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
      ...(input.authors ? { authors: input.authors } : {}),
      ...(input.tags ? { tags: input.tags } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [ogImage],
    },
    robots: input.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}
