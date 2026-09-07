import Link from 'next/link'

import { INDUSTRIES } from '@/lib/industries'
import { PRODUCTS } from '@/lib/products'
import { Reveal, Stagger } from '@/components/motion'

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
        <Reveal>
          <p className="wk-eyebrow">한눈에 비교</p>
          <h2 id="ind-compare-h" className="wk-h2 text-wk-ink">
            어디에 놓느냐가 규격을 정합니다
          </h2>
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
                {['설치 자리', '설치 환경', '화소 간격', '보는 거리', '가장 많이 듣는 고민'].map((h) => (
                  <th key={h} className="pb-3 pr-6 text-caption font-semibold text-wk-ink3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.slug} className="border-b border-wk-line">
                  <th scope="row" className="py-4 pr-6 align-top">
                    <Link
                      href={`/industries?type=${r.slug}`}
                      className="font-semibold text-wk-ink underline-offset-4 hover:underline"
                    >
                      {r.name}
                    </Link>
                  </th>
                  <td className="py-4 pr-6 align-top text-body text-wk-ink2">{r.env}</td>
                  <td className="wk-metric py-4 pr-6 align-top text-body font-semibold text-wk-ink">
                    {r.pitch}
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
          확정 사양은 실측 후 규격서로 드립니다.
        </p>
      </div>
    </section>
  )
}
