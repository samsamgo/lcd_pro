'use client'

import { useState } from 'react'
import Link from 'next/link'

import { INDUSTRIES, INDUSTRY_GROUPS, type IndustryGroup } from '@/lib/industries'
import { PRODUCTS } from '@/lib/products'
import { Reveal, RiseMask, Stagger } from '@/components/motion'
import { PitchDots } from './PitchDots'

type GroupFilter = 'all' | IndustryGroup
type EnvFilter = 'all' | 'indoor' | 'outdoor'

const GROUP_FILTERS: { key: GroupFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  ...INDUSTRY_GROUPS,
]

const ENV_FILTERS: { key: EnvFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'indoor', label: '실내' },
  { key: 'outdoor', label: '옥외' },
]

const chipClass = (on: boolean) =>
  `h-10 rounded-full px-4 text-label font-semibold transition-colors duration-state ease-state ${
    on ? 'bg-wk-ink text-white' : 'bg-white text-wk-ink3 hover:bg-wk-line'
  }`

/**
 * 설치 자리별 한눈에 비교.
 *
 * 왜 만들었나 — /industries 가 히어로 + 카드 6장 + CTA 뿐이라 알맹이가 없었다.
 * 정작 업종마다의 판단 근거(무엇이 문제고, 어떤 규격으로 가고, 왜 그 규격인가)는
 * `lib/industries.ts` 에 이미 다 들어 있는데 카드 뒤 모달에 숨어 있었다.
 * 모달은 눌러야 열린다. 누르지 않는 사람이 대부분이다. 그래서 표로 꺼냈다.
 *
 * 손으로 적은 숫자는 없다. 화소 간격·시청 거리는 `PRODUCTS` 의 실제 값에서 계산한다.
 */
export function IndustryCompare() {
  const [group, setGroup] = useState<GroupFilter>('all')
  const [env, setEnv] = useState<EnvFilter>('all')
  const [expanded, setExpanded] = useState(false)
  const rows = INDUSTRIES.map((i) => {
    const items = i.recommendedSkus
      .map((s) => PRODUCTS.find((p) => p.sku === s))
      .filter((p): p is NonNullable<typeof p> => !!p)

    const pitches = items.map((p) => Number(p.pitch.slice(1))).filter((n) => !Number.isNaN(n))
    const pitch =
      pitches.length === 0
        ? '미상'
        : Math.min(...pitches) === Math.max(...pitches)
          ? `${Math.min(...pitches)}mm`
          : `${Math.min(...pitches)}~${Math.max(...pitches)}mm`

    return {
      slug: i.slug,
      group: i.group,
      environment: i.environment,
      /** 도해용 대표 피치(가장 촘촘한 값). 값이 없으면 그리지 않는다 */
      pitchMin: pitches.length ? Math.min(...pitches) : null,
      name: i.nameKo,
      env: i.environment === 'indoor' ? '실내' : '옥외',
      pitch,
      distance: items[0]?.viewingDistance ?? '미상',
      pain: i.pains[0],
    }
  })
  const filteredRows = rows.filter(
    (r) => (group === 'all' || r.group === group) && (env === 'all' || r.environment === env),
  )
  const visibleRows = expanded ? filteredRows : filteredRows.slice(0, 6)

  const changeGroup = (next: GroupFilter) => {
    setGroup(next)
    setExpanded(false)
  }

  const changeEnv = (next: EnvFilter) => {
    setEnv(next)
    setExpanded(false)
  }

  return (
    <section aria-labelledby="ind-compare-h" className="wk-sec bg-wk-bgFaint">
      <div className="wk-wrap">
        {/* 섹션 머리 3박자(§16-C). RiseMask 는 Reveal 밖 형제(§16-D) */}
        <Reveal y={10}>
          <p className="wk-eyebrow">한눈에 비교</p>
        </Reveal>
        <RiseMask delay={0.06}>
          <h2 id="ind-compare-h" className="wk-h2 text-wk-ink">
            어디에 놓느냐가 규격을 정합니다
          </h2>
        </RiseMask>
        <Reveal y={14} delay={0.16}>
          <p className="wk-lead mt-5">보는 거리에 따라 화소 간격이 갈립니다.</p>
        </Reveal>

        <div className="mt-7 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-caption font-semibold text-wk-ink3">시설</span>
            {GROUP_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => changeGroup(f.key)}
                aria-pressed={group === f.key}
                className={chipClass(group === f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-caption font-semibold text-wk-ink3">환경</span>
            {ENV_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => changeEnv(f.key)}
                aria-pressed={env === f.key}
                className={chipClass(env === f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* 데스크톱 — 표 */}
        <div className="mt-12 hidden overflow-x-auto md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-wk-line2">
                {/* 🔴 2026-09-07 — 원래 '가장 많이 듣는 고민' 이었다. 우리는 첫 수주 전이라
                    들은 적이 없다. 빈도를 주장하는 표기는 관공서 상대로 실적 허위기재로 읽힌다.
                    같은 계열('인기'·'추천'·'대부분의 고객이')은 전수로 걷어냈다. [[company-vs-reference]] */}
                {['설치 자리', '설치 환경', '화소 간격', '보는 거리', '설치 전 검토할 것'].map((h) => (
                  <th key={h} className="pb-3 pr-6 text-caption font-semibold text-wk-ink3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((r) => (
                <tr key={r.slug} className="wk-hov-cell wk-hov-cell-faint border-b border-wk-line bg-wk-bgFaint">
                  <th scope="row" className="py-4 pr-6 align-top">
                    <Link
                      href={`/industries/${r.slug}`}
                      className="font-semibold text-wk-ink underline-offset-4 hover:underline"
                    >
                      {r.name}
                    </Link>
                  </th>
                  <td className="py-4 pr-6 align-top text-body text-wk-ink2">{r.env}</td>
                  {/* 숫자 옆에 그 간격을 **같은 배율로 그린 화소 도해**를 나란히 둔다.
                      "3mm 와 6mm 가 얼마나 다른가" 는 숫자보다 격자가 빠르다.
                      사진이 아니라 코드라 전송량 0 · 진위 문제 0 이다. */}
                  <td className="py-4 pr-6 align-top">
                    <span className="flex items-center gap-2.5">
                      {r.pitchMin !== null && (
                        <PitchDots pitchMm={r.pitchMin} pxPerMm={2.2} className="h-7 w-14 shrink-0 rounded-btn" />
                      )}
                      <span className="wk-metric text-body font-semibold text-wk-ink">
                        {r.pitch}
                      </span>
                    </span>
                  </td>
                  <td className="py-4 pr-6 align-top text-body text-wk-ink2">{r.distance}</td>
                  <td className="py-4 align-top text-label leading-relaxed text-wk-ink3">
                    {r.pain}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 모바일 — 표는 안 읽힌다. 카드로 편다 */}
        <Stagger className="mt-10 grid grid-cols-1 gap-3 md:hidden" y={12} gap={0.05}>
          {visibleRows.map((r) => (
            <div key={r.slug} className="rounded-card border border-wk-line bg-white p-5">
              <p className="font-semibold text-wk-ink">{r.name}</p>
              <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                <div>
                  <dt className="text-caption text-wk-ink3">환경</dt>
                  <dd className="text-body font-medium text-wk-ink2">{r.env}</dd>
                </div>
                <div>
                  <dt className="text-caption text-wk-ink3">화소 간격</dt>
                  <dd className="wk-metric text-body font-semibold text-wk-ink">{r.pitch}</dd>
                </div>
                <div>
                  <dt className="text-caption text-wk-ink3">보는 거리</dt>
                  <dd className="text-body font-medium text-wk-ink2">{r.distance}</dd>
                </div>
              </dl>
              <p className="wk-cap mt-3 !text-wk-ink3">{r.pain}</p>
            </div>
          ))}
        </Stagger>

        {filteredRows.length > 6 && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className={chipClass(expanded)}
            >
              {expanded ? '접기' : `더 보기 (${filteredRows.length - 6}개)`}
            </button>
          </div>
        )}

        <p className="wk-cap mt-8">규격서 기준값이며, 확정 사양은 현장 실측 후 정해집니다.</p>
      </div>
    </section>
  )
}
