import type { Metadata } from 'next'

import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { IMAGES } from '@/lib/imageAssets'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { MountTypes } from '@/components/solution/MountTypes'
import { ProcessOverview } from '@/components/solution/ProcessOverview'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd, serviceLd, howToLd } from '@/lib/seo/jsonld'
import { PRICE_RANGE_SCHEMA } from '@/lib/pricing'
import { SITE, absoluteUrl, buildMetadata } from '@/lib/seo/site'
import { SERVICE_STEPS, TOTAL_DURATION_ISO } from '@/lib/serviceProcess'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '공급 범위',
  description:
    '실측부터 사후관리까지 여섯 공정을 우강테크가 직접 합니다. 공정마다 얼마나 걸리고 누가 맡는지, 그리고 기관에서 준비하실 게 어디까지인지 미리 적어 뒀습니다.',
  path: '/services',
})

/**
 * 공급 범위(솔루션) 페이지.
 *
 *"저희는 뭐든 다 합니다" 는 경쟁사가 그대로 복사할 수 있는 문장이다(안티패턴 2).
 * 이 페이지의 목적은 담당자가 **과업 범위와 일정을 결재 문서로 옮겨 쓸 수 있게** 하는 것이다.
 *   ① 6공정을 한 표에서 비교 (ProcessOverview 요약표)
 *   ② 공정마다 실제로 무엇을 하는가 (ProcessOverview 아코디언)
 *   ③ 금액을 가르는 건 크기가 아니라 취부 방식이다 (MountTypes)
 *   ④ 그래서 지금 무엇을 보내면 되는가 (CtaSection)
 *
 * 🔴 이 페이지의 본문 CTA 는 견적 하나로 모은다. A/S 유도 블록을 다시 넣지 말 것.
 *    A/S 는 /support 소관이고, 이 페이지에서는 NavBar 드롭다운과 푸터가 그 길을 맡는다.
 *
 * 🔴 JSON-LD 의 HowTo 스텝은 화면과 같은 배열(lib/serviceProcess.ts)에서 나온다.
 *    2026-09-07 이전에는 여기에 6공정을 손으로 한 번 더 적어 뒀고, 화면 문구를
 *    고치면 구조화 데이터만 옛말로 남았다. 문자열을 다시 복사해 넣지 말 것.
 */
export default function ServicesPage() {
  return (
    <>
      <JsonLd
        id="ld-services"
        data={serviceLd({
          name: 'LED 전광판 설계 · 제작 · 시공 · 유지보수',
          description:
            '현장 실측, 규격 확정과 제작, 취부 시공, 전기·통신 배선, 제어 설정과 시운전 검사, 인계와 유지보수. 여섯 공정을 하청 없이 직접 합니다.',
          serviceType: 'LED 전광판 · 전자현수막 시공',
          priceRange: PRICE_RANGE_SCHEMA,
          url: absoluteUrl('/services'),
        })}
      />
      <JsonLd
        id="ld-services-howto"
        data={howToLd({
          name: 'LED 전광판 공급 6공정',
          description: '공정마다 얼마나 걸리고 누가 하는지.',
          totalTime: TOTAL_DURATION_ISO,
          steps: SERVICE_STEPS.map((s) => ({ name: s.title, text: s.body })),
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
        <PageHeader
          group="회사소개"
          title="설치 과정"
          lead="실측부터 사후관리까지 여섯 공정. 누가 며칠 동안 무엇을 하는지 아래 표에 적었습니다."
          image={IMAGES.servicesHero}
        />

        {/* 요약표가 먼저, 상세는 아코디언. 섹션 자체가 id="process" 를 갖는다 */}
        <ProcessOverview />

        {/* 금액을 가르는 건 화면 크기가 아니라 어디에 어떻게 거느냐다 */}
        <MountTypes />

        {/* 🔴 2026-09-07 접점 정리 (CEO 육안 확인) —
            여기 있던 A/S 유도 섹션('고장은 우강테크가 책임집니다' + 'A/S 접수하기' → /support)을
            없앴다. 바로 아래 CtaSection 과 붙어서 전폭 CTA 블록 두 개가 한 화면에 연달아 떴고,
            목적지도 서로 달라(/support vs /quote) 어디를 눌러야 하는지 갈렸다.
            A/S 는 /support 한 곳이 맡는다(지시③ 원칙).

            리드 경로가 남아 있다는 증명 —
            ① A/S : 이 페이지 상단 NavBar '공급 범위' 드롭다운에 'A/S — 고장 접수와 모듈 교체'
                    → /support 가 그대로 있고, 푸터에도 'A/S 신청' → /support#as 가 있다.
            ② 견적 : 히어로 '무상 실측 신청' → /quote (첫 화면) 과 아래 CtaSection → /quote,
                    그리고 NavBar·MobileCtaBar 의 상시 '견적 요청' 이 남는다.
            즉 이 섹션을 없애도 /services 에서 A/S 로도 견적으로도 갈 길이 남는다. */}
        <CtaSection
          title={['현장부터', '보겠습니다']}
          sub={'실측은 무상입니다. 현장을 보고 나서 확정 견적을 냅니다.'}
        />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
