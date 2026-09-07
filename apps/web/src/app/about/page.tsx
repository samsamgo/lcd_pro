import type { Metadata } from 'next'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { CompanyHero } from '@/components/public/CompanyHero'
import { CompanyChapters } from '@/components/public/CompanyChapters'
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
 * 그 사람이 실제로 던지는 질문은 순서가 있다 —
 *   ① 실재하는 회사인가  ② 무엇을 어디까지 하는가  ③ 어디 있고 누구에게 연락하는가.
 *
 *   히어로 → 공정 3장 │ 법인 정보·인증 → 위치 │ 문의
 *   다크     다크      │ 라이트            라이트 │ 다크
 *
 * ─────────────────────────────────────────────────────────────
 * 2026-09-07 (3차) — CEO 세 번째 반려 *"회사 소개가 좀 별로야."*
 *
 * 🔴 앞의 두 번은 **부품을 얹어서** 고치려 했고 두 번 다 반려됐다.
 *    1차: 명암 반전 + AboutContact 신설. 2차: Manifesto 를 고정 장면으로 승격 + CompanyScope 신설.
 *    그래서 3차는 **뺀다.** 7 섹션 → 5 섹션.
 *
 * ① `Manifesto`(원칙 3줄 고정 장면) 배선 해제 — **중복이었다.**
 *    Manifesto 자신의 주석이 자백하고 있었다("01 = 2장과 같은 절차 / 02 = 1장과 같은 얘기 /
 *    03 = 3장 문장을 그대로 쓴다"). 즉 원칙 3줄과 공정 3장은 **같은 말**이고,
 *    독자는 같은 얘기를 두 번 읽었다. 게다가 그 중복에 화면 높이 2.2배의 스크롤을 배정했다 —
 *    정보를 찾으러 온 담당자에게 **새 정보가 0인 구간 2.2화면**은 이탈 구간이다.
 *    같은 말을 두 번 하는 대신 한 번 하고, 그 한 번을 공정 3장이 맡는다.
 *
 * ② `CompanyScope`(큰 활자 지표 밴드) 배선 해제 — **형식과 내용이 어긋났다.**
 *    그룹사 지표 밴드는 "이 회사가 얼마나 큰가"를 묻는 형식인데,
 *    우리가 채운 값은 화소 간격·밝기·IP 등급, 즉 **제품 스펙시트**였다.
 *    형식이 던진 질문에 내용이 답하지 않으면 그게 정확히 '템플릿 흉내'로 읽힌다.
 *    스펙은 /products 의 일이다. (수치 자체는 거짓이 아니었고 파생 인프라
 *    `lib/companyScope.ts` 는 히어로가 계속 쓴다.)
 *
 * ③ **가장 강한 자산을 첫 화면으로 올렸다.** 이 회사가 담당자에게 내밀 수 있는 가장 센 것은
 *    서사가 아니라 **조회되는 번호**다. 그런데 그게 페이지 60% 지점에 가장 작은 활자로 있었다.
 *    히어로 사실 띠 3칸을 카탈로그 값(설립·화소간격·KC건수)에서
 *    **신원 값(사업자등록번호 · KC 적합등록 범위 · 취급 화소 간격)** 으로 바꿨다.
 *    첫 화면에 사업자등록번호를 거는 회사 소개는 흔하지 않다. 그게 이 페이지의 주장이다.
 *
 * 🔴 그대로 둔 것 — 섹션 순서(서사 → 증빙 → 문의)와 명암 기조(다크 기본 · 라이트 섬 하나).
 *    라이트 섬이 마지막 증빙 구간이어야 하는 구조적 이유도 있다:
 *    `AboutContact` 가 자기 앞의 `.wk-bridge-down`(라이트→다크)을 소유하므로
 *    문의 폼 바로 앞 섹션은 반드시 라이트여야 한다.
 *
 * 명암 전환 3곳 (설계계약서 §3) —
 *   ├ 다크→라이트 : CompanyChapters 끝 (CompanyScope 폐기로 다리 소유가 되돌아왔다)
 *   └ 라이트→다크→라이트 : AboutContact 앞뒤 (푸터가 라이트라 뒤쪽 다리가 필요하다)
 *
 * 모션 예산 — StickyScene **0**(1→0, Manifesto 해제) · SplitText 2(히어로 h1 · 공정 h2) ·
 * Magnetic 0. 예산을 쓰지 않고 남겼다. 화려함으로 때우지 않는다.
 * priority 이미지는 히어로 1장뿐이고 이번 개정에서 이미지를 한 장도 늘리지 않았다.
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
        <CompanySummary />
        <CompanyLocation />
        <AboutContact />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
