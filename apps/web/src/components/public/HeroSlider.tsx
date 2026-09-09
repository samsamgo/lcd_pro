'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { IMAGES } from '@/lib/imageAssets'
import { Magnetic, Parallax, Reveal, SplitText, useReducedMotion } from '@/components/motion'

/**
 * ⚠️ 2026-09-09 배선 해제 — **참조 0건.** 홈 히어로는 `PublicHero.tsx` + `HeroLedWall.tsx` 다.
 *    CEO "메인 화면 배경화면 너무 구리다" 에 따라 사진 슬라이더를 걷어냈다.
 *    되살리려면 먼저 셋을 해결해라 — ①원본이 1440px 라 1920+ 풀블리드에서 흐리다
 *    ②로비 컷은 바닥에 플라이트 케이스·박스가 널린 공사 현장이다 ③청사 컷의 화면 내용이
 *    와이어프레임 가안이다. 아래 슬라이더 로직(LCP 1장 우선·점진 마운트) 자체는 유효하다.
 *
 * 홈 히어로 — 같은 자리, 배경만 3장이 넘어간다.
 *
 * 2026-09-07 CEO 지시: "이미 꽉 찬 이미지 자리를 슬라이더로." 섹션은 늘리지 않는다.
 * 카피·CTA·레이아웃은 그대로 두고 **배경 레이어만** 교체했다.
 *
 * 과거에 8초 자동 슬라이더 6장을 걷어낸 적이 있다(벤치마크 §6 안티패턴 1).
 * 그때 문제는 "슬라이드가 있다"가 아니라 아래 셋이었다. 그래서 셋을 전부 막았다.
 *   1) LCP 경쟁 — 6장이 동시에 후보가 됐다.
 *      → 지금은 1번 슬라이드만 priority + fetchPriority=high 로 즉시 받고,
 *        나머지는 첫 페인트가 끝난 뒤(useEffect + 지연) **현재 장 + 다음 한 장**까지만
 *        DOM 에 들어간다(maxMounted). 10장이어도 첫 화면에 받는 것은 1장이다.
 *   2) 메시지가 스스로 사라짐 — 사진마다 카피 위치가 흔들렸다.
 *      → 카피는 배경과 무관하게 고정. 움직이는 것은 배경 레이어뿐이다.
 *   3) 판독성 — 밝은 컷에서 흰 글씨가 죽었다.
 *      → 좌측 스크림(.wk-scrim-l-deep) + 하단 스크림 위에 균일 딤 18% 를 한 겹 더 깐다.
 *        어떤 슬라이드에서도 좌측 카피 영역의 배경은 최소 60% 이상 눌린다.
 *
 * 사진 선정 — 톤이 겹치면 슬라이더의 의미가 없다. 실내 대형 / 야간 옥외 / 시공 / 근접으로 갈랐다.
 * 배정은 전부 `lib/imageAssets.ts` 의 home 블록을 거친다(이 파일에 경로를 직접 적지 않는다).
 * 현재 배열과 선정·탈락 근거는 아래 SLIDES 주석에 있다.
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

/**
 * 2026-09-09 CEO "전광판 사진이 너무 적고, 전광판이 다 잘려 잘 안 보인다. 더 잘 보이게" — 10장.
 *
 * 🔴 두 가지를 같이 고쳤다.
 *  ① **장수** 6 → 10. 추가분 4장은 spare 에서 원본을 한 장씩 열어 보고 골랐다
 *     (선정·탈락 근거는 `lib/imageAssets.ts` home 블록 주석에 남겼다).
 *  ② **잘림**. 전에는 대부분 object-[50%_50%] 였다. 사진 한가운데가 아니라
 *     **전광판이 있는 높이**를 잡아야 한다 — 아래 수치는 원본에서 화면(패널)의
 *     세로 중심이 몇 % 에 있는지를 실제로 재서 넣은 값이다. 감으로 바꾸지 마라.
 *
 * 첫 장은 LCP 를 진다. 그래서 "전광판이 가장 크게 보이는 컷" 을 1번에 둔다.
 * 픽셀 근접(J4)은 전광판이 아니라 화소 매크로라 **첫 장에서 내렸다** —
 * 첫 화면에 전광판이 안 보인다는 인상의 진원이었다. 질감 컷으로 5번에 둔다.
 */
const SLIDES: Slide[] = [
  // 1 · 기업 로비 대형 월 — 화면이 프레임의 절반. LCP 담당(전광판이 가장 크게 보이는 컷)
  { src: IMAGES.home.heroLobby, objectClass: 'object-[50%_40%]' },
  // 2 · 야간 청사 외벽 '안전한 귀가길 되세요' — 화면 세로 중심 45%
  { src: IMAGES.home.hero, objectClass: 'object-[50%_45%]' },
  // 3 · 호텔 로비 곡면 월 — 화면 세로 중심 42%
  { src: IMAGES.home.heroCurved, objectClass: 'object-[50%_42%]' },
  // 4 · 시골 학교 정문 가로형 '등교 시간 안내' — 화면 세로 중심 36%
  { src: IMAGES.home.heroSchoolGate, objectClass: 'object-[50%_36%]' },
  // 5 · 픽셀 광파 근접 — 질감 컷. 화면 전체가 피사체라 중앙
  { src: IMAGES.home.statement, objectClass: 'object-[50%_50%]' },
  // 6 · 강당 무대 대형 월 — 화면 세로 중심 36%
  { src: IMAGES.home.heroStage, objectClass: 'object-[50%_36%]' },
  // 7 · 주간 학교 정문 취부 시공 — 전광판이 캐노피 아래 상단(28%). 인물·사다리는 아래 3분의 1
  { src: IMAGES.home.heroReveal, objectClass: 'object-[50%_28%]' },
  // 8 · 청사 외벽 가로형 — 화면이 우측으로 치우쳐 가로를 55% 로 민다
  { src: IMAGES.home.heroCityHall, objectClass: 'object-[55%_40%]' },
  // 9 · 폭풍 하늘 지주형 — 2:3 세로컷. 화면 세로 중심 32%
  { src: IMAGES.home.heroStormy, objectClass: 'object-[50%_32%]' },
  // 10 · 자동차 전시장 벽면 월 — 화면이 좌측이라 가로 45%
  { src: IMAGES.home.heroShowroom, objectClass: 'object-[45%_42%]' },
]

export function HeroSlider() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  /**
   * 2번 이후 슬라이드를 언제 DOM 에 넣을지.
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
  /**
   * 지금까지 DOM 에 올린 마지막 슬라이드 번호. **줄어들지 않는다.**
   * 한 바퀴 돌아 index 가 0 으로 돌아갔을 때 뒤쪽 장을 도로 언마운트하면
   * 마지막 장 → 첫 장 크로스페이드가 끊기고, 다시 볼 때마다 DOM 이 요동친다.
   */
  const [maxMounted, setMaxMounted] = useState(1)

  useEffect(() => {
    setMaxMounted((m) => Math.max(m, Math.min(index + 1, SLIDES.length - 1)))
  }, [index])

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
            /**
             * 2026-09-09 — 10장이 되면서 **한꺼번에 마운트하지 않는다.**
             * 뷰포트 안이라 loading="lazy" 는 소용이 없다(브라우저가 곧바로 받아간다).
             * 9장을 동시에 받으면 첫 화면 전송량이 배로 뛴다. 그래서 항상
             * **현재 장 + 다음 한 장**까지만 DOM 에 둔다 — 크로스페이드는 다음 장이
             * 미리 들어와 있어야 성립하므로 한 칸 앞까지가 최소이자 충분한 선이다.
             */
            if (n > maxMounted) return null
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
                  aria-hidden="true"
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
      {/* 하단 스크림 — 인디케이터·캡션 판독용.
          2026-09-09 h-2/3 → h-[55%]. 전광판은 사진의 위쪽 절반에 있는데 하단 스크림이
          화면 절반 높이부터 올라오면 정작 팔려는 물건을 덮는다. 카피 판독은 좌측
          스크림(.wk-scrim-l-deep)이 이미 지고 있으므로 이 층은 짧아도 대비가 유지된다. */}
      <div aria-hidden="true" className="wk-scrim-b pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[55%]" />
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

      {/* 인디케이터 — 얇은 막대. 화살표는 두지 않는다(카피와 싸운다).
          10장이 되면서 막대 폭을 모바일에서 줄였다(7 × 10 + 간격이면 360px 화면을 넘는다). */}
      {!reduce && restMounted && SLIDES.length > 1 && (
        <div
          className="absolute bottom-6 right-5 z-20 flex items-center gap-1.5 sm:gap-2 lg:right-10"
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
                className={`block h-[3px] w-4 rounded-full transition-colors sm:w-7 duration-state ease-state group-focus-visible:ring-2 group-focus-visible:ring-white/80 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-black/40 ${
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
