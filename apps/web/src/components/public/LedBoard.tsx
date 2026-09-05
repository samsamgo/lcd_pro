'use client'

import { useEffect, useState } from 'react'
import { LedSwap } from '@/components/motion'

/**
 * LED 안내판 — 홈 히어로 바로 아래의 시그니처 요소.
 *
 * 왜 흐르는 띠(LedTicker)를 걷어냈나
 * ---------------------------------
 * 흐르는 띠는 어느 사이트에나 있는 "뉴스 티커"로 읽힌다. 우리 제품이 아니다.
 * 실제 관공서·학교 전광판은 문구가 흐르지 않고 **바뀐다.** 한 대를 걸어두고
 * 대기번호였다가, 급식 안내였다가, 재난 문구가 된다. 그게 이 물건의 전부다.
 * 그래서 이 자리는 "제품 설명"이 아니라 **제품 그 자체**여야 한다.
 *
 * 화면처럼 보이게 하는 것은 색이 아니라 픽셀 구조다 (LedTicker에서 검증된 방식).
 *   1. 도트 매트릭스 — 격자 위 검은 마스크로 발광부를 점으로 끊는다
 *   2. 모듈 조립선 — 세로 1px 라인으로 실제 모듈 이음매를 흉내낸다
 *   3. 베젤 — 안쪽 광 테두리로 "면"이 아니라 "장치"로 읽히게 한다
 *
 * 전환은 슬라이드가 아니라 LedSwap(어두워졌다 밝아짐)이다. 화면 갈리는 순간을 흉내낸다.
 * 모션이 꺼진 환경에서는 전환 없이 문구만 바뀐다 — 정보가 모션에 기대지 않는다.
 */

type Slot = {
  /** 어디에 걸린 화면인가 */
  place: string
  /** 그 화면에 지금 떠 있는 문구 */
  message: string
}

const SLOTS: Slot[] = [
  { place: '시청 민원실', message: '대기 12번 · 3번 창구로 오세요' },
  { place: '초등학교 정문', message: '오늘 급식 · 돈까스, 미역국' },
  { place: '군청 앞 도로', message: '호우주의보 · 하천 진입 금지' },
  { place: '고등학교 강당', message: '제32회 졸업식 · 10시 시작' },
  { place: '구청 로비', message: '여권 발급 2층 · 민원 접수 1층' },
]

const HOLD_MS = 2600

const DOT_MASK =
  'radial-gradient(circle at center, rgba(0,0,0,0.62) 0.9px, transparent 1.15px)'
const MODULE_LINE =
  'linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 100%)'

export function LedBoard() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % SLOTS.length), HOLD_MS)
    return () => clearInterval(t)
  }, [])

  const slot = SLOTS[i]

  return (
    <section
      aria-label="같은 전광판 한 대에 상황에 따라 다른 안내가 표시되는 예시"
      className="relative isolate overflow-hidden bg-wk-night"
    >
      {/* 발광 바닥 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(70% 130% at 50% 50%, rgba(255,182,72,.12), transparent 72%)',
        }}
      />

      <div className="wk-wrap py-9 md:py-14">
        <div className="flex min-h-[4.5rem] flex-col items-center gap-2.5 text-center md:min-h-[6rem] md:gap-3.5">
          <LedSwap index={i}>
            <p className="wk-cap !text-[#FFB648]/70">{slot.place}</p>
            <p
              className="mt-2 text-h3 font-bold tracking-[-0.01em] text-[#FFB648] md:text-h2"
              style={{ textShadow: '0 0 18px rgba(255,182,72,.45)' }}
            >
              {slot.message}
            </p>
          </LedSwap>
        </div>

        {/* 지금 몇 번째 화면인지 — 점 대신 모듈 칸처럼 */}
        <div
          aria-hidden="true"
          className="mt-7 flex justify-center gap-1.5 md:mt-9"
        >
          {SLOTS.map((s, n) => (
            <span
              key={s.place}
              className={`h-1 w-7 rounded-[1px] transition-colors duration-300 ${
                n === i ? 'bg-[#FFB648]/80' : 'bg-white/15'
              }`}
            />
          ))}
        </div>
      </div>

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
        style={{
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,.06), inset 0 -1px 0 rgba(0,0,0,.6)',
        }}
      />
    </section>
  )
}
