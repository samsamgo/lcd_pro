import type { Metadata } from 'next'
import { BrandHero } from '@/components/brand/BrandHero'
import { Manifesto } from '@/components/brand/Manifesto'
import { CinematicScene } from '@/components/brand/CinematicScene'
import { InstantQuotePreview } from '@/components/landing/InstantQuotePreview'
import { ProductSection } from '@/components/landing/ProductSection'
import { PackagesSection } from '@/components/landing/PackagesSection'
import { FaqSection } from '@/components/landing/FaqSection'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { JsonLd } from '@/components/seo/JsonLd'
import { serviceLd, howToLd, breadcrumbLd } from '@/lib/seo/jsonld'
import { SITE, absoluteUrl, buildMetadata } from '@/lib/seo/site'
import { PRICE_RANGE_SCHEMA } from '@/lib/pricing'

export const metadata: Metadata = buildMetadata({
  title: `${SITE.nameKo} | 빛으로 공간을 바꾸는 디스플레이 브랜드`,
  description:
    '우강테크(WK Tech)는 빛으로 공간을 바꾸는 디스플레이 브랜드입니다. LED 디스플레이의 설계·제조·시공·운영을 하나의 표준으로 잇습니다. 사진 3장이면 30분 안에 예상 범위 견적을 확인하세요.',
  path: '/',
})

export default function Home() {
  return (
    <>
      <JsonLd
        id="ld-home-service"
        data={serviceLd({
          name: 'LED 디스플레이 설계·제조·시공·운영',
          description:
            '빛으로 공간을 바꾸는 디스플레이 브랜드. LED 사이니지의 설계·제조·표준 시공·CMS 운영·AS를 하나로 제공합니다.',
          serviceType: 'LED 디스플레이 · 사이니지',
          priceRange: PRICE_RANGE_SCHEMA,
          url: absoluteUrl('/'),
        })}
      />
      <JsonLd
        id="ld-home-howto"
        data={howToLd({
          name: '사진 3장으로 LED 디스플레이 견적받고 설치하기',
          description: '매장 사진 3장으로 30분 안에 예상 범위 견적을 확인하고 표준 시공과 운영까지 진행하는 절차.',
          totalTime: 'PT30M',
          steps: [
            { name: '사진 업로드', text: '설치 위치가 보이는 공간 사진 3장을 업로드합니다.' },
            { name: '30분 범위 견적', text: '표준 SKU 기준으로 예상 범위 견적을 화면에서 바로 확인합니다.' },
            { name: '현장 실측·확정 견적', text: '전문가가 현장을 실측해 확정 견적과 시공 일정을 안내합니다.' },
            { name: '표준 시공·운영', text: '3일 표준 시공 후 CMS 운영과 AS로 공간을 관리합니다.' },
          ],
        })}
      />
      <JsonLd id="ld-home-breadcrumb" data={breadcrumbLd([{ name: '홈', url: absoluteUrl('/') }])} />

      <NavBar />
      <main id="main">
        <BrandHero />
        <Manifesto />

        {/* 실내 */}
        <CinematicScene
          layout="fullbleed"
          align="left"
          eyebrow="실내 · Indoor"
          title={<>메뉴가,<br />살아 움직인다</>}
          body="종이 메뉴판의 시대는 지났습니다. 카페·식당의 메뉴와 가격을 화면에서 즉시 바꾸고, 계절과 시간에 맞춰 공간의 표정을 바꿉니다."
          image="/curated/gal-restaurant-menu.jpg"
          imageAlt="카페·식당 실내 LED 메뉴 디스플레이"
          href="/industries/cafe"
          cta="실내 디스플레이 보기"
        />

        {/* 옥외 */}
        <CinematicScene
          layout="split"
          theme="dark"
          imageSide="right"
          eyebrow="옥외 · Outdoor"
          title={<>거리를,<br />압도한다</>}
          body="직사광선 아래서도 선명한 고밝기 옥외 디스플레이. 원거리 가시성부터 방수·구조·옥외광고물 인허가까지 — 거리에서 가장 먼저 눈에 띄는 공간을 만듭니다."
          image="/curated/svc-outdoor-p5.jpg"
          imageAlt="옥외 고밝기 LED 광고 디스플레이"
          href="/industries/outdoor-ad"
          cta="옥외 디스플레이 보기"
        />

        {/* 표준 */}
        <CinematicScene
          layout="split"
          theme="light"
          imageSide="left"
          eyebrow="기술 표준 · Standard"
          title={<>표준이,<br />속도를 만든다</>}
          body="우강테크는 캐비닛·컨트롤러·절차를 표준화했습니다. NovaStar 글로벌 컨트롤러와 표준 SKU로, 복잡한 견적을 30분으로, 긴 시공을 3일로 줄였습니다."
          image="/curated/svc-controller.jpg"
          imageAlt="NovaStar 표준 LED 컨트롤러"
          stats={[
            { value: '30분', label: '1차 견적' },
            { value: '3일', label: '표준 시공' },
            { value: '6종', label: '표준 SKU' },
          ]}
          href="/services"
          cta="기술 표준 알아보기"
        />

        {/* 인터랙티브 견적 */}
        <InstantQuotePreview />

        {/* 라인업 */}
        <ProductSection />

        {/* 패키지 */}
        <PackagesSection />

        {/* FAQ */}
        <FaqSection />

        {/* 클로징 */}
        <CinematicScene
          layout="fullbleed"
          align="center"
          eyebrow="Start"
          title={<>당신의 공간을, 켜다</>}
          body="사진 3장이면 충분합니다. 30분 안에 예상 범위 견적을 받아보세요."
          image="/curated/gal-metro-videowall.jpg"
          imageAlt="대형 LED 디스플레이 공간"
          href="/quote"
          cta="견적 시작하기"
        />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
