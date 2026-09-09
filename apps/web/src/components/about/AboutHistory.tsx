'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

import { HISTORY } from '@/lib/credentials'
import { EASE, Reveal, RiseMask, useReducedMotion } from '@/components/motion'

/**
 * 연혁 — 세로 타임라인.
 *
 * 🔴 **날짜는 전부 실제 서류에 인쇄된 것이다** (정본 = `lib/credentials.ts` HISTORY).
 *    2026년 6월 설립 이전 이력은 없다. 없는 것을 만들지 마라 — 관공서 담당자가
 *    확인서 원본과 나란히 놓고 본다. 한 줄이라도 안 맞으면 그때부터 전부 의심받는다.
 *
 * 연출(2026-09-09 CEO "애니메이션 더 추가해서") —
 *  · 왼쪽 세로선이 **스크롤을 따라 위에서 아래로 자란다**(scaleY 스크럽).
 *  · 항목은 각자 자기 자리에서 fade-up 하고, 그때 점이 회색 → 주황으로 켜진다.
 *    선이 도착한 곳까지만 불이 들어와 있어, 스크롤이 곧 연도 진행이 된다.
 * 🔴 선은 width/height 가 아니라 **scaleY** 로 자란다(레이아웃 재계산 회피, 설계계약서 §0-6).
 */
export function AboutHistory() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 78%', 'end 62%'] })
  const grow = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <section aria-labelledby="history-h" className="wk-sec bg-white">
      <div className="wk-wrap">
        <Reveal y={10}>
          <p className="wk-eyebrow">연혁</p>
        </Reveal>
        <h2 id="history-h" className="wk-h2 text-wk-ink">
          <RiseMask delay={0.06}>2026년, 여기까지 왔습니다</RiseMask>
        </h2>
        <Reveal y={14} delay={0.14}>
          <p className="wk-lead mt-5">
            아래 항목은 모두 발급받은 서류가 있습니다.{' '}
            <Link
              href="/about/certification"
              className="font-semibold text-wk-cta underline-offset-4 hover:underline"
            >
              인증·서류
            </Link>
            에서 원본을 보실 수 있습니다.
          </p>
        </Reveal>

        <div ref={ref} className="relative mt-12 lg:mt-16">
          {/* 바닥선 — 아직 지나지 않은 구간 */}
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-[5px] top-2 w-px bg-wk-line"
          />
          {/* 자라는 선 — 점의 중심(왼쪽에서 5px)을 지난다 */}
          <motion.span
            aria-hidden="true"
            className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-wk-cta"
            style={reduce ? { transform: 'scaleY(1)' } : { scaleY: grow }}
          />

          <div className="relative">
            {HISTORY.map((h) => (
              <Reveal key={`${h.date}-${h.title}`} y={16} className="relative pb-8 pl-8 last:pb-0">
                <motion.span
                  aria-hidden="true"
                  className="absolute left-0 top-[7px] h-[11px] w-[11px] rounded-full border-2 border-white shadow-[0_0_0_1px_#E5E8EB]"
                  initial={reduce ? { backgroundColor: '#B14E11' } : { backgroundColor: '#D1D6DB', scale: 0.6 }}
                  whileInView={{ backgroundColor: '#DE671D', scale: 1 }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ duration: reduce ? 0.2 : 0.5, ease: EASE.entrance }}
                />
                <div className="flex flex-col gap-x-8 gap-y-1 sm:flex-row sm:items-baseline">
                  <time className="wk-metric w-[7.5rem] shrink-0 text-label font-bold text-wk-cta">
                    {h.date}
                  </time>
                  <div className="min-w-0">
                    <p className="text-body-lg font-semibold text-wk-ink">{h.title}</p>
                    {h.detail && <p className="mt-1 text-label text-wk-ink3">{h.detail}</p>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
