import type { Metadata } from 'next'
import { HeroSection } from '@/components/landing/HeroSection'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { ServicesSection } from '@/components/landing/ServicesSection'
import { DifferentiatorSection } from '@/components/landing/DifferentiatorSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { TargetSection } from '@/components/landing/TargetSection'
import { ProductSection } from '@/components/landing/ProductSection'
import { PackagesSection } from '@/components/landing/PackagesSection'
import { SocialProof } from '@/components/landing/SocialProof'
import { FaqSection } from '@/components/landing/FaqSection'
import { CtaSection } from '@/components/landing/CtaSection'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/seo/JsonLd'
import { serviceLd } from '@/lib/seo/jsonld'
import { SITE, absoluteUrl, buildMetadata } from '@/lib/seo/site'
import { PRICE_RANGE_SCHEMA } from '@/lib/pricing'

export const metadata: Metadata = buildMetadata({
  title: `${SITE.nameKo} | LED 사이니지 B2B 플랫폼 — 사진 3장 즉석 범위 견적`,
  description:
    '우강테크(WK Tech)는 카페·식당·헬스장을 위한 LED 사이니지 표준화 시공 플랫폼입니다. 매장 사진 3장으로 즉석 범위 견적을 화면에서 바로 확인하고, 표준화된 설치와 AS까지 한 번에 제공합니다.',
  path: '/',
})

export default function Home() {
  return (
    <>
      <JsonLd
        id="ld-home-service"
        data={serviceLd({
          name: 'LED 사이니지 표준화 시공',
          description:
            '카페·식당·헬스장 등 소상공인을 위한 LED 사이니지 표준화 시공 서비스. 사진 3장 → 즉석 범위 견적 → 표준 시공 → 정기 점검 + AS.',
          serviceType: 'LED 사이니지 시공',
          priceRange: PRICE_RANGE_SCHEMA,
          url: absoluteUrl('/'),
        })}
      />
      <NavBar />
      <main id="main">
        <HeroSection />
        <ProblemSection />
        <ServicesSection />
        <DifferentiatorSection />
        <HowItWorks />
        <TargetSection />
        <ProductSection />
        <PackagesSection />
        <SocialProof />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
