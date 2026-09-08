'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PRODUCTS, MAX_W_PER_M2_BY_PITCH } from '@/lib/products'
import { skuToSegment } from '@/lib/productCategories'
import { SKU_PRICE_FROM } from '@/lib/pricing'
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

type EnvFilter = 'all' | 'indoor' | 'outdoor'

const ENV_FILTERS: { key: EnvFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'indoor', label: '실내' },
  { key: 'outdoor', label: '옥외' },
]

const chipClass = (on: boolean) =>
  `h-10 rounded-full px-4 text-label font-semibold transition-colors duration-state ease-state ${
    on ? 'bg-wk-ink text-white' : 'bg-white text-wk-ink3 hover:bg-wk-line'
  }`

export function SpecCompareTable() {
  const [env, setEnv] = useState<EnvFilter>('all')
  const [expanded, setExpanded] = useState(false)
  const rows = [...PRODUCTS].sort(
    (a, b) => minDistanceM(a.viewingDistance) - minDistanceM(b.viewingDistance),
  )
  const filteredRows = rows.filter((p) => env === 'all' || p.env === env)
  const canCollapse = filteredRows.length > 8
  const visibleRows = canCollapse && !expanded ? filteredRows.slice(0, 6) : filteredRows

  const changeEnv = (next: EnvFilter) => {
    setEnv(next)
    setExpanded(false)
  }

  return (
    <section id="spec-table" className="wk-sec scroll-mt-24 bg-wk-bgFaint">
      <div className="wk-wrap">
        <div className="mt-7 flex flex-wrap items-center gap-2">
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
                  {visibleRows.map((p) => {
                    const nit = Number(p.brightness.replace(/[^\d]/g, ''))
                    const watt = MAX_W_PER_M2_BY_PITCH[p.pitch]
                    return (
                      <tr key={p.sku} className="wk-hov-cell border-b border-wk-line bg-white last:border-b-0">
                        <th
                          scope="row"
                          className={`${TD} sticky left-0 z-10 bg-inherit font-semibold`}
                        >
                          {/* 제품 이름 = 모델 페이지 링크(/products/<segment>). 옛 `?type=`·`#` 앵커 없음 */}
                          <Link
                            href={`/products/${skuToSegment(p.sku)}`}
                            className="block text-wk-ink underline-offset-4 hover:text-wk-cta hover:underline"
                          >
                            {p.name}
                          </Link>
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

            {canCollapse && (
              <div className="border-t border-wk-line bg-wk-bgFaint px-5 py-4 text-center sm:px-7">
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  className={chipClass(expanded)}
                >
                  {expanded ? '접기' : '더 보기'}
                </button>
              </div>
            )}

            {/* 2026-09-08 CEO 지시 '규격표 잡다한 설명 다 빼라' — 각주 3개 제거. 단위·기준은 표 머리(mm·nit·W/m²·추정)에만 남긴다 */}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
