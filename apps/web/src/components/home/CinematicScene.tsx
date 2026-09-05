'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion'

import { IMAGES } from '@/lib/imageAssets'
import { StickyScene } from '@/components/motion'

/**
 * 다크 시네마틱 장면 — 이 페이지의 하이라이트. 3막.
 *
 * 규격표를 읽게 만드는 것이 목적이다. 표로 적으면 넘어가지만,
 * 화면이 고정된 채 사진과 숫자가 스크롤에 맞춰 바뀌면 끝까지 본다.
 *
 *   1막 픽셀 보케   → 화소 간격(피치). 스크롤에 따라 피치 수치가 실제로 좁아진다.
 *   2막 픽셀 매크로 → 밝기 · 시야각 · 방수 등급.
 *   3막 모듈 부양   → 전면 유지보수, 모듈 단위 교체.
 *
 * ⚠️ StickyScene 은 페이지에 1개만 둔다(설계계약서 §4 모션 예산).
 * ⚠️ 숫자는 카운트업하지 않는다. 1막의 피치만 "스크롤 진행도 = 밀도" 라는
 *    의미가 있어 진행도에 연결했고, 나머지는 최종값을 HTML 에 둔다
 *    (벤치마크 §5 패턴 9 / §6 안티패턴 15).
 * ⚠️ 아래 수치는 제품 규격서 기준값(초안)이다. 확정 사양은 실측 후 규격서로 제공한다.
 */

type Metric = { k: string; v: string; u?: string }

type Act = {
  eyebrow: string
  title: string
  body: string
  metrics: Metric[]
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
   * (실제로 그 상태로 렌더링되던 것을 잡아 고친 자리다.)
   */
  textRange: [number, number, number, number]
}

const ACTS: Act[] = [
  {
    eyebrow: '밀도',
    title: '화면은 픽셀의 밀도로 결정됩니다',
    body: '가까이서 볼수록 화소가 촘촘해야 글자가 뭉치지 않습니다. 민원 창구는 좁게, 도로변은 넓게 갑니다.',
    metrics: [
      { k: '화소 간격', v: '1.8 – 10', u: 'mm' },
      { k: '권장 최소 시청거리', v: '1.8 – 10', u: 'm' },
    ],
    img: IMAGES.cinematic[0],
    alt: '초점이 풀린 LED 픽셀들이 색점으로 번지는 근접 촬영',
    range: [0.0, 0.0, 0.30, 0.36],
    textRange: [0.0, 0.0, 0.27, 0.31],
  },
  {
    eyebrow: '가시성',
    title: '밖에서는 밝기가 규격입니다',
    body: '실내용 밝기로 밖에 걸면 낮에는 안 보입니다. 빗물과 먼지를 어디까지 막을지도 같이 정해야 합니다.',
    metrics: [
      { k: '옥외 밝기', v: '6,000', u: 'nit급' },
      { k: '수평 시야각', v: '140', u: '°' },
      { k: '방진 · 방수', v: 'IP65' },
    ],
    img: IMAGES.cinematic[1],
    alt: 'LED 모듈 표면의 적·녹·청 발광 소자를 확대한 매크로 촬영',
    range: [0.30, 0.36, 0.63, 0.69],
    textRange: [0.31, 0.35, 0.60, 0.64],
  },
  {
    eyebrow: '유지보수',
    title: '고장은 모듈 한 장에서 끝납니다',
    body: '앞에서 모듈을 뽑는 구조입니다. 화면 뒤로 사람이 들어갈 통로를 따로 만들지 않아도 됩니다.',
    metrics: [
      { k: '교체 단위', v: '모듈 1장' },
      { k: '정비 방향', v: '전면' },
      { k: '후면 통로', v: '불필요' },
    ],
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
        화소, 밝기, 그리고 고장
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

            {/* 텍스트 — 같은 자리에서 교차 페이드 */}
            <div className="absolute inset-x-0 bottom-0 z-10">
              <div className="wk-wrap pb-14 md:pb-20">
                <div className="relative min-h-[300px] md:min-h-[320px]">
                  {ACTS.map((a, i) => (
                    <ActPanel key={a.title} act={a} progress={p} index={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </StickyScene>

      <p className="wk-wrap wk-cap pb-14 !text-wk-nightMuted">
        권장 최소 시청거리는 화소 간격 1mm를 1m로 보는 업계 통용 기준입니다. 수치는 제품 규격서
        기준값이며 모델·현장 조건에 따라 달라집니다. 확정 사양은 현장 실측 후 규격서로 제공합니다.
      </p>
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
  const [a, b, c, d] = act.range
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0])
  const y = useTransform(progress, [a, b, c, d], [26, 0, 0, -20])

  return (
    <motion.div className="absolute inset-x-0 bottom-0" style={{ opacity, y }}>
      <div className="flex items-baseline gap-3">
        <span className="wk-metric text-caption font-semibold text-white/40">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="text-caption font-semibold uppercase tracking-[0.14em] text-wk-blue">
          {act.eyebrow}
        </span>
      </div>

      <h3 className="wk-display mt-4 max-w-[13ch] text-wk-nightInk">{act.title}</h3>
      <p className="wk-body mt-5 max-w-[34ch] !text-wk-nightMuted">{act.body}</p>

      <MetricRow act={act} progress={progress} />
    </motion.div>
  )
}

/* ── 규격 수치 ─────────────────────────────────────────────── */
function MetricRow({ act, progress }: { act: Act; progress: MotionValue<number> }) {
  const [a, , c] = act.range
  // 1막만 진행도에 연결한다 — 스크롤이 곧 "밀도가 촘촘해진다" 는 의미이기 때문.
  const pitch = useTransform(progress, [a, c], [10, 1.8])
  const pitchText = useTransform(pitch, (v) => v.toFixed(1))
  const isPitchAct = act.eyebrow === '밀도'

  return (
    <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
      {act.metrics.map((m, i) => (
        <div key={m.k}>
          <dt className="text-caption text-white/50">{m.k}</dt>
          <dd className="wk-metric mt-1 text-h3 font-semibold text-wk-nightInk">
            {isPitchAct && i < 2 ? <motion.span>{pitchText}</motion.span> : m.v}
            {m.u && <small className="ml-1 text-white/70">{m.u}</small>}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/* ── 모션 최소화 경로 ──────────────────────────────────────────
   sticky·스크럽을 전부 제거하고 3막을 그대로 쌓는다.
   정보는 모션 완료에 의존하지 않는다(벤치마크 §2.4). */
function StaticScene() {
  return (
    <section aria-labelledby="cine-h" className="wk-night-glow wk-sec-lg">
      <h2 id="cine-h" className="sr-only">
        LED 화면을 결정하는 세 가지 규격
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
              <span className="text-caption font-semibold uppercase tracking-[0.14em] text-wk-blue">
                {String(i + 1).padStart(2, '0')} · {a.eyebrow}
              </span>
              <h3 className="wk-display mt-4 max-w-[15ch] text-wk-nightInk">{a.title}</h3>
              <p className="wk-body mt-5 !text-wk-nightMuted">{a.body}</p>
              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
                {a.metrics.map((m) => (
                  <div key={m.k}>
                    <dt className="text-caption text-white/50">{m.k}</dt>
                    <dd className="wk-metric mt-1 text-h3 font-semibold text-wk-nightInk">
                      {m.v}
                      {m.u && <small className="ml-1 text-white/70">{m.u}</small>}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        ))}
        <p className="wk-cap !text-wk-nightMuted">
          권장 최소 시청거리는 화소 간격 1mm를 1m로 보는 업계 통용 기준입니다. 수치는 제품 규격서
          기준값이며 모델·현장 조건에 따라 달라집니다. 확정 사양은 현장 실측 후 규격서로 제공합니다.
        </p>
      </div>
    </section>
  )
}
