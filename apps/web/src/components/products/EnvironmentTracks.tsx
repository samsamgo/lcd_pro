import Image from 'next/image'

import { PRODUCTS } from '@/lib/products'
import { IMAGES } from '@/lib/imageAssets'
import type { Sku } from '@/lib/pricing'
import { ProductGrid } from '@/components/landing/ProductGrid'
import { Reveal } from '@/components/motion'

/**
 * 환경 우선 분류.
 *
 * 안티패턴 13 — 구매자는 `OUT-M`이 실내용인지 학교용인지 모른다.
 * 그래서 묶음의 이름은 설치 환경으로 짓고, 화소 간격·밝기는 그 판단의 근거로
 * 뒤에 붙인다. 모델명은 카드 안에서만 나온다.
 *
 * 2026-09-07 3묶음(3·1·2종) → 2묶음(3·3종)으로 재편.
 * 왜 —
 *   ① 예전 구성은 2열 격자에 3장·1장·2장을 흘려서 마지막 줄에 빈 칸이 남았다.
 *      특히 옥외 근거리 묶음은 카드가 한 장뿐이라 오른쪽 절반이 통째로 비었다.
 *   ② 묶음마다 사진 한 장씩(4:3, 세로 600px대)이 왼쪽 칼럼에 붙어 있어
 *      이 섹션 하나가 3,600px를 먹었다. 사진이 카드 이미지와 같은 얘기를 반복했다.
 *   ③ 거리 구분(5m/30m/50m)은 없애지 않았다. 카드의 권장 시청 거리,
 *      SpecScale 의 거리 축, SpecCompareTable 이 같은 정보를 더 정확히 준다.
 *
 * 지금 구조는 묶음당 정확히 3장이라 1열(모바일)·3열(lg) 어디서도 빈 칸이 없다.
 * 중간에 2열 단계를 두지 않는 이유도 같다 — 3장을 2열에 흘리면 반드시 하나 남는다.
 *
 * 각 묶음의 규격 문구는 lib/products.ts 의 실제 값에서 계산한다.
 * 여기에 손으로 적은 숫자는 없다.
 */
type Track = {
  id: string
  /** IMAGES.productTracks 의 키 */
  photo: string
  eyebrow: string
  title: string
  desc: string
  /** 이 묶음에서 판단이 갈리는 지점 — 담당자가 현장에서 확인할 것 */
  check: string
  alt: string
  skus: Sku[]
}

const TRACKS: Track[] = [
  {
    id: 'indoor',
    photo: 'indoor-near',
    alt: '한국 관공서 민원실 창구 위에 설치된 가로형 LED 화면에 "민원 안내" 문구가 표시되어 있다',
    eyebrow: '건물 안 · 2~4m',
    title: '실내에서 글자를 읽는 화면',
    desc: '민원실 창구, 로비, 회의실, 학교 복도처럼 사람이 화면 앞까지 걸어오는 자리입니다. 글자와 표가 많고 실내 조명 아래에서 보기 때문에, 밝기보다 화소 간격이 먼저입니다.',
    check: '가장 가까이 보는 사람의 거리를 기준으로 정합니다. 그 거리보다 촘촘하면 비용만 늘고, 성기면 글자 가장자리가 눈에 띕니다. 창가 자리라면 오후 역광이 드는 시간도 함께 봅니다.',
    skus: ['P2.5', 'IN-S', 'IN-M'],
  },
  {
    id: 'outdoor',
    photo: 'outdoor-far',
    alt: '한국 도로변에 지주로 세워진 옥외 LED 화면에 "재난 안전 안내" 문구가 표시되어 있다',
    eyebrow: '건물 밖 · 5m~50m',
    title: '햇빛과 비를 견디는 옥외 화면',
    desc: '정문 차단기 옆부터 도로변 게시대, 청사 외벽까지. 보는 거리가 5m인지 50m인지에 따라 화소 간격이 갈리고, 그 자리가 바깥이라는 사실 때문에 밝기와 방수 등급이 함께 올라갑니다.',
    check: '설치 높이와 도로에서의 거리를 실측합니다. 햇빛이 화면에 직접 닿는 시간대, 구조 보강 필요 여부, 옥외광고물 신고 대상인지가 이 단계에서 갈립니다.',
    skus: ['OUT-S', 'OUT-M', 'OUT-L'],
  },
]

export function EnvironmentTracks() {
  return (
    <section id="lineup" className="wk-sec scroll-mt-24 bg-white">
      <div className="wk-wrap">
        <Reveal>
          <p className="wk-eyebrow">환경 우선</p>
          <h2 className="wk-h2 max-w-2xl text-wk-ink">
            안에 거는지 밖에 거는지부터 갈립니다
          </h2>
          <p className="wk-lead mt-5">
            보는 거리와 햇빛 조건이 정해지면 화소 간격과 밝기는 계산으로 따라옵니다.
            두 묶음 가운데 현장에 해당하는 곳부터 보십시오. 여섯 제품을 나란히 놓고
            비교하려면{' '}
            <a href="#spec-table" className="font-semibold text-wk-cta underline underline-offset-4">
              규격 비교표
            </a>
            로 바로 가셔도 됩니다.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 space-y-16 lg:mt-20 lg:space-y-24">
        {TRACKS.map((t) => {
          const items = t.skus
            .map((s) => PRODUCTS.find((p) => p.sku === s))
            .filter((p): p is NonNullable<typeof p> => !!p)
          const pitches = items.map((p) => Number(p.pitch.slice(1)))
          const nits = items.map((p) => Number(p.brightness.replace(/[^\d]/g, '')))
          const range = (v: number[], fmt: (n: number) => string) =>
            Math.min(...v) === Math.max(...v)
              ? fmt(Math.min(...v))
              : `${fmt(Math.min(...v))}–${fmt(Math.max(...v))}`
          const pitchText = range(pitches, String)
          const nitText = range(nits, (n) => n.toLocaleString())

          return (
            <div key={t.id} id={t.id} className="wk-wrap scroll-mt-24">
              {/* ── 묶음 머리말: 글 + 사진을 한 줄에 두어 세로 낭비를 없앤다 ── */}
              <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
                <Reveal className="lg:col-span-7">
                  {/* wk-eyebrow 는 uppercase 라 단위 m 이 M 으로 뒤집힌다("2~4M").
                      단위가 들어가는 eyebrow 는 normal-case 로 되돌린다. */}
                  <p className="wk-eyebrow normal-case tracking-[0.06em]">{t.eyebrow}</p>
                  <h3 className="wk-h3 text-wk-ink">{t.title}</h3>
                  <p className="wk-body mt-4 max-w-xl">{t.desc}</p>

                  <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
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
                      <dt className="text-caption text-wk-ink3">방수 · 방진</dt>
                      <dd className="wk-metric text-h3 font-semibold text-wk-ink">
                        {items[0].env === 'indoor' ? '해당 없음' : 'IP65'}
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

                  <p className="mt-7 rounded-card-m bg-wk-bgFaint p-4 text-label leading-relaxed text-wk-ink2">
                    <b className="mb-1 block font-semibold text-wk-ink">
                      현장에서 먼저 확인할 것
                    </b>
                    {t.check}
                  </p>
                </Reveal>

                {/* 이 환경이 실제로 어떤 자리인지 — 16:9 로 낮춰 세로를 줄인다 */}
                <Reveal className="lg:col-span-5" delay={0.08}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-card-m">
                    <Image
                      src={IMAGES.productTracks[t.photo]}
                      alt={t.alt}
                      fill
                      sizes="(min-width:1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              </div>

              {/* ── 카드 3장: 1열 → 3열. 중간에 2열을 두지 않아 빈 칸이 없다 ── */}
              <div className="mt-10 lg:mt-12">
                <ProductGrid skus={t.skus} columns={3} noMidBreak />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
