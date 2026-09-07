import { IMAGES } from '@/lib/imageAssets'
import type { Metadata } from 'next'
import Image from 'next/image'
import { NavBar } from '@/components/NavBar'
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
  title: 'LED 전광판 설치 사례',
  description:
    '관공서·민원실, 학교·강당, 보건소, 도로·교차로, 주차장, 아파트까지. 자리마다 보는 거리와 운영 내용이 다릅니다. 설치 자리별로 어떤 구성이 들어가는지 정리했습니다.',
  path: '/industries',
})

/**
 * 설치 사례.
 *
 * 어두운 히어로로 시작해 카드 그리드로 이어진다.
 * 카드에서 업종을 고르면 모달로 상세가 열린다(페이지 이동 없음).
 * 네비게이션 하위 메뉴는 `?type=` 로 들어와 해당 모달을 바로 연다.
 */
export default function IndustriesPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-industries"
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '설치 사례', url: absoluteUrl('/industries') },
        ])}
      />
      <NavBar />
      <main id="main">
        {/* 히어로 */}
        <section
      data-wk-dark-hero className="relative flex min-h-[62svh] items-end overflow-hidden bg-black md:min-h-[70svh]">
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src={IMAGES.industriesHero}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/70" />
          </div>

          <div className="relative z-10 w-full pb-14 md:pb-20">
            <div className="wk-wrap">
              <p className="wk-eyebrow !text-white/70">
                설치 사례
              </p>
              <h1 className="wk-h1 max-w-[13em] text-white">
                이런 자리에는
                <br />
                이런 구성이 들어갑니다
              </h1>
              <p className="wk-lead mt-7 !text-white/85">
                민원실, 강당, 보건소 출입구, 교차로, 주차장 진입로는 보는 거리도 운영하는 내용도
                다릅니다. 해당하는 자리를 선택하시면 어떤 규격이 들어가고 무엇을 미리 확인해야
                하는지 보여드립니다.
              </p>
            </div>
          </div>
        </section>

        {/* 설치 사례 카드 */}
        <section className="wk-sec bg-wk-bg">
          <div className="wk-wrap">
            <IndustryGrid />
            {/* 🔴 실적 표기가 아니다. "설치 사례"라는 이름 때문에 납품 실적으로
                읽히면 안 되므로 카드 바로 아래에 못을 박는다. */}
            <p className="wk-cap mt-8">
              카드는 설치 자리 유형별 표준 구성입니다. 특정 기관의 납품 실적이나 계약 건수를
              표시한 것이 아니며, 사진은 자리별 설치 형태를 보여주기 위한 예시입니다.
              확정 사양과 금액은 현장 실측 후 규격서로 드립니다.
            </p>
          </div>
        </section>

        {/* 카드 뒤 모달에 숨어 있던 판단 근거를 표로 꺼낸다 */}
        <IndustryCompare />

        {/* "걸면 뭐가 뜨나" — 글보다 사진이 빠른 질문 */}
        <IndustryScenes />

        {/* 업종과 무관하게 일정이 갈리는 네 지점 */}
        <IndustryChecks />

        <CtaSection
          title={['우리 기관은 어떤지', '물어보십시오']}
          sub={'비슷한 자리에 어떤 구성이 들어갔는지 정리해 보내드립니다.'}
        />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
