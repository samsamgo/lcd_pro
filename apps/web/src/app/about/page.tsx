import type { Metadata } from 'next'
import Link from 'next/link'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { PageHeader } from '@/components/PageHeader'
import { AboutSlogan } from '@/components/about/AboutSlogan'
import { AboutGreeting } from '@/components/about/AboutGreeting'
import { AboutWhy } from '@/components/about/AboutWhy'
import { AboutHistory } from '@/components/about/AboutHistory'
import { CertStrip } from '@/components/about/CertStrip'
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
    '공간에 빛을 더하고, 기술로 완성합니다. LED 모듈 선정부터 구조 설계, 제작, 설치, 유지보수까지 모든 과정을 직접 책임지는 우강테크의 인사말, 연혁, 인증·서류, 오시는 길.',
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
 * 🔴 2026-09-09 3차 지시 — "회사소개를 ksys.co.kr 인사말 페이지처럼 멋있게. 슬로건 하나
 *    크게 띄워 줘야 멋있어 보인다." 여는 장을 **슬로건 한 장**(`AboutSlogan`, 다크 풀블리드)으로
 *    독립시키고, 인사말은 좌 헤드라인 / 우 3문단 순차 리빌로 다시 짰다.
 *
 *    구성 = 슬로건 → 인사말 → 신뢰 선언 → 선택 이유 4장 → 연혁 → 인증·서류 → 오시는 길.
 *
 * 🔴 2026-09-09 2차 지시 — "회사 개요 없애고, '우강테크 인사말', 로고 하나 넣고,
 *    '대표이사 이희원' 지우고 '우강테크 임직원 일동'." `CompanyOverview` 배선 해제.
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
          lead="공간에 빛을 더하고, 기술로 완성합니다."
          image={IMAGES.company.hero}
        />

        {/* ① 여는 장 — 슬로건 한 장. 🔴 2026-09-09 CEO "우강테크 메시지 할 때 슬로건 하나
            크게 띄워 줘야 멋있어 보인다." 다크 풀블리드 + 초대형 BEYOND THE DISPLAY.
            옛 인사말 상단의 슬로건·로고 띠가 여기로 옮겨왔다 — 인사말에 다시 넣지 마라. */}
        <AboutSlogan />

        {/* ② 인사말 — 좌 헤드라인 / 우 3문단 순차 리빌 */}
        <div id="greeting" className={SEC}>
          <AboutGreeting />
        </div>

        {/* ③ 신뢰 선언 — 다크 한 장. 2026-09-09 CEO 문장 "설치는 끝이 아니라 시작입니다."
            '시작' 한 어절만 실제로 발광한다.
            🔴 자리를 인사말 바로 뒤로 올렸다(전에는 연혁 뒤). 인사말이 "책임진다"고 말한 직후에
               선언이 오는 게 흐름이 맞고, 슬로건(다크) → 인사말(라이트) → 선언(다크) 으로
               명암이 번갈아 읽힌다. */}
        <CompanyCredo />

        {/* ④ 선택해야 하는 이유 — 네비바에는 없는 섹션이다(하위 메뉴는 4개로 묶었다).
            앵커는 옛 `/services` 리다이렉트가 착지할 자리로 남겨 둔다. */}
        <div id="why" className={SEC}>
          <AboutWhy />
        </div>

        {/* ⑤ 연혁 — 🔴 2026-09-09 CEO "회사소개에서 회사 개요 없애고".
            `CompanyOverview`(회사 개요 표) 배선을 풀었다. 파일은 남겼지만 참조 0건이다.
            `lib/subnav.ts` ABOUT_SECTIONS 의 '회사 개요'(#company) 링크도 같이 뺐다 —
            되살리려면 두 곳을 같이 되살려야 죽은 앵커가 안 생긴다. */}
        <div id="history" className={SEC}>
          <AboutHistory />
        </div>

        {/* ⑥ 인증·서류 — 전체 갤러리는 /about/certification */}
        <div id="certification" className={SEC}>
          <CertStrip />
        </div>

        {/* ⑦ 오시는 길 */}
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
