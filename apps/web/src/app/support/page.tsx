import type { Metadata } from 'next'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { SupportHero } from '@/components/public/SupportHero'
import { AfterService } from '@/components/public/AfterService'
import { ServiceRequest } from '@/components/public/ServiceRequest'
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
  title: '고객센터',
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
          { name: '고객센터', url: absoluteUrl('/support') },
        ])}
      />
      <NavBar />
      <main id="main">
        <SupportHero />
        <ServiceRequest />
        <AfterService />
        <div id="faq">
        </div>
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
