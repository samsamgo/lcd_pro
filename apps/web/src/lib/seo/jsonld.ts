/**
 * Schema.org JSON-LD 헬퍼
 *
 * AEO/GEO 핵심: 모든 페이지 타입별 구조화 데이터 노출.
 * Organization, LocalBusiness, WebSite, Service, BlogPosting, FAQPage,
 * HowTo, BreadcrumbList — 페이지별로 필요한 것만 사용.
 */

import { SITE, absoluteUrl, socialLinks } from './site'
import { PRICE_RANGE_SCHEMA } from '../pricing'

/* ───────────────────────── Organization ────────────────────────── */
export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.nameKo,
    alternateName: SITE.nameEn,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: absoluteUrl('/opengraph-image'),
    image: absoluteUrl('/opengraph-image'),
    description: SITE.taglineKo,
    slogan: SITE.sloganKo,
    foundingDate: SITE.founded,
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
    sameAs: socialLinks(),
  }
}

/* ───────────────────────── LocalBusiness ───────────────────────── */
export function localBusinessLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE.url}/#localbusiness`,
    name: SITE.nameKo,
    alternateName: SITE.nameEn,
    image: absoluteUrl('/opengraph-image'),
    url: SITE.url,
    ...(SITE.phone ? { telephone: SITE.phone } : {}),
    email: SITE.email,
    description: SITE.taglineKo,
    priceRange: PRICE_RANGE_SCHEMA,
    address: {
      '@type': 'PostalAddress',
      addressCountry: SITE.countryCode,
      addressLocality: SITE.cityKo,
      ...(SITE.addressFull ? { streetAddress: SITE.addressFull } : {}),
    },
    ...(SITE.openingHours ? { openingHours: SITE.openingHours } : {}),
    areaServed: { '@type': 'Country', name: 'South Korea' },
    sameAs: socialLinks(),
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
    areaServed: { '@type': 'Country', name: 'South Korea' },
    ...(input.url ? { url: input.url } : {}),
    ...(input.priceRange ? { offers: { '@type': 'Offer', priceCurrency: 'KRW', priceRange: input.priceRange } } : {}),
  }
}

/* ───────────────────────── BlogPosting ─────────────────────────── */
export interface BlogPostingLdInput {
  title: string
  description: string
  url: string
  publishedAt: string
  updatedAt?: string
  author?: string
  image?: string
  tags?: string[]
}
export function blogPostingLd(input: BlogPostingLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    image: input.image ?? absoluteUrl('/opengraph-image'),
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    author: {
      '@type': 'Organization',
      name: input.author ?? SITE.nameKo,
    },
    publisher: { '@id': `${SITE.url}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': input.url },
    keywords: input.tags?.join(', '),
    inLanguage: SITE.locale,
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
export interface HowToLdInput {
  name: string
  description: string
  steps: HowToStep[]
  totalTime?: string // ISO 8601 duration e.g. "PT30M"
}
export function howToLd(input: HowToLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    ...(input.totalTime ? { totalTime: input.totalTime } : {}),
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
  url: string
}
export function breadcrumbLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }
}
