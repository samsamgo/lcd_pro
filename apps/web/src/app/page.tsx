import type { Metadata } from 'next'
import { PublicHero } from '@/components/public/PublicHero'
import { ProofRow } from '@/components/public/ProofRow'
import { ScrollProgress } from '@/components/public/ScrollProgress'
import { LedTicker } from '@/components/public/LedTicker'
import { ScrollStatement } from '@/components/public/ScrollStatement'
import { CinematicScene } from '@/components/home/CinematicScene'
import { ScreenGallery } from '@/components/public/ScreenGallery'
import { ProductShowcase } from '@/components/public/ProductShowcase'
import { ProcessTimeline } from '@/components/public/ProcessTimeline'
import { AfterService } from '@/components/public/AfterService'
import { FaqSection } from '@/components/landing/FaqSection'
import { CtaSection } from '@/components/landing/CtaSection'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { JsonLd } from '@/components/seo/JsonLd'
import { serviceLd, howToLd, breadcrumbLd } from '@/lib/seo/jsonld'
import { SITE, absoluteUrl, buildMetadata } from '@/lib/seo/site'
import { PRICE_RANGE_SCHEMA } from '@/lib/pricing'

export const metadata: Metadata = buildMetadata({
  title: `${SITE.nameKo} | 관공서·학교 LED 전광판 · 전자현수막`,
  description:
    '관공서·공공기관·학교 LED 전광판과 전자현수막. 견적서만 드리지 않고 규격서와 설치 도면, 인증이 어디까지 됐는지까지 적어서 같이 보내드립니다. 설계·제작·시공·A/S 직접 수행.',
  path: '/',
})

export default function Home() {
  return (
    <>
      <JsonLd
        id="ld-home-service"
        data={serviceLd({
          name: 'LED 전광판·전자현수막 설계·제작·시공·유지보수',
          description:
            '관공서·공공기관·학교 LED 전광판과 전자현수막. 실측과 설계, 제작, 시공, A/S까지 한 곳에서 합니다.',
          serviceType: 'LED 전광판 · 전자현수막',
          priceRange: PRICE_RANGE_SCHEMA,
          url: absoluteUrl('/'),
        })}
      />
      <JsonLd
        id="ld-home-howto"
        data={howToLd({
          name: '관공서·학교 LED 전광판 도입 절차',
          description:
            '설치 장소와 규모 확인부터 현장 실측, 제작·시공, 담당자 교육과 A/S까지의 절차.',
          totalTime: 'P30D',
          steps: [
            { name: '문의·상담', text: '설치 장소와 용도를 알려주시면 개략 견적과 사양서를 보내드립니다.' },
            { name: '현장 실측', text: '전기 인입과 구조를 확인해 확정 견적과 규격서를 작성합니다.' },
            { name: '제작·시공', text: '자사에서 조립·검사한 뒤 기관 일정에 맞춰 설치합니다.' },
            { name: '교육·A/S', text: '화면 교체 방법을 담당자에게 안내하고, 이후 고장은 모듈 단위로 대응합니다.' },
          ],
        })}
      />
      <JsonLd id="ld-home-breadcrumb" data={breadcrumbLd([{ name: '홈', url: absoluteUrl('/') }])} />

      <ScrollProgress />
      <NavBar />
      <main id="main">
        {/* 관공서 담당자가 확인하는 순서대로 배치한다.
            ① 무엇을 하는 회사인가 → ② 믿을 만한가 → ③ 우리 같은 데 쓰나
            → ④ 설치 후는 어떻게 되나 → ⑤ 서류는 있나 → ⑥ 어떻게 연락하나 */}
        <PublicHero />
        <LedTicker items={[`민원실 대기번호`, `학교 급식·행사 안내`, `지자체 재난 문구`, `강당 행사 화면`, `옥외 전자현수막`, `층별 종합안내`]} />

        {/* ── 라이트: 믿을 만한가 ── */}
        <ProofRow />

        {/* 라이트 → 다크는 선이 아니라 그라디언트 다리로 잇는다 (벤치마크 §4.2) */}
        <div
          aria-hidden="true"
          className="h-32 bg-gradient-to-b from-wk-bgFaint to-wk-night md:h-40"
        />

        {/* ── 다크: 제품을 체험시키는 장 ── */}
        <ScrollStatement
          lead="Why"
          text="대한민국에서 한 해 버려지는 현수막만 약 5,400톤."
          tail="약 487만 장의 현수막. 우강테크는 그 정보를 디지털로 전달합니다."
        />
        <CinematicScene />

        <div aria-hidden="true" className="h-32 bg-gradient-to-b from-wk-night to-white md:h-40" />

        {/* ── 라이트: 무엇을 어떻게 받는가 ── */}
        <ProductShowcase />
        <ScreenGallery />
        <ProcessTimeline />
        <AfterService />
        <FaqSection />

        {/* ── near-black 최종 전환 ── */}
        <CtaSection />
        </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
