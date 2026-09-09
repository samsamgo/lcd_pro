import { Footer } from '@/components/Footer'
import { CtaSection } from '@/components/landing/CtaSection'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { SubNav } from '@/components/SubNav'
import { ProductCatalog } from '@/components/products/ProductCatalog'
import { IMAGES } from '@/lib/imageAssets'
import { PRODUCT_SUBNAV } from '@/lib/subnav'
import type { EnvFilter } from '@/lib/productModels'

/**
 * /products · /products/indoor · /products/outdoor 가 **같은 화면**을 쓴다.
 * 셋의 차이는 처음에 걸려 있는 필터 하나뿐이다(CEO 2026-09-09).
 *
 * 페이지 안에 섹션을 더 붙이지 마라. 여기 있는 것은 머리 + 하위탭 + 카드 격자 + 문의뿐이다.
 */
export function ProductsPageBody({
  env = 'all',
  title,
  lead,
  current,
}: {
  env?: EnvFilter
  title: string
  lead: string
  current: string
}) {
  return (
    <>
      <NavBar />
      <main id="main">
        <PageHeader group="제품" title={title} lead={lead} image={IMAGES.productsHero} />
        <SubNav back={{ label: '홈', href: '/' }} items={PRODUCT_SUBNAV} current={current} />
        <ProductCatalog initialEnv={env} />
        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
