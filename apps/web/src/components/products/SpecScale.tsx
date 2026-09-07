import Image from 'next/image'

import { PRODUCTS } from '@/lib/products'
import { IMAGES } from '@/lib/imageAssets'
import { GrowBar, Reveal, RevealImage, RiseMask } from '@/components/motion'
import { PitchDots } from '@/components/public/PitchDots'

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

/**
 * 화소 간격 도해 3장 — 가장 촘촘한 것 / 가운데 / 가장 성긴 것.
 * 피치도 거리도 제품 데이터에서 뽑는다. 여기 손으로 적은 숫자는 없다.
 */
const SWATCHES = (() => {
  const pitches = Array.from(
    new Set(PRODUCTS.map((p) => Number(p.pitch.slice(1))).filter((n) => !Number.isNaN(n))),
  ).sort((a, b) => a - b)

  const picks =
    pitches.length >= 3
      ? [pitches[0], pitches[Math.floor((pitches.length - 1) / 2)], pitches[pitches.length - 1]]
      : pitches

  return picks.map((pitch) => {
    const owners = PRODUCTS.filter((p) => Number(p.pitch.slice(1)) === pitch)
    const nearest = Math.min(...owners.map((p) => minDistanceM(p.viewingDistance)))
    return {
      pitch,
      label: `약 ${nearest}m 이상에서 보는 자리`,
      example: owners.map((p) => p.name).join(' · '),
    }
  })
})()


export function SpecScale() {
  const rows = [...PRODUCTS].sort(
    (a, b) => minDistanceM(a.viewingDistance) - minDistanceM(b.viewingDistance),
  )
  const maxNit = Math.max(...rows.map((p) => nitValue(p.brightness)))

  return (
    <section id="compare" className="wk-sec scroll-mt-24 bg-wk-bgFaint">
      <div className="wk-wrap">
        {/* 섹션 머리 3박자 — eyebrow(약) → 제목(중·RiseMask) → 리드(약).
            🔴 RiseMask 를 Reveal 안에 넣지 않는다(구조정본 §16-D). 형제로 둔다. */}
        <Reveal y={10}>
          <p className="wk-eyebrow">규격 비교</p>
        </Reveal>
        <RiseMask delay={0.06}>
          <h2 className="wk-h2 max-w-2xl text-wk-ink">
            거리가 화소 간격을, 햇빛이 밝기를 정합니다
          </h2>
        </RiseMask>
        <Reveal y={14} delay={0.16}>
          <p className="wk-lead mt-5">
            화소 간격은 화면의 등급이 아니라 시청 거리의 함수입니다. 아래 두 축에서
            현장 조건과 만나는 지점을 찾으십시오. 값은 전부 아래 규격 비교표와 같은
            출처에서 나옵니다.
          </p>
        </Reveal>

        {/* ── 축 0. 화소 간격을 눈으로 ──────────────────────────
            2026-09-07 신설. 여기에는 원래 아무것도 없었다 — 담당자가 가장 자주 묻는
            "2.5mm 와 6mm 가 뭐가 다르냐" 를 숫자로만 답하고 있었다.
            실사 매크로 사진으로 답할 수 없어서(피치를 증명하지 못한다) 도해로 그린다.
            세 장 모두 같은 배율이라 촘촘한 정도의 비율이 그대로 참이다. */}
        <div className="mt-12 overflow-hidden rounded-card border border-wk-line bg-white shadow-wk-1 lg:mt-16">
          {/* 🔴 이 사이트에서 **실사(AI 생성물 아님)** 로 확인된 몇 안 되는 컷 중 하나다.
              화면 문자 0 · 인물 0 · 상호 0 · 국적 단서 0 이라 아무 주장도 하지 않는다.
              그래서 "재료 사진" 으로만 쓴다 — 시공 실적이나 납품처로 읽힐 캡션을 붙이지 마라.
              (§17-D 가 "J4 가 닿지 않는 페이지에서 꺼내 쓰라" 고 지정해 둔 컷이다) */}
          <RevealImage>
            {/* .wk-emit(안쪽 베젤)만 쓰고 .wk-emit-spill 은 쓰지 않는다 —
                 새어 나오는 빛은 어두운 면에서만 빛으로 읽히고, 흰 카드 위에서는
                 파란 얼룩진 그림자가 된다(§17-B: emit 계열은 다크 면 전용). */}
            <div className="wk-emit relative aspect-[16/6] overflow-hidden bg-wk-night">
              <Image
                src={IMAGES.productsPitchMacro}
                alt="LED 모듈 표면을 비스듬히 확대한 사진 — 검은 마스크 사이로 발광 소자가 줄지어 켜져 있다"
                fill
                sizes="(min-width:1200px) 1200px, 100vw"
                quality={78}
                className="object-cover"
              />
            </div>
          </RevealImage>

          <div className="border-b border-wk-line px-5 py-4 sm:px-7">
            <h3 className="text-body-lg font-semibold text-wk-ink">
              화소 간격을 같은 배율로 그리면
            </h3>
            <p className="mt-1 text-label text-wk-ink3">
              간격이 좁을수록 같은 면적에 알갱이가 많이 들어갑니다. 그만큼 가까이에서 봐도
              글자가 뭉치지 않고, 대신 같은 화면 크기의 값이 올라갑니다.
            </p>
          </div>

          <div className="grid gap-px bg-wk-line sm:grid-cols-3">
            {SWATCHES.map((s, n) => (
              <Reveal key={s.pitch} y={14} delay={n * 0.08} className="bg-white p-5 sm:p-6">
                <PitchDots pitchMm={s.pitch} className="h-32 w-full rounded-card-m sm:h-36" />
                <p className="wk-metric mt-4 text-h3 font-semibold text-wk-ink">
                  {s.pitch}
                  <small> mm</small>
                </p>
                <p className="mt-1 text-label text-wk-ink2">{s.label}</p>
                <p className="wk-cap mt-1.5">{s.example}</p>
              </Reveal>
            ))}
          </div>

          <p className="wk-cap border-t border-wk-line px-5 py-3.5 sm:px-7">
            아래 세 그림은 실제 크기가 아니라 간격의 비율을 보여주는 도해입니다. 같은 배율(1mm = 5px)로
            그렸으므로 촘촘한 정도의 차이는 실제 비율과 같습니다. 맨 위 사진은 LED 모듈 표면을 찍은
            것으로, 화소 간격 규격이 확인되지 않아 도해와 축척이 다릅니다.
          </p>
        </div>

        {/* ── 축 1. 권장 시청 거리 ─────────────────────────────── */}
        <Reveal delay={0.08} y={16}>
          <div className="mt-6 overflow-hidden rounded-card border border-wk-line bg-white shadow-wk-1">
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
                  {rows.map((p, n) => {
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
                          {/* 막대는 "권장 최소 거리부터 그 너머 전부" 를 뜻하므로
                              시작점(왼쪽)에서 오른쪽으로 자란다. width 가 아니라 scaleX 라
                              레이아웃 이동이 없다(설계계약서 §0-6). */}
                          <GrowBar
                            className="absolute inset-y-0 rounded-btn bg-wk-blueWeak"
                            style={{ left: `${left}%`, right: 0 }}
                            delay={Math.min(n, 6) * 0.07}
                            duration={1.1}
                          />
                          <span
                            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-wk-cta"
                            style={{ left: `${left}%` }}
                            aria-hidden="true"
                          />
                          {/* 오른쪽 끝(축의 70% 이후)에 찍히는 점은 라벨을 점 왼쪽으로
                              뒤집는다. 그러지 않으면 라벨이 카드 밖으로 밀려 세 줄로 접힌다
                              (2026-09-07 '약 50m 이상'에서 실제로 발생) */}
                          <span
                            className={`wk-metric absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-caption font-semibold text-wk-ink2 ${
                              left > 70 ? '-translate-x-full pr-4' : 'pl-5'
                            }`}
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
                  .map((p, n) => {
                    const nit = nitValue(p.brightness)
                    return (
                      <li key={p.sku} className={ROW}>
                        <span className="min-w-0 truncate text-label font-semibold text-wk-ink">
                          {p.name}
                        </span>
                        <span className="flex items-center gap-3">
                          <span className="h-6 flex-1 overflow-hidden rounded-btn bg-wk-bg">
                            <GrowBar
                              className={`block h-full rounded-btn ${
                                p.env === 'indoor' ? 'bg-wk-ink2' : 'bg-wk-cta'
                              }`}
                              style={{ width: `${(nit / maxNit) * 100}%` }}
                              delay={Math.min(n, 6) * 0.07}
                              duration={1.1}
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
