import Image from 'next/image'
import { IMAGES } from '@/lib/imageAssets'
import { Parallax, Reveal, RevealImage, ScrollBridge, SplitText } from '@/components/motion'

/**
 * 🔴 2026-09-08 QA — **`/about` 에서 배선 해제. 현재 참조 0건.** (CompanyScope 선례)
 *    한 페이지 통독 결과 02장 본문 ≈ ProcessOverview 01(현장 실측) 문장, 03장 표 ≈ 06(인계·유지보수)
 *    문장이었고, 같은 페이지에 "하는 일"이 4(CompanyOverview 사진)·3(여기)·6(공정표)로 세 번
 *    나뉘어 있었다. 되돌리려면 page.tsx 에 한 줄 넣으면 되지만, 그 전에 여기 문장을
 *    ProcessOverview 와 겹치지 않게 먼저 정리할 것. 아래 `id="process"` 는 page.tsx 래퍼와 충돌하므로
 *    되살릴 때 반드시 뺀다.
 *
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
 * 2026-09-07 (3차) — CEO 지시 "드리는 서류도 빼. 그런 거 안 줘."
 * 각 장 아래 붙어 있던 산출물 목록 9개(조립 규격서·실측 조서·설치 도면·취부 상세도·
 * 장애 처리 결과 보고서 등)와 섹션 리드의 "산출물을 함께 둡니다" 문장을 전부 없앴다.
 * 🔴 주지도 않을 문서를 목록으로 적어 두면 그게 그대로 클레임 근거가 된다.
 *    이 자리에 다시 문서 목록을 붙이지 말 것. 세 장은 "무엇을 직접 하는가"만 말한다.
 * 목록이 빠지면서 3장 좌측 열이 1·2장보다 짧아지므로 3장에도 note 를 하나 붙여
 * 세 장의 좌우 균형을 맞췄다.
 *
 * ⚠️ 카피 규칙 — 우리는 아직 첫 수주 전이다.
 *    가동 중인 공장·시공 실적·고객사를 문장으로 만들지 않는다.
 *    지금 사실인 것(기준·절차·책임 범위)만 쓴다.
 *    2026-09-07 에 1장 본문의 "10년의 경험을 바탕으로"를 뺐다. 출처를 댈 수 없다.
 *
 * 2026-09-07 (3차) — CEO *"회사 소개가 좀 별로야."*
 * ⑧ **이 섹션이 /about 의 유일한 서사 구간이 됐다.** `Manifesto`(원칙 3줄 고정 장면)를
 *    페이지에서 뺐기 때문이다. 뺀 이유는 이 파일과 **같은 말을 하고 있었다**는 것이다 —
 *    Manifesto 주석이 스스로 "01 = 2장과 같은 절차 / 02 = 1장과 같은 얘기 /
 *    03 = 3장 문장을 그대로 쓴다" 고 적어 두고 있었다.
 *    🔴 그러니 여기에 그 세 줄을 다시 옮겨 붙이지 마라. 중복을 없애려고 뺀 것이다.
 * ⑨ 섹션 리드를 사실에 맞게 고쳤다. "남에게 넘기는 구간이 어디인지도 같이 적습니다" 는
 *    실제로 지키지 않는 약속이었다(외부 위임 표기는 02장 note 한 곳뿐이다).
 *    지키지 못할 약속을 리드에 적으면 그게 그대로 클레임 근거가 된다.
 * ⑩ 라이트로 넘어가는 `.wk-bridge-up` 소유가 여기로 되돌아왔다(CompanyScope 폐기).
 *
 * 2026-09-07 (2차) — "그룹사처럼" 지시 반영.
 * ④ 섹션 머리(공정 / 어디까지 직접 하는가 / 리드)를 붙였다. 고정 장면 다음에 곧바로
 *    '01' 이 나와서 세 장이 무엇의 목록인지 여는 문장이 없었다.
 * ⑤ 장 번호를 text-h1 → text-display-xl 로 올렸다. 번호가 이 섹션의 유일한 색인이므로
 *    제목보다 커야 색인으로 읽힌다.
 * ⑥ 각 장 제목을 h2 → h3 으로 내렸다. 섹션 h2 가 생겨 문서 구조가 한 단 깊어졌다.
 * ⑦ 라이트로 넘어가는 `.wk-bridge-up` 을 여기서 뺐다. 이제 다크 구간의 끝은
 *    CompanyScope 이고, 다리는 그쪽이 소유한다.
 *
 * ─────────────────────────────────────────────────────────────
 * 2026-09-07 (4차) CEO 지시 *"한눈에 보기도 좀 더 보기 쉽게. 각 페이지 좀 더 업그레이드."*
 *
 * ⑪ **제목만 훑으면 페이지가 파악되게 바꿨다.** 이전 세 제목은
 *    "직접 설계하고, 직접 검사합니다 / 규격은 현장에서 확정합니다 / 설치 다음 날부터가 본론입니다"
 *    — 셋 다 좋은 문장이지만 **무슨 공정인지 제목만으로는 안 잡혔다.** 공정명은 옆의
 *    작은 파란 라벨에만 있었다. 세 제목을 히어로 h1 의 세 동사에 맞춰 짧게 다시 썼다:
 *      h1  LED 전광판을 만들고, 달고, 고칩니다
 *      01  직접 만듭니다   02  현장에서 재고 답니다   03  모듈만 갈아 고칩니다
 *    🔴 이 대응이 이 페이지의 구조다. 한쪽만 고치면 깨진다.
 * ⑫ **각 장의 `note` 산문을 라벨 표로 바꿨다.** 인용부호 한 덩어리는 스캔이 안 된다.
 *    문장은 그대로 두고 앞에 라벨(부품·검사·구조·전기·점검·교체·보증)을 붙여 행으로 쪼갰다.
 *    🔴 새 주장을 만든 것이 아니다. 기존 note 문장을 나눠 담았을 뿐이다.
 *    🔴 이 표에 산출물·서류 항목을 다시 넣지 마라(3차에 걷어낸 것이다).
 * ⑬ 장 간격을 gap-24/32/40 → gap-16/20/24 로 줄였다. 새 정보 없이 스크롤만 먹던 구간이다.
 * ⑭ `.wk-bridge-up` 을 `ScrollBridge` 로 승격했다 — 페이지에서 가장 큰 전환부인데
 *    지금까지 그냥 그라디언트 <div> 였다. 화소 격자가 다리에서 켜졌다 꺼진다.
 *    이미지 0장·전송량 0B, 예산은 "장 전환 다리마다 1"(설계계약서 §4) 안이다.
 * ⑮ 사진에 `.wk-emit`(베젤 + 상단 스페큘러)을 얹었다. 다크 면 위 미디어를
 *    "인쇄된 사각형" 이 아니라 "켜져 있는 화면" 으로 읽히게 한다. CSS ::after 하나, 0B.
 *    🔴 사진에 호버 확대는 걸지 않았다 — `<Image>` 에 `scale-125` 가 이미 걸려 있어
 *       `.wk-hov-media` 의 `scale(1.03)` 이 그걸 덮어쓰고 패럴랙스 가장자리가 터진다.
 * ⑯ 섹션에 `id="process"` 를 붙였다. 요약표(`CompanyAtAGlance`) 1행이 여기를 가리킨다.
 */
type Chapter = {
  no: string
  label: string
  title: string
  body: string
  /** 라벨 + 한 줄. 산문 대신 스캔되는 형태로 적는다 */
  facts: { k: string; v: string }[]
  src: string
  alt: string
}

const CHAPTERS: Chapter[] = [
  {
    no: '01',
    label: '설계 · 제작',
    title: '직접 만듭니다',
    body:
      '어떤 모듈을 쓸지, 어떤 프레임에 올릴지, 어떤 검사를 거칠지를 우리가 정합니다. 남이 만든 것을 받아다 파는 방식이 아닙니다.',
    facts: [
      { k: '부품', v: 'KC 기준에 맞는 부품을 씁니다' },
      { k: '검사', v: '조립부터 검사까지 직접 봅니다. 그래야 문제가 생겼을 때 어디서 났는지 압니다' },
    ],
    src: IMAGES.company.chapter1,
    alt: '작업대 위에서 점검중 문구가 뜬 LED 모듈을 장갑 낀 손으로 들고 점검 체크시트와 대조하는 장면',
  },
  {
    no: '02',
    label: '실측 · 시공',
    title: '현장에서 재고 답니다',
    body:
      '바닥에서 몇 미터인지, 붙일 구조물이 무엇인지, 전기를 어디서 끌어오는지를 현장에서 확인한 뒤 규격을 확정합니다. 사진만으로 정하지 않습니다.',
    facts: [
      { k: '구조', v: '구조기술사 검토를 거친 값만 도면에 올립니다' },
      { k: '전기', v: '전기 검토를 거치지 않은 수치는 임의로 확정하지 않습니다' },
    ],
    src: IMAGES.company.chapter2,
    alt: '관공서 로비에서 안전콘과 비계를 두고 벽면 프레임에 LED 캐비닛을 취부하는 시공 인력 두 명',
  },
  {
    no: '03',
    label: '운영 · 유지보수',
    title: '모듈만 갈아 고칩니다',
    body:
      '다는 데는 하루면 끝나지만 쓰는 것은 몇 년입니다. 설치 다음 날부터가 본론입니다.',
    facts: [
      { k: '점검', v: '원격으로 먼저 보고, 필요하면 가서 점검합니다' },
      { k: '교체', v: '문제 있는 모듈만 갈아 끼웁니다. 화면을 통째로 뜯지 않습니다' },
      { k: '보증', v: '무상보증 기간과 예비 부품 조건은 계약할 때 정합니다' },
    ],
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
              설계·제작, 실측·시공, 운영·유지보수. 세 구간에서 우리가 무엇을 직접 하는지
              그대로 적습니다.
            </p>
          </Reveal>
        </div>

        <div className="wk-wrap-wide mt-16 flex flex-col gap-16 md:mt-20 md:gap-20 lg:gap-24">
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

                {/* 산문 대신 라벨 표. 🔴 Stagger 를 쓰지 않는다 —
                    Stagger 는 자식을 래퍼로 감싸 first:/last: 를 전부 참으로 만든다(구조정본 §15).
                    Reveal 은 자신이 컨테이너라 divide-y 가 정상 동작한다. */}
                <Reveal delay={0.2} y={10}>
                  <dl className="mt-8 max-w-[38rem] divide-y divide-white/10 border-y border-white/10">
                    {c.facts.map((f) => (
                      <div key={f.k} className="flex gap-4 py-3">
                        <dt className="w-14 shrink-0 text-caption font-semibold uppercase tracking-widest text-wk-blue">
                          {f.k}
                        </dt>
                        <dd className="break-keep text-caption text-wk-nightMuted">{f.v}</dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              </div>

              <div className="lg:col-span-7">
                <RevealImage className="wk-emit overflow-hidden rounded-card-m sm:rounded-card">
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

      {/* 다크 구간 끝 → 법인 정보(라이트)로 넘어가는 다리. 설계계약서 §3.
          2026-09-07(4차) 그냥 그라디언트 <div> 였던 것을 ScrollBridge 로 승격했다 —
          이 페이지에서 가장 큰 전환부인데 아무 일도 일어나지 않아 두 장이 그냥 붙어 있었다.
          코드로 그리므로 이미지 0장·전송량 0B. reduced-motion 은 부품이 자체 처리한다. */}
      <ScrollBridge direction="up" className="wk-bridge-up h-20 md:h-28" cell={16} />
    </>
  )
}
