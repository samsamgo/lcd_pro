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
    '관공서·학교 LED 전광판 도입 전 가장 많이 묻는 질문. 예산 과목 계상, 계약 방법, 전기 인입, 옥외광고물 신고, 담당자 직접 조작, 보증과 A/S 절차를 정리했습니다.',
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
          description="예산 과목 계상부터 계약·전기 인입·사후 관리까지, 담당자가 결재 전에 실제로 막히는 지점만 모았습니다."
          crumbs={[{ name: '홈', href: '/' }, { name: 'FAQ' }]}
        />
        <FaqSection hideHeader />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
