import type { Metadata } from 'next'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { ServiceHero } from '@/components/services/ServiceHero'
import { ProcessScroller } from '@/components/solution/ProcessScroller'
import { ScopeTable } from '@/components/solution/ScopeTable'
import { DocumentList } from '@/components/solution/DocumentList'
import { ServiceRequest } from '@/components/public/ServiceRequest'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd, serviceLd, howToLd } from '@/lib/seo/jsonld'
import { PRICE_RANGE_SCHEMA } from '@/lib/pricing'
import { SITE, absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '공급 범위',
  description:
    '현장 실측부터 제작·시공·인수·사후관리까지 6공정을 우강테크가 직접 수행합니다. 공정별 소요 기간과 산출물, 그리고 발주처가 준비하실 항목의 경계를 그대로 공개합니다.',
  path: '/services',
})

/**
 * 공급 범위(솔루션) 페이지.
 *
 *"저희는 뭐든 다 합니다" 는 경쟁사가 그대로 복사할 수 있는 문장이다(안티패턴 2).
 * 이 페이지의 목적은 담당자가 **과업 범위와 일정을 결재 문서로 옮겨 쓸 수 있게** 하는 것이다.
 *   ① 6공정 각각에서 우리가 무엇을 하고 무엇을 내놓는가 (ProcessScroller)
 *   ② 어디까지가 우리 몫이고 어디부터가 기관 몫인가 (ScopeTable)
 *   ③ 결재에 붙일 서류가 무엇이고 언제 받는가 (DocumentList)
 *   ④ 그래서 지금 무엇을 보내면 되는가 (ServiceRequest)
 */
export default function ServicesPage() {
  return (
    <>
      <JsonLd
        id="ld-services"
        data={serviceLd({
          name: 'LED 전광판 설계 · 제작 · 시공 · 유지보수',
          description:
            '현장 실측, 규격 확정과 제작, 구조 취부 시공, 전기·제어 결선, 인수·교육, 사후관리까지 6공정을 자사에서 직접 수행합니다.',
          serviceType: 'LED 전광판 · 전자현수막 시공',
          priceRange: PRICE_RANGE_SCHEMA,
          url: absoluteUrl('/services'),
        })}
      />
      <JsonLd
        id="ld-services-howto"
        data={howToLd({
          name: 'LED 전광판 공급 6공정',
          description:
            '현장 실측부터 사후관리까지 각 공정의 수행 주체와 산출물.',
          totalTime: 'P45D',
          steps: [
            { name: '현장 실측 · 기본설계', text: '설치 위치에서 시청 거리, 지상고, 전기 인입을 직접 측정해 실측 조서와 설치 위치 도면을 작성합니다.' },
            { name: '규격 확정 · 제작', text: '화소 간격, 화면 크기, 밝기, 방수 등급을 확정하고 캐비닛을 조립해 출고 전 작동 검사를 합니다.' },
            { name: '구조 · 취부 시공', text: '취부 철물을 제작해 기존 구조물에 고정하고 화면 본체를 설치·정렬합니다.' },
            { name: '전기 · 제어 결선', text: '분전반 이후 배선과 접지를 시공하고 제어기를 설치해 네트워크를 설정합니다.' },
            { name: '인수 · 교육', text: '담당자가 직접 문구를 바꿀 수 있도록 교육하고 조작 안내서를 제출합니다.' },
            { name: '사후관리', text: '장애 접수 후 원격 확인, 방문 판정, 모듈 단위 교체, 결과 보고서 제출 순으로 처리합니다.' },
          ],
        })}
      />
      <JsonLd
        id="ld-breadcrumb-services"
        data={breadcrumbLd([
          { name: '홈', url: SITE.url + '/' },
          { name: '공급 범위', url: SITE.url + '/services' },
        ])}
      />

      <NavBar />
      <main id="main">
        <ServiceHero />

        {/* ① 공정별로 무엇을 하고 무엇을 내놓는가 */}
        <div id="process">
          <ProcessScroller />
        </div>

        {/* ② 우리 몫과 기관 몫의 경계 */}
        <ScopeTable />

        {/* ③ 결재에 붙일 서류 */}
        <DocumentList />

        {/* ④ 지금 무엇을 보내면 되는가 */}
        <ServiceRequest />

        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
