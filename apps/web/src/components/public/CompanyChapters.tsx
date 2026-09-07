import Image from 'next/image'
import { IMAGES } from '@/lib/imageAssets'
import { Parallax, Reveal, RevealImage, SplitText, Stagger } from '@/components/motion'

/**
 * 회사 소개 본문 — 공정 3장(章). 연혁 나열 대신 "어디까지 직접 하는가".
 *
 * 2026-09-07 재설계 —
 * ① 번호가 안 읽히던 문제. 이전에는 '01'이 라벨과 같은 text-label 크기라
 *    옆의 파란 라벨에 시선을 뺏겼고, 라벨 셋이 전부 "직접 ○○는 부분"으로 시작해
 *    서로 구분되지 않았다. 번호를 디스플레이 크기로 올려 유일한 색인으로 삼고,
 *    라벨은 공정명(설계·제작 / 실측·시공 / 운영·유지보수)으로 바꿨다.
 * ② 3장만 좌우를 뒤집던 레이아웃을 없앴다. 뒤집는 순간 화면상 읽는 순서가
 *    번호 순서와 어긋난다. 셋 다 텍스트 5열 + 사진 7열로 고정한다.
 * ③ 02의 라벨("직접 올리는 부분")과 제목("근거 있는 견적")이 서로 다른 얘기였다.
 *    셋 다 "무엇을 어떻게 한다"는 같은 형식의 선언문으로 통일했다.
 *
 * ⚠️ 카피 규칙 — 우리는 아직 첫 수주 전이다.
 *    가동 중인 공장·시공 실적·고객사를 문장으로 만들지 않는다.
 *    지금 사실인 것(기준·절차·책임 범위)만 쓴다.
 *    2026-09-07 에 1장 본문의 "10년의 경험을 바탕으로"를 뺐다. 출처를 댈 수 없다.
 *
 * 2026-09-07 (2차) — "그룹사처럼" 지시 반영.
 * ④ 섹션 머리(공정 / 어디까지 직접 하는가 / 리드)를 붙였다. 고정 장면 다음에 곧바로
 *    '01' 이 나와서 세 장이 무엇의 목록인지 여는 문장이 없었다.
 * ⑤ 장 번호를 text-h1 → text-display-xl 로 올렸다. 번호가 이 섹션의 유일한 색인이므로
 *    제목보다 커야 색인으로 읽힌다.
 * ⑥ 각 장 제목을 h2 → h3 으로 내렸다. 섹션 h2 가 생겨 문서 구조가 한 단 깊어졌다.
 * ⑦ 라이트로 넘어가는 `.wk-bridge-up` 을 여기서 뺐다. 이제 다크 구간의 끝은
 *    CompanyScope 이고, 다리는 그쪽이 소유한다.
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
}

const CHAPTERS: Chapter[] = [
  {
    no: '01',
    label: '설계 · 제작',
    title: '직접 설계하고, 직접 검사합니다',
    body:
      '어떤 모듈을 쓸지, 어떤 프레임에 올릴지, 어떤 검사를 거칠지를 우리가 정합니다. 남이 만든 것을 받아다 파는 방식이 아닙니다.',
    points: ['모듈·프레임 사양 선정', '조립 규격서 작성', '작동·성능 검사 기준'],
    note: 'KC 기준에 맞는 부품을 쓰고, 조립부터 검사까지 직접 봅니다. 그래야 문제가 생겼을 때 어디서 났는지 압니다.',
    src: IMAGES.company.chapter1,
    alt: '작업대 위에서 점검중 문구가 뜬 LED 모듈을 장갑 낀 손으로 들고 점검 체크시트와 대조하는 장면',
  },
  {
    no: '02',
    label: '실측 · 시공',
    title: '규격은 현장에서 확정합니다',
    body:
      '바닥에서 몇 미터인지, 붙일 구조물이 무엇인지, 전기를 어디서 끌어오는지를 현장에서 확인한 뒤 규격을 확정합니다. 사진만으로 정하지 않습니다.',
    points: ['현장 실측 조서', '설치 도면(기존 구조물·지상고 포함)', '취부 상세도'],
    note: '구조와 전기 수치는 임의로 확정하지 않습니다. 구조기술사와 전기 검토를 거친 값만 도면에 올립니다.',
    src: IMAGES.company.chapter2,
    alt: '관공서 로비에서 안전콘과 비계를 두고 벽면 프레임에 LED 캐비닛을 취부하는 시공 인력 두 명',
  },
  {
    no: '03',
    label: '운영 · 유지보수',
    title: '설치 다음 날부터가 본론입니다',
    body:
      '다는 데는 하루면 끝나지만 쓰는 것은 몇 년입니다. 원격으로 먼저 보고, 가서 점검하고, 모듈을 갈고, 결과를 문서로 남깁니다.',
    points: ['모듈 단위 교체', '원격 상태 확인', '장애 처리 결과 보고서'],
    src: IMAGES.company.chapter3,
    alt: '실내 LED 월 앞에서 흡착판으로 모듈 한 장을 전면에서 빼내고 내부 기판을 점검하는 기술자',
  },
]

export function CompanyChapters() {
  return (
    <>
      <section className="wk-sec-lg wk-night" aria-label="우강테크가 직접 하는 일">
        {/* 2026-09-07(2차) 섹션 머리를 붙였다. 이전에는 고정 장면 다음에 곧바로 '01' 이 나와서
            세 장이 무엇의 목록인지 알려 주는 문장이 없었다. 큰 회사 소개일수록
            챕터 앞에 그 챕터를 여는 한 문장이 있다. SplitText 는 여기가 페이지의 두 번째이자
            마지막 사용이다(히어로 h1 과 합해 2 = 설계계약서 §4 상한). */}
        <div className="wk-wrap-wide">
          <Reveal y={0} duration={0.7}>
            <p className="text-label font-semibold uppercase tracking-widest text-wk-blue">공정</p>
          </Reveal>
          <SplitText
            as="h2"
            text="어디까지 직접 하는가"
            className="wk-h1 mt-5 text-wk-nightInk"
            delay={0.08}
          />
          <Reveal delay={0.2} y={16}>
            <p className="wk-lead mt-6 !text-wk-nightMuted">
              세 장면으로 나눠 적었습니다. 장면마다 우리가 만드는 산출물을 함께 둡니다.
            </p>
          </Reveal>
        </div>

        <div className="wk-wrap-wide mt-20 flex flex-col gap-24 md:mt-28 md:gap-32 lg:gap-40">
          {CHAPTERS.map((c) => (
            <article
              key={c.no}
              className="grid gap-8 md:gap-12 lg:grid-cols-12 lg:items-center lg:gap-16"
              aria-labelledby={`chapter-${c.no}`}
            >
              <div className="lg:col-span-5">
                <Reveal y={16}>
                  <div className="flex items-baseline gap-4 border-b border-white/10 pb-4">
                    <span className="wk-metric text-display-xl font-bold leading-none text-white/40">
                      {c.no}
                    </span>
                    <span className="text-label font-semibold uppercase tracking-widest text-wk-blue">
                      {c.label}
                    </span>
                  </div>
                </Reveal>

                <Reveal delay={0.06}>
                  <h3 id={`chapter-${c.no}`} className="wk-h2 mt-7 max-w-[14em] text-wk-nightInk">
                    {c.title}
                  </h3>
                </Reveal>

                <Reveal delay={0.14}>
                  <p className="wk-body mt-6 !text-wk-nightMuted">{c.body}</p>
                </Reveal>

                <Stagger className="mt-8 flex flex-col" y={10}>
                  {c.points.map((p) => (
                    <span
                      key={p}
                      className="border-t border-white/10 py-3 text-label font-medium text-wk-nightInk"
                    >
                      {p}
                    </span>
                  ))}
                </Stagger>

                {c.note && (
                  <Reveal delay={0.2} y={10}>
                    <p className="mt-7 max-w-[38rem] border-l-2 border-white/20 pl-3.5 text-caption text-wk-nightMuted">
                      {c.note}
                    </p>
                  </Reveal>
                )}
              </div>

              <div className="lg:col-span-7">
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
    </>
  )
}
