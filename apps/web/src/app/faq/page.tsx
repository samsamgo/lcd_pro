import type { Metadata } from 'next'
import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { IMAGES } from '@/lib/imageAssets'
import { Footer } from '@/components/Footer'
import { FaqSection } from '@/components/landing/FaqSection'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { SITE, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '자주 묻는 질문',
  description:
    'LED 전광판 도입 전에 확인해야 하는 것들. 가격을 바꾸는 조건, 계약 방법, 전기 인입, 옥외광고물 신고, 담당자 직접 조작, 보증과 A/S를 정리했습니다.',
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
        <PageHeader
          group="고객지원"
          title="자주 묻는 질문"
          lead="예산·계약·전기·보증. 결재 전에 걸리는 것들을 정리했습니다."
          image={IMAGES.faqHero}
        />
        <FaqSection hideHeader />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
