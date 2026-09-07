import type { Metadata } from 'next'
import Link from 'next/link'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { ServiceHero } from '@/components/services/ServiceHero'
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
    '실측부터 사후관리까지 여섯 공정을 우강테크가 직접 합니다. 공정마다 얼마나 걸리고 무엇이 나오는지, 그리고 기관에서 준비하실 게 어디까지인지 미리 적어 뒀습니다.',
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
          description: '공정마다 얼마나 걸리고, 누가 하고, 무슨 서류가 남는지.',
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
        <ServiceHero />

        {/* 요약표가 먼저, 상세는 아코디언. 섹션 자체가 id="process" 를 갖는다 */}
        <ProcessOverview />

        {/* 금액을 가르는 건 화면 크기가 아니라 어디에 어떻게 거느냐다 */}
        <MountTypes />

        {/* A/S 접수 폼은 /support 한 곳에만 둔다. 같은 폼을 두 페이지에 두면
            어디로 접수해야 하는지 고객이 헷갈리고, 문의 경로도 갈린다. */}
        <section aria-labelledby="svc-after-h" className="wk-sec-sm bg-white">
          <div className="wk-wrap text-center">
            <h2 id="svc-after-h" className="wk-h2 text-wk-ink">
              고장은 우강테크가 책임집니다
            </h2>
            <p className="wk-lead mx-auto mt-5">
              화면 전체를 뜯지 않습니다. 원격으로 원인을 먼저 잡고,
              필요하면 가서 해당 모듈만 갈아 끼웁니다.
            </p>
            <Link href="/support" className="wk-btn-p mt-9 inline-flex">
              A/S 접수하기
            </Link>
          </div>
        </section>

        <CtaSection
          title={['현장부터', '보겠습니다']}
          sub={'실측은 무상입니다. 보고 나서 확정 견적과 도면을 드립니다.'}
        />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
