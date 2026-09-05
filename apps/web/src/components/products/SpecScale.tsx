import { PRODUCTS } from '@/lib/products'
import { Reveal } from '@/components/motion'

/**
 * 규격을 눈으로 비교하는 섹션.
 *
 * 표만 있는 페이지는 실패한다. 화소 간격 2.5mm와 6mm의 차이는 숫자로는
 * 두 배 남짓이지만, 실제 판단은 "얼마나 떨어져서 보는가" 로 갈린다.
 * 그래서 두 축을 그림으로 겹쳐 놓는다 — 시청 거리와 밝기.
 *
 * 그려지는 값은 전부 lib/products.ts 의 실제 필드에서 뽑는다.
 * 여기서 새로 만든 숫자는 없고, 축의 눈금만 표시용이다.
 */

/** '약 30m 이상' → 30 */
function minDistanceM(text: string): number {
  const m = text.match(/(\d+(?:\.\d+)?)/)
  return m ? Number(m[1]) : 0
}

/** nit 문자열 → 숫자 */
function nitValue(text: string): number {
  return Number(text.replace(/[^\d]/g, ''))
}

/** 2m와 50m를 한 화면에 같이 두려면 선형 축으로는 실내 제품이 왼쪽 끝에 뭉친다 */
const AXIS_MAX_M = 60
const pos = (m: number) => (Math.sqrt(m) / Math.sqrt(AXIS_MAX_M)) * 100
const TICKS = [2, 5, 10, 20, 30, 50]

/** 규격 행은 4열 키/값이 아니라 2열 정의 목록이다 (벤치마크 §3.1) */
const ROW = 'grid grid-cols-[minmax(140px,.7fr)_1.3fr] items-center gap-4'


export function SpecScale() {
  const rows = [...PRODUCTS].sort(
    (a, b) => minDistanceM(a.viewingDistance) - minDistanceM(b.viewingDistance),
  )
  const maxNit = Math.max(...rows.map((p) => nitValue(p.brightness)))

  return (
    <section id="compare" className="wk-sec scroll-mt-24 bg-wk-bgFaint">
      <div className="wk-wrap">
        <Reveal>
          <p className="wk-eyebrow">규격 비교</p>
          <h2 className="wk-h2 max-w-xl text-wk-ink">화소 간격</h2>
          <p className="wk-lead mt-5">
            화소 간격은 화면의 등급이 아니라 시청 거리의 함수입니다. 아래 두 축에서
            현장 조건과 만나는 지점을 찾으십시오.
          </p>
        </Reveal>

        {/* ── 축 1. 권장 시청 거리 ─────────────────────────────── */}
        <Reveal delay={0.08}>
          <div className="mt-12 overflow-hidden rounded-card border border-wk-line bg-white shadow-wk-1 lg:mt-16">
            <div className="border-b border-wk-line px-5 py-4 sm:px-7">
              <h3 className="text-body-lg font-semibold text-wk-ink">
                권장 시청 거리와 화소 간격
              </h3>
              <p className="mt-1 text-label text-wk-ink3">
                막대가 시작되는 지점이 그 화면의 권장 최소 거리입니다. 그보다 가까이에서
                보면 화소 사이 간격이 눈에 들어옵니다.
              </p>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[36rem] px-5 py-6 sm:px-7">
                {/* 눈금 */}
                <div className={`${ROW} mb-4`}>
                  <span aria-hidden="true" />
                  <span className="relative block h-5 border-b border-wk-line">
                    {TICKS.map((t) => (
                      <span
                        key={t}
                        className="wk-metric absolute -translate-x-1/2 text-caption text-wk-ink3"
                        style={{ left: `${pos(t)}%` }}
                      >
                        {t}m
                      </span>
                    ))}
                  </span>
                </div>

                <ul className="m-0 list-none space-y-3 p-0">
                  {rows.map((p) => {
                    const d = minDistanceM(p.viewingDistance)
                    const left = pos(d)
                    return (
                      <li key={p.sku} className={ROW}>
                        <span className="min-w-0">
                          <b className="block truncate text-label font-semibold text-wk-ink">
                            {p.name}
                          </b>
                          <span className="wk-metric block text-caption text-wk-ink3">
                            화소 간격 {p.pitch.slice(1)}
                            <small> mm</small> · {p.env === 'indoor' ? '실내' : '옥외'}
                          </span>
                        </span>

                        <span className="relative block h-8">
                          <span
                            className="absolute inset-y-0 rounded-btn bg-wk-blueWeak"
                            style={{ left: `${left}%`, right: 0 }}
                            aria-hidden="true"
                          />
                          <span
                            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-wk-cta"
                            style={{ left: `${left}%` }}
                            aria-hidden="true"
                          />
                          <span
                            className="wk-metric absolute top-1/2 -translate-y-1/2 pl-5 text-caption font-semibold text-wk-ink2"
                            style={{ left: `${left}%` }}
                          >
                            {p.viewingDistance}
                          </span>
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>

            <p className="wk-cap border-t border-wk-line px-5 py-3.5 sm:px-7">
              가로축은 2m와 50m를 한 화면에 담기 위해 균등 눈금이 아닙니다. 거리 값은 제품
              규격의 권장 최소 시청 거리입니다.
            </p>
          </div>
        </Reveal>

        {/* ── 축 2. 밝기 ───────────────────────────────────────── */}
        <Reveal delay={0.12}>
          <div className="mt-6 overflow-hidden rounded-card border border-wk-line bg-white shadow-wk-1">
            <div className="border-b border-wk-line px-5 py-4 sm:px-7">
              <h3 className="text-body-lg font-semibold text-wk-ink">밝기와 설치 환경</h3>
              <p className="mt-1 text-label text-wk-ink3">
                실내 화면과 옥외 화면의 밝기는 등급 차이가 아니라 주변 빛의 차이입니다.
                실내 화면을 햇빛 아래 두면 흰 종이처럼 보입니다.
              </p>
            </div>

            <div className="px-5 py-6 sm:px-7">
              <ul className="m-0 list-none space-y-3 p-0">
                {[...PRODUCTS]
                  .sort((a, b) => nitValue(a.brightness) - nitValue(b.brightness))
                  .map((p) => {
                    const nit = nitValue(p.brightness)
                    return (
                      <li key={p.sku} className={ROW}>
                        <span className="min-w-0 truncate text-label font-semibold text-wk-ink">
                          {p.name}
                        </span>
                        <span className="flex items-center gap-3">
                          <span className="h-6 flex-1 overflow-hidden rounded-btn bg-wk-bg">
                            <span
                              className={`block h-full rounded-btn ${
                                p.env === 'indoor' ? 'bg-wk-ink2' : 'bg-wk-cta'
                              }`}
                              style={{ width: `${(nit / maxNit) * 100}%` }}
                              aria-hidden="true"
                            />
                          </span>
                          <span className="wk-metric w-20 shrink-0 text-right text-label font-semibold text-wk-ink">
                            {nit.toLocaleString()}
                            <small> nit</small>
                          </span>
                        </span>
                      </li>
                    )
                  })}
              </ul>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-wk-line pt-4">
                <span className="inline-flex items-center gap-2 text-caption text-wk-ink2">
                  <span className="h-2.5 w-5 rounded-btn bg-wk-ink2" aria-hidden="true" />
                  실내 — 조명 아래에서 봅니다
                </span>
                <span className="inline-flex items-center gap-2 text-caption text-wk-ink2">
                  <span className="h-2.5 w-5 rounded-btn bg-wk-cta" aria-hidden="true" />
                  옥외 — 햇빛과 경쟁합니다
                </span>
              </div>
            </div>

            <p className="wk-cap border-t border-wk-line px-5 py-3.5 sm:px-7">
              표기 밝기는 제품 규격의 최대값입니다. 실제 운영 밝기는 주변 조도에 맞춰
              낮춰서 사용하며, 야간 눈부심 민원을 줄이는 목적도 있습니다.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
