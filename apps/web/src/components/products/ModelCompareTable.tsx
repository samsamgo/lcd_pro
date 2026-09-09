import Link from 'next/link'

import { envText, FORM_LABEL, PRODUCT_MODELS, ipOf, pitchRange, sizeUnit } from '@/lib/productModels'

/**
 * 시리즈 비교표 — 12종을 한 표에 세운다.
 *
 * 담당자가 여기서 하는 일은 하나다: "우리 자리에 들어갈 시리즈가 어느 것인가."
 * 그래서 열은 자리 고르는 데 필요한 것만 둔다 — 설치 환경 / 구성 단위 / 화소 간격 / 한 장 크기 /
 * 방진·방수. 밝기·소비전력처럼 모델을 정한 뒤에 보는 값은 각 시리즈 상세 규격표에 있다.
 *
 * 🔴 2026-09-09 CEO 지시 — '간격 종류'·'보는 거리(어림)' 두 열과 보는 거리 각주를 없앴다.
 *    되살리지 마라. (`viewingHint()` 는 productModels 에 남아 있지만 이 표에서는 쓰지 않는다)
 *
 * 값은 손으로 적지 않는다. 전부 lib/productModels.ts 에서 계산한다.
 */
const TH = 'whitespace-nowrap px-4 py-3 text-left text-caption font-semibold'
const TD = 'whitespace-nowrap px-4 py-3.5 text-label text-wk-ink'

export function ModelCompareTable() {
  const rows = [...PRODUCT_MODELS].sort((a, b) => {
    const order = { indoor: 0, outdoor: 1, rental: 2 }
    return order[a.env] - order[b.env] || a.series.localeCompare(b.series)
  })

  return (
    <section className="wk-sec bg-white" aria-labelledby="cmp-h">
      <div className="wk-wrap">
        <p className="wk-eyebrow">시리즈 비교</p>
        <h2 id="cmp-h" className="wk-h2 text-wk-ink">
          시리즈 {rows.length}종 한눈에
        </h2>
        <p className="mt-3 max-w-[46em] text-body text-wk-ink2">
          자리를 고르는 데 필요한 값만 세웠습니다. 밝기·소비전력·색온도 같은 나머지 규격은 각 시리즈를 누르면
          화소 간격별 표로 나옵니다.
        </p>

        <div className="mt-8 overflow-hidden rounded-card border border-wk-line">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">제품 시리즈 규격 비교</caption>
              <thead>
                <tr className="bg-wk-ink text-white">
                  <th scope="col" className={TH}>
                    시리즈
                  </th>
                  <th scope="col" className={TH}>
                    설치 환경
                  </th>
                  <th scope="col" className={TH}>
                    구성 단위
                  </th>
                  <th scope="col" className={TH}>
                    화소 간격
                  </th>
                  <th scope="col" className={TH}>
                    한 장 크기
                  </th>
                  <th scope="col" className={TH}>
                    방진·방수
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m, i) => (
                  <tr key={m.slug} className={i % 2 === 1 ? 'bg-wk-bgFaint' : 'bg-white'}>
                    <th scope="row" className={`${TD} border-t border-wk-line font-semibold`}>
                      <Link
                        href={`/products/models/${m.slug}`}
                        className="wk-metric font-bold text-wk-ink underline-offset-4 hover:text-wk-cta hover:underline"
                      >
                        {m.series}
                      </Link>
                      <span className="mt-0.5 block text-caption font-normal text-wk-ink3">{m.name}</span>
                    </th>
                    <td className={`${TD} border-t border-wk-line`}>{envText(m)}</td>
                    <td className={`${TD} border-t border-wk-line`}>{FORM_LABEL[m.form]}</td>
                    <td className={`${TD} wk-metric border-t border-wk-line font-semibold text-wk-cta`}>
                      {pitchRange(m)}
                    </td>
                    <td className={`${TD} wk-metric border-t border-wk-line`}>{sizeUnit(m) || '-'}</td>
                    <td className={`${TD} wk-metric border-t border-wk-line`}>
                      {ipOf(m) || <span className="text-wk-disabled">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="wk-cap mt-4">
          방진·방수 칸이 비어 있는 것은 규격서에 등급 표기가 없는 항목입니다(주로 실내 모듈). 지어내지 않고 비워
          둡니다.
        </p>
      </div>
    </section>
  )
}
