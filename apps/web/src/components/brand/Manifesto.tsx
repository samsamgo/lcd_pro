'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'
import { StickyScene } from '@/components/motion'

/**
 * 원칙 선언 — /about 의 유일한 고정 장면(StickyScene).
 *
 * 2026-09-07 (2차) 재설계. 왜 정지 텍스트를 고정 장면으로 올렸는가 —
 * CEO 지시는 "LED 사이니지 그룹처럼" 이었다. 그 register 의 핵심은 화려한 장식이 아니라
 * **한 화면에 한 문장만 두는 배짱**이다. 세 줄을 한 덩어리로 쌓으면 리스트로 읽히고,
 * 한 줄씩 화면을 차지하면 선언으로 읽힌다. 우리가 파는 물건이 "문구가 갈리는 화면"이므로
 * 이 연출 자체가 제품 은유이기도 하다.
 *
 * 🔴 사진을 쓰지 않는다. 실사진이 확보되지 않은 자리를 생성 이미지로 메우지 않는다.
 *    배경은 `.wk-pixelgrid`(CSS 격자)뿐이다. 이미지 0장 = 이 섹션의 추가 전송량 0.
 *
 * 모션 예산 — 이 페이지의 StickyScene 은 여기 하나뿐이다(설계계약서 §4).
 * 그래서 히어로 이후 SplitText 는 쓰지 않고 진행도 기반 교차로만 장면을 넘긴다.
 * `prefers-reduced-motion` 에서는 고정 없이 세 줄을 그대로 쌓아 보여준다.
 *
 * 카피 근거 (지어낸 주장이 아니다) —
 *   01 CompanyChapters 02장(현장에서 규격 확정)과 같은 절차를 말한다.
 *   02 CompanyChapters 01장(기준을 우리가 정한다)과 같은 얘기다.
 *      🔴 2026-09-07 "규격서를 먼저 드립니다" 를 뺐다 — CEO 지시로 문서 제공 약속을
 *         사이트 전체에서 걷어냈다. 여기만 남으면 /about 한 페이지 안에서 말이 어긋난다.
 *   03 CompanyChapters 03장 문장을 그대로 쓴다. 보증 기간 약속이 아니라 운영 기간이다.
 */
type Principle = {
  no: string
  line: string
  body: string
  /** 글자 층 구간 [진입시작, 진입완료, 퇴장시작, 퇴장완료]. 막끼리 절대 겹치지 않는다 */
  range: [number, number, number, number]
}

const PRINCIPLES: Principle[] = [
  {
    no: '01',
    line: '가격은 현장에서 나옵니다.',
    body: '바닥에서 몇 미터인지, 무엇에 붙일지, 전기를 어디서 끌어오는지를 보고 규격을 확정합니다.',
    range: [0.0, 0.0, 0.29, 0.33],
  },
  {
    no: '02',
    line: '기준이 금액보다 먼저입니다.',
    body: '무엇을 어떤 기준으로 만들지 먼저 정합니다. 금액은 그다음에 나옵니다.',
    range: [0.33, 0.37, 0.62, 0.66],
  },
  {
    no: '03',
    line: '설치는 하루, 운영은 10년입니다.',
    body: '다는 데는 하루면 끝납니다. 그 뒤로는 원격으로 보고, 가서 모듈만 갈아 끼웁니다.',
    range: [0.66, 0.7, 1.0, 1.0],
  },
]

/** 데스크톱은 길게, 모바일은 짧게 — 모바일에서 2.2배는 지루하다 */
function useSceneLength() {
  const [len, setLen] = useState(2.2)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setLen(mq.matches ? 1.5 : 2.2)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return len
}

export function Manifesto() {
  const reduce = useReducedMotion()
  const length = useSceneLength()

  if (reduce) return <StaticManifesto />

  return (
    <section className="wk-night-glow wk-pixelgrid relative" aria-label="우강테크의 원칙">
      <h2 className="sr-only">우강테크의 원칙</h2>

      <StickyScene length={length}>
        {(p) => (
          <div className="relative flex h-full w-full items-center">
            <div className="wk-wrap w-full">
              <p className="text-label font-semibold uppercase tracking-widest text-wk-blue">원칙</p>

              {/* 세 막이 같은 자리에서 교차한다. 높이를 고정해야 문장 길이에 따라 화면이 뛰지 않는다 */}
              <div className="relative mt-8 min-h-[300px] md:mt-10 md:min-h-[340px]">
                {PRINCIPLES.map((item) => (
                  <PrincipleAct key={item.no} item={item} progress={p} />
                ))}
              </div>

              {/* 진행 막대 — 스크롤이 어디까지 왔는지 알려 준다. transform 만 쓴다 */}
              <div className="mt-4 h-px w-full max-w-[26em] overflow-hidden bg-white/15">
                <motion.div
                  className="h-full w-full origin-left bg-wk-blue"
                  style={{ scaleX: p }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        )}
      </StickyScene>

      <p className="wk-wrap wk-cap pb-20 !text-wk-nightMuted md:pb-24">
        아래 등록번호는 전부 발급 기관에서 직접 조회됩니다.
      </p>
    </section>
  )
}

/* ── 한 막 ─────────────────────────────────────────────────── */
function PrincipleAct({ item, progress }: { item: Principle; progress: MotionValue<number> }) {
  const [a, b, c, d] = item.range
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0])
  // 들어올 때 살짝 아래에서 올라오고, 나갈 때 위로 빠진다. transform / opacity 만 건드린다
  const y = useTransform(progress, [a, b, c, d], [26, 0, 0, -26])

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 top-0 will-change-transform">
      <div className="flex items-baseline gap-5 md:gap-7">
        <span className="wk-metric text-h3 font-bold leading-none text-white/35">{item.no}</span>
        <p className="wk-display max-w-[16em] text-wk-nightInk">{item.line}</p>
      </div>
      <p className="wk-lead mt-7 !text-wk-nightMuted md:mt-9">{item.body}</p>
    </motion.div>
  )
}

/* ── 모션을 줄이는 사용자 — 고정 없이 그대로 쌓는다 ────────── */
function StaticManifesto() {
  return (
    <section className="wk-sec-xl wk-night-glow wk-pixelgrid relative" aria-label="우강테크의 원칙">
      <div className="wk-wrap">
        <p className="text-label font-semibold uppercase tracking-widest text-wk-blue">원칙</p>
        <h2 className="sr-only">우강테크의 원칙</h2>

        <div className="mt-10 flex max-w-[26em] flex-col">
          {PRINCIPLES.map((item) => (
            <div key={item.no} className="border-t border-white/10 py-8 first:border-t-0 first:pt-0">
              <div className="flex items-baseline gap-5">
                <span className="wk-metric text-h3 font-bold leading-none text-white/35">
                  {item.no}
                </span>
                <p className="wk-display text-wk-nightInk">{item.line}</p>
              </div>
              <p className="wk-lead mt-5 !text-wk-nightMuted">{item.body}</p>
            </div>
          ))}
        </div>

        <p className="wk-cap mt-14 !text-wk-nightMuted">
          아래 등록번호는 전부 발급 기관에서 직접 조회됩니다.
        </p>
      </div>
    </section>
  )
}
