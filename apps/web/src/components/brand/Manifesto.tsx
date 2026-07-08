'use client'

import { motion } from 'framer-motion'

/**
 * 브랜드 매니페스토 — 거대 편집형 타이포 + 넉넉한 여백 (Apple 톤).
 */
export function Manifesto() {
  const words = '빛은, 대기업의 것이 아니다.'
  return (
    <section className="bg-black px-6 py-32 sm:py-44">
      <div className="mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400/80"
        >
          Our Belief
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(2rem,5.5vw,4rem)] font-bold leading-[1.1] tracking-tight text-white"
        >
          {words}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-10 max-w-2xl text-lg font-light leading-[1.9] text-zinc-400 sm:text-xl"
        >
          작은 카페의 창가에도, 골목 끝 헬스장에도, 오래된 식당의 간판에도
          공간을 깨우는 빛이 필요합니다. 우리는 그 빛을 표준으로 만들어
          누구나 가질 수 있게 했습니다. 복잡한 계산은 우리가,
          사장님께는 <span className="text-zinc-200">사진 3장</span>과
          <span className="text-zinc-200"> 살아나는 공간</span>만.
        </motion.p>
      </div>
    </section>
  )
}
