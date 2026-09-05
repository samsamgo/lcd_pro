import Image from 'next/image'
import { IMAGES } from '@/lib/imageAssets'
import { Parallax, Reveal, RevealImage, Stagger } from '@/components/motion'

/**
 * 회사 소개 본문 — 3개 장(章).
 *
 * 연혁 나열 대신 "우리가 어디까지 직접 하는가" 를 세 덩어리로 나눈다.
 *   1장 직접 만드는 부분(설계·조립·검사)
 *   2장 직접 올리는 부분(실측·구조·시공)
 *   3장 계속 보는 부분(운영·A/S)
 *
 * 레이아웃 — 5+7 을 두 장 유지하고 마지막 장에서 한 번만 뒤집는다.
 * 매 장 지그재그로 뒤집으면 템플릿 냄새가 난다(벤치마크 §3.1).
 *
 * ⚠️ 카피 규칙 — 우리는 아직 첫 수주 전이다.
 *    가동 중인 공장·시공 실적·고객사를 문장으로 만들지 않는다.
 *    지금 사실인 것(기준·절차·책임 범위)만 쓰고, 준비 중인 것은 준비 중이라고 쓴다.
 */
type Chapter = {
  no: string
  label: string
  title: string
  body: string
  points: string[]
  note?: string
  src: string
  alt: string
  flip?: boolean
}

const CHAPTERS: Chapter[] = [
  {
    no: '01',
    label: '직접 만드는 부분',
    title: '직접 설계합니다',
    body:
      '어떤 모듈을 사용할지, 어떤 프레임에 적용할지, 어떤 검사를 거칠지까지 10년의 경험과 노하우를 바탕으로 직접 정하고 관리합니다.',
    points: ['모듈·프레임 사양 선정', '조립 규격서 작성', '작동·성능 검사 기준'],
    note: 'KC 인증 기준에 맞는 부품과 제품을 적용하고, 조립부터 검사까지 직접 관리합니다.',
    src: IMAGES.company.chapter1,
    alt: '장갑을 낀 손으로 LED 모듈을 들어 표면 상태를 살피는 장면',
  },
  {
    no: '02',
    label: '직접 올리는 부분',
    title: '근거 있는 견적',
    body:
      '담당자가 지상고, 기존 구조물, 전기 인입 위치, 취부 조건을 현장에서 직접 확인한 뒤 규격을 확정합니다.',
    points: ['현장 실측 조서', '설치 도면(기존 구조물·지상고 포함)', '취부 상세도'],
    note: '구조·전기 수치는 구조기술사 검토와 전기 검토를 거쳐 확정합니다.',
    src: IMAGES.company.chapter2,
    alt: '건물 외벽 고소 작업대 위에서 LED 프레임을 취부하는 시공 인력',
  },
  {
    no: '03',
    label: '계속 보는 부분',
    title: '설치는 하루지만, 운영은 10년입니다',
    body:
      '전광판은 설치하는 시간보다 사용하는 시간이 훨씬 깁니다. 장애 발생 시 원격 확인부터 방문 점검, 부품 교체, 결과 보고까지 절차를 문서로 드립니다.',
    points: ['모듈 단위 교체', '원격 상태 확인', '장애 처리 결과 보고서'],
    src: IMAGES.company.chapter3,
    alt: '여러 대의 전광판 상태를 한 화면에서 확인하는 관제실 모니터 월',
    flip: true,
  },
]

export function CompanyChapters() {
  return (
    <section className="wk-sec-lg bg-white" aria-label="우강테크가 직접 하는 일">
      <div className="wk-wrap-wide flex flex-col gap-24 md:gap-32 lg:gap-40">
        {CHAPTERS.map((c) => (
          <article
            key={c.no}
            className="grid items-center gap-8 md:gap-12 lg:grid-cols-12 lg:gap-16"
            aria-labelledby={`chapter-${c.no}`}
          >
            <div
              className={
                c.flip
                  ? 'lg:col-span-5 lg:col-start-8 lg:row-start-1'
                  : 'lg:col-span-5'
              }
            >
              <Reveal y={16}>
                <p className="flex items-baseline gap-3">
                  <span className="wk-metric text-label font-semibold text-wk-ink3">{c.no}</span>
                  <span className="text-label font-semibold uppercase tracking-widest text-wk-cta">
                    {c.label}
                  </span>
                </p>
              </Reveal>

              <Reveal delay={0.06}>
                <h2 id={`chapter-${c.no}`} className="wk-h2 mt-4 max-w-[13ch] text-wk-ink">
                  {c.title}
                </h2>
              </Reveal>

              <Reveal delay={0.14}>
                <p className="wk-body mt-6">{c.body}</p>
              </Reveal>

              <Stagger className="mt-7 flex flex-col gap-2" y={10}>
                {c.points.map((p) => (
                  <span
                    key={p}
                    className="flex items-baseline gap-2.5 text-label font-medium text-wk-ink2"
                  >
                    <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-wk-blue" />
                    {p}
                  </span>
                ))}
              </Stagger>

              {c.note && (
                <Reveal delay={0.2} y={10}>
                  <p className="wk-cap mt-6 max-w-[38rem] border-l-2 border-wk-line2 pl-3.5">
                    {c.note}
                  </p>
                </Reveal>
              )}
            </div>

            <div className={c.flip ? 'lg:col-span-7 lg:col-start-1 lg:row-start-1' : 'lg:col-span-7'}>
              <RevealImage className="overflow-hidden rounded-card-m sm:rounded-card">
                <Parallax strength={0.14} className="relative aspect-[4/3]">
                  <Image
                    src={c.src}
                    alt={c.alt}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="scale-125 object-cover"
                  />
                </Parallax>
              </RevealImage>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
