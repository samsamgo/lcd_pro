'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'

import { IMAGES } from '@/lib/imageAssets'
import { Reveal } from '@/components/motion'

/**
 * 도입 절차 타임라인.
 *
 * 담당자가 결재 문서에 붙일 수 있게 단계마다 "얼마나 걸리는지" 와
 *"무슨 문서가 나오는지" 를 같이 적는다. 절차만 나열하면 읽지 않는다.
 *
 * 왼쪽 세로선이 스크롤에 따라 차오른다. 변형은 scaleY(transform) 하나뿐이라
 * 레이아웃 재계산이 없고, 모션 최소화 설정에서는 처음부터 채워둔다.
 */
const STEPS = [
  {
    title: '문의',
    days: '1영업일 이내',
    body: '설치 장소와 용도만 알려주시면 됩니다. 개략 견적과 사양 제안을 보내드립니다. 예산 잡기 전이어도 괜찮습니다.',
    out: '개략 견적서 · 사양 제안서',
    img: IMAGES.process[0],
    alt: '설치 예정 지점의 지주와 주변 조건을 확인하는 현장 실측 장면',
  },
  {
    title: '현장 실측',
    days: '일정 협의',
    body: '직접 가서 시청 거리와 전기 인입 용량, 붙일 면의 구조를 봅니다. 확정 견적과 도면은 여기서 나옵니다.',
    out: '확정 견적서 · 제품 규격서 · 설치 도면',
    img: IMAGES.process[1],
    alt: '강당 벽면 프레임에 LED 모듈을 한 장씩 붙여 나가는 작업 장면',
  },
  {
    title: '제작',
    days: '규격에 따라 상이',
    body: '불량은 공장에서 걸러냅니다. 모듈을 프레임에 올린 뒤 화면 전체를 켜서 색과 밝기가 고른지 보고, 걸리면 현장에 내보내지 않습니다.',
    out: '점등 검사 기록',
    img: IMAGES.process[2],
    alt: '창고에 적재된 LED 캐비닛과 포장된 모듈 상자',
  },
  {
    title: '시공',
    days: '현장 조건에 따라',
    body: '기관 일정에 맞춥니다. 방학이든 휴일이든 업무 시간 외든 상관없습니다. 전기·통신 연결과 시운전까지 하고 마칩니다.',
    out: '시공 사진 · 시운전 기록',
    img: IMAGES.process[3],
    alt: '청사 출입구 캐노피에 전자현수막을 설치하는 시공 현장',
  },
  {
    title: '인수와 교육',
    days: '설치 당일',
    body: '담당자가 직접 문구를 바꿀 수 있게 현장에서 알려드립니다. 인사이동으로 사람이 바뀌어도 안내서만 보면 됩니다.',
    out: '인수인계서 · 운영 매뉴얼',
    img: IMAGES.process[4],
    alt: '관제 화면에 표시된 모듈별 오류 위치 히트맵',
  },
  {
    title: '유지보수',
    days: '상시',
    body: '연락 주시면 원격으로 먼저 봅니다. 원인이 잡히면 부품을 챙겨 나갑니다. 처리 내역은 문서로 남겨 드립니다.',
    out: '장애 처리 보고서',
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
        <p className="wk-eyebrow">도입 절차</p>
        <h2 id="process-h" className="wk-h2 max-w-[16ch] text-wk-ink">
          진행 순서
        </h2>
        <p className="wk-lead mt-5">
          단계마다 나오는 문서를 미리 적어 두었습니다. 공정별로 업체가 바뀌지 않고, 담당자 한 명이
          끝까지 응대합니다.
        </p>

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
                {/* 마디 */}
                <span
                  aria-hidden="true"
                  className="absolute -left-9 top-1 flex h-[23px] w-[23px] items-center justify-center rounded-full border-2 border-wk-cta bg-white md:-left-16 md:h-[39px] md:w-[39px]"
                >
                  <span className="wk-metric hidden text-caption font-bold text-wk-cta md:block">
                    {i + 1}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-wk-cta md:hidden" />
                </span>

                <Reveal y={16} duration={0.7}>
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-12">
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="wk-h3 text-wk-ink">{s.title}</h3>
                        <span className="wk-metric text-label font-medium text-wk-ink3">
                          {s.days}
                        </span>
                      </div>
                      <p className="wk-body mt-3 !text-wk-ink3">{s.body}</p>
                      <p className="mt-3.5 inline-flex flex-wrap items-center gap-2 rounded-btn bg-wk-blueWeak px-3 py-1.5 text-caption font-semibold text-wk-blueActive">
                        <span className="uppercase tracking-[0.14em]">산출물</span>
                        <span className="font-medium">{s.out}</span>
                      </p>
                    </div>

                    <div className="relative aspect-[16/10] overflow-hidden rounded-card-m bg-wk-bg shadow-wk-1 lg:aspect-[4/3]">
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
          소요 기간은 화면 규격, 구조 보강 여부, 기관 일정에 따라 달라집니다. 확정 일정은 실측 후
          공정표로 드립니다.
        </p>
      </div>
    </section>
  )
}
