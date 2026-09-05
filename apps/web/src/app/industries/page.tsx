import { IMAGES } from '@/lib/imageAssets'
import type { Metadata } from 'next'
import Image from 'next/image'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { IndustryGrid } from '@/components/public/IndustryGrid'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '업종별 LED 전광판',
  description:
    '관공서·민원실, 학교·강당, 전자현수막, 공공기관·시설관리. 현장마다 보는 거리와 운영 내용이 다릅니다. 설치 장소에 맞는 화면 구성을 안내합니다.',
  path: '/industries',
})

/**
 * 업종별.
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
          { name: '업종별', url: absoluteUrl('/industries') },
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
                Industries
              </p>
              <h1 className="wk-h1 max-w-[13em] text-white">
                현장마다
                <br />
                필요한 화면이 다릅니다
              </h1>
              <p className="wk-lead mt-7 !text-white/85">
                민원실, 강당, 로비, 옥외 게시대는 보는 거리도 운영하는 내용도 다릅니다.
                해당하는 현장을 선택하시면 구성과 사전 확인 사항을 보여드립니다.
              </p>
            </div>
          </div>
        </section>

        {/* 업종 카드 */}
        <section className="wk-sec bg-wk-bg">
          <div className="wk-wrap">
            <IndustryGrid />
          </div>
        </section>

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
