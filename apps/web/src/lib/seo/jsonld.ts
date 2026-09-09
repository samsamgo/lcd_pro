/**
 * Schema.org JSON-LD 헬퍼
 *
 * AEO/GEO 핵심: 모든 페이지 타입별 구조화 데이터 노출.
 * Organization, LocalBusiness, WebSite, Service, BlogPosting, FAQPage,
 * HowTo, BreadcrumbList — 페이지별로 필요한 것만 사용.
 */

import { SITE, absoluteUrl, socialLinks } from './site'
import { PRICE_RANGE_SCHEMA } from '../pricing'

/**
 * PostalAddress 공통 — Organization·LocalBusiness 가 같은 주소를 써야 한다.
 * 🔴 addressFull 통짜를 streetAddress 에 넣지 마라. 구글이 지역(대전)을 못 뽑는다.
 */
function postalAddressLd() {
  return {
    '@type': 'PostalAddress',
    addressCountry: SITE.countryCode,
    ...(SITE.addressRegion ? { addressRegion: SITE.addressRegion } : {}),
    ...(SITE.addressLocality ? { addressLocality: SITE.addressLocality } : {}),
    ...(SITE.streetAddress ? { streetAddress: SITE.streetAddress } : {}),
  }
}

/**
 * `평일 09:00~18:00` 같은 사람이 읽는 문자열을 schema.org 규격으로 바꾼다.
 * 규격은 `Mo-Fr 09:00-18:00` 형태만 인정한다 — 한글 문자열을 그대로 내보내면 무효 값이다.
 * 파싱이 안 되면 아무것도 내보내지 않는다(틀린 값보다 없는 값이 낫다).
 */
function openingHoursSpecLd() {
  const m = SITE.openingHours?.match(/평일\s*(\d{1,2}:\d{2})\s*[~-]\s*(\d{1,2}:\d{2})/)
  if (!m) return null
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'https://schema.org/Monday',
      'https://schema.org/Tuesday',
      'https://schema.org/Wednesday',
      'https://schema.org/Thursday',
      'https://schema.org/Friday',
    ],
    opens: m[1].padStart(5, '0'),
    closes: m[2].padStart(5, '0'),
  }
}

const AREA_SERVED_KR = { '@type': 'Country', name: '대한민국' } as const

/* ───────────────────────── Organization ────────────────────────── */
export function organizationLd() {
  const sameAs = socialLinks()
  const hours = openingHoursSpecLd()
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.nameKo,
    alternateName: SITE.nameEn,
    legalName: SITE.legalName,
    url: SITE.url,
    // 구글 로고 가이드라인은 래스터(png/jpg) 정사각 로고를 요구한다. OG 이미지(1200x630)는 로고가 아니다.
    logo: absoluteUrl('/icon-512.png'),
    image: absoluteUrl('/opengraph-image'),
    description: SITE.taglineKo,
    slogan: SITE.sloganKo,
    foundingDate: SITE.founded,
    // 🔴 최상위 연락처 — contactPoint 안에만 있으면 지식패널·AI 답변이 못 집는 경우가 많다.
    ...(SITE.phone ? { telephone: SITE.phone } : {}),
    ...(SITE.fax ? { faxNumber: SITE.fax } : {}),
    email: SITE.email,
    address: postalAddressLd(),
    areaServed: AREA_SERVED_KR,
    ...(hours ? { openingHoursSpecification: [hours] } : {}),
    knowsAbout: [
      'LED 사이니지', '디지털 사이니지', '전광판', 'LED 디스플레이',
      'NovaStar', 'VNNOX', 'LED 시공', 'AS·유지보수',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        ...(SITE.phone ? { telephone: SITE.phone } : {}),
        email: SITE.email,
        areaServed: 'KR',
        availableLanguage: ['Korean'],
      },
    ],
    // 빈 배열은 내보내지 않는다 — 값 없는 속성은 구조화 데이터 경고를 만든다.
    ...(sameAs.length ? { sameAs } : {}),
  }
}

/* ───────────────────────── LocalBusiness ───────────────────────── */
export function localBusinessLd() {
  const sameAs = socialLinks()
  const hours = openingHoursSpecLd()
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/#localbusiness`,
    name: SITE.nameKo,
    alternateName: SITE.nameEn,
    legalName: SITE.legalName,
    logo: absoluteUrl('/icon-512.png'),
    image: absoluteUrl('/opengraph-image'),
    url: SITE.url,
    ...(SITE.phone ? { telephone: SITE.phone } : {}),
    ...(SITE.fax ? { faxNumber: SITE.fax } : {}),
    email: SITE.email,
    description: SITE.taglineKo,
    priceRange: PRICE_RANGE_SCHEMA,
    address: postalAddressLd(),
    // 🔴 `평일 09:00~18:00` 을 openingHours 에 그대로 넣으면 무효 값이다. 규격 객체로 내보낸다.
    ...(hours ? { openingHoursSpecification: [hours] } : {}),
    areaServed: AREA_SERVED_KR,
    parentOrganization: { '@id': `${SITE.url}/#organization` },
    ...(sameAs.length ? { sameAs } : {}),
  }
}

/* ───────────────────────── Product + Offer ─────────────────────── */
export interface ProductLdInput {
  name: string
  description: string
  sku: string
  image?: string
  category?: string
  priceFrom?: number // KRW 최소가 (설치비 기준). 있으면 Offer 노출
  url?: string
}
export function productLd(input: ProductLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    sku: input.sku,
    image: input.image ?? absoluteUrl('/opengraph-image'),
    category: input.category ?? 'LED 사이니지',
    brand: { '@type': 'Brand', name: SITE.nameKo },
    ...(input.url ? { url: input.url } : {}),
    ...(input.priceFrom
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'KRW',
            price: input.priceFrom,
            priceSpecification: {
              '@type': 'PriceSpecification',
              priceCurrency: 'KRW',
              minPrice: input.priceFrom,
              valueAddedTaxIncluded: false,
            },
            availability: 'https://schema.org/InStock',
            seller: { '@id': `${SITE.url}/#organization` },
          },
        }
      : {}),
  }
}

/** 여러 제품을 ItemList 로 묶어 제품 목록 페이지에 노출 */
export function productListLd(products: ProductLdInput[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: productLd(p),
    })),
  }
}

/* ───────────────────────── WebSite (sitelinks search) ──────────── */
export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.nameKo,
    alternateName: SITE.nameEn,
    inLanguage: SITE.locale,
    publisher: { '@id': `${SITE.url}/#organization` },
  }
}

/* ───────────────────────── Service ─────────────────────────────── */
export interface ServiceLdInput {
  name: string
  description: string
  serviceType?: string
  priceRange?: string
  url?: string
}
export function serviceLd(input: ServiceLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    serviceType: input.serviceType ?? 'LED 사이니지 표준 시공 및 AS',
    provider: { '@id': `${SITE.url}/#organization` },
    areaServed: AREA_SERVED_KR,
    ...(input.url ? { url: input.url } : {}),
    ...(input.priceRange ? { offers: { '@type': 'Offer', priceCurrency: 'KRW', priceRange: input.priceRange } } : {}),
  }
}

/* ───────────────────────── FAQPage ─────────────────────────────── */
export interface FaqItem {
  question: string
  answer: string
}
export function faqPageLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  }
}

/* ───────────────────────── HowTo ───────────────────────────────── */
export interface HowToStep {
  name: string
  text: string
}
/**
 * 🔴 2026-09-09 CEO 지시로 `totalTime` 을 없앴다.
 *    "설치 과정 잡다한 설명 없애고, 소요기간 없애라." — 홈 HowTo 에 P30D 가 박혀 있었다.
 *    현장마다 다른 기간을 구조화 데이터로 내보내면 검색결과에 소요기간이 노출되고,
 *    그건 화면에 없는 말을 검색엔진에만 하는 것이자 지연 시 분쟁 근거가 된다.
 *    공정별 기간이 필요한 페이지(/about#process)는 자체 HowTo 를 쓰지 않는다.
 *    ⚠️ 다시 넣지 마라. 넣으려면 화면에 같은 값이 먼저 있어야 한다.
 */
export interface HowToLdInput {
  name: string
  description: string
  steps: HowToStep[]
}
export function howToLd(input: HowToLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    step: input.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
}

/* ───────────────────────── BreadcrumbList ──────────────────────── */
export interface BreadcrumbItem {
  name: string
  url?: string
}
export function breadcrumbLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      // 현재 페이지(마지막 항목)는 url 생략 가능 (Google 가이드라인 허용)
      ...(it.url ? { item: it.url } : {}),
    })),
  }
}
