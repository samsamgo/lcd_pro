import type { Metadata } from 'next'
import { ExternalLink, ShieldCheck } from 'lucide-react'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { PageHeader } from '@/components/PageHeader'
import { HELD_CREDENTIALS } from '@/components/public/CompanySummary'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { IMAGES } from '@/lib/imageAssets'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '인증 현황',
  description:
    'KC 인증 제품만 공급합니다. 우강테크 명의 적합등록 번호와 국립전파연구원 조회 방법을 정리했습니다.',
  path: '/about/certification',
})

/**
 * 인증 현황 — **별도 페이지.**
 *
 * 🔴 2026-09-08 CEO 지시 "KC 인증서는 따로 페이지 만들어서 관리".
 *    회사소개 안의 한 섹션이었는데, 서류는 앞으로 계속 늘어나는 항목이라
 *    회사소개에 두면 그 페이지가 서류철이 된다. 여기서 따로 관리한다.
 *
 * 항목을 추가하려면 `components/public/CompanySummary.tsx` 의 `HELD_CREDENTIALS` 에
 * 한 줄 넣으면 된다 — 이 페이지는 손대지 않는다.
 * ⚠️ 개수를 세지 않는다. "2종" 처럼 세면 그 숫자가 작다는 사실만 부각된다.
 * ⚠️ 취득하지 않은 인증을 "진행 중" 으로 적지 않는다. 관공서 상대 허위표기는 제재 사유다.
 */
export default function CertificationPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-certification"
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '회사소개', url: absoluteUrl('/about') },
          { name: '인증 현황', url: absoluteUrl('/about/certification') },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHeader
          group="회사소개"
          title="인증 현황"
          lead="KC 인증 제품만 공급합니다. 인증받지 않은 제품은 취급하지 않습니다."
          image={IMAGES.pageHeaders.certification}
        />

        <section className="wk-sec bg-white" aria-labelledby="cert-h">
          <div className="wk-wrap">
            <h2 id="cert-h" className="sr-only">
              보유 인증
            </h2>
            <p className="wk-lead">
              아래 번호는 국립전파연구원에서 직접 조회하실 수 있습니다.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {HELD_CREDENTIALS.map((c) => (
                <div
                  key={c.no}
                  className="flex h-full flex-col rounded-card border border-wk-line bg-white p-6 lg:p-7"
                >
                  <ShieldCheck size={20} strokeWidth={1.8} className="text-wk-blue" aria-hidden="true" />
                  <p className="mt-4 text-body-lg font-semibold text-wk-ink">{c.title}</p>
                  <p className="mt-1.5 text-label text-wk-ink3">{c.detail}</p>
                  <p className="mt-4 font-mono text-body font-semibold tracking-tight text-wk-ink">
                    {c.no}
                  </p>
                  <p className="mt-1 text-caption text-wk-ink3">
                    {c.issuer} · {c.valid}
                  </p>
                  {c.verify && (
                    <a
                      href={c.verify.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-1.5 pt-5 text-label font-semibold text-wk-cta hover:underline"
                    >
                      {c.verify.label}
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  )}
                </div>
              ))}
            </div>
            <p className="wk-cap mt-5">
              납품 서류에 필요한 인증 자료는 견적 단계에서 함께 드립니다.
            </p>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
