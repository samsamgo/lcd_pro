import type { Metadata } from 'next'

import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { IMAGES } from '@/lib/imageAssets'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { ProductsAtAGlance } from '@/components/products/ProductsAtAGlance'
import { SubNav } from '@/components/SubNav'
import { productSubNavItems } from '@/lib/subnav'
import { PRODUCT_CATEGORIES } from '@/lib/productCategories'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { SITE, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '제품',
  description:
    '민원실 창구 안내판부터 옥외 대형 전광판까지. 모델명이 아니라 설치 환경과 보는 거리로 고르도록 정리했습니다. 화소 간격·밝기·방수 등급과 기준 가격을 그대로 공개합니다.',
  path: '/products',
})

/**
 * 제품 페이지 — 카테고리 6종 × 소속 모델을 한 화면에 전부 펼친다(ProductsAtAGlance).
 * 카테고리 이름·모델 이름은 lib/productCategories.ts · lib/products.ts 에서만 온다.
 * 규격 비교표·규격서는 /products/specs 로 분리했다.
 */
export default function ProductsPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-products"
        data={breadcrumbLd([
          { name: '홈', url: SITE.url + '/' },
          { name: '제품', url: SITE.url + '/products' },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHeader
          group="제품"
          title="제품"
          lead="보는 거리로 고릅니다. 화소 간격과 밝기는 설치 조건의 결과입니다."
          image={IMAGES.productsHero}
        />

        <SubNav
          back={{ label: '홈', href: '/' }}
          items={[{ label: '제품 전체', href: '/products' }, ...productSubNavItems(PRODUCT_CATEGORIES)]}
          current="/products"
        />

        {/* 2026-09-08 CEO 지시 "제품 페이지는 한눈에". 카테고리 6종 × 소속 모델을 전부 펼친다.
            SpecScale·StructureShowcase·ProductScenes·EnvironmentTracks 는 파일만 남겼다(참조 0건). */}
        <ProductsAtAGlance />

        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
