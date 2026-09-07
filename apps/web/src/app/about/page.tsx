import type { Metadata } from 'next'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { CompanyHero } from '@/components/public/CompanyHero'
import { CompanyChapters } from '@/components/public/CompanyChapters'
import { Manifesto } from '@/components/brand/Manifesto'
import { CompanySummary } from '@/components/public/CompanySummary'
import { CompanyLocation } from '@/components/public/CompanyLocation'
import { AboutContact } from '@/components/about/AboutContact'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationLd, breadcrumbLd } from '@/lib/seo/jsonld'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'

/**
 * 회사 소개.
 *
 * 독자는 "이 회사에 세금을 써도 되는가" 를 판단하는 담당 공무원이다.
 * 그래서 연혁 나열이 아니라 다음 순서로 읽히게 만든다.
 *
 *   히어로 → 원칙 선언 → 공정 3장 │ 법인 정보·인증 → 위치 │ 연락처
 *   다크     다크        다크      │ 라이트            라이트 │ 다크
 *
 * 2026-09-07 재설계 (CEO 반려 반영) —
 * 이전에는 라이트가 기본이고 다크가 예외라 장면이 산만했다. 뒤집었다.
 * 다크가 바탕이고, 라이트는 "결재에 옮겨 적을 사실"을 모아 둔 가운데 한 덩어리뿐이다.
 * 라이트 섬 하나가 오히려 그 두 섹션을 서류처럼 도드라지게 한다.
 * 명암 전환 세 곳은 전부 `.wk-bridge-*` 그라디언트 다리로 잇는다(설계계약서 §3).
 *   ├ 다크→라이트 : CompanyChapters 끝
 *   └ 라이트→다크→라이트 : AboutContact 앞뒤 (푸터가 라이트라 뒤쪽 다리가 필요하다)
 *
 * 모션 예산 — StickyScene 0 · SplitText 2(히어로 h1·원칙 첫 줄) · Magnetic 1(견적 CTA).
 * 예산 안에서만 쓴다. 화려함으로 때우지 않는다.
 * priority 이미지는 히어로 1장뿐이다.
 */
export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '회사 소개',
  description:
    '주식회사 우강테크는 관공서·학교 LED 전광판을 설계·제작·시공·유지보수합니다. 법인 등기 정보와 KC 적합등록 번호를 그대로 공개합니다.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <JsonLd id="ld-org-about" data={organizationLd()} />
      <JsonLd
        id="ld-breadcrumb-about"
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '회사 소개', url: absoluteUrl('/about') },
        ])}
      />
      <NavBar />
      <main id="main">
        <CompanyHero />
        <Manifesto />
        <CompanyChapters />
        <CompanySummary />
        <CompanyLocation />
        <AboutContact />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
