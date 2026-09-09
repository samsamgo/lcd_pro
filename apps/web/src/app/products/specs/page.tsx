import type { Metadata } from 'next'

import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { SubNav } from '@/components/SubNav'
import { productSubNavItems } from '@/lib/subnav'
import { PRODUCT_CATEGORIES } from '@/lib/productCategories'
import { IMAGES } from '@/lib/imageAssets'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { ModelCompareTable } from '@/components/products/ModelCompareTable'
import { SpecCompareTable } from '@/components/products/SpecCompareTable'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '규격 비교표',
  description: '제품 시리즈 12종의 화소 간격·구성 단위·방수 등급·보는 거리를 한 표에서 비교합니다.',
  path: '/products/specs',
})

/** 규격 비교표 — /products 에 섞여 있던 표·규격서를 여기로 떼어냈다(메뉴 이름 = 페이지 제목). */
export default function SpecsPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-specs"
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '제품', url: absoluteUrl('/products') },
          { name: '규격 비교표', url: absoluteUrl('/products/specs') },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHeader
          group="제품"
          title="규격 비교표"
          lead="시리즈 12종의 화소 간격·구성 단위·방수 등급·보는 거리. 결재 서류에 그대로 옮기셔도 됩니다."
          image={IMAGES.pageHeaders.specs}
        />
        <SubNav
          back={{ label: '제품 전체', href: '/products' }}
          items={productSubNavItems(PRODUCT_CATEGORIES)}
          current="/products/specs"
        />
        {/* 2026-09-09 WS-C — 시리즈 비교표(공급사 규격서 기반)를 위에 두고,
            그 아래 견적 기준 구성표(견적엔진과 묶인 SKU 층)를 남긴다. 둘은 층이 다르다:
            위는 '무엇을 파는가', 아래는 '이 자리면 얼마인가'. */}
        <div id="spec">
          <ModelCompareTable />
        </div>
        <div id="quote-spec">
          <SpecCompareTable />
        </div>
        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
