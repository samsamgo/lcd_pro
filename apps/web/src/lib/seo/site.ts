/**
 * 사이트 전역 상수 (브랜드·도메인·SEO 기본값)
 *
 * 도메인은 CEO 결재 전 placeholder. NEXT_PUBLIC_SITE_URL 환경변수로 override 가능.
 * 운영 도메인 확정 시 03-marketing-sales ORDER 처리 후 env 갱신.
 */

const RAW_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ||
  'https://wooktech.co.kr' // 운영 도메인 (구매 완료). override: NEXT_PUBLIC_SITE_URL

export const SITE = {
  // 브랜드
  nameKo: '우강테크',
  nameEn: 'WOOKANG TECH',
  legalName: '주식회사 우강테크',
  shortName: 'WOOKANG TECH',
  // 🔴 2026-09-07 (4차) CEO 지시 — *"회사 소개에 우리 사이니지 업체라고. 왜 이렇게 관공서하고 학교에 집착해."*
  // 이 세 값은 **회사를 소개하는 자리**(layout 제목 · 푸터 · JSON-LD Organization/LocalBusiness)로 나간다.
  // 그 자리는 "무엇을 만드는 회사인가" 를 말해야 한다. "누구에게 파는가" 는 고객군이지 정체성이 아니다.
  // before: sloganKo = '관공서·학교 전광판, 설치부터 A/S까지'
  //         taglineKo = 'LED 전광판 · 전자현수막 — 실측부터 A/S까지 직접 합니다'
  // 관공서·학교는 없앤 것이 아니라 자리를 옮겼다 — `lib/industries.ts` 의 설치 분야 4군 중
  // 두 군이고, /about 요약표의 '설치 분야' 행이 그 4군을 그대로 나열한다.
  sloganKo: 'LED 전광판 설계 · 제작 · 시공 · 유지보수',
  sloganEn: 'We build with light.',
  taglineKo: 'LED 전광판·전자현수막을 직접 설계·제작·시공하고 유지보수하는 LED 사이니지 업체입니다.',

  // URL·연락
  url: RAW_URL,
  locale: 'ko_KR',
  defaultLanguage: 'ko',
  email: 'contact@wooktech.co.kr',
  // 대표번호 = 회사 유선번호. 정본은 대표 명함이다.
  // 2026-09-07 CEO 지시: "우강테크 전화번호로 하라." 개인 휴대폰(010-7272-6903)을 걷어냈다.
  // 관공서 담당자는 홈페이지·명함·제안서를 나란히 놓고 본다. 세 곳의 번호가 다르면 그 자체가 감점이다.
  // 빈 값이면 UI는 전화 링크/번호를 omit하고 견적/상담 채널만 노출한다.
  phone: (process.env.NEXT_PUBLIC_PHONE || '042-621-7982') as string,
  fax: (process.env.NEXT_PUBLIC_FAX || '042-627-7983') as string,

  // 실제 확정 시 env로 주입 (가짜 값 노출 금지). 빈 값이면 UI에서 해당 항목 omit.
  addressFull: (process.env.NEXT_PUBLIC_ADDRESS || '대전광역시 대덕구 대화로106번길 66, 2층 202호(대화동, 펜타플렉스)') as string,
  ceoName: (process.env.NEXT_PUBLIC_CEO || '이희원') as string,
  bizRegNo: (process.env.NEXT_PUBLIC_BIZ_REG_NO || '897-86-03889') as string,
  corpRegNo: (process.env.NEXT_PUBLIC_CORP_REG_NO || '160111-0074810') as string,
  openingHours: (process.env.NEXT_PUBLIC_HOURS || '평일 09:00~18:00') as string,

  // 상담 채널 URL — 실제 채널 개설 후 env 주입. 값이 있을 때만 버튼/링크 노출.
  kakaoChannelUrl: (process.env.NEXT_PUBLIC_KAKAO_CHANNEL ?? '') as string,
  naverTalkUrl: (process.env.NEXT_PUBLIC_NAVER_TALK ?? '') as string,
  naverPlaceUrl: (process.env.NEXT_PUBLIC_NAVER_PLACE ?? '') as string,
  instagramUrl: (process.env.NEXT_PUBLIC_INSTAGRAM ?? '') as string,
  youtubeUrl: (process.env.NEXT_PUBLIC_YOUTUBE ?? '') as string,

  // 검색엔진 사이트 소유확인 토큰
  naverSiteVerification: (process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ?? '') as string,
  googleSiteVerification: (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '') as string,

  // 비즈니스
  industry: 'LED 사이니지 / 디지털 사이니지 / 전광판',
  controllerStandard: 'NovaStar Taurus + VNNOX',
  // 🔴 2026-09-07 정정 — '서울' 로 박혀 있었다. 법인 소재지는 대전광역시 대덕구다(등기 기준).
  // 이 값은 JSON-LD 의 addressLocality 로 나가 검색결과 지역 표기를 만든다.
  // 관공서는 지역 업체를 우선 찾는 경우가 많아, 틀린 도시는 영업 기회를 통째로 날린다.
  cityKo: '대전',
  countryCode: 'KR',
  founded: '2026',
} as const

/** 설정된 소셜/채널 URL만 모아 반환 (JSON-LD sameAs, 푸터 링크 등에 사용) */
export function socialLinks(): string[] {
  return [
    SITE.kakaoChannelUrl,
    SITE.naverTalkUrl,
    SITE.naverPlaceUrl,
    SITE.instagramUrl,
    SITE.youtubeUrl,
  ].filter(Boolean)
}

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
