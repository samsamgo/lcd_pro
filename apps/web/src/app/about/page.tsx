import type { Metadata } from 'next'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { CompanyHero } from '@/components/public/CompanyHero'
import { CompanyChapters } from '@/components/public/CompanyChapters'
import { Manifesto } from '@/components/brand/Manifesto'
import { CompanySummary } from '@/components/public/CompanySummary'
import { CompanyLocation } from '@/components/public/CompanyLocation'
import { AboutClose } from '@/components/about/AboutClose'
import { JsonLd } from '@/components/seo/JsonLd'
import { organizationLd, breadcrumbLd } from '@/lib/seo/jsonld'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'

/**
 * 회사 소개.
 *
 * 독자는 "이 회사에 세금을 써도 되는가" 를 판단하는 담당 공무원이다.
 * 그래서 연혁 나열이 아니라 다음 순서로 읽히게 만든다.
 *
 *   히어로(자리)  → 3개 장(직접 하는 일) → 선언(다크) → 법인 정보·인증 → 위치 → 다음 단계
 *   라이트          라이트                   다크          라이트           라이트   라이트
 *
 * 라이트 두 장 → 다크 한 장 → 라이트 세 장. 매 섹션 체커보드로 칠하지 않는다(벤치마크 §4.2).
 *
 * 모션 예산 — StickyScene 0 · SplitText 2(히어로·선언) · Magnetic 1(마무리 CTA).
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
        <CompanyChapters />
        <Manifesto />
        <CompanySummary />
        <CompanyLocation />
        <AboutClose />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
