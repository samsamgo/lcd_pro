import { Reveal, RiseMask } from '@/components/motion'

/**
 * 인사말 — 여는 장(`AboutSlogan`) 바로 다음 장.
 *
 * 🔴 2026-09-09 CEO 지시로 케이시스 인사말 페이지 구조를 따라 다시 짰다.
 *    좌측에 큰 한글 헤드라인 두 줄, 우측에 세 문단. 문단은 **한 문단씩 순차로 떠오른다**
 *    (CEO "창 열리고 이런 문구들 너무 좋다" = 스크롤에 맞춰 열리는 리빌 연출).
 *
 * 🔴 **여기서 뺀 것 — 되돌리지 마라.**
 *    · 슬로건(BEYOND THE DISPLAY)·로고 띠 → `AboutSlogan` 으로 옮겼다. 두 장이 같은 말을 하면 안 된다.
 *    · 우측 dl(공장/시공/부품/연구 4행) → 삭제. CEO "'대전 대덕구 자체 공장에서 제작합니다
 *      (공장등록 2026.08)' 같은 설명 빼라." 자격 나열은 인증·서류 섹션(`CertStrip`)이 맡는다.
 *
 * 구성 규칙
 *  · 🔴 **개인(대표) 사진·이름·직함은 넣지 않는다.** 주어는 회사, 서명은 '우강테크 임직원 일동'.
 *  · 문단에 실적 수치를 넣지 않는다. 확인되는 사실만 말한다.
 */
const PARAGRAPHS = [
  'LED 모듈 선정부터 구조 설계, 제작, 설치, 유지보수까지 모든 과정을 우강테크가 직접 책임집니다. 도면 한 장에서 시작한 일이 현장에서 켜지는 순간까지, 맡는 사람이 바뀌지 않습니다.',
  '설치는 끝이 아니라 시작입니다. 오랫동안 안정적으로 작동하는 전광판을 만들고, 문제가 생겼을 때는 끝까지 책임지는 기술로 답합니다.',
  '단순한 전광판을 넘어, 공간과 사람을 연결하는 디스플레이를 만들겠습니다. 화면 하나를 두고 고민하고 계시다면 연락 주십시오. 자리와 조건을 보고 가장 맞는 답을 드리겠습니다.',
]

export function AboutGreeting() {
  return (
    <section aria-labelledby="greeting-h" className="wk-sec-lg bg-white">
      <div className="wk-wrap">
        <Reveal y={10}>
          {/* 🔴 2026-09-09 CEO "'대표 인사말' 말고 '우강테크 인사말'." 되돌리지 마라 */}
          <p className="wk-eyebrow">우강테크 인사말</p>
        </Reveal>

        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
          {/* 좌 — 큰 한글 헤드라인 두 줄. 마스크 리빌로 아래에서 열린다 */}
          <div className="lg:col-span-5">
            <h2 id="greeting-h" className="wk-h1 max-w-[12ch] leading-[1.18] text-wk-ink">
              <RiseMask delay={0.06}>설계에서 시작해</RiseMask>
              <RiseMask delay={0.16}>
                <span className="text-wk-cta">현장에서 증명</span>합니다
              </RiseMask>
            </h2>
          </div>

          {/* 우 — 세 문단. 딜레이 0.12 간격으로 한 문단씩 fade-up */}
          <div className="lg:col-span-7">
            {PARAGRAPHS.map((p, i) => (
              <Reveal key={i} y={20} delay={0.12 * i}>
                <p className="wk-body mt-7 max-w-[40em] leading-[1.95] first:mt-0">{p}</p>
              </Reveal>
            ))}

            {/* 서명 — 🔴 2026-09-09 CEO "'대표이사 이희원' 이라는 말도 지우고
                '우강테크 임직원 일동' 이런 식으로." 개인 이름·직함을 다시 넣지 마라. */}
            <Reveal y={14} delay={0.42}>
              <p className="mt-12 border-t border-wk-line pt-7 text-body-lg font-bold text-wk-ink">
                우강테크 임직원 일동
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
