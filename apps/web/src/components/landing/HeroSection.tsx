'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock, Shield, Zap } from 'lucide-react'
import { SITE } from '@/lib/seo/site'

const BADGES = [
  { icon: Clock, text: '30분 내 견적' },
  { icon: Zap, text: '표준화 설치' },
  { icon: Shield, text: '원격 CMS 관리' },
]

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-16">
      {/* 배경 이미지 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image
          src="/curated/hero-home.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/60 to-white" />
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-cyan-600/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* 배지 */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-700">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          {SITE.nameKo} · {SITE.nameEn} — LED 사이니지 B2B 플랫폼
        </div>

        {/* 헤드라인 */}
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          매장 사진 3장으로
          <br />
          <span className="text-gradient">30분 내 견적</span>
        </h1>

        <p className="mx-auto mb-4 max-w-2xl text-lg text-zinc-600 sm:text-xl">
          전기·구조·허가 걱정 없이. 표준화된 설치, 원격 콘텐츠 관리,
          <br className="hidden sm:block" />
          정기 점검까지 — 기술을 몰라도 누구나 LED 사이니지를 운영합니다.
        </p>
        <p className="mx-auto mb-10 max-w-2xl text-sm italic text-zinc-500">
          {SITE.sloganKo}
        </p>

        {/* CTA 버튼 */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/quote"
            className="group flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-blue-500 active:scale-95 glow"
          >
            지금 견적 요청하기
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <a
            href="http://pf.kakao.com/_lcdpro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-8 py-4 text-base font-semibold text-yellow-600 transition-all hover:bg-yellow-400/20"
          >
            카카오로 문의하기
          </a>
        </div>

        {/* 소셜 증거 미니 배지 */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {BADGES.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-zinc-700"
            >
              <Icon size={15} className="text-blue-600" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* 스크롤 힌트 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-zinc-500">
        <span className="text-xs">스크롤</span>
        <div className="h-6 w-px bg-gradient-to-b from-zinc-300 to-transparent" />
      </div>
    </section>
  )
}
