'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

import { IMAGES } from '@/lib/imageAssets'
import { useReducedMotion } from '@/components/motion'

/**
 * 회사소개 여는 장 — **스크롤 연동 "창 열림"(open reveal).**
 *
 * 🔴 2026-09-09 CEO 피드백. "케이시스는 애니메이션 효과가 화려하게 들어가서 그랬는데,
 *    너 정확히 페이지를 안 봤구나. 뭔가 잘린 듯이 보이네. 좀 더 심리적으로 사람들이 홀리게."
 *    → COO 가 ksys.co.kr/page/ceo_greeting.php 를 실제로 스크롤하며 관찰한 구조를 그대로 옮겼다.
 *
 * 관찰한 원본 동작
 *   ① 스크롤 0 — 흰 배경. 화면 좌우 끝에 큰 검정 영문 두 덩어리. 가운데는 비어 있다.
 *   ② 스크롤 — 화면 중앙에서 세로로 긴 사진 창이 **폭을 넓히며 열린다**(45% → 풀블리드).
 *      넓어지는 창에 밀려 좌우 영문이 화면 밖으로 빠져나간다.
 *   ③ 창 안의 흰 헤드라인이 떠오르고, 풀블리드가 되는 지점에서 첫 어절이 주황으로 물든다.
 *   ④ 그 아래 작은 문단이 우측 정렬로 뒤따라 뜬다. 다 열리면 잠시 고정됐다가 넘어간다.
 *   (원본 마크업 단서 = `div.open_reveal_copy.is_on` + 자체 scroll.js 진행도 계산.
 *    우리는 framer `useScroll` + `useTransform` 으로 같은 것을 만든다)
 *
 * 🔴 **잘림 방지 설계** — CEO 가 본 "잘린 듯한" 화면은 마스크 리빌(RiseMask)이 만든 것이다.
 *    이 장에는 마스크가 하나도 없다. 전부 **스크롤 스크럽**이라 중간 프레임이 스크롤 위치와
 *    1:1 로 대응한다(관찰자 지연이 원리적으로 없다). 그리고
 *    · 좌우 영문은 progress 0 에서 **완전히 보이는 자리**에 둔다(잘리지 않는다).
 *    · 창 안 텍스트는 창 **폭에 맞춰** 배치한다(고정 100vw 층에 두면 창이 좁을 때 잘린다).
 *      그래서 창이 아무리 좁아도 글자가 창 밖으로 나가는 순간이 없다.
 *    · 사진만 100vw 고정 층에 둔다 — 창이 넓어질 때 사진이 늘어나는 게 아니라 **드러난다.**
 *
 * 🔴 **폰(md 미만) 분기** — 2026-09-09 390px 실측. 좌우 배치를 그대로 쓰면 창(--w0)이
 *    화면 대부분을 먹어 영문 두 덩어리가 각각 15vw 안에 못 들어가고 창 뒤에 숨는다
 *    ("B…" 와 "…AY" 만 삐져나온다 = CEO 가 말한 "잘린 듯"). 그래서 폰에서는
 *    영문을 **위·아래 세로 배치**로 바꾸고 y 로 밀어낸다. x 이동은 md 이상 전용.
 *    컨테이너도 180svh 로 줄여 다 열린 뒤 빈 스크롤이 남지 않게 한다.
 *
 * 🔴 이 컴포넌트가 `PageHeader` 를 대체한다. about 페이지에 배너를 다시 넣지 마라 —
 *    같은 자리에서 같은 말("공간에 빛을 더하고…")을 두 번 하게 된다.
 *    옛 `AboutSlogan` 도 이 장에 흡수됐다(파일은 남겼고 참조 0건).
 */

/** 좌우로 밀려나는 영문 — 슬로건 두 덩어리 */
const LEFT_WORD = 'BEYOND'
const RIGHT_WORD = 'THE DISPLAY'

/** 창 안 헤드라인 — 첫 덩어리만 풀블리드 시점에 주황으로 물든다 */
const HEAD_ACCENT = '공간에 빛을'
const HEAD_REST = ' 더하고,'
const HEAD_LINE2 = '기술로 완성합니다'

/** 창 안 작은 문단 — 우측 정렬 3줄(md 이상). 주어는 회사다 */
const SUB_LINES = [
  '우강테크는 LED 모듈 선정부터 구조 설계, 제작, 설치, 유지보수까지',
  '모든 과정을 직접 책임집니다.',
  '단순한 전광판을 넘어, 공간과 사람을 연결하는 디스플레이를 만듭니다.',
]

/** 폰(md 미만) — 같은 말을 2줄로 줄이고 좌측 정렬한다 */
const SUB_LINES_SM = [
  '우강테크는 LED 모듈 선정부터 설계·제작·설치·유지보수까지 직접 책임집니다.',
  '전광판을 넘어, 공간과 사람을 연결하는 디스플레이를 만듭니다.',
]

/** 0~1 로 자른다 */
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
/** 구간 [a,b] 를 0~1 로 정규화 */
const seg = (v: number, a: number, b: number) => clamp01((v - a) / (b - a))

export function AboutOpening() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  /** 미세 떨림 제거. 스크럽 값은 원시 스크롤이 그대로 들어와 손떨림이 그림에 보인다 */
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  /* ── 창 ── 폭 42vw(폰 84vw) → 100vw, 높이 70svh(폰 54svh) → 100svh.
     시작값은 CSS 변수 --w0/--h0/--r0 로 받는다
     (JS 로 화면폭을 재면 서버 렌더와 어긋나 하이드레이션이 깨진다) */
  const width = useTransform(
    p,
    (v) => `calc((var(--w0) + (100 - var(--w0)) * ${seg(v, 0, 0.6).toFixed(4)}) * 1vw)`,
  )
  const height = useTransform(
    p,
    (v) => `calc((var(--h0) + (100 - var(--h0)) * ${seg(v, 0, 0.6).toFixed(4)}) * 1svh)`,
  )
  const radius = useTransform(
    p,
    (v) => `calc(var(--r0) * ${(1 - seg(v, 0, 0.6)).toFixed(4)} * 1px)`,
  )

  /* ── 영문 슬로건 ── 창에 밀려 화면 밖으로.
     md 이상 = 좌우로(x), 폰 = 위아래로(y). 폰에서 15vw 안에 두 덩어리를 욱여넣으면
     창(84vw) 뒤에 숨어 "B…" "…AY" 만 삐져나온다 — 실측 2026-09-09 */
  const leftX = useTransform(p, (v) => `${(-72 * seg(v, 0, 0.55)).toFixed(2)}vw`)
  const rightX = useTransform(p, (v) => `${(72 * seg(v, 0, 0.55)).toFixed(2)}vw`)
  const topY = useTransform(p, (v) => `${(-40 * seg(v, 0, 0.55)).toFixed(2)}svh`)
  const bottomY = useTransform(p, (v) => `${(40 * seg(v, 0, 0.55)).toFixed(2)}svh`)
  const sideOpacity = useTransform(p, (v) => 1 - seg(v, 0.42, 0.58))

  /* ── 창 안 헤드라인 ── */
  const headOpacity = useTransform(p, (v) => seg(v, 0.2, 0.42))
  const headY = useTransform(p, (v) => `${(40 * (1 - seg(v, 0.2, 0.42))).toFixed(1)}px`)
  /** 첫 어절이 물드는 시점 = 창이 풀블리드가 되는 지점. 원본의 하늘색 자리에 우리 주황을 쓴다 */
  const accentColor = useTransform(p, [0.56, 0.72], ['#FFFFFF', '#DE671D'])

  /* ── 창 안 문단 ── */
  const subOpacity = useTransform(p, (v) => seg(v, 0.55, 0.75))
  const subY = useTransform(p, (v) => `${(30 * (1 - seg(v, 0.55, 0.75))).toFixed(1)}px`)

  /** 모션 최소화 — 최종 상태(풀블리드 + 텍스트 보임)로 정적 렌더 */
  const done = reduce

  return (
    <div
      ref={ref}
      className="relative h-[180svh] [--h0:54] [--r0:20] [--w0:84] md:h-[260svh] md:[--h0:70] md:[--r0:24] md:[--w0:42]"
    >
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-white">
        {/* 영문 슬로건 — progress 0 에서 완전히 보이는 자리에 둔다(잘리지 않게) */}
        {!done && (
          <>
            {/* 폰: 창 위/아래 중앙에 세로 배치. 창이 열리면 위아래로 밀려난다 */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-[9svh] flex justify-center px-5 md:hidden"
            >
              <motion.span
                style={{ y: topY, opacity: sideOpacity }}
                className="whitespace-nowrap text-[clamp(2rem,12vw,3.25rem)] font-extrabold leading-none tracking-[-0.04em] text-wk-ink"
              >
                {LEFT_WORD}
              </motion.span>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-[9svh] flex justify-center px-5 md:hidden"
            >
              <motion.span
                style={{ y: bottomY, opacity: sideOpacity }}
                className="whitespace-nowrap text-[clamp(2rem,12vw,3.25rem)] font-extrabold leading-none tracking-[-0.04em] text-wk-ink"
              >
                {RIGHT_WORD}
              </motion.span>
            </div>

            {/* md 이상: 기존 좌우 배치 그대로 */}
            <motion.span
              aria-hidden="true"
              style={{ x: leftX, opacity: sideOpacity }}
              className="pointer-events-none absolute left-[6vw] top-1/2 hidden -translate-y-1/2 whitespace-nowrap text-h1 font-extrabold leading-none tracking-[-0.04em] text-wk-ink md:block md:text-display-xl"
            >
              {LEFT_WORD}
            </motion.span>
            <motion.span
              aria-hidden="true"
              style={{ x: rightX, opacity: sideOpacity }}
              className="pointer-events-none absolute right-[6vw] top-1/2 hidden -translate-y-1/2 whitespace-nowrap text-h1 font-extrabold leading-none tracking-[-0.04em] text-wk-ink md:block md:text-display-xl"
            >
              {RIGHT_WORD}
            </motion.span>
          </>
        )}

        {/* 열리는 창 */}
        <motion.div
          style={
            done
              ? { width: '100vw', height: '100svh', borderRadius: 0 }
              : { width, height, borderRadius: radius }
          }
          className="relative isolate overflow-hidden bg-wk-night will-change-[width,height]"
        >
          {/* 사진 층 — 창 폭과 무관하게 100vw 로 고정. 창이 넓어지면 '드러난다' */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: '100vw', height: '100svh' }}
          >
            <Image
              src={IMAGES.company.opening}
              alt="" aria-hidden="true"
              fill
              priority
              sizes="100vw"
              /* 폰은 프레임이 좁아 중앙을 잡으면 대형 LED 월이 잘려 나간다 */
              className="object-cover object-[62%_40%] md:object-[50%_50%]"
            />
            {/* 흰 글자를 얹으려면 이 정도는 눌러야 읽힌다 */}
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          </div>

          {/* 글 층 — 창 폭에 맞춘다. 창이 좁아도 글자가 밖으로 나가지 않는다 */}
          <div className="absolute inset-0 flex flex-col justify-end px-5 pb-[9%] md:px-[7%]">
            <motion.h1
              style={done ? undefined : { opacity: headOpacity, y: headY }}
              className="text-h2 font-extrabold leading-[1.1] tracking-[-0.035em] text-white md:text-display-xl"
            >
              <span className="block">
                <motion.span style={done ? { color: '#DE671D' } : { color: accentColor }}>
                  {HEAD_ACCENT}
                </motion.span>
                {HEAD_REST}
              </span>
              <span className="block">{HEAD_LINE2}</span>
            </motion.h1>

            <motion.p
              style={done ? undefined : { opacity: subOpacity, y: subY }}
              className="mt-4 max-w-[34em] self-start text-left text-body leading-relaxed text-white/85 md:mt-8 md:self-end md:text-right"
            >
              {SUB_LINES_SM.map((l, i) => (
                <span key={`sm-${i}`} className="block md:hidden">
                  {l}
                </span>
              ))}
              {SUB_LINES.map((l, i) => (
                <span key={`md-${i}`} className="hidden md:block">
                  {l}
                </span>
              ))}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
