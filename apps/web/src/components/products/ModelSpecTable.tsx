import type { ProductModel } from '@/lib/productModels'

/**
 * 모델 규격표 — **행 = 항목, 열 = 화소 간격.**
 *
 * 담당자가 이 표를 결재 문서로 그대로 옮겨 적는다. 그래서
 *  ① 값은 공급사 규격서 표기 그대로 옮긴다(단위·기호 포함).
 *  ② 전 간격이 같은 값이면 한 칸으로 합쳐 쓴다(colSpan) — 같은 숫자를 여덟 번 적지 않는다.
 *  ③ 읽히지 않거나 명백한 오기인 칸은 '-' 로 비운다. 지어내지 않는다.
 *
 * 열이 최대 9개까지 가므로 가로 스크롤이 필요하다. 첫 열(항목명)은 스크롤해도 붙어 있게 한다.
 */
export function ModelSpecTable({ model }: { model: ProductModel }) {
  return (
    <div className="overflow-hidden rounded-card border border-wk-line">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">{model.series} 화소 간격별 규격</caption>
          <thead>
            <tr className="bg-wk-ink text-white">
              <th
                scope="col"
                className="sticky left-0 z-10 min-w-[150px] bg-wk-ink px-4 py-3 text-caption font-semibold"
              >
                항목
              </th>
              {model.pitches.map((p) => (
                <th
                  key={p}
                  scope="col"
                  className="wk-metric whitespace-nowrap px-4 py-3 text-center text-caption font-semibold"
                >
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {model.specRows.map((row, ri) => {
              const merged = row.single !== undefined
              return (
                <tr key={row.label} className={ri % 2 === 1 ? 'bg-wk-bgFaint' : 'bg-white'}>
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 min-w-[150px] border-t border-wk-line px-4 py-3 text-caption font-semibold text-wk-ink2 ${
                      ri % 2 === 1 ? 'bg-wk-bgFaint' : 'bg-white'
                    }`}
                  >
                    {row.label}
                  </th>
                  {merged ? (
                    <td
                      colSpan={model.pitches.length}
                      className="wk-metric border-t border-wk-line px-4 py-3 text-center text-caption text-wk-ink"
                    >
                      {row.single === '' ? '-' : row.single}
                    </td>
                  ) : (
                    model.pitches.map((p, i) => {
                      const v = row.values?.[i] ?? ''
                      return (
                        <td
                          key={p}
                          className="wk-metric whitespace-nowrap border-t border-wk-line px-4 py-3 text-center text-caption text-wk-ink"
                        >
                          {v === '' ? <span className="text-wk-disabled">-</span> : v}
                        </td>
                      )
                    })
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
