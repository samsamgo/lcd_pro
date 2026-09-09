import { Footer } from '@/components/Footer'
import { CtaSection } from '@/components/landing/CtaSection'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import Link from 'next/link'
import { ProductCatalog } from '@/components/products/ProductCatalog'
import { IMAGES } from '@/lib/imageAssets'
import type { EnvFilter } from '@/lib/productModels'

/**
 * /products · /products/indoor · /products/outdoor 가 **같은 화면**을 쓴다.
 * 셋의 차이는 처음에 걸려 있는 필터 하나뿐이다(CEO 2026-09-09).
 *
 * 여기 있는 것은 머리 + 카드 격자(필터 포함) + 규격 비교표 링크 + 문의뿐이다. 하위 바(SubNav)는 없다.
 */
export function ProductsPageBody({
  env = 'all',
  title,
  lead,
}: {
  env?: EnvFilter
  title: string
  lead: string
}) {
  return (
    <>
      <NavBar />
      <main id="main">
        <PageHeader group="제품" title={title} lead={lead} image={IMAGES.productsHero} />
        <ProductCatalog initialEnv={env} />
        {/* 2026-09-09 CEO "웹에 SKU 없애" — 견적엔진용 SKU 6종 그리드는 화면에서 뺀다. 라우트는 견적엔진이 참조하므로 남긴다 */}
        {/* 규격 비교표 — CEO 2026-09-09 "아래에 둬라". 필터 옆·네비에 두지 않는다 */}
        <section className="bg-wk-night pb-20 md:pb-28" aria-label="규격 비교표">
          <div className="wk-wrap">
            <Link
              href="/products/specs"
              className="group flex flex-col gap-4 rounded-card border border-white/10 bg-white/5 px-7 py-8 transition-colors duration-200 hover:bg-white/10 md:flex-row md:items-center md:justify-between"
            >
              <span>
                <span className="block text-h3 font-bold text-white">규격 비교표</span>
                <span className="mt-1.5 block text-body text-white/65">전 시리즈 규격을 한 표에서 비교합니다.</span>
              </span>
              <span className="inline-flex items-center gap-2 text-label font-semibold text-white">
                한 표로 보기 <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </div>
        </section>
        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
