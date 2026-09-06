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
 * 왜 색 블록인가 (CEO 지적 2026-09-06)
 * ------------------------------------
 * 1판은 흰 글자 한 줄, 2판은 색만 입힌 글자였다. 둘 다 "밋밋한 자막"이었다.
 * CEO: "TV에서 저렇게 밑밑한 자막만 나오는 거 봤어?"
 *
 * 실제 국내 전광판 사진(`public/cases/gen/gen-3.jpg` 학교 정문)을 보면
 * **분홍·노랑 solid 색 블록**을 화면 가득 깔고 그 위에 어두운 글자를 얹는다.
 * 아이콘도 들어가고, 화면을 좌우로 갈라 두 가지를 동시에 띄운다.
 * 글자가 빛나는 게 아니라 **면(面)이 빛난다.** 그래서 이 판은 면으로 만든다.
 *
 * 레이아웃 4종 — 화면 종류마다 구조 자체가 다르다
 *   number  대기번호처럼 숫자가 주인공 (거대 숫자 + 보조 안내)
 *   split   급식·행사처럼 화면을 좌우로 갈라 두 블록 (gen-3 실물 구조)
 *   alert   재난 문구 — 화면 전체가 붉은 면이 된다
 *   board   층별 안내처럼 표 형태
 *
 * 화면처럼 보이게 하는 것은 색이 아니라 픽셀 구조다.
 *   도트 매트릭스 · 모듈 조립선 · 베젤 — 세 겹을 면 위에 얹는다.
 *
 * 전환은 LedSwap(어두워졌다 밝아짐). 모션이 꺼지면 전환 없이 내용만 바뀐다.
 */

type Slot =
  | { kind: 'number'; place: string; head: string; value: string; unit: string; note: string }
  | { kind: 'split'; place: string; left: Panel; right: Panel }
  | { kind: 'alert'; place: string; badge: string; message: string; note: string }
  | { kind: 'board'; place: string; head: string; rows: [string, string][] }

type Panel = { icon: string; text: string; bg: string; ink: string }

const SLOTS: Slot[] = [
  {
    kind: 'number',
    place: '시청 민원실',
    head: '창구 대기 현황',
    value: '12',
    unit: '번',
    note: '3번 창구로 오세요',
  },
  {
    // gen-3 실물 구조 — 화면을 둘로 갈라 색 블록 두 개
    kind: 'split',
    place: '초등학교 정문',
    left: { icon: '🍚', text: '오늘의 급식 안내', bg: '#FF7BB0', ink: '#2B0A18' },
    right: { icon: '🏃', text: '가을 체육행사 안내', bg: '#FFD23F', ink: '#2B2000' },
  },
  {
    kind: 'alert',
    place: '군청 앞 도로',
    badge: '호우주의보',
    message: '하천 진입 금지',
    note: '18:00 기준 · 대전지방기상청',
  },
  {
    kind: 'split',
    place: '보건소 입구',
    left: { icon: '💉', text: '독감 예방접종', bg: '#3DD68C', ink: '#04230F' },
    right: { icon: '🕘', text: '접수 09:00~16:00', bg: '#4DA3FF', ink: '#04162B' },
  },
  {
    kind: 'board',
    place: '구청 로비',
    head: '층별 안내',
    rows: [
      ['1F', '민원 접수'],
      ['2F', '여권 발급'],
      ['3F', '세무과'],
      ['4F', '건축과'],
    ],
  },
]

const HOLD_MS = 3600

const DOT_MASK =
  'radial-gradient(circle at center, rgba(0,0,0,0.55) 0.9px, transparent 1.15px)'
const MODULE_LINE =
  'linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 100%)'

function Block({ p }: { p: Panel }) {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-1.5 px-4 py-6 md:gap-2.5 md:py-8"
      style={{ background: p.bg, color: p.ink }}
    >
      <span aria-hidden="true" className="text-h2 leading-none md:text-[2.5rem]">
        {p.icon}
      </span>
      <span className="text-body-lg font-bold tracking-[-0.01em] md:text-h3">{p.text}</span>
    </div>
  )
}

function Body({ slot }: { slot: Slot }) {
  if (slot.kind === 'number') {
    return (
      <div className="flex w-full items-stretch">
        <div className="flex w-[38%] flex-col items-center justify-center bg-[#0E2A5C] px-3 py-6 text-center md:py-8">
          <span className="text-label font-semibold tracking-[0.14em] text-[#7FB4FF]">
            {slot.head}
          </span>
          <span className="mt-1 text-body-lg font-bold text-white md:text-h3">{slot.note}</span>
        </div>
        <div className="flex flex-1 items-center justify-center gap-2 bg-[#04140A] px-3 py-6 md:py-8">
          <span
            className="wk-metric text-[3.5rem] font-bold leading-none text-[#3DFF88] md:text-[5rem]"
            style={{ textShadow: '0 0 30px rgba(61,255,136,.55)' }}
          >
            {slot.value}
          </span>
          <span className="text-h3 font-bold text-[#3DFF88]">{slot.unit}</span>
        </div>
      </div>
    )
  }

  if (slot.kind === 'split') {
    return (
      <div className="flex w-full items-stretch gap-[3px]">
        <Block p={slot.left} />
        <Block p={slot.right} />
      </div>
    )
  }

  if (slot.kind === 'alert') {
    return (
      <div
        className="flex w-full flex-col items-center justify-center gap-2 px-4 py-6 text-center md:py-8"
        style={{ background: '#C81E1E', color: '#FFF4F4' }}
      >
        <span className="rounded-[2px] bg-white/95 px-3 py-1 text-label font-bold tracking-[0.08em] text-[#C81E1E]">
          ⚠ {slot.badge}
        </span>
        <span className="text-h2 font-bold tracking-[-0.01em] md:text-[2.75rem]">
          {slot.message}
        </span>
        <span className="wk-cap !text-white/75">{slot.note}</span>
      </div>
    )
  }

  return (
    <div className="w-full bg-[#101418] px-4 py-5 md:py-7">
      <p className="text-center text-label font-bold tracking-[0.14em] text-[#FFB648]">
        {slot.head}
      </p>
      <ul className="mx-auto mt-3 grid max-w-[26rem] list-none grid-cols-2 gap-x-6 gap-y-1.5 p-0">
        {slot.rows.map(([f, name]) => (
          <li key={f} className="flex items-baseline justify-between gap-3">
            <span className="wk-metric text-body-lg font-bold text-[#FFB648]">{f}</span>
            <span className="text-body-lg font-semibold text-white">{name}</span>
          </li>
        ))}
      </ul>
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
      <div className="wk-wrap py-10 md:py-14">
        <p className="wk-cap text-center !text-white/45">{slot.place}</p>

        {/* 화면 본체 — 베젤 안에 면이 들어간다 */}
        <div className="relative mx-auto mt-4 max-w-[52rem] overflow-hidden rounded-[3px] ring-1 ring-white/15">
          <div className="flex min-h-[8.5rem] items-stretch md:min-h-[10.5rem]">
            <LedSwap index={i}>
              <div className="flex min-h-[8.5rem] w-full items-stretch md:min-h-[10.5rem]">
                <Body slot={slot} />
              </div>
            </LedSwap>
          </div>

          {/* 도트 매트릭스 + 모듈 조립선 — 면 위에 얹어야 '화면'이 된다 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              backgroundImage: `${DOT_MASK}, ${MODULE_LINE}`,
              backgroundSize: '3.5px 3.5px, 140px 100%',
            }}
          />
          {/* 베젤 안쪽 그림자 — 면이 아니라 장치로 읽히게 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              boxShadow:
                'inset 0 0 0 2px rgba(0,0,0,.75), inset 0 2px 0 rgba(255,255,255,.07), inset 0 -3px 6px rgba(0,0,0,.6)',
            }}
          />
        </div>

        {/* 지금 몇 번째 화면인지 — 점 대신 모듈 칸처럼 */}
        <div aria-hidden="true" className="mt-7 flex justify-center gap-1.5">
          {SLOTS.map((s, n) => (
            <span
              key={s.place + n}
              className={`h-1 w-7 rounded-[1px] transition-colors duration-300 ${
                n === i ? 'bg-[#FFB648]/85' : 'bg-white/15'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
