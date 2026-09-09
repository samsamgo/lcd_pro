import type { Metadata } from 'next'

import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { IMAGES } from '@/lib/imageAssets'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { ProductEntryTiles } from '@/components/products/ProductEntryTiles'
import { ProductCategoryGrid } from '@/components/products/ProductCategoryGrid'
import { StructureShowcase } from '@/components/products/StructureShowcase'
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
    '실내용·실외용 LED 전광판 시리즈. 화소 간격별 전체 규격을 표로 공개합니다. 설치할 자리와 보는 거리로 고르시면 됩니다.',
  path: '/products',
})

/**
 * /products 입구.
 *
 * 🔴 2026-09-09 CEO 지시 "제품은 온빛전자처럼 인도어/아웃도어로 멋있게".
 *    첫 갈림길을 **실내 / 실외 두 장의 큰 다크 타일**로 두고, 여섯 카테고리는 그 아래 둔다.
 *    모델 시리즈 목록은 각 카테고리 페이지 안에서 검정 배경 흰 카드로 펼친다.
 *    (전에 여기 있던 ProductsAtAGlance 는 카테고리 × 모델을 한 페이지에 전부 펼치는 형태라
 *     시리즈 12종이 들어오면서 한 화면에 담기지 않는다. 파일은 남겨 둔다.)
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
          lead="설치할 자리와 보는 거리로 고릅니다. 화면 크기가 먼저고, 화소 간격이 그다음입니다."
          image={IMAGES.productsHero}
        />

        <SubNav
          back={{ label: '홈', href: '/' }}
          items={[{ label: '제품 전체', href: '/products' }, ...productSubNavItems(PRODUCT_CATEGORIES)]}
          current="/products"
        />

        <ProductEntryTiles />

        <ProductCategoryGrid eyebrow="용도별" heading="쓰이는 자리로도 고를 수 있습니다" showMore />

        {/* "무엇을 파는지" 다음에 "어떻게 생겼는지". 규격 숫자가 실물로 읽히게 한다 */}
        <StructureShowcase />

        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
