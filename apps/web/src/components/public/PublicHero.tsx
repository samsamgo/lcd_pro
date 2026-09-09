'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

import { HeroLedWall } from './HeroLedWall'
import { Magnetic, Parallax, Reveal } from '@/components/motion'

/**
 * 홈 히어로.
 *
 * 2026-09-09 CEO "메인 화면 배경화면 너무 구리다." → **사진 슬라이더를 걷어냈다.**
 * 배경은 `HeroLedWall` 이 캔버스로 그리는 LED 라이트월이다(왜 그렇게 했는지는 그 파일 상단).
 * 이 파일은 레이어 순서와 카피만 진다.
 *
 * 레이어(아래 → 위)
 *   1. 캔버스 LED 월 — Parallax 0.15 로 스크롤보다 살짝 느리게 따라온다
 *   2. 비네팅 — 가장자리를 눌러 시선을 좌측 카피로 모은다
 *   3. 좌측 스크림(.wk-scrim-l-deep) — 판독용. **하단 스크림은 두지 않는다.**
 *      사진이던 시절에는 밝은 컷을 눌러야 했지만, 지금은 배경 자체가 우리가 만든 것이라
 *      덮을 이유가 없다. 덮으면 다시 탁해진다.
 *   4. 카피 · CTA
 *
 * 🔴 텍스트 등장은 Reveal(fade-up) 만 쓴다. RiseMask 계열은 금지 —
 *    마스크가 글자를 자른 프레임이 정지 화면으로 남는 문제가 2026-09-09 에 확인됐다.
 * 🔴 이전 구현 `HeroSlider.tsx` 는 파일만 남고 참조는 0건이다. 되살리려거든
 *    위 원인(저해상 원본·공사 현장 컷·와이어프레임 화면)부터 해결하고 오라.
 */
export function PublicHero() {
  return (
    <section
      data-wk-dark-hero
      className="relative isolate flex min-h-svh items-end overflow-hidden bg-[#05080C]" /* 2026-09-09 CEO "처음 들어왔을 때 화면 꽉 차게" — 헤더가 투명 오버레이라 100svh 로 */
    >
      {/* 1 · 배경 — 장식이므로 접근성 트리 밖. 의미는 h1 이 진다 */}
      <Parallax strength={0.15} className="pointer-events-none absolute inset-0">
        {/* 높이/오프셋은 디자인 토큰이 아니라 패럴랙스 이동량(±15%)을 흡수하는 구조값이다 */}
        <div aria-hidden="true" className="relative w-full" style={{ height: '132%', marginTop: '-16%' }}>
          <HeroLedWall className="absolute inset-0" />
        </div>
      </Parallax>

      {/* 2 · 비네팅
          2026-09-09 COO 검수 "탁하다" → **상단을 풀었다.** 화면 위쪽은 광파가 가장 넓게
          흐르는 자리인데 거기를 누르면 정작 보여줄 것을 덮는다. 아래쪽만 유지해
          카피·스크롤 유도 문구가 앉을 바닥을 만든다. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: [
            'linear-gradient(to top, rgba(0,0,0,.42) 0%, rgba(0,0,0,.12) 32%, transparent 60%)',
            'radial-gradient(130% 100% at 50% 40%, transparent 56%, rgba(0,0,0,.26) 100%)',
          ].join(','),
        }}
      />
      {/* 3 · 좌측 스크림 — 카피 뒤만 누른다.
          🔴 opacity-80 = 검수 지시 "지금보다 20% 더 얇게". 배경이 이미 검정 바탕(#05080C)이라
             .wk-scrim-l-deep 을 100% 로 얹으면 좌측 절반이 그냥 검은 판이 된다. */}
      <div aria-hidden="true" className="wk-scrim-l-deep pointer-events-none absolute inset-0 z-10 opacity-80" />

      {/* 4 · 문구 */}
      <div className="relative z-20 w-full pb-24 pt-36 md:pb-28 md:pt-44">
        <div className="wk-wrap">
          <Reveal immediate y={0} duration={0.6}>
            <p className="wk-eyebrow !text-white/70">LED 전광판 · 전자현수막</p>
          </Reveal>

          <Reveal immediate y={20} delay={0.1} duration={0.7}>
            <h1 className="wk-hero text-white">설계부터 유지보수까지</h1>
          </Reveal>

          <Reveal immediate y={18} delay={0.24}>
            <p className="wk-lead mt-6 !text-white/85">
              제작 · 설치 · A/S까지, 우강테크가 책임집니다.
            </p>
          </Reveal>

          <Reveal immediate y={16} delay={0.36}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Magnetic className="w-full sm:w-auto">
                <Link href="/quote" className="wk-btn-p">
                  견적 문의하기
                </Link>
              </Magnetic>
              <Link
                href="/products"
                className="wk-btn border border-white/35 bg-white/5 text-white backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                제품 규격 보기
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      {/* 스크롤 유도 — 과하지 않게 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-5 z-20 hidden justify-center md:flex"
      >
        <span className="flex flex-col items-center gap-1.5 text-caption font-medium text-white/55 animate-pulse-slow">
          아래로 스크롤
          <ChevronDown size={16} strokeWidth={2} />
        </span>
      </div>
    </section>
  )
}
