'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { IMAGES } from '@/lib/imageAssets'

/**
 * 활용 예시 슬라이더 — 홈 히어로 바로 아래.
 *
 * 왜 사진인가 (CEO 지시 2026-09-07, 두 번째 반려)
 * ---------------------------------------------
 * 이 자리에는 CSS 로 전광판 화면을 흉내 낸 `LedBoard` 가 있었다.
 * 1판(흰 자막) → 2판(색 블록)까지 고쳤지만 CEO 판정은 같았다 — "이상한 전광판 슬라이더".
 * 흉내는 아무리 정교해도 흉내로 읽힌다. 그래서 시뮬레이션을 걷어내고 **사진**으로 바꿨다.
 * `LedBoard.tsx` 파일은 되돌릴 수 있게 남겨뒀다(참조만 끊었다 = 번들에 들어가지 않는다).
 *
 * 사진 선정 — 파일명으로 고르지 않았다
 * ------------------------------------
 * 정본 `teams/web/knowledge/홈페이지-구조정본.md` §13 의 2단 판정을 그대로 적용하고,
 * 채택한 4장은 전부 원본을 확대해 작은 글씨 붕괴 여부까지 눈으로 확인했다.
 *   ① 화면에 뜬 내용이 한국어인가 (추상 그라데이션·영문이면 탈락)
 *   ② 화면 밖 배경이 국내인가 (건물·포장·수목·차량)
 * 확대 검사에서 실제로 한 장을 떨어뜨렸다 — `gen-51`(우천 광장)은 도트매트릭스 표현이
 * 정확하고 문자도 없지만, 배경 가옥이 일본식 기와지붕이다. 배선하지 않았다.
 *
 * 캡션 규칙 — 🔴 `시공 사례`·`납품처`·기관명·건수 금지
 * ---------------------------------------------------
 * `cases/gen/*` 는 전부 AI 연출컷이다. 실적으로 읽히면 날조다.
 * 그래서 라벨을 `제품 활용 예시`로 고정하고, 캡션에는 **장소 유형과 화면 문구**만 적는다.
 *
 * LCP 방어 — 히어로와 경쟁시키지 않는다
 * -------------------------------------
 * 히어로(`HeroSlider`)가 `priority` 를 쥐고 있다. 이 섹션은 그 아래다.
 * 그래서 `priority` 를 쓰지 않는 것으로 끝내지 않고, **뷰포트에 근접하기 전에는
 * `<Image>` 자체를 DOM 에 넣지 않는다**(IntersectionObserver). `loading="lazy"` 만으로는
 * 브라우저가 첫 화면에서 미리 받아가는 경우가 있어 히어로와 대역폭을 다툰다.
 * 자동 전환 타이머도 화면에 들어온 뒤에만 돈다(안 보이는 섹션에서 타이머를 돌리지 않는다).
 *
 * 접근성
 * ------
 * · `prefers-reduced-motion` 이면 자동 전환·크로스페이드를 끈다(수동 전환은 남긴다).
 * · 사진마다 의미 있는 alt.
 * · 인디케이터 탭 타깃 44px 이상(막대는 얇게, 버튼은 44px).
 */

/** 한 장이 머무는 시간(ms). 히어로(6초)와 같은 호흡. */
const HOLD = 6000
/** 크로스페이드 시간(ms). */
const FADE = 900

type Scene = {
  src: string
  /** 장소 유형 — 기관명·고객명은 절대 쓰지 않는다 */
  place: string
  /** 화면에 무엇이 떠 있는가 */
  screen: string
  alt: string
  /** 360px 세로에서 피사체가 잘리지 않게 컷마다 따로 잡는다(리터럴 고정) */
  objectClass: string
}

const SCENES: Scene[] = [
  {
    src: IMAGES.homeScenes[0],
    place: '초등학교 정문',
    screen: '등하원 안내 · 천천히 운전해 주세요',
    alt: '학교 정문 담장에 설치된 LED 전광판에 노란색과 흰색 글자로 등하원 안내 문구가 표시된 모습',
    objectClass: 'object-[38%_45%] md:object-[40%_48%]',
  },
  {
    src: IMAGES.homeScenes[1],
    place: '강당 · 다목적홀',
    screen: '행사 안내',
    alt: '강당 무대 벽면을 채운 대형 LED 화면에 파란 글씨로 행사 안내가 표시된 모습',
    objectClass: 'object-[50%_38%]',
  },
  {
    src: IMAGES.homeScenes[2],
    place: '청사 앞 광장',
    screen: '시설 배치도 안내',
    alt: '가을 단풍이 든 공공청사 앞 광장에 세워진 세로형 LED 안내 사인',
    objectClass: 'object-[35%_55%] md:object-[40%_55%]',
  },
  {
    src: IMAGES.homeScenes[3],
    place: '도서관 로비',
    screen: '이용 안내',
    alt: '도서관 로비 기둥 옆에 세워진 세로형 LED 안내 사인에 이용 안내가 표시된 모습',
    objectClass: 'object-[28%_50%] md:object-[35%_50%]',
  },
]

export function SceneSlider() {
  const ref = useRef<HTMLElement | null>(null)
  /** 뷰포트 근접 여부 — 이게 true 가 되기 전에는 이미지를 한 장도 받지 않는다 */
  const [near, setNear] = useState(false)
  const [reduce, setReduce] = useState(false)
  const [i, setI] = useState(0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduce(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduce || !near || SCENES.length < 2) return
    let timer = 0
    const schedule = () => {
      window.clearTimeout(timer)
      if (document.hidden) return
      timer = window.setTimeout(() => setI((n) => (n + 1) % SCENES.length), HOLD)
    }
    schedule()
    document.addEventListener('visibilitychange', schedule)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', schedule)
    }
  }, [i, near, reduce])

  const scene = SCENES[i]

  return (
    <section
      ref={ref}
      aria-label="전광판 제품 활용 예시 사진"
      className="relative isolate overflow-hidden bg-wk-night"
    >
      <div className="wk-wrap py-10 md:py-14">
        <p className="wk-cap text-center !text-white/45">제품 활용 예시</p>

        {/* 사진 — 비율을 고정해 전환 중 레이아웃이 흔들리지 않게 한다 */}
        <div className="relative mx-auto mt-4 aspect-[3/2] w-full max-w-[52rem] overflow-hidden rounded-[3px] bg-white/5 ring-1 ring-white/15">
          {near &&
            SCENES.map((s, n) => {
              const active = n === i
              return (
                <Image
                  key={s.src}
                  src={s.src}
                  alt={active ? s.alt : ''}
                  aria-hidden={active ? undefined : true}
                  fill
                  loading="lazy"
                  sizes="(max-width: 56rem) 100vw, 52rem"
                  quality={80}
                  className={`object-cover ${s.objectClass}`}
                  style={{
                    opacity: active ? 1 : 0,
                    transition: reduce ? undefined : `opacity ${FADE}ms cubic-bezier(0.4,0,0.2,1)`,
                  }}
                />
              )
            })}

          {/* 캡션 판독용 하단 스크림 — 밝은 컷에서도 흰 글씨가 죽지 않게 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-black/75 via-black/35 to-transparent"
          />

          {/* 캡션은 사진 위 고정 자리 — 사진이 바뀌어도 위치가 흔들리지 않는다 */}
          <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-4 md:px-6 md:pb-5">
            <p className="text-label font-semibold tracking-[0.12em] text-white/60">
              {scene.place}
            </p>
            <p className="mt-1 text-body-lg font-bold text-white md:text-h3">{scene.screen}</p>
          </div>
        </div>

        {/* 인디케이터 — 막대는 얇게, 탭 타깃은 44px */}
        <div
          className="mt-5 flex justify-center gap-1"
          role="group"
          aria-label="활용 예시 사진 전환"
        >
          {SCENES.map((s, n) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setI(n)}
              aria-label={`${s.place} 사진 보기`}
              aria-current={n === i}
              className="flex h-11 w-11 items-center justify-center focus-visible:outline-none"
            >
              <span
                className={`block h-1 w-7 rounded-[1px] transition-colors duration-300 ${
                  n === i ? 'bg-[#FFB648]/85' : 'bg-white/20'
                }`}
              />
            </button>
          ))}
        </div>

        <p className="mt-1 text-center text-caption text-white/35">
          설치 형태와 화면 구성을 보여드리기 위한 연출 이미지입니다.
        </p>
      </div>
    </section>
  )
}
