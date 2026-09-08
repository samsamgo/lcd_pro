'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

import { IMAGES } from '@/lib/imageAssets'
import { Magnetic, Parallax, Reveal, SplitText } from '@/components/motion'

/**
 * 홈 히어로 — 같은 자리, 배경만 3장이 넘어간다.
 *
 * 2026-09-07 CEO 지시: "이미 꽉 찬 이미지 자리를 슬라이더로." 섹션은 늘리지 않는다.
 * 카피·CTA·레이아웃은 그대로 두고 **배경 레이어만** 교체했다.
 *
 * 과거에 8초 자동 슬라이더 6장을 걷어낸 적이 있다(벤치마크 §6 안티패턴 1).
 * 그때 문제는 "슬라이드가 있다"가 아니라 아래 셋이었다. 그래서 셋을 전부 막았다.
 *   1) LCP 경쟁 — 6장이 동시에 후보가 됐다.
 *      → 지금은 1번 슬라이드만 priority + fetchPriority=high 로 즉시 받고,
 *        2·3번은 첫 페인트가 끝난 뒤(useEffect + 지연) 비로소 DOM 에 들어간다.
 *   2) 메시지가 스스로 사라짐 — 사진마다 카피 위치가 흔들렸다.
 *      → 카피는 배경과 무관하게 고정. 움직이는 것은 배경 레이어뿐이다.
 *   3) 판독성 — 밝은 컷에서 흰 글씨가 죽었다.
 *      → 좌측 스크림(.wk-scrim-l-deep) + 하단 스크림 위에 균일 딤 18% 를 한 겹 더 깐다.
 *        어떤 슬라이드에서도 좌측 카피 영역의 배경은 최소 60% 이상 눌린다.
 *
 * 사진 선정 — 톤이 겹치면 슬라이더의 의미가 없다. 주간 / 야간 / 근접 셋으로 잡았다.
 *   1) gen-18   블루아워 도심 미디어 파사드 (화면에 한국어 문구, 기존 LCP 컷 유지)
 *   2) A4       주간 곡면 미디어 파사드 (실사 계열 W)
 *   3) J4       픽셀 광파 근접 (실사 계열 W, 제품 디테일)
 * 셋 다 imageAssets 레지스트리에 이미 존재하는 키다(신규 배정 없음 = 중복검사 무해).
 *
 * export 이름은 PublicHero.tsx 가 재export 하므로 유지한다.
 */

/** 한 장이 머무는 시간(ms). 5~7초 구간. */
const HOLD = 6000
/** 크로스페이드 시간(ms). 1.2~1.6초 구간. */
const FADE = 1400
/** Ken Burns 최대 배율. 1.04 를 넘기면 싸구려로 보인다. */
const ZOOM = 1.04

type Slide = {
  src: string
  /**
   * object-position — 세로 화면(360px)에서 피사체가 잘리지 않게 컷마다 따로 잡는다.
   * Tailwind 가 소스를 문자열로 훑기 때문에 클래스는 반드시 리터럴로 적는다(조립 금지).
   */
  objectClass: string
}

const SLIDES: Slide[] = [
  // 야간 청사 외벽 — 첫 장이 LCP 를 진다
  { src: IMAGES.home.hero, objectClass: 'object-[50%_38%] lg:object-[50%_42%]' },
  // 주간 학교 정문 시공 — 인물·사다리가 화면 아래 3분의 1에 몰려 있어 위쪽을 잡는다
  { src: IMAGES.home.heroReveal, objectClass: 'object-[50%_35%] lg:object-[50%_40%]' },
  // 블루아워 도심 파사드 — 화면이 우상단이라 세로에서 그쪽을 남긴다
  { src: IMAGES.home.heroCity, objectClass: 'object-[58%_40%] lg:object-[50%_45%]' },
  // 픽셀 근접
  { src: IMAGES.home.statement, objectClass: 'object-[50%_50%]' },
]

export function HeroSlider() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  /**
   * 2·3번 슬라이드를 언제 DOM 에 넣을지.
   * 뷰포트 안이라 loading="lazy" 만으로는 브라우저가 곧바로 받아간다.
   * 첫 페인트가 끝난 뒤에 마운트해야 LCP 경쟁이 실제로 사라진다.
   */
  const [restMounted, setRestMounted] = useState(false)
  /**
   * Ken Burns 시동 플래그.
   * 첫 렌더에서 곧바로 scale(1.04) 을 적으면 transition 이 걸릴 시작값이 없어
   * 1번 슬라이드만 확대된 채 멈춰 있다. 한 프레임 뒤에 켜야 실제로 움직인다.
   */
  const [zooming, setZooming] = useState(false)

  useEffect(() => {
    if (reduce) return
    const raf = requestAnimationFrame(() => setZooming(true))
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  useEffect(() => {
    if (reduce || SLIDES.length < 2) return
    const t = window.setTimeout(() => setRestMounted(true), 1200)
    return () => window.clearTimeout(t)
  }, [reduce])

  /**
   * 자동 전환. index 가 바뀔 때마다 타이머를 다시 건다
   * (= 인디케이터를 누르면 그 시점부터 다시 6초).
   * 탭이 백그라운드면 걸지 않고, 돌아오면 다시 건다.
   */
  useEffect(() => {
    if (reduce || !restMounted || SLIDES.length < 2) return

    let timer = 0
    const schedule = () => {
      window.clearTimeout(timer)
      if (document.hidden) return
      timer = window.setTimeout(
        () => setIndex((n) => (n + 1) % SLIDES.length),
        HOLD,
      )
    }
    schedule()
    document.addEventListener('visibilitychange', schedule)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', schedule)
    }
  }, [index, reduce, restMounted])

  return (
    <section
      data-wk-dark-hero
      className="relative isolate flex min-h-[86svh] items-end overflow-hidden bg-wk-ink lg:min-h-[92svh]"
    >
      {/* 배경 슬라이더 — 장식이므로 접근성 트리에서 뺀다. 의미는 h1 이 진다. */}
      <Parallax strength={0.12} className="pointer-events-none absolute inset-0">
        {/* 높이/오프셋은 디자인 토큰이 아니라 패럴랙스 이동량(±12%)을 흡수하는 구조값이다 */}
        <div
          aria-hidden="true"
          className="relative w-full"
          style={{ height: '126%', marginTop: '-13%' }}
        >
          {SLIDES.map((s, n) => {
            if (n > 0 && !restMounted) return null
            const active = n === index
            return (
              <div
                key={s.src}
                className="absolute inset-0 will-change-[opacity,transform]"
                style={{
                  opacity: active ? 1 : 0,
                  transform: reduce || !active || !zooming ? 'scale(1)' : `scale(${ZOOM})`,
                  transition: reduce
                    ? undefined
                    : `opacity ${FADE}ms cubic-bezier(0.4,0,0.2,1), transform ${HOLD + FADE}ms linear`,
                }}
              >
                <Image
                  src={s.src}
                  alt=""
                  fill
                  priority={n === 0}
                  fetchPriority={n === 0 ? 'high' : 'auto'}
                  loading={n === 0 ? 'eager' : 'lazy'}
                  sizes="100vw"
                  quality={82}
                  className={`object-cover ${s.objectClass}`}
                />
              </div>
            )
          })}
        </div>
      </Parallax>

      {/* 균일 딤 — 슬라이드마다 밝기가 다르다. 카피 대비의 하한선을 여기서 만든다 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-black/[.18]" />
      {/* 스크림 — 좌측 텍스트 뒤만 누른다 */}
      <div aria-hidden="true" className="wk-scrim-l-deep pointer-events-none absolute inset-0 z-10" />
      {/* 하단 스크림 — 인디케이터·캡션 판독용 */}
      <div aria-hidden="true" className="wk-scrim-b pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/3" />
      {/* 그레인 */}
      <div aria-hidden="true" className="wk-grain pointer-events-none absolute inset-0 z-10" />

      {/* 문구 */}
      <div className="relative z-20 w-full pb-24 pt-36 md:pb-28 md:pt-44">
        <div className="wk-wrap">
          <Reveal immediate y={0} duration={0.6}>
            <p className="wk-eyebrow !text-white/70">LED 전광판 · 전자현수막</p>
          </Reveal>

          <SplitText
            immediate
            as="h1"
            text="설계부터 유지보수까지"
            className="wk-hero text-white"
            gap={0.06}
          />

          <Reveal immediate y={18} delay={0.22}>
            <p className="wk-lead mt-6 !text-white/85">
              제작 · 설치 · A/S까지, 우강테크가 책임집니다.
            </p>
          </Reveal>

          <Reveal immediate y={16} delay={0.34}>
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

      {/* 인디케이터 — 얇은 막대 3개. 화살표는 두지 않는다(카피와 싸운다) */}
      {!reduce && restMounted && SLIDES.length > 1 && (
        <div
          className="absolute bottom-6 right-5 z-20 flex items-center gap-2 lg:right-10"
          role="group"
          aria-label="히어로 배경 사진 전환"
        >
          {SLIDES.map((s, n) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setIndex(n)}
              aria-label={`배경 사진 ${n + 1}번`}
              aria-current={n === index}
              className="group -my-2 px-0.5 py-2 focus-visible:outline-none"
            >
              <span
                className={`block h-[3px] w-7 rounded-full transition-colors duration-state ease-state group-focus-visible:ring-2 group-focus-visible:ring-white/80 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-black/40 ${
                  n === index ? 'bg-white' : 'bg-white/35 group-hover:bg-white/60'
                }`}
              />
            </button>
          ))}
        </div>
      )}

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
