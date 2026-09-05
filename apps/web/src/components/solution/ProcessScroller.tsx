'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { IMAGES } from '@/lib/imageAssets'
import { Reveal, RevealImage, Stagger } from '@/components/motion'

/**
 * 6공정 — 좌측 스티키 목록 + 우측 상세.
 *
 *"우리는 뭐든 다 합니다" 는 경쟁사가 그대로 복사할 수 있는 문장이다(안티패턴 2).
 * 공정마다 ① 무엇을 하는가 ② 소요 기간 ③ 산출물 ④ 담당을 적어야
 * 담당자가 결재 문서에 옮겨 쓸 수 있다.
 *
 * 왜 StickyScene 을 쓰지 않았나 —
 * 우측 내용이 스크롤 진행도로 교체되면 6개 상세가 DOM 에 한 번에 존재하지 않아
 * 검색·복사·키보드 탐색이 전부 망가진다. 여기서는 우측을 평범한 문서로 두고
 * 좌측 목록만 IntersectionObserver 로 따라가게 한다. 스크롤만 해도 진행되고,
 * 목록을 눌러도 이동한다(앵커라 JS 없이도 동작한다).
 *
 * 선택 표시는 색만으로 하지 않는다 — 색 + 2px 밑줄 + 굵기(접근성 §7).
 *
 * ⚠️ 소요 기간은 표준 공정안이다. 실측 전에는 확정 일정이 아니며 화면에도 그렇게 적는다.
 */
type Step = {
  id: string
  no: string
  title: string
  body: string
  duration: string
  owner: string
  outputs: string[]
  image: string
  alt: string
}

const STEPS: Step[] = [
  {
    id: 'survey',
    no: '01',
    title: '현장 실측 · 기본설계',
    body:
      '직접 가서 잽니다. 얼마나 떨어져서 보는지, 바닥에서 몇 미터인지, 붙일 구조물이 뭔지, 전기를 어디서 끌어오는지. 사진만 보고 규격을 정하지 않습니다. 여기서 나온 숫자가 이후 도면과 견적의 기준이 되기 때문입니다.',
    duration: '방문 1일 · 조서 작성 3~5영업일',
    owner: '우강테크 기술팀',
    outputs: ['현장 실측 조서', '설치 위치 도면(기존 구조물·지상고 표기)', '개략 규격서'],
    image: IMAGES.service[0],
    alt: '태블릿 진단 화면으로 설치 예정 위치의 조건을 기록하는 기술자',
  },
  {
    id: 'spec',
    no: '02',
    title: '규격 확정 · 제작',
    body:
      '실측한 값으로 화소 간격과 화면 크기, 밝기, 방수 등급을 확정하고 캐비닛을 조립합니다. 다 조립하면 화면 전체를 켜서 색과 밝기가 고른지 봅니다. 여기서 걸리면 현장에 안 나갑니다.',
    duration: '2~4주 (모듈 발주 리드타임 포함)',
    owner: '우강테크 기술팀 · 모듈 공급사',
    outputs: ['제품 규격서', '캐비닛 조립도', '자재 내역서'],
    image: IMAGES.service[1],
    alt: '조립을 마친 LED 캐비닛에 테스트 패턴을 띄워 색과 밝기를 확인하는 장면',
  },
  {
    id: 'structure',
    no: '03',
    title: '구조 · 취부 시공',
    body:
      '붙일 자리에 맞는 취부 철물을 만들어 고정하고 화면을 올려 정렬합니다. 높은 데 달아야 하는 현장이면 어떤 장비를 쓸지, 안전 계획을 어떻게 잡을지 미리 협의합니다.',
    duration: '1~3일 (화면 크기·작업 높이에 따라 변동)',
    owner: '우강테크 시공팀 · 고소작업 협력사',
    outputs: ['취부 상세도', '구조 검토 의견서', '시공 사진 대장'],
    image: IMAGES.service[2],
    alt: '도로변 H빔 지주에 크레인으로 전광판 본체를 올려 고정하는 시공 현장',
  },
  {
    id: 'power',
    no: '04',
    title: '전기 · 통신 배선',
    body:
      '제어함에서 화면까지 배선하고 접지와 차단기 용량을 잡습니다. 건물 분전반에서 제어함까지 전원을 끌어오는 건 기관에서 준비하시는 범위입니다. 어디까지가 누구 몫인지는 도면에 그려서 드리니 나중에 다툴 일이 없습니다.',
    duration: '1~2일',
    owner: '우강테크 시공팀 · 전기공사업 등록업체',
    outputs: ['전기 계통도', '배선도', '접지·차단기 사양서'],
    image: IMAGES.service[3],
    alt: '캐비닛 후면을 열고 전원과 신호 케이블을 배선하는 작업',
  },
  {
    id: 'commission',
    no: '05',
    title: '제어 설정 · 시운전 검사',
    body:
      '제어기와 미디어플레이어를 달고 화면을 켭니다. 밝기와 균일도를 재서 성적서로 남기는데, 그대로 준공 서류에 붙이시면 됩니다.',
    duration: '1일',
    owner: '우강테크 기술팀',
    outputs: ['작동 검사 성적서', '밝기·균일도 측정 기록', '시운전 확인서'],
    image: IMAGES.service[4],
    alt: '학교 정문 위 캐노피에 전광판 취부 프레임을 고정하는 작업',
  },
  {
    id: 'handover',
    no: '06',
    title: '인계 · 운영 · 유지보수',
    body:
      '담당자분께 화면 바꾸는 법을 현장에서 알려드립니다. 넘겨드린 뒤 고장이 나면 접수받고, 원격으로 먼저 보고, 필요하면 가서 판정하고, 모듈 갈고, 처리 내역을 문서로 드립니다.',
    duration: '인계 1일 · 이후 상시',
    owner: '우강테크 기술팀 (A/S 접수 창구)',
    outputs: ['운영 매뉴얼', '유지보수 계획서', '장애 처리 결과 보고서'],
    image: IMAGES.service[5],
    alt: '정비용 작업대에 교체 부품과 공구를 종류별로 펼쳐 놓은 모습',
  },
]

export function ProcessScroller() {
  const [active, setActive] = useState(STEPS[0].id)
  const refs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const nodes = STEPS.map((s) => refs.current[s.id]).filter(Boolean) as HTMLElement[]
    if (!nodes.length) return

    // 화면 중앙을 지나는 공정 하나만 활성으로 본다.
    // threshold 를 잘게 쪼개는 대신 rootMargin 으로 판정선을 만든다(벤치마크 §2.3).
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting)
        const el = hit?.target
        if (el instanceof HTMLElement && el.dataset.step) setActive(el.dataset.step)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  return (
    <section id="process" className="wk-sec bg-white">
      <div className="wk-wrap">
        <Reveal y={16}>
          <p className="wk-eyebrow">공급 범위</p>
          <h2 className="wk-h2 max-w-[13ch] text-wk-ink">여섯 공정에서 우리가 하는 일</h2>
          <p className="wk-lead mt-5">
            공정마다 무엇을 하고, 얼마나 걸리고, 무엇을 서류로 드리고, 누가 담당하는지
            적었습니다.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          <nav aria-label="공정 목록" className="hidden lg:col-span-4 lg:block">
            <ol className="sticky top-24 flex flex-col">
              {STEPS.map((s) => {
                const on = active === s.id
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      aria-current={on ? 'true' : undefined}
                      className={[
                        'flex w-full items-baseline gap-3 border-b-2 py-3.5',
                        'transition-colors duration-state ease-state',
                        on
                          ? 'border-wk-cta font-bold text-wk-ink'
                          : 'border-transparent font-medium text-wk-ink3 hover:text-wk-ink2',
                      ].join(' ')}
                    >
                      <span className="wk-metric text-label text-wk-ink3">{s.no}</span>
                      <span className="text-body-lg">{s.title}</span>
                    </a>
                  </li>
                )
              })}
            </ol>
          </nav>

          <div className="flex flex-col gap-16 md:gap-20 lg:col-span-8">
            {STEPS.map((s) => (
              <article
                key={s.id}
                id={s.id}
                data-step={s.id}
                ref={(el) => {
                  refs.current[s.id] = el
                }}
                className="scroll-mt-24"
                aria-labelledby={`${s.id}-title`}
              >
                <RevealImage className="overflow-hidden rounded-card-m sm:rounded-card">
                  <div className="relative aspect-[16/9] bg-wk-bg">
                    <Image
                      src={s.image}
                      alt={s.alt}
                      fill
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </RevealImage>

                <Reveal y={18} delay={0.06}>
                  <p className="mt-7 flex items-baseline gap-3">
                    <span className="wk-metric text-label font-semibold text-wk-cta">{s.no}</span>
                    <span className="text-label font-semibold uppercase tracking-widest text-wk-ink3">
                      공정
                    </span>
                  </p>
                  <h3 id={`${s.id}-title`} className="wk-h3 mt-2 text-wk-ink">
                    {s.title}
                  </h3>
                  <p className="wk-body mt-4">{s.body}</p>
                </Reveal>

                <Stagger className="mt-7 grid gap-3 sm:grid-cols-2" y={12}>
                  <div className="h-full rounded-card-m border border-wk-line bg-wk-bgFaint p-5">
                    <p className="wk-cap">소요 기간</p>
                    <p className="wk-metric mt-1.5 text-label font-semibold text-wk-ink">
                      {s.duration}
                    </p>
                    <p className="wk-cap mt-4">담당</p>
                    <p className="mt-1.5 text-label font-semibold text-wk-ink">{s.owner}</p>
                  </div>

                  <div className="h-full rounded-card-m border border-wk-line bg-wk-bgFaint p-5">
                    <p className="wk-cap">발주처에 드리는 산출물</p>
                    <ul className="mt-2.5 flex flex-col gap-2">
                      {s.outputs.map((o) => (
                        <li key={o} className="flex items-baseline gap-2.5">
                          <span
                            aria-hidden="true"
                            className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-wk-blue"
                          />
                          <span className="text-label font-medium text-wk-ink2">{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Stagger>
              </article>
            ))}
          </div>
        </div>

        <Reveal y={12}>
          <p className="wk-cap mt-14 max-w-[38rem] border-l-2 border-wk-line2 pl-3.5">
            위 소요 기간은 표준 공정안입니다. 확정 일정은 현장 실측 후 견적서에 기재합니다.
            구조 검토 의견서의 수치는 구조기술사 검토를 거쳐 확정되며, 그 전 값은 초안으로
            표기합니다.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
