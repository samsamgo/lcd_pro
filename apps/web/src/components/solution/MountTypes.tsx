import Image from 'next/image'

import { IMAGES } from '@/lib/imageAssets'
import { Reveal, Stagger } from '@/components/motion'

/**
 * 취부 방식 — 어디에 어떻게 거는가.
 *
 * 왜 만들었나 — /services 에서 행정 성격 섹션 두 개를 걷어내고 나니 얇아졌다.
 * 그 자리를 다시 행정 얘기로 채우면 같은 실수다. 전광판 회사가 할 말로 채운다.
 *
 * 담당자가 견적을 비교할 때 실제로 금액을 가르는 건 화면 크기가 아니라
 * "어디에 어떻게 거느냐"다. 기존 벽을 쓰면 싸고, 지주를 세우면 비싸고,
 * 천장에 달면 구조 검토가 붙는다. 그걸 미리 알면 예산이 안 틀어진다.
 *
 * ─────────────────────────────────────────────────────────────
 * 2026-09-07 수리 (CEO "취부 방식 적어논 페이지 부분 좀 이상하고"). 진단 3건:
 *
 * ① 🔴 구분선과 여백이 통째로 사라져 세 항목이 한 덩어리로 뭉쳐 있었다. 원인은
 *    `<Stagger>` 다. Stagger 는 자식 하나하나를 <motion.div> 로 감싼다
 *    (components/motion/index.tsx 의 Children.map). 그래서 항목 div 는 자기 래퍼의
 *    유일한 자식이 되고, `first:` / `last:` (= :first-child / :last-child) 가
 *    **모든 항목에서 참**이 된다. `py-6 first:pt-0 last:border-0 last:pb-0` 는 결국
 *    전 항목에 pt-0 · pb-0 · border-0 으로 적용됐다 — 상하 패딩 0, 구분선 0.
 *    → 구분선은 래퍼(Stagger 의 직접 자식)에 걸리는 `divide-y` 로 옮겼다.
 *    🔴 Stagger 안에서는 first:/last: 를 쓰지 말 것. 같은 결함이 다른 섹션에도 있다
 *       (components/public/AfterService.tsx 의 STEPS 목록).
 *
 * ② h2 는 "금액을 가릅니다" 라고 선언해 놓고 세 항목 어디에도 금액 신호가 없었다.
 *    독자는 약속된 판단 근거를 못 받고 설명문 세 덩이만 읽는다.
 *    → 항목마다 `cost` 한 줄(무엇이 추가로 붙는가)을 넣어 제목의 약속을 지킨다.
 *    🔴 금액·배수는 적지 않는다. 소싱 단가가 확정 전이라 숫자는 지어내는 것이 된다.
 *
 * ③ 좌측 사진이 `aspect-[3/4]`(세로 4:3) 고정이라 데스크톱에서 약 730px 로 커졌는데
 *    우측 글은 500px 도 안 됐다. 글이 `lg:self-center` 로 가운데 뜨면서 위아래에
 *    100px 넘는 빈칸이 생겼다 — 이게 "이상하다"의 실제 정체다.
 *    → 사진을 열 높이에 맞춰 늘리고(lg:h-full) 글의 self-center 를 뺐다.
 *      모바일에서는 4:3 가로로 둔다. 세로 사진은 첫 화면을 통째로 먹는다.
 */

const TYPES = [
  {
    name: '벽부형',
    where: '청사 외벽 · 학교 담장 · 로비 벽면',
    body: '기존 벽에 취부 철물을 고정해 화면을 겁니다. 가장 흔하고 가장 저렴합니다. 벽이 하중을 견디는지와 화면 뒤 정비 공간이 나오는지를 봅니다.',
    /** 무엇이 금액에 얹히는가 — 숫자는 쓰지 않는다 */
    cost: '추가 공사 없음 (세 방식 중 기준선)',
    note: '화면 뒤로 못 들어가면 앞에서 정비하는 구조로 갑니다',
  },
  {
    name: '지주형',
    where: '정문 앞 · 도로변 · 주차장 진입로',
    body: '기초를 치고 기둥을 세워 그 위에 화면을 올립니다. 붙일 벽이 없거나 도로에서 보여야 할 때 씁니다.',
    cost: '기초 공사 · 지주 제작 · 구조 검토가 붙습니다',
    note: '옥외광고물 신고 대상이 되는 경우가 가장 많습니다',
  },
  {
    name: '천장 행잉',
    where: '강당 무대 · 체육관 · 로비 상부',
    body: '천장 구조물이나 트러스에 매답니다. 바닥을 안 쓰고 시야를 안 가립니다.',
    cost: '매다는 지점 하중 검토와 안전 장치가 붙습니다',
    note: '행사 때 올렸다 내리는 구성도 가능합니다',
  },
]

export function MountTypes() {
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

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-12 lg:items-stretch lg:gap-8">
          <Reveal className="lg:col-span-5">
            {/* 모바일은 4:3 가로, 데스크톱은 글 높이에 맞춰 늘어난다 */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-card lg:aspect-auto lg:h-full lg:min-h-[26rem]">
              <Image
                src={IMAGES.mountScene}
                alt="고소작업차 바스켓에 오른 작업자 두 명이 크레인으로 들어 올린 LED 캐비닛을 건물 외벽에 고정하고 있다"
                fill
                sizes="(min-width:1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          {/* 🔴 구분선은 여기(Stagger 의 직접 자식 = 래퍼)에 건다.
              항목 div 에 first:/last: 를 쓰면 Stagger 래퍼 때문에 전부 참이 된다. */}
          <Stagger
            className="divide-y divide-wk-line lg:col-span-7"
            y={12}
            gap={0.07}
          >
            {TYPES.map((t) => (
              <div key={t.name} className="py-6">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="wk-h3 text-wk-ink">{t.name}</h3>
                  <p className="wk-cap !text-wk-ink3">{t.where}</p>
                </div>
                <p className="wk-body mt-3">{t.body}</p>
                <p className="mt-3.5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-label">
                  <span className="font-semibold uppercase tracking-[0.14em] text-wk-cta">
                    금액 영향
                  </span>
                  <span className="text-wk-ink2">{t.cost}</span>
                </p>
                <p className="wk-cap mt-2">→ {t.note}</p>
              </div>
            ))}
          </Stagger>
        </div>

        <p className="wk-cap mt-10 max-w-[46rem]">
          어느 방식이 맞는지는 실측 때 정합니다. 구조 보강이나 기초 공사가 필요하면
          그 범위와 비용을 확정 견적에 따로 적습니다.
        </p>
      </div>
    </section>
  )
}
