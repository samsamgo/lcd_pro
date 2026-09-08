import type { Metadata } from 'next'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { SpecCompareTable } from '@/components/products/SpecCompareTable'
import { SpecSheets } from '@/components/products/SpecSheets'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '규격 비교표',
  description: '전 모델의 화소 간격·밝기·방수 등급·권장 시청거리를 한 표에서 비교합니다.',
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
        <section className="wk-sec-sm bg-white pt-28 md:pt-32">
          <div className="wk-wrap">
            <p className="wk-eyebrow">제품</p>
            <h1 className="wk-h1 text-wk-ink">규격 비교표</h1>
            <p className="wk-lead mt-5">
              전 모델의 화소 간격·밝기·방수 등급·권장 시청거리입니다. 결재 서류에 그대로 옮기셔도 됩니다.
            </p>
          </div>
        </section>
        <div id="spec">
          <SpecCompareTable />
          <SpecSheets />
        </div>
        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
