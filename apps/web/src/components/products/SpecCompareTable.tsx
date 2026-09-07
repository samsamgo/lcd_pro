import { PRODUCTS, MAX_W_PER_M2_BY_PITCH } from '@/lib/products'
import { SKU_PRICE_FROM } from '@/lib/pricing'
import { CABINET_W_MM, CABINET_H_MM } from '@/lib/standardBlock'
import { Reveal, RiseMask } from '@/components/motion'

/**
 * 전 제품 규격 비교표.
 *
 * 이 페이지의 목적은 담당자가 규격을 결재 문서로 그대로 옮겨 적는 것이다.
 * 그런데 규격서(SpecSheets)는 탭이라 한 번에 한 제품만 보인다 —
 * 옮겨 적기는 되지만 **비교**가 안 된다. 그래서 전 제품을 한 표에 세운다.
 *
 * 규칙 두 가지.
 *   ① 이 표의 모든 값은 lib/products.ts · lib/pricing.ts · lib/standardBlock.ts 에서
 *      읽어온다. 여기서 손으로 적은 숫자는 하나도 없다.
 *   ② 확정되지 않은 값은 지어내지 않고 "사양 확정 후" 로 비워 둔다. 소비전력은 견적엔진에
 *      제품군이 등록된 피치(P2.5·P3·P5)만 값이 있고, P4·P6은 공급사 사양서
 *      회수 전이라 비어 있다. 비어 있는 것이 틀린 값보다 낫다.
 */

/** '약 30m 이상' → 30 (정렬 기준) */
function minDistanceM(text: string): number {
  const m = text.match(/(\d+(?:\.\d+)?)/)
  return m ? Number(m[1]) : 0
}

const TH = 'px-4 py-3 text-left align-bottom text-caption font-semibold text-wk-ink3'
const TD = 'whitespace-nowrap px-4 py-3.5 align-middle text-label text-wk-ink'

export function SpecCompareTable() {
  const rows = [...PRODUCTS].sort(
    (a, b) => minDistanceM(a.viewingDistance) - minDistanceM(b.viewingDistance),
  )

  return (
    <section id="spec-table" className="wk-sec scroll-mt-24 bg-wk-bgFaint">
      <div className="wk-wrap">
        <Reveal y={10}>
          <p className="wk-eyebrow">한 장 비교</p>
        </Reveal>
        <RiseMask delay={0.06}>
          <h2 className="wk-h2 max-w-2xl text-wk-ink">
            여섯 제품을 한 표에 세웠습니다
          </h2>
        </RiseMask>
        <Reveal y={14} delay={0.16}>
          <p className="wk-lead mt-5">
            항목과 단위를 결재 문서에 쓰는 그대로 적었습니다. 이 표만 있으면 사양서
            초안을 쓸 수 있고, 확정되지 않은 값은 채우지 않고 비워 두었습니다.
          </p>
        </Reveal>

        <Reveal delay={0.08} y={16}>
          <div className="mt-12 overflow-hidden rounded-card border border-wk-line bg-white shadow-wk-1 lg:mt-16">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[56rem] border-collapse text-left">
                <caption className="sr-only">
                  우강테크 LED 화면 6종의 설치 환경·화소 간격·밝기·권장 시청 거리·방수
                  등급·최대 소비전력·설치비 기준 비교
                </caption>
                <thead className="bg-wk-bgFaint">
                  <tr className="border-b border-wk-line">
                    <th scope="col" className={`${TH} sticky left-0 z-10 bg-wk-bgFaint`}>
                      제품
                    </th>
                    <th scope="col" className={TH}>설치 환경</th>
                    <th scope="col" className={TH}>
                      화소 간격
                      <span className="mt-0.5 block font-normal">mm</span>
                    </th>
                    <th scope="col" className={TH}>
                      밝기(최대)
                      <span className="mt-0.5 block font-normal">nit</span>
                    </th>
                    <th scope="col" className={TH}>권장 시청 거리</th>
                    <th scope="col" className={TH}>방수 · 방진</th>
                    <th scope="col" className={TH}>
                      최대 소비전력
                      <span className="mt-0.5 block font-normal">W/m² · 추정</span>
                    </th>
                    <th scope="col" className={TH}>
                      설치비 기준
                      <span className="mt-0.5 block font-normal">VAT 별도</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* 행 호버는 tr 이 지고, 좌측 고정 셀은 bg-inherit 로 그 색을 그대로 받는다.
                      bg-white 를 셀에 직접 주면 그 칸만 하얗게 남아 행이 반쪽만 반응한다. */}
                  {rows.map((p) => {
                    const nit = Number(p.brightness.replace(/[^\d]/g, ''))
                    const watt = MAX_W_PER_M2_BY_PITCH[p.pitch]
                    return (
                      <tr key={p.sku} className="wk-hov-cell border-b border-wk-line bg-white last:border-b-0">
                        <th
                          scope="row"
                          className={`${TD} sticky left-0 z-10 bg-inherit font-semibold`}
                        >
                          <span className="block">{p.name}</span>
                          <span className="wk-metric mt-0.5 block text-caption font-normal text-wk-ink3">
                            {p.sku}
                          </span>
                        </th>
                        <td className={TD}>
                          {p.env === 'indoor' ? '건물 안(실내)' : '건물 밖(옥외)'}
                        </td>
                        <td className={`${TD} wk-metric font-semibold`}>{p.pitch.slice(1)}</td>
                        <td className={`${TD} wk-metric font-semibold`}>
                          {nit.toLocaleString()}
                        </td>
                        <td className={`${TD} wk-metric`}>{p.viewingDistance}</td>
                        <td className={TD}>{p.ingress}</td>
                        <td className={`${TD} wk-metric`}>
                          {watt ? (
                            watt
                          ) : (
                            <span className="text-wk-ink3">사양 확정 후</span>
                          )}
                        </td>
                        <td className={`${TD} wk-metric font-semibold`}>
                          {SKU_PRICE_FROM[p.sku]}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 border-t border-wk-line bg-wk-bgFaint px-5 py-4 sm:px-7">
              <p className="wk-cap">
                <b className="font-semibold text-wk-ink2">최대 소비전력</b> — 전체 화면이
                흰색으로 켜졌을 때의 설계 상한이며, 배전 용량을 잡을 때 쓰는 값입니다.
                평상시 안내 화면의 실제 소비는 이보다 크게 낮습니다. 공급사 사양서를
                회수하기 전이라 <b className="font-semibold text-wk-ink2">보수적으로 잡은
                추정치</b>이고, 견적엔진에 제품군이 등록된 피치만 값이 있습니다.
              </p>
              <p className="wk-cap">
                <b className="font-semibold text-wk-ink2">무게 · 화면 치수</b> — 캐비닛
                몇 장을 어떻게 짜는지가 정해져야 나오는 값이라 표에 미리 적지 않습니다.
                표준 캐비닛은 {CABINET_W_MM}×{CABINET_H_MM}mm 이고, 실측 후 견적서에
                최종 치수와 하중을 기재합니다.
              </p>
              <p className="wk-cap">
                <b className="font-semibold text-wk-ink2">설치비 기준</b> — 최소 구성
                기준의 시작 금액입니다. 전기 증설, 구조 보강, 옥외광고물 신고, 고소작업은
                포함되지 않습니다.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
