import type { Metadata } from 'next'
import Link from 'next/link'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { PageHeader } from '@/components/PageHeader'
import { ServiceRequest } from '@/components/public/ServiceRequest'
import { AfterService } from '@/components/public/AfterService'
import { SymptomGuide } from '@/components/public/SymptomGuide'
import { FaqSection } from '@/components/landing/FaqSection'
import { DownloadList } from '@/components/support/DownloadList'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { RESOURCES } from '@/lib/resources'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { IMAGES } from '@/lib/imageAssets'
import { SITE, absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const metadata: Metadata = buildMetadata({
  title: '고객지원',
  description:
    'A/S 신청, 자주 묻는 질문, 자료실을 한 페이지에 정리했습니다. 장애 접수 시 원격 확인 후 방문 판정과 모듈 교체를 진행합니다.',
  path: '/support',
})

/**
 * 고객지원 — **한 페이지.** 순서는 A/S 신청 → 자주 묻는 질문 → 자료실.
 *
 * 🔴 2026-09-08 CEO 지시 "고객지원은 순서대로. A/S 가 가장 위. 견적 요청은 왜 있느냐(뺐다).
 *    A/S 누르면 A/S 부분으로 이동, 스크롤하면 아래 탭 나오고".
 *    /faq · /support/downloads 는 여기 섹션으로 합쳤고 옛 주소는 redirects 로 온다.
 *    견적 문의는 우측 하단 플로팅 버튼과 페이지 끝 문의 칸이 맡는다 — 메뉴에서 뺐다.
 *
 * 섹션 id(as·faq·downloads)는 각 섹션 요소 자신에게 한 번만 단다. 스크롤 오프셋(`scroll-mt-32`)도
 * 그 요소에 있어야 헤더+하위바(약 120px) 아래에 제목이 온다.
 */

export default function SupportPage() {
  const empty = RESOURCES.length === 0

  return (
    <>
      <JsonLd
        id="ld-breadcrumb-support"
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '고객지원', url: absoluteUrl('/support') },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHeader
          group="고객지원"
          title="고객지원"
          lead="화면이 안 나오면 바로 연락 주십시오. 원격으로 먼저 확인하고, 모듈을 갈아야 하는 건이면 부품을 챙겨 나갑니다."
          image={IMAGES.support}
        />

        {/* ① A/S 신청 — `id="as"` 는 ServiceRequest 의 section 에 있다.
            여기 래퍼에 같은 id 를 또 달면 한 문서에 id 가 둘이 된다(2026-09-08 QA 실측). */}
        <ServiceRequest />
        <AfterService />
        <SymptomGuide />

        {/* ② 자주 묻는 질문 — 본문은 사이트에서 여기 한 곳. `id="faq"` 는 FaqSection 안에 있다 */}
        <FaqSection />

        {/* ③ 자료실 — 파일은 lib/resources.ts. 없으면 없다고 쓰고 요청 경로를 준다 */}
        <section id="downloads" className="scroll-mt-32 wk-sec bg-wk-bg" aria-labelledby="dl-h">
          <div className="wk-wrap">
            <p className="wk-eyebrow">자료실</p>
            <h2 id="dl-h" className="wk-h2 text-wk-ink">
              규격서 · 시공사례집
            </h2>
            <p className="wk-lead mt-4">결재 서류에 첨부하실 자료를 내려받으십시오.</p>
            <div className="mt-8">
              {empty ? (
                <div className="rounded-card border border-wk-line bg-white p-10 text-center md:p-14">
                  <p className="text-body-lg font-semibold text-wk-ink">규격서와 사양 비교표는 요청하시면 보내드립니다</p>
                  <p className="mx-auto mt-3 max-w-[28em] text-label leading-relaxed text-wk-ink3">
                    설치 자리와 필요한 서류를 알려주시면 그 형식에 맞춰 보내드립니다. 전 모델 규격은{' '}
                    <Link href="/products/specs" className="font-semibold text-wk-cta underline-offset-4 hover:underline">규격 비교표</Link>
                    에서 바로 보실 수 있습니다.
                  </p>
                  <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
                    <Link
                      href="/quote"
                      className="rounded-btn bg-wk-cta px-5 py-3 text-sm font-bold text-white transition-colors duration-150 hover:bg-wk-ctaHover"
                    >
                      자료 요청하기
                    </Link>
                    <a
                      href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`}
                      className="rounded-btn border border-wk-line2 px-5 py-3 text-sm font-semibold text-wk-ink2 transition-colors duration-150 hover:bg-wk-bgFaint"
                    >
                      {SITE.phone}
                    </a>
                  </div>
                </div>
              ) : (
                <DownloadList resources={RESOURCES} />
              )}
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
