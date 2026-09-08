import type { Metadata } from 'next'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { ProductsHero } from '@/components/products/ProductsHero'
import { ProductCategoryGrid } from '@/components/products/ProductCategoryGrid'
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
 * 제품 페이지.
 *
 * 구성 원칙 — 모델명으로 메뉴를 만들지 않는다(벤치마크 §6 안티패턴 13).
 * 담당자는 `WK-P2.5-IN` 이 실내용인지 학교용인지 모른다. 그래서
 *   ① 어디에 거는가(EnvironmentTracks)
 *   ② 얼마나 멀리서 보는가 · 얼마나 밝아야 하는가(SpecScale)
 *   ③ 안이 어떻게 생겼는가(StructureShowcase)
 *   ④ 실제로 어떻게 보이는가(ProductScenes)
 *   ⑤ 여섯 제품을 한 표에 세운 비교표(SpecCompareTable)
 *   ⑥ 제품 하나씩의 규격서(SpecSheets)
 * 순서로 좁혀 들어간다. 모델명은 마지막 규격서에서 처음 등장한다.
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
        <ProductsHero />

        {/* 🔴 2026-09-08 — /products 는 **카테고리 입구**로만 쓴다.
            전에는 환경 트랙·화소 축척·구조·장면·비교표·규격서 여섯 섹션이 한 페이지에 있었고,
            네비바 하위 메뉴는 그 안의 앵커(#lineup·#spec)로 뛰어들었다. 눌러도 페이지가 안 바뀌니
            "이상한 곳으로 연동된다"(CEO). 이제 카테고리 3종은 각자 페이지가 있고 여기는
            그 셋을 사진으로 보여주고 보내는 일만 한다. 비교표·규격서는 /products/specs 로 갔다.
            SpecScale·StructureShowcase·ProductScenes 는 파일만 남겼다(참조 0건 = 번들 제외). */}
        <ProductCategoryGrid />

        <CtaSection
          title={['어느 제품이 맞는지', '같이 정하겠습니다']}
          sub={'보는 거리와 설치 자리만 알려주시면 맞는 규격을 골라 드립니다.'}
        />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
