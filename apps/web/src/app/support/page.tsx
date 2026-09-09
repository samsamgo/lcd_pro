import type { Metadata } from 'next'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { PageHeader } from '@/components/PageHeader'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { IMAGES } from '@/lib/imageAssets'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'
import { ServiceRequest } from '@/components/public/ServiceRequest'
import { AfterService } from '@/components/public/AfterService'
import { SymptomGuide } from '@/components/public/SymptomGuide'

export const metadata: Metadata = buildMetadata({
  title: 'LED 전광판 A/S 신청 — 고장 접수·원격 확인',
  description:
    'LED 전광판 화면이 안 나오거나 색이 이상할 때 접수해 주십시오. 상태를 원격으로 먼저 확인하고, 현장 방문이 필요한지 판정한 뒤 모듈 교체까지 직접 진행합니다.',
  path: '/support',
})

/**
 * 고객지원 — **세 페이지로 분리** (2026-09-09 CEO "자료실 따로, 자주 묻는 질문 따로, A/S 따로.
 * 그래야 더 보기 쉽다. 고객 문의는 데이터로 저장되어야 한다").
 *   /support            A/S 신청 (이 파일)
 *   /support/faq        자주 묻는 질문
 *   /support/downloads  자료실(게시판)
 * 09-08 의 한 페이지·앵커 구성은 폐기했다. 옛 앵커(#faq·#downloads)로 오는 링크는 없다(네비·푸터 전부 교체).
 * A/S 접수는 `/api/lead` 가 카카오워크 알림 + `leads` 테이블 저장을 같이 한다.
 */
export default function SupportPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-support"
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '고객지원', url: absoluteUrl('/support') },
          { name: 'A/S 신청', url: absoluteUrl('/support') },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHeader
          group="고객지원"
          title="A/S 신청"
          lead="화면이 안 나오면 바로 접수해 주십시오. 상태를 원격으로 확인하고, 고장이 나면 빠르게 조치합니다."
          image={IMAGES.support}
        />
        <ServiceRequest />
        <AfterService />
        <SymptomGuide />
        {/* 2026-09-09 CEO 지시 — 고객지원 페이지에서 하단 문의 칸(예산 잡기 전이어도…) 제거 */}
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
