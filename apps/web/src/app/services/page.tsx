import type { Metadata } from 'next'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { PageHero } from '@/components/PageHero'
import { ServicesSection } from '@/components/landing/ServicesSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd, serviceLd } from '@/lib/seo/jsonld'
import { PRICE_RANGE_SCHEMA } from '@/lib/pricing'
import { SITE, absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '서비스',
  description:
    '표준화 시공, NovaStar 컨트롤러 표준, 콘텐츠 세팅·운영 지원, AS·유지보수, 인증·인허가 대응, 공공조달·다점포까지 — LED 사이니지에 필요한 모든 영역을 한 파트너로 제공합니다.',
  path: '/services',
})

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        id="ld-services"
        data={serviceLd({
          name: 'LED 사이니지 표준화 시공·운영 서비스',
          description:
            '표준화 시공, 컨트롤러 표준, 콘텐츠 운영 지원, AS, 인허가 대응, 다점포 대응.',
          serviceType: 'LED 사이니지 시공·운영',
          priceRange: PRICE_RANGE_SCHEMA,
          url: absoluteUrl('/services'),
        })}
      />
      <JsonLd
        id="ld-breadcrumb-services"
        data={breadcrumbLd([
          { name: '홈', url: SITE.url + '/' },
          { name: '서비스', url: SITE.url + '/services' },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHero
          eyebrow="Services"
          title="시공부터 운영까지, 한 파트너로"
          description="LED 사이니지 도입에 필요한 모든 영역을 표준화된 방법으로 제공합니다. 설계·시공·인허가·AS·콘텐츠 운영까지 한 곳에서 끝냅니다."
          crumbs={[{ name: '홈', href: '/' }, { name: '서비스' }]}
        />
        <ServicesSection hideHeader />
        <HowItWorks />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
