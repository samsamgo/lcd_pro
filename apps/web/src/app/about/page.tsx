import type { Metadata } from 'next'
import Link from 'next/link'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { PageHeader } from '@/components/PageHeader'
import { AboutGreeting } from '@/components/about/AboutGreeting'
import { AboutWhy } from '@/components/about/AboutWhy'
import { AboutHistory } from '@/components/about/AboutHistory'
import { CertStrip } from '@/components/about/CertStrip'
import { CompanyOverview } from '@/components/public/CompanyOverview'
import { CompanyCredo } from '@/components/public/CompanyCredo'
import { CompanyLocation } from '@/components/public/CompanyLocation'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { IMAGES } from '@/lib/imageAssets'
import { SITE, absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '회사소개',
  description:
    '대전 대덕구에서 LED 전광판을 설계·제작·시공하고 유지보수합니다. 인사말, 회사 개요, 연혁, 발급받은 인증·서류 원본, 오시는 길.',
  path: '/about',
})

/**
 * 회사소개 — **한 페이지.**
 *
 * 🔴 2026-09-09 CEO 지시로 **처음부터 재설계**했다.
 *    *"회사 소개 페이지부터 다 마음에 안 든다. 기존 것에서 필요한 것만 골라서 재설계.
 *      설치 과정 잡다한 설명·소요기간 없애라. 회사 개요를 케이시스·온빛전자처럼 멋있게.
 *      KC 인증서 PDF 있으니 다른 회사처럼 보여줘라."*
 *
 *    구성 = 인사말(온빛) → 선택 이유 6장(온빛 PERFECT SYSTEM) → 회사 개요 표(케이시스)
 *          → 연혁 → 신조 → 인증·서류 → 오시는 길.
 *
 * 🔴 **여기서 뺀 것 — 되돌리지 마라.**
 *    · `ProcessOverview`(여섯 공정·소요기간) — CEO "설치 과정 잡다한 설명·소요기간 없애라".
 *      회사소개는 '누구인가'를 말하는 페이지지 공정 설명서가 아니다. 파일은 남겼다(참조 0건).
 *    · `CompanyStatement`(다크 여는 장 + 취급 범위 6칸) — 인사말이 여는 장을 맡으면서
 *      같은 자리가 둘이 됐다. 취급 범위 숫자는 /products 가 정본이다. 파일은 남겼다.
 *    · `CompanyOverview` 안의 '하는 일' 사진 4장 — `AboutWhy` 6장과 같은 얘기였다.
 *
 * 섹션 id 는 네비바 하위 메뉴(`lib/subnav.ts` ABOUT_SECTIONS)와 1:1 이고 순서도 같다.
 * 🔴 id 는 **이 파일의 래퍼에만** 둔다. 하위 컴포넌트가 같은 id 를 또 달면 앵커가 갈라진다.
 * `scroll-mt-24` 는 고정 헤더(64) 아래에 섹션 머리가 오게 하는 여유다.
 */
const SEC = 'scroll-mt-24'

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
          lead="대전 대덕구에서 LED 전광판을 설계하고, 만들고, 달고, 고칩니다."
          image={IMAGES.company.hero}
        />

        {/* ① 인사말 */}
        <div id="greeting" className={SEC}>
          <AboutGreeting />
        </div>

        {/* ② 선택해야 하는 이유 — 네비바에는 없는 섹션이다(하위 메뉴는 5개로 묶었다).
            앵커는 옛 `/services` 리다이렉트가 착지할 자리로 남겨 둔다. */}
        <div id="why" className={SEC}>
          <AboutWhy />
        </div>

        {/* ③ 회사 개요 표 */}
        <div id="company" className={SEC}>
          <CompanyOverview />
        </div>

        {/* ④ 연혁 */}
        <div id="history" className={SEC}>
          <AboutHistory />
        </div>

        {/* 신조 — 다크 한 장. CEO 가 직접 가져온 문장이고 '빛나는' 한 어절만 실제로 발광한다.
            자리는 사실(개요·연혁) 다음, 서류(인증) 앞이다. */}
        <CompanyCredo />

        {/* ⑤ 인증·서류 — 전체 갤러리는 /about/certification */}
        <div id="certification" className={SEC}>
          <CertStrip />
        </div>

        {/* ⑥ 오시는 길 */}
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
