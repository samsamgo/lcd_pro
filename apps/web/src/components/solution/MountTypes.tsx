'use client'

import { useCallback, useRef, useState } from 'react'

import { Reveal, SceneStack } from '@/components/motion'

/**
 * 취부 방식 — 어디에 어떻게 거는가.
 *
 * 담당자가 견적을 비교할 때 실제로 금액을 가르는 건 화면 크기가 아니라
 * "어디에 어떻게 거느냐"다. 기존 벽을 쓰면 싸고, 지주를 세우면 비싸고,
 * 천장에 달면 구조 검토가 붙는다. 그걸 미리 알면 예산이 안 틀어진다.
 *
 * ─────────────────────────────────────────────────────────────
 * 2026-09-07 2차 개정 (CEO "3가지 한 개씩 좀 예쁘게 띄워줘. 애니메이션들 넣어서" +
 * "까리한 거 들어가야 할 때 넣고, 실사 사진 필요한 부분은 그런 거 넣고").
 *
 * ① 세 방식을 세로로 쌓던 목록을 **한 번에 한 장면**으로 바꿨다.
 * ② 사진을 **한 장도 쓰지 않는다.** 전부 도해다.
 *
 * 🔴 왜 사진을 뺐나 — 벽부형·지주형·천장 행잉 각각의 **진짜 시공 사진이 우리에게 없다.**
 *    `cases/gen/*` 는 전량 AI 연출컷, `cases/case-*` 30장도 AI 생성물(작은 글씨가 비어
 *    한글로 붕괴), `curated/` 는 21장 중 19장이 해외 스톡이다(구조정본 §13-B / §13-C).
 *    "이렇게 설치됩니다" 자리에 연출컷을 넣으면 그 순간 날조가 된다.
 *    2026-09-07 미배선 gen 23장 + spare 를 전수 육안 판독했지만 세 방식을 정직하게
 *    설명하는 컷은 없었다(판독 결과는 구조정본 §13-E).
 *    → 취부 구조는 원래 **도면으로 설명하는 대상**이다. 도해가 사진보다 정확하고,
 *      전송량이 0이며, 진위 문제 자체가 생기지 않는다.
 *    → 실사 시공 사진이 확보되면 이 도해 옆이나 아래에 붙이면 된다.
 *      직전까지 여기 있던 `IMAGES.mountScene`(gen-44)은 삭제하지 않고 `spare` 로 되돌렸다.
 *
 * 🔴 도해는 세 장이 **하나의 그림 체계**다. 화면 사각형·지면선·라벨 위치가 전부 같고,
 *    **파란색은 오직 "그 방식 때문에 추가로 생기는 것"에만 칠한다.**
 *    벽부형은 취부 철물만 파랗고(=기준선), 지주형은 기초와 지주가 통째로 파랗고,
 *    천장 행잉은 매다는 지점이 파랗다. 색만 따라가도 금액 서열이 읽힌다.
 *    이 규칙을 깨면 도해가 그냥 장식이 된다.
 *
 * 🔴 이 섹션의 목적은 예쁜 화면이 아니라 "금액이 어디서 갈리는가"다.
 *    한 개씩 보여주면 비교가 어려워진다 — 그게 이 형식의 유일한 약점이다.
 *    그래서 **비교는 탭 레일이 상시로 맡는다.** 탭에 이름만 적지 않고
 *    금액 신호(기준선 / 기초·지주 / 하중 검토)를 같이 박아 뒀다.
 *    장면을 하나만 보고 있어도 세 방식의 원가 서열은 항상 눈에 있다.
 *
 * 🔴 자동 전환을 넣지 않았다. 근거 3가지 —
 *    ① 장면마다 본문이 4~5줄이라 6초로는 못 읽는다. 읽는 중에 넘어가면 개악이다.
 *    ② 자동전환의 표준 방어책인 hover-pause 가 **모바일에는 없다.** 반쪽짜리 방어다.
 *    ③ 비교를 탭 레일이 이미 맡고 있으므로 자동으로 순회해서 보여줄 이유가 없다.
 *    (히어로·SceneSlider 는 글이 한 줄이라 자동 전환이 성립한다. 여기는 다르다.)
 *
 * 🔴 `<Stagger>` 를 걷어냈다. Stagger 는 자식을 <motion.div> 로 하나씩 감싸서
 *    `first:` / `last:` 가 모든 항목에서 참이 된다(구조정본 §15). 여기서 실제로
 *    구분선과 상하 여백이 통째로 사라졌던 자리다. 목록 자체가 없어져 함정도 없어졌다.
 *
 * 🔴 장면 전환은 `SceneStack` 이다. AnimatePresence(mode="wait") 를 쓰면 전환 중
 *    컨테이너 높이가 무너져 아래 내용이 뛴다. SceneStack 은 세 장면을 같은 그리드 칸에
 *    겹쳐 두고 opacity 만 바꾸므로 높이가 "가장 긴 장면" 으로 고정된다(레이아웃 이동 0).
 *    → 그래서 **조작 요소는 절대 SceneStack 안에 넣지 않는다.** 숨은 층의 버튼에
 *      탭 포커스가 걸린다. '다음 방식' 버튼이 스택 바깥에 있는 이유다.
 */

type Mount = {
  id: 'wall' | 'pylon' | 'ceiling'
  no: string
  name: string
  /** 탭에 같이 박는 금액 신호. 이게 있어야 한 장면만 봐도 서열이 보인다 */
  tag: string
  where: string
  body: string
  /** 무엇이 금액에 얹히는가 — 🔴 금액·배수 숫자는 쓰지 않는다.
   *  소싱 단가가 확정 전이라 숫자를 적으면 지어내는 것이 된다 */
  cost: string
  note: string
  /** 도해 대체 텍스트 */
  figureAlt: string
}

const TYPES: Mount[] = [
  {
    id: 'wall',
    no: '01',
    name: '벽부형',
    tag: '기준선',
    where: '청사 외벽 · 학교 담장 · 로비 벽면',
    body: '기존 벽에 취부 철물을 고정해 화면을 겁니다. 가장 흔하고 가장 저렴합니다. 벽이 하중을 견디는지와 화면 뒤 정비 공간이 나오는지를 봅니다.',
    cost: '추가 공사 없음 (세 방식 중 기준선)',
    note: '화면 뒤로 못 들어가면 앞에서 정비하는 구조로 갑니다',
    figureAlt:
      '벽부형 취부 개념도. 기존 벽에 앵커로 고정한 취부 철물 두 단이 화면을 잡고, 화면과 벽 사이에 정비 공간이 남는다.',
  },
  {
    id: 'pylon',
    no: '02',
    name: '지주형',
    tag: '기초·지주',
    where: '정문 앞 · 도로변 · 주차장 진입로',
    body: '기초를 치고 기둥을 세워 그 위에 화면을 올립니다. 붙일 벽이 없거나 도로에서 보여야 할 때 씁니다.',
    cost: '기초 공사 · 지주 제작 · 구조 검토가 붙습니다',
    note: '옥외광고물 신고 대상이 되는 경우가 가장 많습니다',
    figureAlt:
      '지주형 취부 개념도. 지면 아래 콘크리트 기초 위에 베이스 플레이트와 기둥을 세우고 그 위에 화면을 올린다.',
  },
  {
    id: 'ceiling',
    no: '03',
    name: '천장 행잉',
    tag: '하중 검토',
    where: '강당 무대 · 체육관 · 로비 상부',
    body: '천장 구조물이나 트러스에 매답니다. 바닥을 안 쓰고 시야를 안 가립니다.',
    cost: '매다는 지점 하중 검토와 안전 장치가 붙습니다',
    note: '행사 때 올렸다 내리는 구성도 가능합니다',
    figureAlt:
      '천장 행잉 취부 개념도. 천장 트러스 두 지점에 체인을 걸어 행잉 바를 매달고 그 아래 화면을 건다. 별도의 2차 안전 와이어가 사선으로 추가된다.',
  },
]

/* ────────────────────────────────────────────────────────────
   도해

   좌표계는 세 장이 전부 같다 — 이걸 어기면 전환할 때 화면이 튀어 보인다.
     화면(스크린)  x 96–288 · y 148–300
     지면선        y 430
     라벨          x 24 부터, fontSize 13
   파란색(#3182F6)은 "그 방식 때문에 추가로 생기는 것"에만 쓴다.
   장식 색은 wk-blue 를 쓴다 — 텍스트가 아니라 도형이므로 대비 규정(§3) 대상이 아니다.
   ──────────────────────────────────────────────────────────── */

const ADD = '#3182F6' // 추가로 생기는 것
const ADD_TEXT = '#6BA6F8' // 다크 위 파란 라벨 (배경 #0B0B0F 대비 6.4:1)

/** 세 도해가 공유하는 화면 사각형 */
function Screen() {
  return (
    <g>
      <rect x="96" y="148" width="192" height="152" rx="6" fill={ADD} opacity=".08" />
      <rect
        x="96"
        y="148"
        width="192"
        height="152"
        rx="6"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        opacity=".9"
      />
      {/* 픽셀 격자 암시 */}
      <line x1="192" y1="148" x2="192" y2="300" stroke="currentColor" strokeWidth="1" opacity=".28" />
      <line x1="96" y1="224" x2="288" y2="224" stroke="currentColor" strokeWidth="1" opacity=".28" />
      <text x="182" y="322" fontSize="12" fill="currentColor" opacity=".65">
        화면
      </text>
    </g>
  )
}

/** 세 도해가 공유하는 지면선 */
function Ground() {
  return (
    <g>
      <line x1="24" y1="430" x2="376" y2="430" stroke="currentColor" strokeWidth="2" opacity=".4" />
      {[40, 76, 112, 148, 268, 304, 340].map((x) => (
        <line
          key={x}
          x1={x}
          y1="430"
          x2={x - 14}
          y2="444"
          stroke="currentColor"
          strokeWidth="1"
          opacity=".22"
        />
      ))}
    </g>
  )
}

function MountDiagram({ type }: { type: Mount }) {
  return (
    <div className="wk-pixelgrid relative h-full w-full overflow-hidden rounded-card bg-wk-night">
      <svg
        viewBox="0 0 400 470"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={type.figureAlt}
        className="absolute inset-0 h-full w-full text-wk-nightMuted"
      >
        {type.id === 'wall' && (
          <>
            {/* 기존 벽 — 이미 있는 것이라 강조하지 않는다 */}
            <rect x="316" y="40" width="46" height="390" stroke="currentColor" strokeWidth="2" fill="none" opacity=".6" />
            {[64, 100, 136, 172, 208, 244, 280, 316, 352, 388].map((y) => (
              <line key={y} x1="316" y1={y} x2="362" y2={y - 22} stroke="currentColor" strokeWidth="1" opacity=".25" />
            ))}

            {/* 취부 철물 + 앵커 — 이 방식에서 유일하게 추가되는 것 */}
            {[186, 262].map((y) => (
              <g key={y}>
                <rect x="288" y={y} width="28" height="9" fill={ADD} opacity=".9" />
                <circle cx="320" cy={y + 4} r="5" fill={ADD} />
              </g>
            ))}

            <Screen />

            {/* 정비 공간 치수 */}
            <g opacity=".7">
              <line x1="288" y1="352" x2="316" y2="352" stroke="currentColor" strokeWidth="1.5" />
              <line x1="288" y1="344" x2="288" y2="360" stroke="currentColor" strokeWidth="1.5" />
              <line x1="316" y1="344" x2="316" y2="360" stroke="currentColor" strokeWidth="1.5" />
            </g>

            <Ground />

            <g fontSize="13" fill="currentColor" fontWeight="500">
              <text x="24" y="72">기존 벽 — 있는 것을 그대로 쓴다</text>
              <text x="24" y="378" fill={ADD_TEXT}>
                취부 철물 · 앵커
              </text>
              <text x="24" y="400" opacity=".75">
                뒤쪽 정비 공간을 남긴다
              </text>
            </g>
          </>
        )}

        {type.id === 'pylon' && (
          <>
            <Screen />

            {/* 지주 · 베이스 플레이트 · 지중 기초 — 통째로 추가되는 것 */}
            <rect x="176" y="300" width="32" height="124" fill={ADD} opacity=".9" />
            <rect x="146" y="420" width="92" height="12" fill={ADD} />
            {[156, 228].map((x) => (
              <circle key={x} cx={x} cy="426" r="4" fill="currentColor" opacity=".85" />
            ))}

            <Ground />

            {/* 지면 아래 기초 */}
            <rect x="132" y="432" width="120" height="30" rx="2" fill={ADD} opacity=".28" />
            <rect x="132" y="432" width="120" height="30" rx="2" stroke={ADD} strokeWidth="2" fill="none" />
            {[150, 174, 198, 222, 246].map((x) => (
              <line key={x} x1={x} y1="432" x2={x - 12} y2="462" stroke={ADD} strokeWidth="1" opacity=".55" />
            ))}

            <g fontSize="13" fill="currentColor" fontWeight="500">
              <text x="24" y="352" fill={ADD_TEXT}>
                지주 — 제작 · 구조 검토
              </text>
              <text x="268" y="452" fill={ADD_TEXT}>
                지중 기초
              </text>
              <text x="24" y="72" opacity=".75">
                붙일 벽이 없을 때
              </text>
            </g>
          </>
        )}

        {type.id === 'ceiling' && (
          <>
            {/* 천장 슬래브 */}
            <line x1="24" y1="44" x2="376" y2="44" stroke="currentColor" strokeWidth="2" opacity=".5" />
            {[44, 92, 140, 188, 236, 284, 332].map((x) => (
              <line key={x} x1={x} y1="44" x2={x + 14} y2="30" stroke="currentColor" strokeWidth="1" opacity=".25" />
            ))}

            {/* 트러스 — 이미 있는 구조물 */}
            <rect x="72" y="62" width="256" height="30" stroke="currentColor" strokeWidth="2" fill="none" opacity=".6" />
            <path
              d="M72 92 L104 62 L136 92 L168 62 L200 92 L232 62 L264 92 L296 62 L328 92"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              opacity=".4"
            />

            {/* 매다는 지점 + 체인 — 이 방식에서 추가되는 것 */}
            {[144, 240].map((x) => (
              <g key={x}>
                <circle cx={x} cy="92" r="7" fill={ADD} />
                <line x1={x} y1="99" x2={x} y2="126" stroke={ADD} strokeWidth="4" strokeLinecap="round" />
              </g>
            ))}

            {/* 2차 안전 와이어 */}
            <line x1="104" y1="80" x2="150" y2="140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" opacity=".65" />
            <line x1="296" y1="80" x2="250" y2="140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" opacity=".65" />

            {/* 행잉 바 */}
            <rect x="120" y="126" width="144" height="12" rx="3" fill="currentColor" opacity=".75" />

            <Screen />
            <Ground />

            <g fontSize="13" fill="currentColor" fontWeight="500">
              <text x="24" y="118">천장 구조물 · 트러스</text>
              <text x="24" y="352" fill={ADD_TEXT}>
                매다는 지점 — 하중 검토
              </text>
              <text x="24" y="374" opacity=".75">
                2차 안전 와이어
              </text>
              <text x="24" y="400" opacity=".6">
                바닥을 쓰지 않는다
              </text>
            </g>
          </>
        )}
      </svg>
    </div>
  )
}

export function MountTypes() {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const go = useCallback((next: number) => {
    setActive(next)
    tabRefs.current[next]?.focus()
  }, [])

  /** ← → Home End 로 탭을 옮긴다 (WAI-ARIA tabs 패턴) */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const last = TYPES.length - 1
      let next: number | null = null
      if (e.key === 'ArrowRight') next = (active + 1) % TYPES.length
      else if (e.key === 'ArrowLeft') next = (active + last) % TYPES.length
      else if (e.key === 'Home') next = 0
      else if (e.key === 'End') next = last
      if (next === null) return
      e.preventDefault()
      go(next)
    },
    [active, go],
  )

  return (
    <section aria-labelledby="mount-h" className="wk-sec-lg bg-wk-bgFaint">
      <div className="wk-wrap-wide">
        <Reveal>
          <p className="wk-eyebrow">취부 방식</p>
          <h2 id="mount-h" className="wk-h2 text-wk-ink">
            어디에 어떻게 거느냐가 금액을 가릅니다
          </h2>
          <p className="wk-lead mt-5">
            견적을 비교할 때 금액을 가장 많이 움직이는 건 화면 크기가 아닙니다.
            기존 벽을 쓰면 추가 공사가 없고, 지주를 세우면 기초 공사가 붙습니다.
          </p>
        </Reveal>

        {/* ── 탭 레일 = 상시 비교표 ────────────────────────────
            한 장면만 보고 있어도 세 방식의 이름과 금액 서열이 항상 눈에 있다.
            🔴 탭 타깃 44px 이상(min-h-14 = 56px). 과거 16px·38px 미달 적발 이력. */}
        <Reveal className="mt-10 lg:mt-12" y={14}>
          <div
            role="tablist"
            aria-label="취부 방식"
            onKeyDown={onKeyDown}
            className="grid grid-cols-3 gap-2 border-b border-wk-line sm:gap-3"
          >
            {TYPES.map((t, i) => {
              const on = i === active
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`mount-tab-${t.id}`}
                  aria-selected={on}
                  aria-controls={`mount-panel-${t.id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={[
                    // min-w-0 + flex-wrap — 360px 에서 '03 천장 행잉' 이 버튼 폭을 넘지 않게
                    'flex min-h-14 min-w-0 flex-col justify-center gap-1 rounded-t-btn px-2 py-3 text-left',
                    'border-b-2 transition-colors duration-150 ease-state sm:px-4',
                    on
                      ? 'border-wk-cta bg-white text-wk-ink shadow-wk-1'
                      : 'border-transparent text-wk-ink3 hover:bg-white/70 hover:text-wk-ink2',
                  ].join(' ')}
                >
                  <span className="flex flex-wrap items-baseline gap-x-1.5">
                    <span className="text-caption tabular-nums opacity-60">{t.no}</span>
                    <span className={`break-keep text-body-lg ${on ? 'font-semibold' : 'font-medium'}`}>
                      {t.name}
                    </span>
                  </span>
                  <span className={`break-keep text-caption ${on ? 'text-wk-cta' : 'text-wk-ink4'}`}>
                    {t.tag}
                  </span>
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* ── 장면 = 한 번에 하나 ──────────────────────────── */}
        <div className="mt-8 grid gap-8 lg:mt-12 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* 왼쪽: 도해. 틀은 종횡비 고정이라 전환 중 레이아웃 이동 0 */}
          <div className="lg:col-span-6">
            <SceneStack
              active={active}
              className="aspect-[4/3] w-full sm:aspect-[3/2] lg:aspect-[4/5]"
            >
              {TYPES.map((t) => (
                <MountDiagram key={t.id} type={t} />
              ))}
            </SceneStack>

            {/* 🔴 이 고지를 지우지 마라. 도해를 시공 사진으로 읽히게 두면 안 된다. */}
            <p className="wk-cap mt-3">
              취부 개념도 — 실제 구조는 현장 여건과 구조 검토 결과에 따라 달라집니다
            </p>
          </div>

          {/* 오른쪽: 글. 세 장면을 겹쳐 두므로 높이가 가장 긴 장면으로 고정된다 */}
          <div className="lg:col-span-6">
            <SceneStack active={active}>
              {TYPES.map((t, i) => (
                <div
                  key={t.id}
                  role="tabpanel"
                  id={`mount-panel-${t.id}`}
                  aria-labelledby={`mount-tab-${t.id}`}
                  tabIndex={i === active ? 0 : -1}
                >
                  <p className="wk-eyebrow !text-wk-ink4">{t.where}</p>
                  <h3 className="wk-h3 mt-3 text-wk-ink">{t.name}</h3>
                  <p className="wk-body mt-5">{t.body}</p>

                  <div className="mt-7 rounded-card-m border border-wk-line bg-white p-5 shadow-wk-1 sm:p-6">
                    <p className="text-caption font-semibold uppercase tracking-[0.14em] text-wk-cta">
                      금액 영향
                    </p>
                    <p className="wk-body mt-2 !text-wk-ink">{t.cost}</p>
                  </div>

                  <p className="wk-cap mt-5">→ {t.note}</p>
                </div>
              ))}
            </SceneStack>

            {/* 🔴 조작 요소는 SceneStack 바깥에 둔다. 안에 넣으면 숨은 층의 버튼에 탭 포커스가 간다. */}
            <button
              type="button"
              onClick={() => go((active + 1) % TYPES.length)}
              className="mt-8 inline-flex min-h-14 items-center gap-2 rounded-btn px-4 text-label font-semibold text-wk-cta transition-colors duration-150 ease-state hover:bg-wk-blueWeak"
            >
              다음 방식 · {TYPES[(active + 1) % TYPES.length].name}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <p className="wk-cap mt-12 max-w-[46rem]">
          어느 방식이 맞는지는 실측 때 정합니다. 구조 보강이나 기초 공사가 필요하면
          그 범위와 비용을 확정 견적에 따로 적습니다.
        </p>
      </div>
    </section>
  )
}
