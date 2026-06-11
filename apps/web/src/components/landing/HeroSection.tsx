'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock, Shield, Zap } from 'lucide-react'
import { SITE } from '@/lib/seo/site'

const BADGES = [
  { icon: Clock, text: '사진 3장 즉석 견적' },
  { icon: Zap, text: '표준화 설치' },
  { icon: Shield, text: '원격 콘텐츠 관리 (준비중)' },
]

export function HeroSection() {
  return (
    <section className="surface-dark relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-16">
      {/* 배경 — 대형 LED 실사. 사진이 주인공, 어두운 오버레이로 텍스트 대비만 확보 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image
          src="/curated/hero-home.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        {/* 좌→우 + 하단 다크 그라데이션 (가독성) */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-zinc-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        {/* LED 발광 포인트 */}
        <div className="absolute left-1/4 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute right-10 bottom-10 h-[360px] w-[360px] rounded-full bg-blue-600/15 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
        {/* 배지 */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-sm font-medium text-cyan-200">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          {SITE.nameKo} · {SITE.nameEn} — LED 사이니지 설계·시공·운영
        </div>

        {/* 헤드라인 — 고대비 단색(흰색), 발광은 사진/액센트에만 */}
        <h1 className="mb-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          매장을 밝히는
          <br />
          <span className="text-cyan-400">LED 전광판</span>, 표준으로
        </h1>

        <p className="mx-auto mb-4 max-w-2xl text-lg text-zinc-200 sm:text-xl">
          실내·옥외 LED 사이니지를 설계부터 시공·AS까지 한 번에.
          <br className="hidden sm:block" />
          매장 사진 3장이면 화면에서 바로 예상 범위 견적을 확인합니다.
        </p>
        <p className="mx-auto mb-10 max-w-2xl text-sm italic text-zinc-400">
          {SITE.sloganKo}
        </p>

        {/* CTA 버튼 */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/quote"
            className="group flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-blue-500 active:scale-95 led-glow"
          >
            지금 견적 요청하기
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/#products"
            className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/10"
          >
            제품 라인업 보기
          </Link>
        </div>

        {/* 소셜 증거 미니 배지 */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {BADGES.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 rounded-full glass-dark px-4 py-2 text-sm text-zinc-200"
            >
              <Icon size={15} className="text-cyan-400" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* 스크롤 힌트 */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-zinc-400">
        <span className="sr-only">아래로 스크롤</span>
        <span className="text-xs">스크롤</span>
        <div className="h-6 w-px bg-gradient-to-b from-zinc-500 to-transparent" />
      </div>
    </section>
  )
}
