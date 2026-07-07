import type { Metadata } from 'next'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { PageHero } from '@/components/PageHero'
import { FaqSection } from '@/components/landing/FaqSection'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { SITE, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '자주 묻는 질문',
  description:
    'LED 사이니지 견적·인허가·AS·설치 기간·개인정보 등 자주 묻는 질문을 모았습니다. 왜 범위 견적인지, 옥외 인허가는 어떻게 처리되는지 확인하세요.',
  path: '/faq',
})

export default function FaqPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-faq"
        data={breadcrumbLd([
          { name: '홈', url: SITE.url + '/' },
          { name: 'FAQ', url: SITE.url + '/faq' },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHero
          eyebrow="FAQ"
          title="자주 묻는 질문"
          description="견적·인허가·AS·설치 기간·개인정보까지 — 도입 전에 가장 많이 묻는 질문을 정리했습니다."
          crumbs={[{ name: '홈', href: '/' }, { name: 'FAQ' }]}
        />
        <FaqSection hideHeader />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
