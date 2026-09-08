import type { Metadata } from 'next'
import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { IMAGES } from '@/lib/imageAssets'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { SymptomGuide } from '@/components/public/SymptomGuide'
import { AfterService } from '@/components/public/AfterService'
import { ServiceRequest } from '@/components/public/ServiceRequest'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'

/**
 * 고객센터.
 *
 * 설치 후 담당자가 찾는 것을 한 곳에 모은다.
 *   ① A/S 신청 ② 처리 절차 ③ 자주 묻는 질문
 *
 * 신규 문의(견적)와 설치 후 문의(장애)는 성격이 다르다.
 * 견적은 /quote, 장애는 여기로 나눈다.
 */
export const metadata: Metadata = buildMetadata({
  title: 'A/S 신청',
  description:
    'LED 전광판 A/S 신청과 처리 절차, 자주 묻는 질문을 안내합니다. 장애 접수 시 원격 확인 후 방문 판정과 부품 교체를 진행합니다.',
  path: '/support',
})

export default function SupportPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-support"
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: 'A/S 신청', url: absoluteUrl('/support') },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHeader
          group="고객지원"
          title="A/S 신청"
          lead="화면이 안 나오면 바로 연락 주십시오. 원격으로 먼저 확인하고, 모듈을 갈아야 하는 건이면 부품을 챙겨 나갑니다."
          image={IMAGES.support}
        />
        <ServiceRequest />
        <AfterService />

        {/* 전화 걸기 전에 스스로 가늠할 수 있게 — 출동이 줄고 접수 정확도가 오른다 */}
        <SymptomGuide />

        <CtaSection
          title={['A/S 문의는', '이 번호로 주십시오']}
          sub={'접수 폼이 번거로우시면 전화로 바로 접수하셔도 됩니다.'}
        />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
