import { IMAGES } from '@/lib/imageAssets'
import type { Metadata } from 'next'
import Image from 'next/image'
import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { IndustryCompare } from '@/components/public/IndustryCompare'
import { IndustryScenes } from '@/components/public/IndustryScenes'
import { IndustryChecks } from '@/components/public/IndustryChecks'
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
          lead="이런 자리에는 이런 구성이 들어갑니다. 해당하는 자리를 고르시면 규격과 확인할 것을 보여드립니다."
          image={IMAGES.industriesHero}
        />

        {/* 시공사례 카드 */}
        <section className="wk-sec bg-wk-bg">
          <div className="wk-wrap">
            <IndustryGrid />
            {/* 🔴 실적 표기가 아니다. "시공사례"라는 이름 때문에 납품 실적으로
                읽히면 안 되므로 카드 바로 아래에 못을 박는다. */}
            <p className="wk-cap mt-8">
              카드는 설치 자리 유형별 표준 구성입니다. 특정 기관의 납품 실적이나 계약 건수를
              표시한 것이 아니며, 사진은 자리별 설치 형태를 보여주기 위한 예시입니다.
              확정 사양과 금액은 현장을 실측한 뒤에 정해집니다.
            </p>
          </div>
        </section>

        {/* 카드 뒤 모달에 숨어 있던 판단 근거를 표로 꺼낸다 */}
        <IndustryCompare />

        {/* "걸면 뭐가 뜨나" — 글보다 사진이 빠른 질문 */}
        <IndustryScenes />

        {/* 업종과 무관하게 일정이 갈리는 네 지점 */}
        <IndustryChecks />

        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
