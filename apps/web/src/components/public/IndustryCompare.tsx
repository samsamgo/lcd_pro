import Link from 'next/link'

import { INDUSTRIES } from '@/lib/industries'
import { PRODUCTS } from '@/lib/products'
import { Reveal, RiseMask, Stagger } from '@/components/motion'
import { PitchDots } from './PitchDots'

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
      /** 도해용 대표 피치(가장 촘촘한 값). 값이 없으면 그리지 않는다 */
      pitchMin: pitches.length ? Math.min(...pitches) : null,
      name: i.nameKo,
      env: i.environment === 'indoor' ? '실내' : '옥외',
      pitch,
      distance: items[0]?.viewingDistance ?? '미상',
      pain: i.pains[0],
    }
  })

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
          <p className="wk-lead mt-5">
            같은 전광판이라도 민원실과 도로변은 필요한 화소 간격이 다릅니다.
            시설을 고르는 게 아니라 <b>보는 거리를 고르는 것</b>에 가깝습니다.
          </p>
        </Reveal>

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
              {rows.map((r) => (
                <tr key={r.slug} className="wk-hov-cell wk-hov-cell-faint border-b border-wk-line bg-wk-bgFaint">
                  <th scope="row" className="py-4 pr-6 align-top">
                    <Link
                      href={`/industries?type=${r.slug}`}
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
          {rows.map((r) => (
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

        <p className="wk-cap mt-8">
          표의 화소 간격과 보는 거리는 제품 규격서 기준값입니다. 현장 조건에 따라 달라지며,
          확정 사양은 현장을 실측한 뒤에 정해집니다.
        </p>
      </div>
    </section>
  )
}
