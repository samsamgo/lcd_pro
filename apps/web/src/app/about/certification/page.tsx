import type { Metadata } from 'next'
import { ShieldCheck, ExternalLink } from 'lucide-react'

import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { IMAGES } from '@/lib/imageAssets'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { HELD_CREDENTIALS } from '@/components/public/CompanySummary'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '인증 현황',
  description:
    'KC 인증 제품만 공급합니다. 우강테크 명의 적합등록 번호와 조회 경로를 정리했습니다.',
  path: '/about/certification',
})

/**
 * 인증 현황 페이지.
 *
 * 🔴 2026-09-08 — 이 페이지를 따로 만든 이유.
 * 등록번호는 홈 첫 화면에 있을 물건이 아니다. 담당자가 결재 서류를 만들 때 찾는 정보이고,
 * 홈에 두면 "인증 개수를 세어 보여주는 회사" 로 읽힌다(CEO 지적). 홈에는
 * "KC 인증 제품만 공급합니다" 한 줄만 두고, 번호는 필요한 사람만 여기로 들어와 본다.
 *
 * 표기 원칙 — 여기서도 개수를 세지 않고, 우리가 못 가진 것을 설명하지 않는다.
 * 번호는 국립전파연구원에서 직접 조회되므로 우리가 서류를 건네지 않아도 검증된다.
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
          lead="KC 인증 제품만 공급합니다. 아래 번호는 국립전파연구원에서 직접 조회하실 수 있습니다."
          image={IMAGES.pageHeaders.certification}
        />

        <section className="wk-sec bg-wk-bg">
          <div className="wk-wrap">
            <div className="grid gap-4 md:grid-cols-2">
              {HELD_CREDENTIALS.map((c) => (
                <div key={c.no} className="flex h-full flex-col rounded-card border border-wk-line bg-white p-6 lg:p-7">
                  <ShieldCheck
                    size={20}
                    strokeWidth={1.8}
                    className="text-wk-blue"
                    aria-hidden="true"
                  />
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
