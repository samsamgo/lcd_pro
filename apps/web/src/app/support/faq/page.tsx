import type { Metadata } from 'next'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { PageHeader } from '@/components/PageHeader'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { IMAGES } from '@/lib/imageAssets'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'
import { FaqSection } from '@/components/landing/FaqSection'

export const metadata: Metadata = buildMetadata({
  title: '자주 묻는 질문',
  description: '예산·계약·전기·보증·A/S 등 LED 전광판 도입 전에 가장 많이 받는 질문과 답.',
  path: '/support/faq',
})

/** 자주 묻는 질문 — 별도 페이지 (2026-09-09 CEO 지시로 /support 에서 분리). 문항 정본은 FaqSection 한 곳 */
export default function FaqPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-faq"
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '고객지원', url: absoluteUrl('/support') },
          { name: '자주 묻는 질문', url: absoluteUrl('/support/faq') },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHeader
          group="고객지원"
          title="자주 묻는 질문"
          lead="도입 전에 가장 많이 받는 질문을 모았습니다. 없는 질문은 문의 주십시오."
          image={IMAGES.support}
        />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
