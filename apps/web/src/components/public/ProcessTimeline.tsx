'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useSpring } from 'framer-motion'

import { IMAGES } from '@/lib/imageAssets'
import { EASE, Reveal, RiseMask, useReducedMotion } from '@/components/motion'

/**
 * 도입 절차 타임라인.
 *
 * 단계마다 "얼마나 걸리는지"를 같이 적는다. 절차만 나열하면 읽지 않는다.
 *
 * 🔴 2026-09-07 CEO 지시("드리는 서류도 빼")로 단계별 `out`(산출물) 배지를 없앴다.
 *    개략 견적서·규격서·설치 도면·시운전 기록·인수인계서·장애 처리 보고서를
 *    단계마다 약속하고 있었다. 주지 않을 문서를 적어 두면 클레임 근거가 된다.
 *    이 자리에 산출물 배지를 다시 붙이지 말 것.
 *
 * 왼쪽 세로선이 스크롤에 따라 차오른다. 변형은 scaleY(transform) 하나뿐이라
 * 레이아웃 재계산이 없고, 모션 최소화 설정에서는 처음부터 채워둔다.
 */
const STEPS = [
  {
    title: '문의',
    days: '1영업일 이내',
    body: '설치 장소와 용도만 알려주시면 개략 견적을 드립니다.',
    img: IMAGES.process[0],
    alt: '설치 예정 지점의 지주와 주변 조건을 확인하는 현장 실측 장면',
  },
  {
    title: '현장 실측',
    days: '일정 협의',
    body: '시청 거리·전기 인입·설치면 구조를 확인해 확정 견적과 도면을 냅니다.',
    img: IMAGES.process[1],
    alt: '강당 벽면 프레임에 LED 모듈을 한 장씩 붙여 나가는 작업 장면',
  },
  {
    title: '제작',
    days: '규격에 따라 상이',
    body: '출하 전 전수 점등 검사. 색과 밝기가 고르지 않으면 내보내지 않습니다.',
    img: IMAGES.process[2],
    alt: '창고에 적재된 LED 캐비닛과 포장된 모듈 상자',
  },
  {
    title: '시공',
    days: '현장 조건에 따라',
    body: '기관 일정에 맞춰 시공합니다. 전기·통신 연결과 시운전까지 포함합니다.',
    img: IMAGES.process[3],
    alt: '청사 출입구 캐노피에 전자현수막을 설치하는 시공 현장',
  },
  {
    title: '인수와 교육',
    days: '설치 당일',
    body: '담당자 운영 교육. 문구 교체 방법을 현장에서 알려드립니다.',
    img: IMAGES.process[4],
    alt: '관제 화면에 표시된 모듈별 오류 위치 히트맵',
  },
  {
    title: '유지보수',
    days: '상시',
    body: '원격 확인 후 방문. 해당 모듈만 교체합니다.',
    img: IMAGES.process[5],
    alt: '점등된 대형 전광판 앞에 선 엔지니어의 실루엣',
  },
]

export function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.72', 'end 0.72'] })
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <section id="process" aria-labelledby="process-h" className="wk-sec bg-white">
      <div className="wk-wrap">
        <Reveal y={10} duration={0.6}>
          <p className="wk-eyebrow">도입 절차</p>
        </Reveal>
        <h2 id="process-h" className="wk-h2 max-w-[16ch] text-wk-ink">
          <RiseMask delay={0.06}>진행 순서</RiseMask>
        </h2>
        <Reveal y={14} delay={0.16}>
          <p className="wk-lead mt-5">
            단계마다 얼마나 걸리는지 미리 적어 두었습니다. 공정별로 업체가 바뀌지 않고, 담당자 한
            명이 끝까지 응대합니다.
          </p>
        </Reveal>

        <div ref={ref} className="relative mt-14 pl-9 md:pl-16">
          {/* 진행선 — scaleY 하나만 움직인다 */}
          <div
            aria-hidden="true"
            className="absolute left-[11px] top-2 w-px bg-wk-line2 md:left-[19px]"
            style={{ height: 'calc(100% - 1rem)' }}
          >
            <motion.div
              className="h-full w-full origin-top bg-wk-cta"
              style={reduce ? { scaleY: 1 } : { scaleY: line }}
            />
          </div>

          <ol className="m-0 list-none space-y-12 p-0 md:space-y-16">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative">
                <StepNode index={i} />

                <Reveal y={16} duration={0.7}>
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-12">
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="wk-h3 text-wk-ink">{s.title}</h3>
                        <span className="wk-metric text-label font-medium text-wk-ink3">
                          {s.days}
                        </span>
                      </div>
                      <p className="wk-body mt-3 !text-wk-ink3">{s.body}</p>                    </div>

                    <div className="wk-hov-media relative aspect-[16/10] overflow-hidden rounded-card-m border border-transparent bg-wk-bg shadow-wk-1 lg:aspect-[4/3]">
                      <Image
                        src={s.img}
                        alt={s.alt}
                        fill
                        sizes="(min-width: 1024px) 42vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <p className="wk-cap mt-10">
          소요 기간은 화면 규격, 구조 보강 여부, 기관 일정에 따라 달라집니다. 확정 일정은 실측 후에
          알려드립니다.
        </p>
      </div>
    </section>
  )
}

/**
 * 진행선의 마디.
 *
 * 🔴 이 마디만 `once: false` 다. 홈의 다른 등장은 전부 한 번 들어오고 끝나는데,
 *    그래서 등장이 끝난 뒤로는 화면이 스크롤에 아무 반응도 하지 않았다.
 *    여기서는 진행선의 머리가 지나갈 때마다 마디가 켜지고, 되돌아가면 다시 꺼진다.
 *    장식이 아니라 "지금 어느 단계를 읽고 있는가" 를 말하는 신호다.
 *
 * viewport margin 의 -28% 는 진행선(offset `start 0.72`)의 머리 위치와 같은 지점이다.
 * 두 값이 어긋나면 선은 이미 지나갔는데 마디가 안 켜진다.
 *
 * 변형은 scale / opacity 뿐이다. 색이나 테두리를 애니메이션하지 않는다(설계계약서 §0-6).
 */
function StepNode({ index }: { index: number }) {
  const reduce = useReducedMotion()

  return (
    <motion.span
      aria-hidden="true"
      className="absolute -left-9 top-1 flex h-[23px] w-[23px] items-center justify-center rounded-full border-2 border-wk-cta bg-white will-change-transform md:-left-16 md:h-[39px] md:w-[39px]"
      initial={reduce ? false : 'off'}
      whileInView="on"
      viewport={{ once: false, margin: '0px 0px -28% 0px' }}
      variants={{
        off: { scale: 0.82, opacity: 0.45 },
        on: { scale: 1, opacity: 1 },
      }}
      transition={{ duration: 0.45, ease: EASE.entrance }}
    >
      <span className="wk-metric hidden text-caption font-bold text-wk-cta md:block">
        {index + 1}
      </span>
      <span className="h-1.5 w-1.5 rounded-full bg-wk-cta md:hidden" />
    </motion.span>
  )
}
