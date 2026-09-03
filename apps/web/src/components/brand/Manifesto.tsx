import { Reveal, SplitText } from '@/components/motion'

/**
 * 선언 섹션 — 회사 소개 한가운데의 다크 장면.
 *
 * 카피 규칙 — 실적을 지어내지 않는다. 동시에 **약점을 자진 신고하지도 않는다.**
 * 묻지 않은 결점을 먼저 꺼내면 읽는 사람은 그 결점만 기억한다.
 * 검증 가능한 사실 중에서 우리가 실제로 다르게 하는 것만 고른다.
 *
 * 라이트 → 다크 → 라이트 전환은 선이 아니라 그라디언트 다리로 잇는다.
 */
const LINES = [
  '실측 없이 확정가를 부르지 않습니다.',
  '규격서 없이 견적서만 내밀지 않습니다.',
  '설치하고 사라지지 않습니다.',
]

export function Manifesto() {
  return (
    <>
      <div className="wk-bridge-down h-24 md:h-32" aria-hidden="true" />

      <section className="wk-sec-xl wk-night" aria-label="우강테크의 원칙">
        <div className="wk-wrap-read">
          <Reveal y={0} duration={0.7}>
            <p className="text-label font-semibold uppercase tracking-widest text-wk-nightMuted">
              우리가 지키는 것
            </p>
          </Reveal>

          <SplitText
            as="h2"
            text={LINES[0]}
            className="wk-display mt-6 text-wk-nightInk"
            delay={0.08}
          />

          <div className="mt-8 flex flex-col gap-4">
            {LINES.slice(1).map((line, i) => (
              <Reveal key={line} delay={0.12 + i * 0.1} y={18}>
                <p className="wk-display text-wk-nightMuted">{line}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.34} y={16}>
            <p className="wk-lead mt-12 !text-wk-nightMuted">
              이 사이트에 적힌 수치는 전부 근거가 있습니다.
              필요하시면 그 근거 문서를 그대로 보내드립니다.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="wk-bridge-up h-24 md:h-32" aria-hidden="true" />
    </>
  )
}
