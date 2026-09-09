'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'

import { BrandLockup } from '@/components/brand/BrandLogo'
import { Reveal, ScrollScale, useReducedMotion } from '@/components/motion'

/**
 * 인사말 — 케이시스 CEO 블록 구조.
 *
 * 🔴 2026-09-09 CEO 피드백("더 화려하게, 애니메이션 더 추가해서")으로 다시 짰다.
 *    COO 가 관찰한 원본 구조 = 좌측 큰 세로 사진 / 우측 초대형 영문 4줄 → 굵은 한글 한 줄
 *    → 회사 주어 문단 2개 → 서명.
 *
 * 연출 — **애플식 읽히는 텍스트.** 영문 4줄이 스크롤 진행에 따라 한 줄씩 회색에서
 * 주황으로 물들며 밝아진다. 마스크(RiseMask)를 쓰지 않는다 —
 * 🔴 CEO 가 말한 "잘린 듯이 보인다" 가 바로 마스크 리빌의 중간 프레임이었다.
 *    여기는 전부 스크롤 스크럽이라 글자가 잘리는 프레임 자체가 없다.
 *
 * 🔴 **개인(대표) 사진·이름·직함은 넣지 않는다.** 주어는 회사. 서명도 두지 않는다(CEO 2026-09-09 "임직원 일동도 빼자").
 *    대표 실물 사진이 없으므로 좌측 사진 자리는 **로고 다크 카드**로 채운다.
 *    없는 인물 사진을 연출컷으로 지어내지 마라.
 * 🔴 문단에 실적 수치를 넣지 않는다. 확인되는 사실만 말한다.
 */
const EN_LINES = ['BEYOND', 'THE DISPLAY', 'DESIGN TO', 'SERVICE']

/** 줄마다 밝아지는 구간. 0.15 씩 밀어 "한 줄씩 읽히는" 리듬을 만든다 */
const EN_SEGMENTS: [number, number][] = [
  [0.10, 0.30],
  [0.25, 0.45],
  [0.40, 0.60],
  [0.55, 0.75],
]

const KO_LEAD = '설계에서 시작해 현장에서 증명합니다.'

const PARAGRAPHS = [
  '우강테크는 LED 전광판을 설계하고, 만들고, 설치하고, 관리하는 회사입니다. 도면 한 장에서 시작한 일이 현장에서 켜지는 순간까지 맡는 사람이 바뀌지 않습니다. 정보통신공사업 등록업체로서 시공을 직접 하고, 전원장치는 KC 적합등록을 받은 것만 씁니다.',
  '설치는 끝이 아니라 시작입니다. 오랫동안 안정적으로 작동하는 전광판을 만들고, 문제가 생겼을 때는 끝까지 책임지는 기술로 답합니다. 공간과 사람을 연결하는 디스플레이, 우강테크가 만들겠습니다.',
]

/** 한 줄 = 하나의 훅 묶음. 배열 안에서 훅을 돌리지 않으려고 컴포넌트로 뗀다 */
function EnLine({
  text,
  progress,
  from,
  to,
  reduce,
}: {
  text: string
  progress: MotionValue<number>
  from: number
  to: number
  reduce: boolean
}) {
  const opacity = useTransform(progress, [from, to], [0.28, 1])
  const color = useTransform(progress, [from, to], ['#D1D6DB', '#B14E11'])

  if (reduce) {
    return <span className="block text-wk-cta">{text}</span>
  }

  return (
    <motion.span className="block will-change-[opacity]" style={{ opacity, color }}>
      {text}
    </motion.span>
  )
}

export function AboutGreeting() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 65%'] })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <section aria-labelledby="greeting-h" className="wk-sec-lg bg-white">
      <div className="wk-wrap">
        <Reveal y={10}>
          {/* 🔴 2026-09-09 CEO "'대표 인사말' 말고 '우강테크 인사말'." 되돌리지 마라 */}
          <p className="wk-eyebrow">우강테크 인사말</p>
        </Reveal>

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* 좌 — 케이시스의 대표 사진 자리. 실물 사진이 없으므로 로고 다크 카드.
              🔴 서명("우강테크 임직원 일동")은 CEO 2026-09-09 "이것도 빼자" 로 제거했다. 다시 넣지 마라. */}
          <div className="lg:col-span-5">
            <ScrollScale from={0.94}>
              <div className="wk-pixelgrid wk-pixelgrid-coarse relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-card bg-wk-night">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(60% 50% at 50% 55%, rgba(222,103,29,.22) 0%, rgba(222,103,29,.06) 45%, transparent 75%)',
                  }}
                />
                <BrandLockup dark height={160} className="relative h-32 w-auto md:h-40" />
              </div>
            </ScrollScale>
          </div>

          {/* 우 — 초대형 영문 4줄 → 한글 한 줄 → 문단 2개 */}
          <div ref={ref} className="lg:col-span-7">
            <p
              aria-label={EN_LINES.join(' ')}
              className="wk-display leading-[1.02] tracking-[-0.04em]"
            >
              {EN_LINES.map((l, i) => (
                <EnLine
                  key={l}
                  text={l}
                  progress={p}
                  from={EN_SEGMENTS[i][0]}
                  to={EN_SEGMENTS[i][1]}
                  reduce={reduce}
                />
              ))}
            </p>

            <Reveal y={16} delay={0.05}>
              <h2
                id="greeting-h"
                className="mt-10 text-h3 font-bold leading-snug tracking-tight text-wk-ink"
              >
                {KO_LEAD}
              </h2>
            </Reveal>

            {PARAGRAPHS.map((t, i) => (
              <Reveal key={i} y={20} delay={0.1 + i * 0.15}>
                <p className="wk-body mt-7 max-w-[40em] leading-[1.95]">{t}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
