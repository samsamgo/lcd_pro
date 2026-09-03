import { PRODUCTS } from '@/lib/products'
import type { Sku } from '@/lib/pricing'
import { ProductGrid } from '@/components/landing/ProductGrid'
import { Reveal } from '@/components/motion'

/**
 * 환경 우선 분류.
 *
 * 안티패턴 13 — 구매자는 `OUT-M`이 실내용인지 학교용인지 모른다.
 * 그래서 묶음의 이름은 설치 환경과 보는 거리로 짓고, 화소 간격·밝기는
 * 그 판단의 근거로 뒤에 붙인다. 모델명은 카드 안에서만 나온다.
 *
 * 각 묶음의 규격 문구는 lib/products.ts 의 실제 값에서 계산한다.
 * 여기에 손으로 적은 숫자는 없다.
 */
type Track = {
  id: string
  eyebrow: string
  title: string
  desc: string
  /** 이 묶음에서 판단이 갈리는 지점 — 담당자가 현장에서 확인할 것 */
  check: string
  skus: Sku[]
}

const TRACKS: Track[] = [
  {
    id: 'indoor-near',
    eyebrow: '건물 안 · 2~4m',
    title: '가까이에서 글자를 읽는 실내 화면',
    desc: '민원실 창구, 로비, 회의실처럼 사람이 화면 앞까지 걸어오는 자리입니다. 글자와 표가 많고, 실내 조명 아래에서 봅니다.',
    check: '가장 가까이 보는 사람의 거리를 기준으로 정합니다. 그 거리보다 촘촘하면 비용만 늘고, 성기면 글자 가장자리가 눈에 띕니다.',
    skus: ['P2.5', 'IN-S', 'IN-M'],
  },
  {
    id: 'outdoor-near',
    eyebrow: '건물 밖 · 5m~',
    title: '정문과 주차장에서 보는 옥외 화면',
    desc: '건물 밖이지만 보행자와 진입 차량이 비교적 가까이에서 보는 자리입니다. 직사광선과 비, 먼지를 함께 견뎌야 합니다.',
    check: '햇빛이 화면에 직접 닿는 시간대를 확인합니다. 처마·차양이 있으면 필요한 밝기가 달라집니다.',
    skus: ['OUT-S'],
  },
  {
    id: 'outdoor-far',
    eyebrow: '건물 밖 · 30m 이상',
    title: '도로변과 외벽에서 멀리 읽는 화면',
    desc: '전자현수막 게시대, 청사 외벽처럼 이동 중인 사람과 차량이 보는 자리입니다. 읽을 수 있는 시간이 몇 초뿐이라 글자 크기가 규격을 결정합니다.',
    check: '설치 높이와 도로에서의 거리를 실측합니다. 구조 보강과 옥외광고물 신고 여부도 이 단계에서 갈립니다.',
    skus: ['OUT-M', 'OUT-L'],
  },
]

export function EnvironmentTracks() {
  return (
    <section id="lineup" className="wk-sec scroll-mt-24 bg-white">
      <div className="wk-wrap">
        <Reveal>
          <p className="wk-eyebrow">환경 우선</p>
          <h2 className="wk-h2 max-w-xl text-wk-ink">
            모델명이 아니라 설치 조건으로 나눕니다
          </h2>
          <p className="wk-lead mt-5">
            보는 거리와 햇빛 조건이 정해지면 화소 간격과 밝기는 계산으로 따라옵니다.
            아래 세 묶음 가운데 현장에 해당하는 곳부터 보십시오.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 space-y-20 lg:mt-20 lg:space-y-28">
        {TRACKS.map((t) => {
          const items = t.skus
            .map((s) => PRODUCTS.find((p) => p.sku === s))
            .filter((p): p is NonNullable<typeof p> => !!p)
          const pitches = items.map((p) => Number(p.pitch.slice(1)))
          const nits = items.map((p) => Number(p.brightness.replace(/[^\d]/g, '')))
          const pitchText =
            Math.min(...pitches) === Math.max(...pitches)
              ? `${Math.min(...pitches)}`
              : `${Math.min(...pitches)}–${Math.max(...pitches)}`
          const nitText =
            Math.min(...nits) === Math.max(...nits)
              ? Math.min(...nits).toLocaleString()
              : `${Math.min(...nits).toLocaleString()}–${Math.max(...nits).toLocaleString()}`

          return (
            <div key={t.id} id={t.id} className="wk-wrap scroll-mt-24">
              <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
                <Reveal className="lg:col-span-5">
                  <p className="wk-eyebrow">{t.eyebrow}</p>
                  <h3 className="wk-h3 text-wk-ink">{t.title}</h3>
                  <p className="wk-body mt-4">{t.desc}</p>

                  <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                    <div>
                      <dt className="text-caption text-wk-ink3">화소 간격</dt>
                      <dd className="wk-metric text-h3 font-semibold text-wk-ink">
                        {pitchText}
                        <small> mm</small>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-caption text-wk-ink3">밝기</dt>
                      <dd className="wk-metric text-h3 font-semibold text-wk-ink">
                        {nitText}
                        <small> nit</small>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-caption text-wk-ink3">구성</dt>
                      <dd className="wk-metric text-h3 font-semibold text-wk-ink">
                        {items.length}
                        <small> 종</small>
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-6 rounded-card-m bg-wk-bgFaint p-4 text-label leading-relaxed text-wk-ink2">
                    <b className="mb-1 block font-semibold text-wk-ink">현장에서 먼저 확인할 것</b>
                    {t.check}
                  </p>
                </Reveal>

                <div className="lg:col-span-7">
                  <ProductGrid skus={t.skus} columns={2} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
