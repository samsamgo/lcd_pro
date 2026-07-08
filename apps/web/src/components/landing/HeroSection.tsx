'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Clock, Shield, Zap, MessageCircle, Sparkles } from 'lucide-react'
import { SITE } from '@/lib/seo/site'
import { useSiteModals } from '@/components/modals/SiteModals'

const BADGES = [
  { icon: Clock, text: '사진 3장 즉석 견적' },
  { icon: Zap, text: '1~3일 표준 시공' },
  { icon: Shield, text: '24시간 긴급 AS' },
]

export function HeroSection() {
  const { openConsult } = useSiteModals()
  const reduce = useReducedMotion()

  const rise = (delay = 0) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3, delay } }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
        }

  return (
    <section className="surface-dark relative flex min-h-[100svh] items-center overflow-hidden px-4 pb-20 pt-28">
      {/* 배경: 근-블랙 + 오로라 글로우 (플랫함 제거, 발광감) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_0%,#0b1220_0%,#09090b_55%)]" />
        <div className="absolute -left-32 top-10 h-[520px] w-[520px] rounded-full bg-cyan-500/20 blur-[140px]" />
        <div className="absolute right-0 top-1/4 h-[460px] w-[460px] rounded-full bg-blue-600/20 blur-[150px]" />
        <div className="absolute bottom-0 left-1/3 h-[300px] w-[600px] rounded-full bg-indigo-500/10 blur-[130px]" />
        {/* 미세 그리드 */}
        <div className="absolute inset-0 opacity-[0.15] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(70%_60%_at_50%_0%,#000,transparent)]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* 좌: 카피 */}
        <div className="text-center lg:text-left">
          <motion.div {...rise(0)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-sm font-medium text-cyan-200">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {SITE.nameKo} · {SITE.nameEn} — LED 사이니지 설계·시공·운영
          </motion.div>

          <motion.h1 {...rise(0.06)} className="text-[2.6rem] font-extrabold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-[4.2rem]">
            매장을 밝히는
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              LED 전광판
            </span>
            , 표준으로
          </motion.h1>

          <motion.p {...rise(0.12)} className="mx-auto mt-6 max-w-xl text-lg text-zinc-300 sm:text-xl lg:mx-0">
            설계부터 시공·AS까지 한 번에. 매장 사진 3장이면
            <br className="hidden sm:block" />
            화면에서 바로 <strong className="font-semibold text-white">예상 범위 견적</strong>을 확인합니다.
          </motion.p>

          <motion.div {...rise(0.18)} className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start sm:justify-center">
            <Link
              href="/quote"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-blue-500 active:scale-95 led-glow sm:w-auto"
            >
              사진 3장 즉석 견적
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              type="button"
              onClick={() => openConsult('hero')}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/10 sm:w-auto"
            >
              <MessageCircle size={18} className="text-cyan-300" />
              30초 빠른 상담
            </button>
          </motion.div>

          <motion.p {...rise(0.24)} className="mt-4 text-sm text-zinc-400">
            약 5분 소요 · 비용 없음 · 기술 지식 없어도 됩니다
          </motion.p>

          <motion.div {...rise(0.3)} className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
            {BADGES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 rounded-full glass-dark px-4 py-2 text-sm text-zinc-200">
                <Icon size={15} className="text-cyan-400" />
                {text}
              </div>
            ))}
          </motion.div>
        </div>

        {/* 우: LED 화면 쇼케이스 */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-lg"
        >
          {/* 메인 스크린 */}
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-900 shadow-2xl ring-1 ring-white/10">
            <div className="relative aspect-[4/5]">
              <Image
                src="/curated/gal-restaurant-menu.jpg"
                alt="매장 LED 메뉴 전광판 시공 예시"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 460px"
                className="object-cover"
              />
              {/* 화면 발광 + 하단 그라데이션 */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
              <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(56,189,248,0.28)]" />
              {/* 상단 라이브 배지 */}
              <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-zinc-950/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                실시간 콘텐츠 송출
              </div>
              {/* 하단 캡션 (가격 칩과 겹치지 않게 우측 정렬) */}
              <div className="absolute bottom-4 right-4 text-right">
                <p className="text-sm font-bold text-white">매장 메뉴 전광판 · P3</p>
                <p className="text-xs text-cyan-300">화면에서 즉시 교체</p>
              </div>
            </div>
          </div>

          {/* 플로팅 가격 칩 */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: -16, y: 16 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute -bottom-5 -left-3 rounded-2xl border border-white/10 bg-white/95 p-4 shadow-xl backdrop-blur sm:-left-6"
          >
            <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600">
              <Sparkles size={12} /> 설치비 기준
            </div>
            <p className="mt-0.5 text-xl font-extrabold text-zinc-900">200만원~</p>
            <p className="text-[11px] text-zinc-500">예상 범위 · VAT 별도</p>
          </motion.div>

          {/* 플로팅 SKU 칩 */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 16, y: -16 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="absolute -right-2 -top-4 rounded-2xl border border-white/10 bg-zinc-900/90 px-4 py-3 shadow-xl backdrop-blur sm:-right-5"
          >
            <p className="text-[11px] text-zinc-400">표준화</p>
            <p className="text-lg font-extrabold text-cyan-400">6종 SKU</p>
          </motion.div>
        </motion.div>
      </div>

      {/* 스크롤 힌트 */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-zinc-500">
        <span className="sr-only">아래로 스크롤</span>
        <span className="text-xs">스크롤</span>
        <div className="h-6 w-px bg-gradient-to-b from-zinc-500 to-transparent" />
      </div>
    </section>
  )
}
