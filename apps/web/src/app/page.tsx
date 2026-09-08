import type { Metadata } from 'next'
import { PublicHero } from '@/components/public/PublicHero'
import { ProofRow } from '@/components/public/ProofRow'
import { ScrollProgress } from '@/components/public/ScrollProgress'
import { CinematicScene } from '@/components/home/CinematicScene'
import { ProductCategoryGrid } from '@/components/products/ProductCategoryGrid'
import { ProcessStrip, HOME_STEPS } from '@/components/home/ProcessStrip'
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
            '설치 장소와 규모 확인부터 현장 실측, 제작·시공, 담당자 교육과 A/S까지의 절차.',
          totalTime: 'P30D',
          // 화면(ProcessStrip)과 같은 배열 — 구조화 데이터가 화면에 없는 말을 하지 않게 한다
          steps: HOME_STEPS,
        })}
      />
      <JsonLd id="ld-home-breadcrumb" data={breadcrumbLd([{ name: '홈', url: absoluteUrl('/') }])} />

      <ScrollProgress />
      <NavBar />
      <main id="main">
        {/* 관공서 담당자가 확인하는 순서대로 배치한다.
            ① 무엇을 하는 회사인가 → ② 믿을 만한가 → ③ 우리 같은 데 쓰나
            → ④ 설치 후는 어떻게 되나 → ⑤ 서류는 있나 → ⑥ 어떻게 연락하나 */}
        <PublicHero />
        {/* 이 자리는 비워 둔다. 히어로가 이미 사진을 돌리는데 바로 아래에서 슬라이더를
            또 쓰면 같은 말을 두 번 하는 것이다(CEO 반려 2026-09-07).
            SceneSlider.tsx · LedBoard.tsx 는 되돌릴 수 있게 남겨뒀다(참조 0건 = 번들 제외). */}

        {/* ── 라이트: 믿을 만한가 ── */}
        <ProofRow />

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
        {/* 2026-09-08 — ProductShowcase(4개 환경 카드) 대신 카테고리 3장. 네비바·/products 와 같은 이름·같은 사진 */}
        <ProductCategoryGrid showMore />

        {/* 2026-09-08 2차 — 진행 순서 4단계로 홈을 닫는다. 문의 칸이 아니다(ProcessStrip 주석 참조) */}
        <ProcessStrip />

        {/* 🔴 2026-09-08 CEO 지시 "메인 페이지에서 시공사례도 빼라".
            홈은 무엇을 파는 회사인지만 보여주고, 어디에 놓는지는 네비바 '시공사례' 가 맡는다.
            CaseHighlights.tsx 는 참조 0건으로 보존(번들 제외). */}

        {/* 🔴 2026-09-08 CEO 지시로 홈 하단 문의 칸(CtaSection)을 뺐다.
            홈에는 히어로 CTA 와 우측 하단 플로팅 버튼이 이미 있어 같은 요청이 세 번이었다.
            문의 칸은 안쪽 페이지(회사소개·제품·시공사례·고객지원)에만 둔다. */}
        </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
