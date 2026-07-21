'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

/**
 * 시네마틱 브랜드 히어로 (Apple/BMW 톤).
 * 풀블리드 LED 실사 + 거대 타이포 + 최소 카피 + 절제된 CTA.
 */
export function BrandHero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-black">
      {/* 풀블리드 배경 */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/curated/hero-home.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />
        {/* 시네마틱 그라데이션 — 이미지를 살리되 텍스트 대비 확보 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300/90"
        >
          우강테크 · WOOKANG TECH
        </motion.p>

        <motion.h1
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(2.75rem,8vw,6.5rem)] font-extrabold leading-[0.98] tracking-tight text-white"
        >
          공간은,
          <br />
          <span className="bg-gradient-to-r from-cyan-200 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            빛
          </span>
          으로 완성된다
        </motion.h1>

        <motion.p
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-8 max-w-2xl text-lg font-light leading-relaxed text-zinc-300 sm:text-xl"
        >
          우강테크는 빛으로 공간을 바꾸는 디스플레이 브랜드입니다.
          <br className="hidden sm:block" />
          설계·제조·시공·운영을 <span className="font-medium text-white">하나의 표준</span>으로 잇습니다.
        </motion.p>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/quote"
            className="w-full rounded-full bg-white px-8 py-4 text-center text-base font-semibold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95 sm:w-auto"
          >
            사진 3장으로 견적 받기
          </Link>
          <Link
            href="#products"
            className="group inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-white/25 px-8 py-4 text-center text-base font-medium text-white backdrop-blur transition-all hover:bg-white/10 sm:w-auto"
          >
            제품 라인업 보기
          </Link>
        </motion.div>
      </div>

      {/* 스크롤 큐 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
      >
        <ChevronDown size={22} className={reduce ? '' : 'animate-bounce'} aria-hidden="true" />
        <span className="sr-only">아래로 스크롤</span>
      </motion.div>
    </section>
  )
}
