import Image from 'next/image'

import { IMAGES } from '@/lib/imageAssets'
import { Reveal, RiseMask, Stagger } from '@/components/motion'

/**
 * 선택해야 하는 이유 6장.
 *
 * 🔴 2026-09-09 — 온빛전자 홈의 "PERFECT SYSTEM / LED 디스플레이, 온빛전자를 선택해야 하는 이유"
 *    구성을 그대로 가져왔다(브리프 §1). 두 톤 영문 대제목(검정 + 주황) → 사진 카드 → 한 줄.
 *
 * ⚠️ 여섯 항목은 전부 **서류로 확인되는 사실**이다. "최신 기술" "합리적인 가격" 같은
 *    검증 불가능한 자랑을 넣지 마라. 온빛의 카피를 베끼되 우리 사실에 맞춘다(브리프 §0-3).
 * ⚠️ 사진은 캡션 없는 장면 층이다. 각 카드의 사진이 그 항목의 **증거 사진이 아니다** —
 *    제목 아래 한 줄이 근거를 말하고, 사진은 무슨 얘기인지 알아보게만 한다.
 *
 * 사진 출처 — `IMAGES.service[*]` 는 2026-09-09 `ProcessOverview`(여섯 공정)를 회사소개에서
 * 걷어내면서 배선이 풀린 컷이다. 레지스트리(`lib/imageAssets.ts`)는 손대지 않았다.
 */
const REASONS: { t: string; d: string; img: string; alt: string }[] = [
  {
    t: '직접 설계하고 직접 만듭니다',
    d: '대전 대덕구 자체 공장에서 제작합니다 (공장등록 2026.08)',
    img: IMAGES.company.chapter1,
    alt: '작업대에서 LED 모듈 뒷면 회로를 계측기로 점검하는 장면',
  },
  {
    t: '등록된 시공업체가 직접 답니다',
    d: '정보통신공사업 등록 제420573호 · 대전광역시',
    img: IMAGES.service[2],
    alt: '도로변 H형강 지주에 크레인으로 구조물을 세우는 장면',
  },
  {
    t: 'KC 적합등록 부품만 씁니다',
    d: '전원장치(SMPS) 적합등록 R-R-WKTC-LH-200-5P',
    img: IMAGES.service[3],
    alt: '캐비닛 후면에서 전원·신호 배선을 정리하는 장면',
  },
  {
    t: '고장은 원격으로 먼저 봅니다',
    d: '확인한 뒤 필요한 모듈만 한 장 단위로 교체합니다',
    img: IMAGES.company.chapter3,
    alt: '흡착판으로 화면 전면에서 모듈 한 장을 빼내는 장면',
  },
  {
    t: '연구개발전담부서를 두고 있습니다',
    d: '한국산업기술진흥협회 인정 2026.08 · 제어·진단을 직접 개발합니다',
    img: IMAGES.service[4],
    alt: '태블릿으로 전광판 제어 화면을 띄워 점등 상태를 확인하는 장면',
  },
  {
    t: '견적 범위를 그 자리에서 드립니다',
    d: '설치 자리와 원하는 크기만 알려주시면 됩니다',
    img: IMAGES.service[0],
    alt: '레이저 거리계와 태블릿으로 설치 예정 지점을 실측하는 장면',
  },
]

export function AboutWhy() {
  return (
    <section aria-labelledby="why-h" className="wk-sec bg-wk-bgFaint">
      <div className="wk-wrap">
        {/* 두 톤 대제목 — 검정 한 줄 + 주황 한 줄 (온빛전자와 같은 처리) */}
        <h2 id="why-h" className="wk-display leading-[1.06] tracking-[-0.035em]">
          <RiseMask>
            <span className="text-wk-ink">WHY</span>
          </RiseMask>
          <RiseMask delay={0.08}>
            <span className="text-wk-cta">WOOKANG</span>
          </RiseMask>
        </h2>
        <Reveal y={14} delay={0.18}>
          <p className="wk-lead mt-6">
            LED 전광판, 우강테크를 선택해야 하는 이유 여섯 가지입니다.
            전부 서류로 확인되는 것만 적었습니다.
          </p>
        </Reveal>

        <Stagger
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-5"
          y={20}
          gap={0.08}
        >
          {REASONS.map((r, i) => (
            <article key={r.t} className="wk-hov-media h-full overflow-hidden rounded-card border border-wk-line bg-white">
              <div className="relative aspect-[4/3] overflow-hidden bg-wk-ink">
                <Image
                  src={r.img}
                  alt={r.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  className="object-cover"
                />
              </div>
              <div className="px-6 py-6">
                <span className="wk-metric block text-caption font-bold tracking-widest text-wk-cta">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="wk-h3 mt-2 text-wk-ink">{r.t}</h3>
                <p className="mt-2.5 text-label leading-relaxed text-wk-ink3">{r.d}</p>
              </div>
            </article>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
