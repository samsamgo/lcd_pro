import { BrandLockup } from '@/components/brand/BrandLogo'
import { Reveal, RevealImage, RiseMask } from '@/components/motion'

/**
 * 인사말 — 회사소개의 첫 장.
 *
 * 🔴 2026-09-09 CEO 지시 "회사 소개 페이지부터 다 마음에 안 든다. 처음부터 재설계.
 *    회사 개요를 케이시스·온빛전자처럼 멋있게."
 *    온빛전자 인사말(상단 큰 현장 사진 → '○○ 홈페이지를 방문해 주셔서 감사합니다' →
 *    3문단 → 서명)과 케이시스 CEO 인사말(대표 서명 + 사람 말투)을 섞은 구성이다.
 *
 * 구성 규칙
 *  · 상단 비주얼은 **로고 한 장**이다(2026-09-09 CEO 지시로 현장 연출컷을 뺐다).
 *    실적 사진이 없는 상태에서 연출컷을 크게 거는 것보다 브랜드 자산이 정직하다.
 *  · 회사명만 주황(`text-wk-cta`). 나머지는 검정이다. 온빛전자와 같은 처리다.
 *  · 🔴 **개인(대표) 사진·이름·직함은 넣지 않는다.** 인사말 주어는 회사이고
 *    서명은 '우강테크 임직원 일동' 이다.
 *  · 문단에는 실적 수치가 없다. 확인되는 사실(공장·등록·KC)만 말한다.
 */
/**
 * 🔴 2026-09-09 CEO 가 직접 준 문장으로 다시 썼다 — 책임·신뢰 강조.
 *    "설계에서 시작해 현장에서 증명합니다 / 모든 과정을 직접 책임집니다 /
 *     설치는 끝이 아니라 시작입니다 / 끝까지 책임지는 기술" 을 그대로 살리고,
 *    사실(등록·KC)은 근거로만 한 번 붙였다. 지역·공장 자랑으로 여는 문장은 쓰지 않는다.
 */
const PARAGRAPHS = [
  'LED 모듈 선정부터 구조 설계, 제작, 설치, 유지보수까지 모든 과정을 우강테크가 직접 책임집니다. 도면 한 장에서 시작한 일이 현장에서 켜지는 순간까지, 맡는 사람이 바뀌지 않습니다.',
  '설치는 끝이 아니라 시작입니다. 오랫동안 안정적으로 작동하는 전광판을 만들고, 문제가 생겼을 때는 끝까지 책임지는 기술로 답합니다. 정보통신공사업 등록업체로서 직접 시공하고, 전원장치는 KC 적합등록을 받은 것만 씁니다.',
  '단순한 전광판을 넘어, 공간과 사람을 연결하는 디스플레이를 만들겠습니다. 화면 하나를 두고 고민하고 계시다면 연락 주십시오. 자리와 조건을 보고 가장 맞는 답을 드리겠습니다.',
]

export function AboutGreeting() {
  return (
    <section aria-labelledby="greeting-h" className="wk-sec bg-white">
      {/* 여는 장 — 슬로건. 2026-09-09 CEO "BEYOND THE DISPLAY 같은 슬로건도 써가면서".
          두 톤 대제목(검정 + 주황) 아래 CEO 문장 두 줄. 버튼·숫자 없음. */}
      <div className="wk-wrap mb-12 md:mb-16">
        <p className="wk-display leading-[1.02] tracking-[-0.04em]" aria-label="Beyond the display">
          <RiseMask>
            <span className="text-wk-ink">BEYOND</span>
          </RiseMask>
          <RiseMask delay={0.08}>
            <span className="text-wk-ink">THE </span>
            <span className="text-wk-cta">DISPLAY.</span>
          </RiseMask>
        </p>
        <Reveal y={14} delay={0.18}>
          <p className="mt-8 text-h3 font-bold leading-snug tracking-tight text-wk-ink md:text-h2">
            공간에 빛을 더하고, 기술로 완성합니다.
          </p>
        </Reveal>
        <Reveal y={14} delay={0.26}>
          <p className="wk-lead mt-4 max-w-[34em]">
            단순한 전광판을 넘어
            <br />
            공간과 사람을 연결하는 디지털 디스플레이를 만듭니다.
          </p>
        </Reveal>
      </div>

      {/* 로고 띠 — 본문 폭보다 넓게 깔아 첫 장의 무게를 만든다.
          🔴 2026-09-09 CEO "로고나 그런 사진 하나 넣고." 현장 사진(연출컷) 대신
             원본 로고 한 장을 다크 배경에 크게 건다. SVG 를 다시 그리지 마라 —
             `/brand/wk-logo-dark.svg` 원본을 BrandLockup 이 그대로 쓴다. */}
      <RevealImage className="wk-wrap-wide">
        <div className="wk-pixelgrid wk-pixelgrid-coarse relative flex items-center justify-center overflow-hidden rounded-card bg-wk-night py-20 md:py-28">
          <BrandLockup dark height={220} className="relative h-28 w-auto md:h-44" />
        </div>
      </RevealImage>

      <div className="wk-wrap mt-12 md:mt-16">
        <Reveal y={10}>
          {/* 🔴 2026-09-09 CEO "'대표 인사말' 말고 '우강테크 인사말'." 되돌리지 마라 */}
          <p className="wk-eyebrow">우강테크 인사말</p>
        </Reveal>

        <h2 id="greeting-h" className="wk-h2 max-w-[22ch] text-wk-ink">
          <RiseMask delay={0.06}>설계에서 시작해</RiseMask>
          <RiseMask delay={0.14}>
            <span className="text-wk-cta">현장에서 증명</span>합니다
          </RiseMask>
        </h2>

        <div className="mt-9 grid gap-x-12 gap-y-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {PARAGRAPHS.map((p, i) => (
              <Reveal key={i} y={16} delay={0.06 * i}>
                <p className="wk-body mt-5 max-w-[40em] first:mt-0 leading-[1.9]">{p}</p>
              </Reveal>
            ))}

            {/* 서명 — 🔴 2026-09-09 CEO "'대표이사 이희원' 이라는 말도 지우고
                '우강테크 임직원 일동' 이런 식으로." 개인 이름·직함을 다시 넣지 마라. */}
            <Reveal y={14} delay={0.24}>
              <p className="mt-10 border-t border-wk-line pt-7 text-body-lg font-bold text-wk-ink">
                우강테크 임직원 일동
              </p>
            </Reveal>
          </div>

          {/* 우측 — 인사말이 근거로 든 사실만 짧게. 숫자가 아니라 자격이다 */}
          <Reveal className="lg:col-span-4" y={18} delay={0.12}>
            <dl className="rounded-card border border-wk-line bg-wk-bgFaint px-6 py-7">
              {[
                ['공장', '대전 대덕구 자체 공장 (공장등록)'],
                ['시공', '정보통신공사업 등록업체'],
                ['부품', 'KC 적합등록 전원장치'],
                ['연구', '연구개발전담부서 인정'],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4 border-b border-wk-line py-3.5 first:pt-0 last:border-b-0 last:pb-0">
                  <dt className="w-12 shrink-0 text-label font-semibold text-wk-cta">{k}</dt>
                  <dd className="text-label leading-relaxed text-wk-ink2">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
