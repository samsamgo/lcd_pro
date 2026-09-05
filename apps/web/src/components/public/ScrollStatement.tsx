'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'

/**
 * 스크롤에 따라 문장이 한 어절씩 밝아지는 다크 문장 섹션.
 *
 * 라이트(신뢰) 장과 다크(제품 체험) 장 사이의 관문이다.
 * 위쪽 .wk-bridge-down 다리를 건너오면 이 섹션에서 화면이 완전히 어두워지고,
 * 바로 아래 시네마틱 장면으로 이어진다.
 *
 * 어절 단위로 자른다. 글자 단위로 자르면 한글은 조사가 끊겨 읽기 어렵다.
 * 모션 최소화 설정에서는 전 어절을 밝게 고정한다(정보가 모션에 의존하지 않는다).
 */
export function ScrollStatement({
  lead,
  text,
  tail,
}: {
  lead?: string
  text: string
  tail?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.5'],
  })

  const words = text.split(' ')

  return (
    <section ref={ref} className="wk-night wk-sec-xl">
      <div className="wk-wrap">
        {lead && <p className="wk-eyebrow !text-wk-blue">{lead}</p>}

        <p className="wk-display max-w-[16ch] text-wk-nightInk">
          {words.map((w, i) => (
            <Word
              key={`${w}-${i}`}
              progress={scrollYProgress}
              range={[i / words.length, (i + 1) / words.length]}
              reduce={Boolean(reduce)}
            >
              {w}
            </Word>
          ))}
        </p>

        {tail && (
          <p className="wk-body mt-10 !text-wk-nightMuted">{tail}</p>
        )}
      </div>
    </section>
  )
}

function Word({
  children,
  progress,
  range,
  reduce,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  reduce: boolean
}) {
  // 시작값 0.45 는 근거가 있다 — #0B0B0F 위 흰색 45% 는 4.51:1 로 WCAG AA 를 넘는다.
  // 더 낮추면 스크롤하기 전에는 문장을 읽을 수 없고, 그러면 정보가 모션에 의존하게 된다.
  const opacity = useTransform(progress, range, [0.45, 1])
  return (
    <span className="mr-[0.28em] inline-block">
      <motion.span className="inline-block" style={reduce ? undefined : { opacity }}>
        {children}
      </motion.span>
    </span>
  )
}
