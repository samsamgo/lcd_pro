import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, ShieldCheck } from 'lucide-react'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { PageHeader } from '@/components/PageHeader'
import { SubNav } from '@/components/SubNav'
import { ABOUT_SECTIONS } from '@/lib/subnav'
import { CompanyAtAGlance } from '@/components/public/CompanyAtAGlance'
import { CompanyOverview } from '@/components/public/CompanyOverview'
import { HELD_CREDENTIALS } from '@/components/public/CompanySummary'
import { CompanyLocation } from '@/components/public/CompanyLocation'
import { ProcessOverview } from '@/components/solution/ProcessOverview'
import { MountTypes } from '@/components/solution/MountTypes'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { IMAGES } from '@/lib/imageAssets'
import { SITE, absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '회사소개',
  description:
    'LED 전광판을 만들고, 달고, 고칩니다. 회사 소개, 설치 과정, 인증 현황, 오시는 길을 한 페이지에 정리했습니다.',
  path: '/about',
})

/**
 * 회사소개 — **한 페이지.**
 *
 * 🔴 2026-09-08 CEO 지시 "회사소개는 한 페이지로 이어지게. 네비바 누르면 해당 위치로 이동,
 *    스크롤하면 아래 네비(탭) 나오고".
 *    /services · /about/certification · /about/location 로 쪼개 뒀던 것을 여기 섹션으로 되돌렸다.
 *    옛 주소는 next.config.mjs 의 redirects 가 이 페이지의 섹션으로 보낸다.
 *
 * 섹션 id 는 네비바 하위 메뉴(SubNav.ABOUT_SECTIONS)와 1:1 — 순서도 같다.
 *
 * 🔴 2026-09-08 QA(한 페이지 통독) — 중복 제거 원칙 = **사실 하나는 한 곳에만.**
 *    · 법인 정보(사업자·법인등록번호) = CompanyOverview 표(#company) 한 곳
 *    · 주소·업무시간 = #location 한 곳 / 'KC 인증 제품만 공급' = #certification 한 곳
 *    · 전화는 요약표(#intro)와 #location 두 곳 — 요약표의 "어떻게 연락하나" 답이라 의도적 예외
 *    · CompanyChapters(공정 3장) 는 배선 해제 — 02·03 본문이 ProcessOverview 의 01·06 공정
 *      문장과 거의 같았고, 같은 페이지에 "하는 일"이 4(사진)·3(장)·6(공정) 세 가지 분할로
 *      놓여 있었다. 4(무엇을) + 6(어떻게) 만 남긴다. 파일은 남겨 둔다(CompanyScope 선례).
 *    · 섹션 id 는 이 파일의 래퍼에만 둔다 — 하위 컴포넌트가 같은 id 를 또 달면 앵커가 갈라진다.
 * `scroll-mt-32` 는 고정 헤더(64) + 고정 탭(56) 아래에 섹션 머리가 오게 하는 여유다.
 */
const SEC = 'scroll-mt-32'

export default function AboutPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-about"
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '회사소개', url: absoluteUrl('/about') },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHeader
          group="회사소개"
          title="회사소개"
          lead="LED 전광판을 만들고, 달고, 고칩니다."
          image={IMAGES.company.hero}
        />
        <SubNav back={{ label: '홈', href: '/' }} items={ABOUT_SECTIONS} />

        {/* ① 회사 소개 */}
        <div id="intro" className={SEC}>
          <CompanyAtAGlance />
          <CompanyOverview />
        </div>

        {/* ② 설치 과정 */}
        <div id="process" className={SEC}>
          <ProcessOverview />
          <MountTypes />
        </div>

        {/* ③ 인증 현황 — 등록번호는 사이트에서 여기에만 둔다. 개수를 세지 않는다 */}
        <section id="certification" className={`${SEC} wk-sec bg-wk-bg`} aria-labelledby="cert-h">
          <div className="wk-wrap">
            <p className="wk-eyebrow">인증 현황</p>
            <h2 id="cert-h" className="wk-h2 text-wk-ink">
              KC 인증 제품만 공급합니다
            </h2>
            <p className="wk-lead mt-4">
              인증받지 않은 제품은 취급하지 않습니다. 아래 번호는 국립전파연구원에서 직접 조회하실 수 있습니다.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {HELD_CREDENTIALS.map((c) => (
                <div key={c.no} className="flex h-full flex-col rounded-card border border-wk-line bg-white p-6 lg:p-7">
                  <ShieldCheck size={20} strokeWidth={1.8} className="text-wk-blue" aria-hidden="true" />
                  <p className="mt-4 text-body-lg font-semibold text-wk-ink">{c.title}</p>
                  <p className="mt-1.5 text-label text-wk-ink3">{c.detail}</p>
                  <p className="mt-4 font-mono text-body font-semibold tracking-tight text-wk-ink">{c.no}</p>
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
            <p className="wk-cap mt-5">납품 서류에 필요한 인증 자료는 견적 단계에서 함께 드립니다.</p>
          </div>
        </section>

        {/* ④ 오시는 길 */}
        <section id="location" className={`${SEC} wk-sec bg-white`} aria-labelledby="loc-h">
          <div className="wk-wrap">
            <p className="wk-eyebrow">오시는 길</p>
            <h2 id="loc-h" className="wk-h2 text-wk-ink">
              {SITE.legalName}
            </h2>
            {/* 주소·업무시간은 아래 카드(CompanyLocation)에만 둔다. 여기는 상호 + 전화만 */}
            <p className="wk-lead mt-4">
              <Link href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`} className="font-semibold text-wk-cta">
                {SITE.phone}
              </Link>
            </p>
          </div>
          <div className="pt-8">
            <CompanyLocation hideHeading />
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
