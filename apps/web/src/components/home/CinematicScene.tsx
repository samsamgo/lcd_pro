'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  motion,
  useTransform,
  type MotionValue,
} from 'framer-motion'

import { IMAGES } from '@/lib/imageAssets'
import { StickyScene, useReducedMotion } from '@/components/motion'

/**
 * 다크 시네마틱 장면 — 이 페이지의 하이라이트. 3막.
 *
 *   1막 픽셀 보케   → DETAIL  가까이 볼수록 선명하게
 *   2막 픽셀 매크로 → SCALE   공간을 압도하는 크기
 *   3막 모듈 부양   → CARE    설치는 끝이 아니라 시작
 *
 * 🔴 2026-09-09 CEO 지시 — **숫자 표와 각주를 전부 뺐다.** "이거 필요 없고."
 *    화소 간격·권장 시청거리·거리별 규격표·교체 단위 같은 수치는 홈에서 말하지 않는다.
 *    홈은 선언만 하고, 규격은 /products 규격표가 정본이다.
 *    🔴 이 파일에 dl/dt/dd 수치표나 하단 각주 문단을 **다시 만들지 마라.**
 *    막마다 남는 것은 번호 + 아이브로우(영문 소문자 대문자화 트래킹) + 제목 + 한 줄뿐이다.
 *
 * 🔴 문구는 국내 상위 업체 어투(케이시스·온빛·컴텔싸인)를 참고한 **선언체**다.
 *    한글 소제목(밀도/크기/유지보수)은 뺐다 — 아이브로우는 영문 한 단어로 통일한다.
 *    🔴 홈에서는 휘도 관련 단어를 쓰지 않는다(홈 전체 grep 검사를 깨뜨린다).
 *
 * ⚠️ StickyScene 은 페이지에 1개만 둔다(설계계약서 §4 모션 예산).
 */

type Act = {
  eyebrow: string
  title: string
  body: string
  img: string
  alt: string
  /**
   * 사진 층의 [진입 시작, 진입 완료, 퇴장 시작, 퇴장 완료].
   * 앞 막의 퇴장 구간과 뒷 막의 진입 구간을 **정확히 겹쳐** 둔다.
   * 겹치지 않으면 교차 지점에서 두 사진이 동시에 흐려져 화면이 캄캄해진다.
   * 겹쳐 두면 두 불투명도의 합이 1로 유지된다.
   */
  range: [number, number, number, number]
  /**
   * 글자 층의 구간. 사진과 달리 **절대 겹치지 않는다.**
   * 겹치면 앞 막의 제목 위에 뒷 막의 제목이 반투명하게 포개져 둘 다 읽을 수 없다.
   * 🔴 2026-09-09 — ActPanel 이 이 값 대신 `range` 를 쓰고 있어 실제로 그 상태로
   *    렌더링됐다(정의만 있고 미사용). 반드시 ActPanel 이 textRange 를 쓴다.
   */
  textRange: [number, number, number, number]
}

const ACTS: Act[] = [
  {
    eyebrow: 'DETAIL',
    title: '가까이 볼수록 선명하게',
    body: '한 걸음 앞에서도 흐트러지지 않는 화질. 자리에 맞는 화소 간격으로 설계합니다.',
    img: IMAGES.cinematic[0],
    alt: '초점이 풀린 LED 픽셀들이 색점으로 번지는 근접 촬영',
    range: [0.0, 0.0, 0.30, 0.36],
    textRange: [0.0, 0.0, 0.27, 0.31],
  },
  {
    eyebrow: 'SCALE',
    title: '공간을 압도하는 크기',
    body: '로비 한 면에서 건물 외벽까지. 보는 거리에 맞춰 화면을 키웁니다.',
    img: IMAGES.cinematic[1],
    alt: 'LED 모듈 표면의 적·녹·청 발광 소자를 확대한 매크로 촬영',
    range: [0.30, 0.36, 0.63, 0.69],
    textRange: [0.31, 0.35, 0.60, 0.64],
  },
  {
    eyebrow: 'CARE',
    title: '설치는 끝이 아니라 시작',
    body: '문제가 생기면 모듈 한 장만 바꿉니다. 오래 안정적으로 켜져 있는 것까지가 우리 일입니다.',
    img: IMAGES.cinematic[2],
    alt: '작업대 위에 놓인 LED 모듈 한 장과 교체용 공구, 설치 위치를 적은 손글씨 라벨',
    range: [0.63, 0.69, 1.0, 1.0],
    textRange: [0.64, 0.68, 1.0, 1.0],
  },
]

/* ── 데스크톱은 길게, 모바일은 짧게 ────────────────────────── */
function useSceneLength() {
  const [len, setLen] = useState(2.8)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setLen(mq.matches ? 1.8 : 2.8)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return len
}

export function CinematicScene() {
  const reduce = useReducedMotion()
  const length = useSceneLength()

  if (reduce) return <StaticScene />

  return (
    <section aria-labelledby="cine-h" className="wk-night-glow relative">
      <h2 id="cine-h" className="sr-only">
        우강테크가 만드는 화면
      </h2>

      <StickyScene length={length}>
        {(p) => (
          <div className="relative h-full w-full">
            {ACTS.map((a) => (
              <SceneImage key={a.title} act={a} progress={p} />
            ))}

            {/* 사진 위 문구 판독 — 좌측 스크림 + 하단 스크림 */}
            <div aria-hidden="true" className="wk-scrim-l-deep pointer-events-none absolute inset-0" />
            <div aria-hidden="true" className="wk-scrim-b pointer-events-none absolute inset-x-0 bottom-0 h-2/3" />
            <div aria-hidden="true" className="wk-grain pointer-events-none absolute inset-0" />

            {/* 막 표시 */}
            <div className="pointer-events-none absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-2.5 md:flex lg:right-10">
              {ACTS.map((a) => (
                <ActDot key={a.title} act={a} progress={p} />
              ))}
            </div>

            {/* 텍스트 — 같은 자리에서 교차 페이드.
                수치표를 걷어낸 만큼 제목을 키우고 아래 여백을 넓혔다. */}
            <div className="absolute inset-x-0 bottom-0 z-10">
              <div className="wk-wrap pb-20 md:pb-28">
                <div className="relative min-h-[260px] md:min-h-[300px]">
                  {ACTS.map((a, i) => (
                    <ActPanel key={a.title} act={a} progress={p} index={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </StickyScene>
    </section>
  )
}

/* ── 사진 층 ───────────────────────────────────────────────── */
function SceneImage({ act, progress }: { act: Act; progress: MotionValue<number> }) {
  const [a, b, c, d] = act.range
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0])
  // 들어오면서 아주 조금 앉고, 나가면서 다시 밀려난다. transform 만 쓴다
  const scale = useTransform(progress, [a, d], [1.1, 1.0])

  return (
    <motion.div className="absolute inset-0" style={{ opacity, scale }}>
      <Image
        src={act.img}
        alt={act.alt}
        fill
        sizes="100vw"
        quality={80}
        className="object-cover"
      />
    </motion.div>
  )
}

/* ── 막 인디케이터 ─────────────────────────────────────────── */
function ActDot({ act, progress }: { act: Act; progress: MotionValue<number> }) {
  const [a, b, c, d] = act.range
  const opacity = useTransform(progress, [a, b, c, d], [0.3, 1, 1, 0.3])
  const scaleY = useTransform(progress, [a, b, c, d], [0.45, 1, 1, 0.45])

  return (
    <motion.span
      aria-hidden="true"
      className="block h-9 w-[3px] origin-center rounded-full bg-wk-blue"
      style={{ opacity, scaleY }}
    />
  )
}

/* ── 텍스트 패널 ───────────────────────────────────────────── */
function ActPanel({
  act,
  progress,
  index,
}: {
  act: Act
  progress: MotionValue<number>
  index: number
}) {
  // 🔴 사진의 range 가 아니라 **글자 전용 textRange** 를 쓴다.
  //    range 를 쓰면 막 전환 지점에서 앞뒤 제목이 겹쳐 둘 다 읽히지 않는다.
  const [a, b, c, d] = act.textRange
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0])
  const y = useTransform(progress, [a, b, c, d], [26, 0, 0, -20])

  return (
    <motion.div className="absolute inset-x-0 bottom-0" style={{ opacity, y }}>
      <div className="flex items-baseline gap-3">
        <span className="wk-metric text-caption font-semibold text-white/40">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="text-caption font-semibold uppercase tracking-[0.24em] text-wk-blue">
          {act.eyebrow}
        </span>
      </div>

      {/* 2026-09-07 — 다크 면 위 디스플레이 활자에는 .wk-emit-text 를 건다(§17-B).
          색을 바꾸지 않는 미세 글로우라 대비비는 그대로다. */}
      <h3 className="wk-emit-text mt-6 max-w-[12ch] text-display-hero font-bold tracking-[-0.03em] text-wk-nightInk">
        {act.title}
      </h3>
      <p className="wk-body mt-7 max-w-[36ch] !text-wk-nightMuted">{act.body}</p>
    </motion.div>
  )
}

/* ── 모션 최소화 경로 ──────────────────────────────────────────
   sticky·스크럽을 전부 제거하고 3막을 그대로 쌓는다.
   정보는 모션 완료에 의존하지 않는다(벤치마크 §2.4). */
function StaticScene() {
  return (
    <section aria-labelledby="cine-h" className="wk-night-glow wk-sec-lg">
      <h2 id="cine-h" className="sr-only">
        우강테크가 만드는 화면
      </h2>
      <div className="wk-wrap-wide space-y-16">
        {ACTS.map((a, i) => (
          <article key={a.title} className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
            <div className="relative aspect-[4/3] overflow-hidden rounded-surface">
              <Image
                src={a.img}
                alt={a.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-caption font-semibold uppercase tracking-[0.24em] text-wk-blue">
                {String(i + 1).padStart(2, '0')} · {a.eyebrow}
              </span>
              <h3 className="wk-display mt-5 max-w-[14ch] text-wk-nightInk">{a.title}</h3>
              <p className="wk-body mt-6 !text-wk-nightMuted">{a.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
