'use client'

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'

/**
 * 화면 최상단 스크롤 진행 바.
 *
 * 홈이 길어지면서 지금 어디쯤인지 감이 안 잡힌다.
 * 얇은 선 하나로 위치를 알려주고, 동시에 페이지에 계속 움직이는 요소를 남긴다.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const w = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })

  if (reduce) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: w }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-wk-blue via-[#6db4ff] to-[#ffb648] shadow-[0_0_12px_rgba(49,130,246,0.6)]"
    />
  )
}
