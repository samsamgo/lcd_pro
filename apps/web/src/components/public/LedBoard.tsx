'use client'

import { useEffect, useState } from 'react'
import { LedSwap } from '@/components/motion'

/**
 * LED 안내판 — 홈 히어로 바로 아래의 시그니처 요소.
 *
 * 왜 흐르는 띠가 아닌가
 * --------------------
 * 흐르는 띠는 어느 사이트에나 있는 "뉴스 티커"로 읽힌다. 우리 제품이 아니다.
 * 실제 전광판은 흐르지 않고 **바뀐다.** 한 대를 걸어두고 대기번호였다가,
 * 급식 안내였다가, 재난 문구가 된다. 그게 이 물건의 전부다.
 *
 * 왜 한 줄이 아닌가 (CEO 지적 2026-09-06)
 * --------------------------------------
 * 첫 판은 흰 글자 한 줄이었다. 실제 전광판은 그렇게 안 나온다.
 * 큰 숫자, 색, 여러 줄, 시계 — 화면을 꽉 채워 쓴다. TV 자막도 그렇다.
 * 그래서 슬롯마다 **레이아웃 자체를 다르게** 가져간다.
 *   number  — 대기번호처럼 숫자가 주인공
 *   list    — 급식·일정처럼 여러 줄
 *   alert   — 재난 문구처럼 색이 경고로 바뀐다
 *   notice  — 행사 안내처럼 제목 + 부제
 *
 * 화면처럼 보이게 하는 것은 색이 아니라 픽셀 구조다.
 *   1. 도트 매트릭스 — 격자 위 검은 마스크로 발광부를 점으로 끊는다
 *   2. 모듈 조립선 — 세로 1px 라인으로 실제 모듈 이음매를 흉내낸다
 *   3. 베젤 — 안쪽 광 테두리로 "면"이 아니라 "장치"로 읽히게 한다
 *
 * 전환은 LedSwap(어두워졌다 밝아짐). 모션이 꺼진 환경에서는 전환 없이 내용만 바뀐다.
 */

type Slot =
  | { kind: 'number'; place: string; label: string; value: string; unit: string; note: string }
  | { kind: 'list'; place: string; title: string; items: string[] }
  | { kind: 'alert'; place: string; badge: string; message: string; note: string }
  | { kind: 'notice'; place: string; title: string; sub: string; note: string }

const SLOTS: Slot[] = [
  {
    kind: 'number',
    place: '시청 민원실',
    label: '대기',
    value: '12',
    unit: '번',
    note: '3번 창구로 오세요',
  },
  {
    kind: 'list',
    place: '초등학교 정문',
    title: '오늘 급식',
    items: ['돈까스', '미역국', '깍두기', '요구르트'],
  },
  {
    kind: 'alert',
    place: '군청 앞 도로',
    badge: '호우주의보',
    message: '하천 진입 금지',
    note: '오후 6시 기준 · 대전기상청',
  },
  {
    kind: 'notice',
    place: '고등학교 강당',
    title: '제32회 졸업식',
    sub: '10:00 · 3학년 학부모님 2층',
    note: '주차는 후문을 이용해 주세요',
  },
  {
    kind: 'list',
    place: '구청 로비',
    title: '층별 안내',
    items: ['1F 민원접수', '2F 여권발급', '3F 세무과', '4F 건축과'],
  },
]

const HOLD_MS = 3400

const DOT_MASK =
  'radial-gradient(circle at center, rgba(0,0,0,0.62) 0.9px, transparent 1.15px)'
const MODULE_LINE =
  'linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 100%)'

/** 전광판 발광색. 경고는 실제 현장처럼 붉게 간다 */
const AMBER = '#FFB648'
const RED = '#FF5A4E'
const GREEN = '#5BE39A'

function glow(hex: string, px = 18, a = 0.45) {
  return { color: hex, textShadow: `0 0 ${px}px ${hex}${Math.round(a * 255).toString(16)}` }
}

function Body({ slot }: { slot: Slot }) {
  if (slot.kind === 'number') {
    return (
      <div className="flex flex-col items-center gap-1">
        <p className="text-label font-semibold tracking-[0.2em]" style={glow(AMBER, 10, 0.3)}>
          {slot.label}
        </p>
        <p className="flex items-baseline gap-1.5">
          <span
            className="wk-metric text-[3.25rem] font-bold leading-none md:text-[4.5rem]"
            style={glow(GREEN, 26, 0.5)}
          >
            {slot.value}
          </span>
          <span className="text-h3 font-bold" style={glow(GREEN, 14, 0.4)}>
            {slot.unit}
          </span>
        </p>
        <p className="mt-1 text-body-lg font-semibold" style={glow(AMBER, 14, 0.4)}>
          {slot.note}
        </p>
      </div>
    )
  }

  if (slot.kind === 'list') {
    return (
      <div className="flex flex-col items-center gap-2.5">
        <p className="text-body-lg font-bold" style={glow(AMBER, 12, 0.35)}>
          {slot.title}
        </p>
        <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-x-5 gap-y-1.5 p-0">
          {slot.items.map((it) => (
            <li
              key={it}
              className="text-h3 font-bold tracking-[-0.01em]"
              style={glow(GREEN, 16, 0.42)}
            >
              {it}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (slot.kind === 'alert') {
    return (
      <div className="flex flex-col items-center gap-2">
        <p
          className="rounded-[2px] px-3 py-1 text-label font-bold tracking-[0.1em]"
          style={{ ...glow(RED, 12, 0.5), border: `1px solid ${RED}66` }}
        >
          ⚠ {slot.badge}
        </p>
        <p
          className="text-h2 font-bold tracking-[-0.01em] md:text-[2.5rem]"
          style={glow(RED, 24, 0.55)}
        >
          {slot.message}
        </p>
        <p className="wk-cap" style={{ color: `${RED}99` }}>
          {slot.note}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <p className="text-h3 font-bold tracking-[-0.01em]" style={glow(AMBER, 18, 0.45)}>
        {slot.title}
      </p>
      <p className="text-body-lg font-semibold" style={glow(GREEN, 14, 0.4)}>
        {slot.sub}
      </p>
      <p className="wk-cap" style={{ color: `${AMBER}88` }}>
        {slot.note}
      </p>
    </div>
  )
}

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
      {/* 발광 바닥 — 경고 화면일 때는 붉게 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 transition-[background] duration-500"
        style={{
          background:
            slot.kind === 'alert'
              ? 'radial-gradient(70% 130% at 50% 50%, rgba(255,90,78,.14), transparent 72%)'
              : 'radial-gradient(70% 130% at 50% 50%, rgba(255,182,72,.12), transparent 72%)',
        }}
      />

      <div className="wk-wrap py-10 md:py-14">
        {/* 설치 장소 — 이 화면이 어디에 걸려 있나 */}
        <p className="wk-cap text-center !text-white/45">{slot.place}</p>

        <div className="mt-4 flex min-h-[8.5rem] items-center justify-center text-center md:min-h-[10rem]">
          <LedSwap index={i}>
            <Body slot={slot} />
          </LedSwap>
        </div>

        {/* 지금 몇 번째 화면인지 — 점 대신 모듈 칸처럼 */}
        <div aria-hidden="true" className="mt-8 flex justify-center gap-1.5">
          {SLOTS.map((s, n) => (
            <span
              key={s.place + n}
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
