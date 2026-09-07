import { Reveal, SplitText } from '@/components/motion'

/**
 * 선언 섹션 — 히어로 바로 다음, 사진 없이 타이포와 여백만으로 만드는 장면.
 *
 * 2026-09-07 재작성. 이전 세 줄은 전부 부정문이었다.
 *   "실측 없이 확정가를 부르지 않습니다 / 규격서 없이 견적서만 내밀지 않습니다 /
 *    설치하고 사라지지 않습니다"
 * 셋 다 "우리는 나쁜 짓을 안 한다"는 방어 문장이라, 읽고 나면 남는 것이
 * 우리가 무엇을 하는지가 아니라 업계가 무슨 짓을 하는지다. 같은 사실을 긍정·선언형으로 뒤집었다.
 *
 * 근거 —
 *   1행 CompanyChapters 02(현장 확인 후 규격 확정)와 같은 절차를 말한다.
 *   2행 규격서는 실제 산출물 목록(02 points)에 있다.
 *   3행 기존 03장 문장을 그대로 쓴다. 보증 기간 약속이 아니라 운영 기간을 말한다.
 * 셋 다 우리 절차에 대한 진술이지 실적·수치가 아니다.
 *
 * 이미지를 쓰지 않는다. 실사진이 확보되지 않은 자리는 비우고 여백으로 만든다.
 */
const LINES = [
  '가격은 현장에서 나옵니다.',
  '규격서가 견적서보다 먼저입니다.',
  '설치는 하루, 운영은 10년입니다.',
]

export function Manifesto() {
  return (
    <section className="wk-sec-xl wk-night" aria-label="우강테크의 원칙">
      <div className="wk-wrap">
        <Reveal y={0} duration={0.7}>
          <p className="text-label font-semibold uppercase tracking-widest text-wk-blue">원칙</p>
        </Reveal>

        <div className="mt-10 max-w-[24em]">
          <SplitText
            as="h2"
            text={LINES[0]}
            className="wk-display text-wk-nightInk"
            delay={0.08}
          />

          {LINES.slice(1).map((line, i) => (
            <Reveal key={line} delay={0.16 + i * 0.1} y={18}>
              <p className="wk-display mt-8 border-t border-white/10 pt-8 text-wk-nightMuted">
                {line}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4} y={16}>
          <p className="wk-lead mt-14 !text-wk-nightMuted">
            아래 등록번호는 전부 발급 기관에서 직접 조회됩니다.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
