import type { Metadata } from 'next'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { ProductsHero } from '@/components/products/ProductsHero'
import { EnvironmentTracks } from '@/components/products/EnvironmentTracks'
import { SpecScale } from '@/components/products/SpecScale'
import { StructureShowcase } from '@/components/products/StructureShowcase'
import { ProductScenes } from '@/components/products/ProductScenes'
import { SpecSheets } from '@/components/products/SpecSheets'
import { PackagesSection } from '@/components/landing/PackagesSection'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { SITE, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '설치 환경별 제품',
  description:
    '민원실 창구 안내판부터 옥외 대형 전광판까지. 모델명이 아니라 설치 환경과 보는 거리로 고르도록 정리했습니다. 화소 간격·밝기·방수 등급과 기준 가격을 그대로 공개합니다.',
  path: '/products',
})

/**
 * 제품 페이지.
 *
 * 구성 원칙 — 모델명으로 메뉴를 만들지 않는다(벤치마크 §6 안티패턴 13).
 * 담당자는 `WK-P2.5-IN` 이 실내용인지 학교용인지 모른다. 그래서
 *   ① 어디에 거는가(EnvironmentTracks)
 *   ② 얼마나 멀리서 보는가 · 얼마나 밝아야 하는가(SpecScale)
 *   ③ 안이 어떻게 생겼는가(StructureShowcase)
 *   ④ 실제로 어떻게 보이는가(ProductScenes)
 *   ⑤ 결재 문서에 옮길 수 있는 규격서(SpecSheets)
 * 순서로 좁혀 들어간다. 모델명은 마지막 규격서에서 처음 등장한다.
 */
export default function ProductsPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-products"
        data={breadcrumbLd([
          { name: '홈', url: SITE.url + '/' },
          { name: '설치 환경별 제품', url: SITE.url + '/products' },
        ])}
      />
      <NavBar />
      <main id="main">
        <ProductsHero />

        {/* ── 어디에 거는가 ── */}
        <div id="lineup">
          <EnvironmentTracks />
        </div>

        {/* ── 얼마나 멀리서, 얼마나 밝게 ── */}
        <SpecScale />

        {/* ── 안이 어떻게 생겼는가 ── */}
        <StructureShowcase />

        {/* ── 실제로 어떻게 보이는가 ── */}
        <ProductScenes />

        {/* ── 결재 문서로 옮길 수 있는 규격 ── */}
        <div id="spec">
          <SpecSheets />
        </div>

        {/* ── 포함 범위와 기준 가격 ── */}
        <div id="price">
          <PackagesSection hideHeader />
        </div>

        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
