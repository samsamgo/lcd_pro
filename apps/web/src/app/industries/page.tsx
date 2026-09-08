import { IMAGES } from '@/lib/imageAssets'
import type { Metadata } from 'next'
import Image from 'next/image'
import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { IndustryCompare } from '@/components/public/IndustryCompare'
import { IndustryGrid } from '@/components/public/IndustryGrid'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: 'LED 전광판 시공사례',
  description:
    '관공서·민원실, 학교·강당, 보건소, 도로·교차로, 주차장, 아파트까지. 자리마다 보는 거리와 운영 내용이 다릅니다. 설치 자리별로 어떤 구성이 들어가는지 정리했습니다.',
  path: '/industries',
})

/**
 * 시공사례.
 *
 * 어두운 히어로로 시작해 카드 그리드로 이어진다.
 * 카드·비교표에서 자리를 고르면 상세 페이지(`/industries/<slug>`)로 간다.
 * 옛 `?type=<slug>` 주소는 IndustryGrid 가 상세 페이지로 바꿔 보낸다.
 */
export default function IndustriesPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-industries"
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '시공사례', url: absoluteUrl('/industries') },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHeader
          group="시공사례"
          title="시공사례"
          lead="설치할 자리를 고르시면 어떤 규격이 들어가는지 보여드립니다."
          image={IMAGES.industriesHero}
        />

        {/* 시공사례 카드 */}
        <section className="wk-sec bg-wk-bg">
          <div className="wk-wrap">
            <IndustryGrid />
            {/* 실적으로 읽히면 안 되므로 한 줄만 남긴다 (2026-09-08 CEO 지시로 긴 각주 축약) */}
            <p className="wk-cap mt-8">
              사진은 자리별 설치 형태를 보여주기 위한 예시이며, 특정 기관의 납품 실적이 아닙니다.
            </p>
          </div>
        </section>

        {/* 카드 뒤 모달에 숨어 있던 판단 근거를 표로 꺼낸다 */}
        <IndustryCompare />

        {/* 🔴 2026-09-08 CEO 지시 "화면 예시도 필요 없고, 시설과 무관하게 있는 불필요한 설명 다 빼".
            IndustryScenes(화면 예시 4장) · IndustryChecks(시설과 무관한 확인 4가지)를 걷어냈다.
            이 페이지는 "어느 자리에 무엇이 들어가는가" 하나만 답한다 — 카드로 고르고, 표로 비교한다.
            두 파일은 참조 0건으로 남겨 뒀다(번들 제외). */}

        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
