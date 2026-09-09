import type { Metadata } from 'next'

import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { IMAGES } from '@/lib/imageAssets'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { ModelCompareTable } from '@/components/products/ModelCompareTable'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: 'LED 전광판 규격 비교표 — 12종 한눈에',
  description:
    'LED 전광판 시리즈 12종의 화소 간격·구성 단위·설치 환경·방수 등급·보는 거리를 한 표에서 비교합니다. 자리를 고르는 데 필요한 값만 세워 두었습니다.',
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
        {/* 🔴 2026-09-09 CEO 지시 "이상한 거 다 지우고" — 여기 있던 견적 SKU 구성표
            (SpecCompareTable)를 뺐다. 규격 비교표는 **시리즈 12종 한 표** 하나만 한다.
            SpecCompareTable.tsx 는 남겨 뒀다(참조 0건 = 번들 제외). */}
        <ModelCompareTable />
        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
