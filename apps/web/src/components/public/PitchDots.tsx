import type { CSSProperties } from 'react'

/**
 * 화소 간격을 **같은 배율로 그린** 도해.
 *
 * 왜 코드로 그리나 (2026-09-07) —
 * "화소 간격 2.5mm 와 6mm 는 무엇이 다른가" 는 이 회사가 가장 많이 설명해야 하는 것인데,
 * 사이트에는 그걸 보여주는 그림이 하나도 없었다. 표에 숫자만 있었다.
 * 그렇다고 사진으로 보여줄 수도 없다 — 모듈 표면 매크로 실사는 우리에게 두 장뿐이고
 * (구조정본 §17-E), 그마저 특정 피치의 실물이 아니라 "무엇이 몇 mm 인지" 를 증명하지 못한다.
 * 근거가 되지 못하는 사진보다 **정확한 도해**가 낫다. 전송량 0, 진위 문제 0.
 *
 * 정직성 —
 * 실제 크기가 아니라 **간격의 비율**만 참이다(1mm = PX_PER_MM 픽셀). 세 장을 같은 배율로
 * 그리므로 "2.5 는 6 보다 2.4배 촘촘하다" 는 눈으로 읽히는 그대로 맞다.
 * 화면에도 그렇게 적는다. 배율을 그림마다 바꾸면 그 순간 거짓말이 된다.
 *
 * 구현 — 새 격자를 또 만들지 않고 전역 `.wk-pixelgrid` 를 변수로 조종한다(§17-B).
 * 마스크만 통짜로 덮어 가장자리가 사라지지 않게 한다(여기서는 격자가 장식이 아니라 내용이다).
 */

/**
 * 1mm 를 몇 px 로 그리는가.
 * 🔴 **한 그림 묶음 안에서는 반드시 같은 값**이어야 비교가 성립한다.
 *    묶음이 달라지면(큰 도해 vs 표 안 미니 도해) 값이 달라도 되지만,
 *    같은 표·같은 줄에 배율이 다른 두 그림을 나란히 두지 마라. 그 순간 거짓말이 된다.
 */
const PX_PER_MM = 5

export function PitchDots({
  pitchMm,
  pxPerMm = PX_PER_MM,
  className = '',
}: {
  pitchMm: number
  /** 좁은 자리(표 안 미니 도해)에서는 배율을 낮춘다. 한 묶음 안에서는 같은 값을 쓸 것 */
  pxPerMm?: number
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      /* 모서리 반경은 부르는 쪽이 정한다 — 큰 도해와 표 안 미니 도해의 크기가 다르다 */
      className={`wk-pixelgrid relative overflow-hidden bg-wk-night ${className}`}
      style={
        {
          '--wk-cell': `${(pitchMm * pxPerMm).toFixed(2)}px`,
          '--wk-dot': '.92',
          /* 피치가 커지면 알갱이도 커진다. 간격의 18% — 실제 모듈의 개구율에 가깝다 */
          '--wk-dotr': `${Math.max(1, pitchMm * pxPerMm * 0.18).toFixed(2)}px`,
          /* 통짜 마스크. 기본값은 가장자리를 지우는데, 여기서는 격자 자체가 내용이다 */
          '--wk-pixelmask': 'linear-gradient(#000, #000)',
        } as CSSProperties
      }
    />
  )
}
