'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * 신조 한 문장 — "가장 강력한 메시지는 말 없이도 빛나는 법이다."
 *
 * 🔴 2026-09-08 CEO 가 직접 가져온 문장. 이 회사가 파는 물건이 **빛나는 화면**이라
 *    문장과 상품이 같은 단어를 쓴다. 그래서 장식이 아니라 이 페이지의 논지가 된다.
 *
 * 디자인 원칙 — **문장이 시키는 대로 만든다.**
 *  · "말 없이도" → 이 섹션에는 아이브로우도, 부연 설명도, 버튼도 없다. 문장 하나뿐이다.
 *  · "빛나는"   → 그 어절만 실제로 빛난다. 화면이 완전히 어두운 상태에서 글자가
 *                 서서히 켜지고, 마지막에 '빛나는' 이 한 번 더 밝아진다.
 *                 LED 모듈이 점등되는 순서 그대로다(전체 저휘도 → 목표 휘도).
 *  · 여백       → 위아래를 크게 비운다. 붐비면 "말 없이"가 거짓말이 된다.
 *
 * ⚠️ 출처를 붙이지 않는다. 누가 한 말인지 확인되지 않았고, 확인 안 된 인용 출처를
 *    적는 것은 사실 날조다. 문장만 둔다.
 * ⚠️ 여기에 CTA·링크·사진을 추가하지 마라. 하나라도 붙는 순간 이 섹션은 배너가 된다.
 *
 * 모션 — IntersectionObserver 로 한 번만 켠다. 실패하거나 prefers-reduced-motion 이면
 * 처음부터 켜진 상태(최종 프레임)로 둔다. 첫 화면이 아니어도 글자가 안 보이는 일은 없다.
 */
const HEAD = '가장 강력한 메시지는'
const TAIL_BEFORE = '말 없이도 '
const GLOW_WORD = '빛나는'
const TAIL_AFTER = ' 법이다.'

export function CompanyCredo() {
  const ref = useRef<HTMLElement>(null)
  const [lit, setLit] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLit(true)
      return
    }
    // 관찰이 불가능한 환경(구형·스로틀링)에서도 반드시 켜지도록 안전망을 함께 건다
    const fallback = window.setTimeout(() => setLit(true), 1200)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLit(true)
          io.disconnect()
          window.clearTimeout(fallback)
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  return (
    <section
      ref={ref}
      aria-labelledby="credo-h"
      className="relative isolate overflow-hidden bg-wk-night py-32 md:py-44 lg:py-52"
    >
      {/* 뒤에서 번지는 빛 — 사진이 아니라 빛 자체다. 문장이 켜질 때 같이 차오른다 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-[2200ms] ease-out"
        style={{
          opacity: lit ? 1 : 0,
          background:
            'radial-gradient(52% 44% at 50% 52%, rgba(222,103,29,.20) 0%, rgba(222,103,29,.07) 42%, transparent 72%)',
        }}
      />
      {/* 화소 격자 — 아주 옅게. 이 면이 '화면'이라는 것만 알린다 */}
      <div aria-hidden="true" className="wk-pixelgrid wk-pixelgrid-coarse absolute inset-0 opacity-40" />

      <blockquote className="wk-wrap relative">
        <p
          id="credo-h"
          className="mx-auto max-w-[20ch] text-center text-display-xl font-bold leading-[1.24] tracking-[-0.03em] transition-[opacity,filter] duration-[1600ms] ease-out"
          style={{
            color: '#F5F7FA',
            opacity: lit ? 1 : 0.06,
            filter: lit ? 'blur(0px)' : 'blur(6px)',
          }}
        >
          {HEAD}
          <br />
          {TAIL_BEFORE}
          <span
            className="transition-[text-shadow,color] duration-[1400ms] ease-out"
            style={{
              // '빛나는' 만 실제로 발광한다. 지연은 CSS delay 가 아니라 값 자체로 준다
              color: lit ? '#FFFFFF' : '#F5F7FA',
              textShadow: lit
                ? '0 0 18px rgba(255,214,170,.55), 0 0 46px rgba(222,103,29,.45), 0 0 92px rgba(222,103,29,.28)'
                : 'none',
              transitionDelay: lit ? '900ms' : '0ms',
            }}
          >
            {GLOW_WORD}
          </span>
          {TAIL_AFTER}
        </p>
      </blockquote>
    </section>
  )
}
