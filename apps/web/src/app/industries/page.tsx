import { IMAGES } from '@/lib/imageAssets'
import type { Metadata } from 'next'
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
 * 🔴 2026-09-09 CEO 지시로 케이시스(ksys.co.kr) 설치사례 형식으로 다시 짰다.
 *    좌측 필터 사이드바 + 우측 3열 사진 카드, 카드를 누르면 **모달**로 큰 사진과 구축정보가 뜬다.
 *    모달은 주소를 `?case=<slug>` 로 바꾸므로 뒤로가기로 닫히고 링크로 공유된다.
 *    옛 `?type=<slug>` 주소는 IndustryGrid 가 `?case=` 로 바꿔 준다.
 *    `/industries/<slug>` 정적 페이지는 검색 유입용으로 살아 있고, 본문은 모달과 같은
 *    컴포넌트(`IndustryGallery`)를 쓴다 — 두 경로로 보여주며 내용이 갈리지 않게.
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
            {/* 🔴 2026-09-09 CEO 지시 "불리한 말은 전부 빼라" — '예시이며 납품 실적이 아닙니다' 각주 제거 */}
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
