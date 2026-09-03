'use client'

import { Marquee } from '@/components/motion'

/**
 * LED 문자 띠.
 *
 * 전광판 회사의 홈이므로 흐르는 띠 자체가 제품 데모다.
 * CSS 애니메이션을 직접 쓰지 않고 Marquee 부품으로 흘린다(이음매·reduced-motion 처리 포함).
 *
 *"화면처럼" 보이게 하는 것은 색이 아니라 픽셀 구조다.
 *   1. 도트 매트릭스 — 4px 격자 위에 검은 마스크를 얹어 발광부를 점으로 끊는다.
 *   2. 세로 갭 — 모듈 사이 1px 라인으로 실제 모듈 조립면을 흉내낸다.
 *   3. 베젤 — 위아래 안쪽 광 테두리로 "면" 이 아니라 "장치" 로 읽히게 한다.
 *
 * 배경은 자체 다크 면이므로 라이트/다크 어느 섹션 사이에 놓아도 읽힌다.
 */
const DOT_MASK =
  'radial-gradient(circle at center, rgba(0,0,0,0.62) 0.9px, transparent 1.15px)'
const MODULE_LINE =
  'linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 100%)'

export function LedTicker({
  items,
  tone = 'amber',
  label = 'LED 전광판에 표출되는 안내 문구 예시',
}: {
  items: string[]
  tone?: 'amber' | 'blue'
  /** 스크린리더용 섹션 설명 */
  label?: string
}) {
  const amber = tone === 'amber'
  const ink = amber ? 'text-[#FFB648]' : 'text-[#6DB4FF]'
  const glow = amber
    ? 'drop-shadow-[0_0_12px_rgba(255,182,72,0.5)]'
    : 'drop-shadow-[0_0_12px_rgba(109,180,255,0.5)]'

  return (
    <section
      aria-label={label}
      className="relative isolate overflow-hidden bg-wk-night"
    >
      {/* 발광 바닥 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: amber
            ? 'radial-gradient(70% 120% at 50% 50%, rgba(255,182,72,.10), transparent 72%)'
            : 'radial-gradient(70% 120% at 50% 50%, rgba(49,130,246,.12), transparent 72%)',
        }}
      />

      <Marquee speed="slow" className="py-5 md:py-7">
        <ul className="m-0 flex list-none items-center gap-10 p-0 pr-10 md:gap-16 md:pr-16">
          {items.map((t) => (
            <li
              key={t}
              className={`whitespace-nowrap text-h3 font-bold tracking-[-0.01em] ${ink} ${glow}`}
            >
              {t}
            </li>
          ))}
        </ul>
      </Marquee>

      {/* 도트 매트릭스 + 모듈 조립선 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage: `${DOT_MASK}, ${MODULE_LINE}`,
          backgroundSize: '4px 4px, 160px 100%',
        }}
      />
      {/* 베젤 — 장치처럼 읽히게 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 border-y border-white/10"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.06), inset 0 -1px 0 rgba(0,0,0,.6)' }}
      />
      {/* 좌우 페이드 — 문구가 화면 밖으로 자연스럽게 빠지게 */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-wk-night to-transparent md:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-wk-night to-transparent md:w-32" />
    </section>
  )
}
