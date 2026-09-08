import type { Metadata } from 'next'
import Link from 'next/link'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { PageHeader } from '@/components/PageHeader'
import { CompanyStatement } from '@/components/public/CompanyStatement'
import { CompanyOverview } from '@/components/public/CompanyOverview'
import { CompanyCredo } from '@/components/public/CompanyCredo'
import { CompanyLocation } from '@/components/public/CompanyLocation'
import { ProcessOverview } from '@/components/solution/ProcessOverview'
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
 *    · 법인등록번호는 사이트에서 완전히 뺐고, 사업자등록번호는 푸터에만 둔다(CEO 지시 2026-09-08)
 *    · 주소·업무시간 = #location 한 곳 / 'KC 인증 제품만 공급' = #certification 한 곳
 *    · 전화는 요약표(#intro)와 #location 두 곳 — 요약표의 "어떻게 연락하나" 답이라 의도적 예외
 *    · CompanyChapters(공정 3장) 는 배선 해제 — 02·03 본문이 ProcessOverview 의 01·06 공정
 *      문장과 거의 같았고, 같은 페이지에 "하는 일"이 4(사진)·3(장)·6(공정) 세 가지 분할로
 *      놓여 있었다. 4(무엇을) + 6(어떻게) 만 남긴다. 파일은 남겨 둔다(CompanyScope 선례).
 *    · 섹션 id 는 이 파일의 래퍼에만 둔다 — 하위 컴포넌트가 같은 id 를 또 달면 앵커가 갈라진다.
 * `scroll-mt-32` 는 고정 헤더(64) + 고정 탭(56) 아래에 섹션 머리가 오게 하는 여유다.
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
          lead="LED 전광판을 만들고, 달고, 고칩니다."
          image={IMAGES.company.hero}
        />

        {/* ① 회사 소개 — 여는 장(선언 + 취급 범위) → 신조 한 문장 → 하는 일·개요표
            🔴 2026-09-08 CEO "잡다한 거 빼라" — CompanyAtAGlance(요약 3행)를 뺐다.
               '무슨 회사'는 바로 위 선언이, '설치 분야'는 시공사례가, '연락'은 아래 개요표와
               플로팅 버튼이 이미 답한다. 요약이 원본 바로 옆에 붙어 있으면 요약이 아니라 반복이다. */}
        <div id="intro" className={SEC}>
          <CompanyStatement />
          <CompanyOverview />
        </div>

        {/* ② 설치 과정 */}
        {/* 🔴 MountTypes(취부 방식 도해 3종)도 뺐다 — 여섯 공정의 03 취부 시공과 같은 얘기다.
            설치 방식은 실측 후 정해지므로 미리 고르게 할 것이 아니다. 파일은 참조 0건으로 보존. */}
        <div id="process" className={SEC}>
          <ProcessOverview />
        </div>

        {/* 신조 — 2026-09-09 CEO "회사소개는 멋있는 말과 애니메이션 다 때려 넣어서 멋있다고 느끼게".
            09-08 에 잠시 뺐던 CompanyCredo 를 되살린다. 문장은 CEO 가 직접 가져온 것이고
            '빛나는' 한 어절만 실제로 발광하는 연출이라 이 회사가 파는 물건과 같은 단어를 쓴다.
            자리는 공정을 다 읽은 뒤 — 라이트(하는 일·개요·공정) 다음의 다크 한 장, 그 뒤 오시는 길. */}
        <CompanyCredo />

        {/* 🔴 인증 현황은 /about/certification 별도 페이지로 옮겼다(CEO 지시 2026-09-08
            "KC 인증서는 따로 페이지 만들어서 관리"). 서류가 늘어나는 자리라 회사소개 안에 두면
            페이지가 계속 길어진다. 네비바 '회사소개 > 인증 현황' 이 그 페이지를 가리킨다. */}

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
