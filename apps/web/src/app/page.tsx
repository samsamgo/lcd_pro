import type { Metadata } from 'next'
import { HeroSection } from '@/components/landing/HeroSection'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { DifferentiatorSection } from '@/components/landing/DifferentiatorSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { TargetSection } from '@/components/landing/TargetSection'
import { ProductSection } from '@/components/landing/ProductSection'
import { PackagesSection } from '@/components/landing/PackagesSection'
import { SocialProof } from '@/components/landing/SocialProof'
import { ConstructionGallery } from '@/components/landing/ConstructionGallery'
import { CtaSection } from '@/components/landing/CtaSection'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/seo/JsonLd'
import { serviceLd } from '@/lib/seo/jsonld'
import { SITE, absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const metadata: Metadata = buildMetadata({
  title: `${SITE.nameKo} | LED 사이니지 B2B 플랫폼 — 사진 3장 30분 견적`,
  description:
    '우강테크(WK Tech)는 카페·식당·헬스장을 위한 LED 사이니지 표준화 시공 + NovaStar 기반 CMS 구독 플랫폼입니다. 매장 사진 3장으로 30분 내 범위 견적, 표준화된 설치, 원격 관리까지 한 번에 제공합니다.',
  path: '/',
})

export default function Home() {
  return (
    <>
      <JsonLd
        id="ld-home-service"
        data={serviceLd({
          name: 'LED 사이니지 설치 + CMS 구독',
          description:
            '카페·식당·헬스장 등 소상공인을 위한 LED 사이니지 표준화 시공과 NovaStar 기반 원격 CMS 구독 서비스. 사진 3장 → 30분 견적 → 표준 시공 → 정기 점검 + 24시간 원격 모니터링.',
          serviceType: 'LED 사이니지 시공 및 CMS 구독',
          priceRange: '₩1,600,000 ~ ₩30,000,000',
          url: absoluteUrl('/'),
        })}
      />
      <NavBar />
      <main id="main">
        <HeroSection />
        <ProblemSection />
        <DifferentiatorSection />
        <HowItWorks />
        <TargetSection />
        <ProductSection />
        <PackagesSection />
        <ConstructionGallery />
        <SocialProof />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
