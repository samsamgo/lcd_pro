'use client'

import Image from 'next/image'
import { useRef, type ReactNode } from 'react'

import { IMAGES } from '@/lib/imageAssets'
import { Reveal, RiseMask, Stagger, useReducedMotion } from '@/components/motion'

/**
 * 선택해야 하는 이유 — **네 장.**
 *
 * 🔴 2026-09-09 CEO 지시로 여섯 장에서 네 장으로 줄이고 문구를 전면 교체했다.
 *    · 삭제 5번 '연구개발전담부서를 두고 있습니다' / 6번 '견적 범위를 그 자리에서 드립니다'
 *      — CEO "말 자체가 이상해. 이건 아니다." 되살리지 마라.
 *    · 괄호 안 날짜·등록번호(공장등록 2026.08 · 제420573호 · R-R-WKTC-…) 전부 제거.
 *      서류 번호는 인증·서류 섹션(`CertStrip` · /about/certification)이 정본이다.
 *    · 그래서 여기 네 줄은 **설명체가 아니라 가치 선언체**다. 사양·번호·연도를 다시 넣지 마라.
 *
 * 🔴 2026-09-09 2차 — CEO "더 화려하게". 카드에 **토스식 tilt** 를 얹었다.
 *    커서 위치에 따라 카드가 최대 4도 기울고, 뒤에서 주황 방사광이 번진다.
 *    회전은 transform, 광원은 opacity 뿐이라 레이아웃 재계산이 없다(설계계약서 §0-6).
 *    prefers-reduced-motion 이면 기울지 않는다(광원도 끈다).
 *
 * ⚠️ 네 항목은 전부 서류로 확인되는 사실에 근거한다. "최신 기술" "합리적인 가격" 같은
 *    검증 불가능한 자랑을 넣지 마라.
 * ⚠️ 사진은 캡션 없는 장면 층이다. 각 카드의 사진은 그 항목의 **증거 사진이 아니다.**
 */
const REASONS: { t: string; d: string; img: string; alt: string }[] = [
  {
    t: '설계부터 직접',
    d: '도면 한 장에서 시작해 우리가 만든 화면을 우리가 답니다.',
    img: IMAGES.company.chapter1,
    alt: '작업대에서 LED 모듈 뒷면 회로를 계측기로 점검하는 장면',
  },
  {
    t: '등록된 시공',
    d: '정보통신공사업 등록업체가 직접 시공합니다.',
    img: IMAGES.service[2],
    alt: '도로변 H형강 지주에 크레인으로 구조물을 세우는 장면',
  },
  {
    t: '검증된 부품',
    d: '전원장치는 KC 적합등록을 받은 것만 씁니다.',
    img: IMAGES.service[3],
    alt: '캐비닛 후면에서 전원·신호 배선을 정리하는 장면',
  },
  {
    t: '빠른 A/S',
    d: '상태를 원격으로 확인하고, 고장이 나면 빠르게 조치합니다.',
    img: IMAGES.company.chapter3,
    alt: '흡착판으로 화면 전면에서 모듈 한 장을 빼내는 장면',
  },
]

/** 최대 기울기(도). 5도를 넘기면 사진이 왜곡돼 싸구려로 보인다 */
const TILT = 4

/**
 * 커서를 따라 기우는 카드.
 * 좌표는 **CSS 변수**로 넘긴다 — setState 로 넘기면 포인터가 움직일 때마다 리렌더가 난다.
 */
function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  if (reduce) return <div className="relative h-full">{children}</div>

  return (
    <div
      ref={ref}
      className="group/tilt relative h-full [perspective:1000px]"
      onPointerMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
        const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
        el.style.setProperty('--ry', `${(nx * TILT).toFixed(2)}deg`)
        el.style.setProperty('--rx', `${(-ny * TILT).toFixed(2)}deg`)
      }}
      onPointerLeave={() => {
        const el = ref.current
        if (!el) return
        el.style.setProperty('--ry', '0deg')
        el.style.setProperty('--rx', '0deg')
      }}
    >
      {/* 뒤에서 번지는 주황 방사광 — 카드 밖으로 새어 나온다 */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-5 -z-10 opacity-0 blur-2xl transition-opacity duration-500 ease-state group-hover/tilt:opacity-100"
        style={{
          background:
            'radial-gradient(52% 46% at 50% 52%, rgba(222,103,29,.38) 0%, rgba(222,103,29,.12) 46%, transparent 74%)',
        }}
      />
      <div
        className="h-full transition-transform duration-300 ease-state will-change-transform [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))_translateZ(0)] group-hover/tilt:[transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))_translateY(-6px)]"
      >
        {children}
      </div>
    </div>
  )
}

export function AboutWhy() {
  return (
    <section aria-labelledby="why-h" className="wk-sec bg-wk-bgFaint">
      <div className="wk-wrap">
        {/* 두 톤 대제목 — 검정 한 줄 + 주황 한 줄 */}
        <h2 id="why-h" className="wk-display leading-[1.06] tracking-[-0.035em]">
          <RiseMask>
            <span className="text-wk-ink">WHY</span>
          </RiseMask>
          <RiseMask delay={0.08}>
            <span className="text-wk-cta">WOOKANG</span>
          </RiseMask>
        </h2>
        <Reveal y={14} delay={0.18}>
          <p className="mt-6 text-h3 font-bold leading-snug tracking-tight text-wk-ink">
            기술로 설계하고, 품질로 증명합니다.
          </p>
        </Reveal>

        <Stagger
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-5"
          y={20}
          gap={0.08}
        >
          {REASONS.map((r, i) => (
            <TiltCard key={r.t}>
              <article className="wk-hov-media h-full overflow-hidden rounded-card border border-wk-line bg-white">
                <div className="relative aspect-[4/3] overflow-hidden bg-wk-ink">
                  <Image
                    src={r.img}
                    alt={r.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                    className="object-cover"
                  />
                </div>
                <div className="px-6 py-6">
                  <span className="wk-metric block text-caption font-bold tracking-widest text-wk-cta">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="wk-h3 mt-2 text-wk-ink">{r.t}</h3>
                  <p className="mt-2.5 text-label leading-relaxed text-wk-ink3">{r.d}</p>
                </div>
              </article>
            </TiltCard>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
