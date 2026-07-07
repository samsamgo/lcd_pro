import type { Metadata } from 'next'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { PageHero } from '@/components/PageHero'
import { ProductSection } from '@/components/landing/ProductSection'
import { TargetSection } from '@/components/landing/TargetSection'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { SITE, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '제품 라인업',
  description:
    '실내 소형 메뉴판부터 옥외 대형 빌딩 전광판까지 — 공간과 목적에 맞춰 표준화한 6가지 LED 사이니지 SKU. 픽셀 피치·밝기·설치비 기준가를 투명하게 공개합니다.',
  path: '/products',
})

export default function ProductsPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-products"
        data={breadcrumbLd([
          { name: '홈', url: SITE.url + '/' },
          { name: '제품 라인업', url: SITE.url + '/products' },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHero
          eyebrow="Products"
          title="공간에 맞는 표준 모델"
          description="복잡한 스펙 없이 — 실내·옥외, 화면 크기, 목적에 맞는 제품을 바로 추천합니다. 모든 설치비 기준가는 예상 범위로 투명하게 공개합니다."
          crumbs={[{ name: '홈', href: '/' }, { name: '제품 라인업' }]}
        />
        <ProductSection hideHeader />
        <TargetSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
