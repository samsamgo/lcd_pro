import type { Metadata } from 'next'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { PageHero } from '@/components/PageHero'
import { PackagesSection } from '@/components/landing/PackagesSection'
import { DifferentiatorSection } from '@/components/landing/DifferentiatorSection'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { SITE, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '패키지',
  description:
    '베이직·스탠다드·프리미엄·렌탈 — 매장 목적에 맞춰 하드웨어·시공·보증·AS 범위를 묶은 표준 패키지. 포함/불포함을 명확히 공개합니다.',
  path: '/packages',
})

export default function PackagesPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-packages"
        data={breadcrumbLd([
          { name: '홈', url: SITE.url + '/' },
          { name: '패키지', url: SITE.url + '/packages' },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHero
          eyebrow="Packages"
          title="목적에 맞게 선택하세요"
          description="하드웨어·시공·보증·AS 범위를 표준 패키지로 묶었습니다. 무엇이 포함되고 무엇이 빠지는지 명확하게 공개합니다."
          crumbs={[{ name: '홈', href: '/' }, { name: '패키지' }]}
        />
        <PackagesSection hideHeader />
        <DifferentiatorSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
