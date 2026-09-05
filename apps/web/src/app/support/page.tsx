import type { Metadata } from 'next'
import Link from 'next/link'
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

        {/* FAQ 본문은 /faq 한 곳에만 둔다. 같은 17문항을 세 페이지에 반복하지 않는다. */}
        <section id="faq" aria-labelledby="support-faq-h" className="wk-sec-sm bg-wk-bgFaint">
          <div className="wk-wrap text-center">
            <h2 id="support-faq-h" className="wk-h2 text-wk-ink">
              그 밖의 질문
            </h2>
            <p className="wk-lead mx-auto mt-5">
              예산 과목, 계약 방식, 전기 인입처럼 결재 전에 걸리는 것들을 따로 정리해 두었습니다.
            </p>
            <Link href="/faq" className="wk-btn-p mt-9 inline-flex">
              자주 묻는 질문 보기
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
