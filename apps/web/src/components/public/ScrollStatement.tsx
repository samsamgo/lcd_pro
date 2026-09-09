'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useReducedMotion } from '@/components/motion'

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
  bg,
}: {
  lead?: string
  text: string
  tail?: string
  /**
   * 장식 배경 사진(선택). 🔴 **캡션이 붙지 않는 순수 배경 층**이다.
   * 실적·사례를 주장하는 자리가 아니므로 여기에는 장소·기관·문구가 읽히는 사진을 넣지 않는다.
   * 지금 쓰는 컷은 문자 0·인물 얼굴 0·지역성 0 인 실사 LED 월이다(구조정본 §13-C).
   */
  bg?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.5'],
  })

  const words = text.split(' ')

  return (
    <section
      ref={ref}
      className="wk-night wk-pixelgrid wk-pixelgrid-coarse wk-sec-xl relative isolate overflow-hidden"
    >
      {/* 발광 층 — 문장 뒤에서 화면 한 장이 켜져 있다.
          🔴 사진을 읽게 하려는 것이 아니라 **면에 빛을 넣으려는 것**이다. 그래서
             ①불투명도를 낮게 두고 ②위에 아래→위 어두운 그라디언트를 덮어 본문 대비를 지킨다.
             본문 대비는 사진이 아니라 이 그라디언트 아래의 #0B0B0F 가 보장한다. */}
      {bg && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src={bg}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            quality={45}
            className="object-cover opacity-[0.24]"
          />
          {/* Tailwind 임의값으로 적지 않는다 — 스캐너가 못 잡으면 그라디언트가 통째로
              사라지고 본문 대비가 무너진다. 대비를 책임지는 층은 인라인으로 박아 둔다. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, #0B0B0F 0%, rgba(11,11,15,.76) 36%, rgba(11,11,15,.84) 72%, #0B0B0F 100%)',
            }}
          />
        </div>
      )}

      <div className="wk-wrap relative">
        {lead && <p className="wk-eyebrow !text-wk-blue">{lead}</p>}

        <p className="wk-display wk-emit-text max-w-[16ch] text-wk-nightInk">
          {words.map((w, i) => (
            <Word
              key={`${w}-${i}`}
              progress={scrollYProgress}
              range={[i / words.length, (i + 1) / words.length]}
              reduce={Boolean(reduce)}
              floor={bg ? 0.52 : 0.45}
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
  floor,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  reduce: boolean
  /** 스크롤 전 최저 불투명도. 배경 밝기에 따라 다르다 — 아래 계산 참조 */
  floor: number
}) {
  // 시작값 0.45 는 근거가 있다 — #0B0B0F 위 흰색 45% 는 4.51:1 로 WCAG AA 를 넘는다.
  // 더 낮추면 스크롤하기 전에는 문장을 읽을 수 없고, 그러면 정보가 모션에 의존하게 된다.
  //
  // 🔴 배경 사진(bg)이 깔리면 바닥 명도가 올라가 그 4.51:1 이 깨진다.
  //    사진 24% + 위 그라디언트 76% 를 합성한 최악값(흰 화소 자리)이 약 #17171A 이고,
  //    거기서 흰색 45% 는 4.2:1 로 떨어진다. 그래서 배경이 있을 때만 바닥을 0.52 로 올린다
  //    → 최악 배경에서도 5.17:1. 배경이 없으면 종전 값 0.45 를 그대로 쓴다.
  const opacity = useTransform(progress, range, [floor, 1])
  return (
    <span className="mr-[0.28em] inline-block">
      <motion.span className="inline-block" style={reduce ? undefined : { opacity }}>
        {children}
      </motion.span>
    </span>
  )
}
