import type { Metadata } from 'next'
import { PublicHero } from '@/components/public/PublicHero'
import { ScrollProgress } from '@/components/public/ScrollProgress'
import { WhyWookang } from '@/components/home/WhyWookang'
import { ProofCards } from '@/components/home/ProofCards'
import { CinematicScene } from '@/components/home/CinematicScene'
import { ProductIntro } from '@/components/home/ProductIntro'
import { ProcessStrip, HOME_STEPS } from '@/components/home/ProcessStrip'
import { CaseHighlights } from '@/components/home/CaseHighlights'
import { ScrollBridge } from '@/components/motion'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { JsonLd } from '@/components/seo/JsonLd'
import { serviceLd, howToLd, breadcrumbLd } from '@/lib/seo/jsonld'
import { SITE, absoluteUrl, buildMetadata } from '@/lib/seo/site'
import { PRICE_RANGE_SCHEMA } from '@/lib/pricing'

export const metadata: Metadata = buildMetadata({
  title: `${SITE.nameKo} | LED 전광판 · 전자현수막 설계·제작·시공`,
  description:
    'LED 전광판과 전자현수막을 설계·제작·시공하고 A/S까지 직접 합니다. 실내 안내판부터 옥외 전자현수막까지, 관공서·학교·상업시설 현장에 맞춰 규격을 잡아 드립니다.',
  path: '/',
})

export default function Home() {
  return (
    <>
      <JsonLd
        id="ld-home-service"
        data={serviceLd({
          name: 'LED 전광판·전자현수막 설계·제작·시공·유지보수',
          description:
            'LED 전광판과 전자현수막. 실측과 설계, 제작, 시공, A/S까지 한 곳에서 합니다.',
          serviceType: 'LED 전광판 · 전자현수막',
          priceRange: PRICE_RANGE_SCHEMA,
          url: absoluteUrl('/'),
        })}
      />
      <JsonLd
        id="ld-home-howto"
        data={howToLd({
          name: 'LED 전광판 도입 절차',
          description:
            '문의와 현장 실측, 제작·시공, 설치 후 A/S까지의 절차.',
          // 화면(ProcessStrip)과 같은 배열 — 구조화 데이터가 화면에 없는 말을 하지 않게 한다.
          // 🔴 소요기간(totalTime)은 2026-09-09 CEO 지시로 뺐다. 다시 넣지 마라(jsonld.ts 주석 참조).
          steps: HOME_STEPS,
        })}
      />
      <JsonLd id="ld-home-breadcrumb" data={breadcrumbLd([{ name: '홈', url: absoluteUrl('/') }])} />

      <ScrollProgress />
      <NavBar />
      <main id="main">
        {/* 🔴 2026-09-09 CEO 지시로 홈 구조를 온빛전자·케이시스 순서로 재정비했다
            (재설계 브리프 `teams/web/reports/redesign-brief-20260909.md`).

              Hero            무엇을 하는 회사인가
              WhyWookang      온빛 'PERFECT SYSTEM' — 왜 우리인가, 사진 4장
              ProofCards      케이시스 '숫자로 증명' 자리 — 숫자가 없으니 서류 3장
              CinematicScene  제품 서사(화소 간격 → 화면 크기 → 유지보수)
              ProductIntro    무엇을 파는가 (제품 렌더)
              CaseHighlights  어디에 쓰이나 (WS-D 소유)
              ProcessStrip    문의 → 실측 → 시공 → A/S 네 단어로 닫는다

            ⚠️ 케이시스의 '캐비닛 분해도(3D)' 자리는 **만들지 않았다.** 실제 분해 렌더가
               없기 때문이다. 없는 그림을 그려 채우지 않는다. 카탈로그 렌더 정리가 끝나
               분해도가 확보되면 그때 COO 가 배선한다. */}
        <PublicHero />
        {/* 이 자리는 비워 둔다. 히어로가 이미 사진을 돌리는데 바로 아래에서 슬라이더를
            또 쓰면 같은 말을 두 번 하는 것이다(CEO 반려 2026-09-07).
            SceneSlider.tsx · LedBoard.tsx 는 되돌릴 수 있게 남겨뒀다(참조 0건 = 번들 제외). */}

        {/* ── 라이트: 왜 우리인가 (사진 4장) ── */}
        <WhyWookang />

        {/* ── 라이트: 믿을 만한가 (서류 3장) ──
            2026-09-09 ProofRow(주장 4칸)를 ProofCards(서류 3장)로 교체했다.
            ProofRow.tsx 는 되돌릴 수 있게 남겼다 — 참조 0건이라 번들에는 들어가지 않는다. */}
        <ProofCards />

        {/* 라이트 → 다크는 선이 아니라 그라디언트 다리로 잇는다 (벤치마크 §4.2)
            2026-09-07 — 이 다리는 페이지에서 가장 눈에 띄는 전환부인데 그냥 색면이었다.
            스크롤에 맞춰 화소 격자가 켜졌다 꺼지게 했다(ScrollBridge). 코드로 그리므로
            전송량 0, 이미지 진위 문제 0. 사진이 필요한 자리가 아니다. */}
        <ScrollBridge
          direction="down"
          className="h-20 bg-gradient-to-b from-white to-wk-night md:h-28"
        />

        {/* ── 다크: 제품을 체험시키는 장 ──
            🔴 2026-09-08 디자인 정리 — 여기 있던 ScrollStatement("한 해 버려지는 현수막 5,400톤")를
            뺐다. 광고대행사 매니페스토 어투는 CEO 가 지적한 "AI 냄새" 의 진원이었고,
            바로 아래 시네마틱 3막과 **같은 다크 면에서 큰 활자로 두 번** 말하고 있었다.
            큰 연출은 페이지에 하나면 된다. 시네마틱 장이 그 하나다. */}
        <CinematicScene />

        <ScrollBridge
          direction="up"
          className="h-20 bg-gradient-to-b from-wk-night to-white md:h-28"
        />

        {/* ── 라이트: 무엇을 파는가 ──
            다크 구간(ScrollStatement + CinematicScene)에서 나와 밝은 면으로 돌아온다.
            규격을 읽는 자리는 서류처럼 밝아야 한다. 빛을 파는 회사라고 화면 전체를 검게
            칠하지 않는다 — 빛은 어둠이 있어야 빛이다.

            2026-09-08 — 이 아래 있던 ScreenGallery·ProcessTimeline·FaqSection 세 섹션을
            걷어냈다. 2026-09-08 시공사례 미리보기까지 빼면서 이 구간은 **제품 → 문의** 두 걸음이다.
            홈에서 끝내지 않고 안쪽 페이지로 보내는 것이 목적이다. */}
        {/* 🔴 2026-09-09 CEO 지시 "메인 페이지 제품 부분은 온빛전자처럼 제품(렌더)으로 넣어봐.
            사진 같은 이상한 설명 지우고 제대로 된 이미지 써". 카테고리 사진 카드(ProductCategoryGrid)를
            제품 렌더 4장(ProductIntro)으로 갈아 끼웠다. ProductCategoryGrid.tsx 는 남겨 뒀다
            (참조 0건 = 번들 제외). */}
        <ProductIntro />

        {/* 🔴 2026-09-09 CEO 지시 "시공사례는 넣어야 해. 우리가 한 게 아니더라도." — 09-08 에 뺐던 자리 복원.
            타사 6곳 전부 홈에 시공사례가 있다. 두 줄 마퀴로 흐르게 해 /industries 격자와 형식을 달리한다. */}
        <CaseHighlights />

        {/* 2026-09-09 — 네 단어(문의 → 실측 → 시공 → A/S) 띠로 홈을 닫는다.
            설명·소요기간은 CEO 지시로 전부 뺐다. 문의 칸이 아니다(ProcessStrip 주석 참조) */}
        <ProcessStrip />

        {/* 🔴 2026-09-08 CEO 지시로 홈 하단 문의 칸(CtaSection)을 뺐다.
            홈에는 히어로 CTA 와 우측 하단 플로팅 버튼이 이미 있어 같은 요청이 세 번이었다.
            문의 칸은 안쪽 페이지(회사소개·제품·시공사례·고객지원)에만 둔다. */}
        </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
