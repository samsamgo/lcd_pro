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
    'LED 전광판 도입 전 가장 많이 묻는 질문. 가격을 바꾸는 조건, 계약 방법, 전기 인입, 옥외광고물 신고, 직접 화면 바꾸기, 보증과 A/S를 정리했습니다.',
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
          description="가격, 계약, 전기, 설치, 고장. 문의 주신 분들이 실제로 가장 많이 물어본 것부터 답했습니다."
          crumbs={[{ name: '홈', href: '/' }, { name: 'FAQ' }]}
        />
        <FaqSection hideHeader />
        <CtaSection
          title={['여기 없는 것은', '직접 답하겠습니다']}
          sub={'전화든 견적 요청이든 편한 쪽으로 남겨 주시면 담당자가 확인합니다.'}
        />
      </main>
      <Footer />
    </>
  )
}
