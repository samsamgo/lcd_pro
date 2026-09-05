import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { IMAGES } from '@/lib/imageAssets'
import { Reveal, SplitText, Stagger } from '@/components/motion'

/**
 * 제품 구성 — 환경·성과를 먼저, 모델명은 뒤로.
 *
 * 벤치마크 §6 안티패턴 13: 구매자는 `AB-P2.5-XR`이 실내용인지 학교용인지 모른다.
 * 그래서 카드 제목은 "실내 고해상도 P1.8–P2.5" 처럼 쓰는 자리와 화소 간격으로 짓는다.
 *
 * 사양 비교를 눈으로 하게 만드는 장치 —
 * 카드마다 화소 간격에 비례한 도트 격자를 깔았다. 위 카드는 촘촘하고
 * 아래로 갈수록 성겨진다. 숫자를 읽지 않아도 밀도 차이가 먼저 보인다.
 */
type Product = {
  env: string
  pitch: string
  title: string
  body: string
  /** 도트 격자 크기(px) — 화소 간격에 비례한 시각 지표. 값 자체는 사양이 아니다 */
  dot: number
  specs: { k: string; v: string }[]
  img: string
  alt: string
  caption: string
}

const PRODUCTS: Product[] = [
  {
    env: '실내 고해상도',
    pitch: 'P1.8 – P2.5',
    title: '가까이서 읽는 화면',
    body: '민원 창구, 로비, 회의실처럼 2~3m 앞에서 보는 자리입니다. 이 거리에서는 화소가 성기면 표와 작은 글씨가 뭉쳐 버립니다.',
    dot: 5,
    specs: [
      { k: '권장 시청거리', v: '2 m 이상' },
      { k: '설치', v: '실내 벽부 · 매립' },
      { k: '밝기', v: '800 – 1,200 nit' },
    ],
    img: IMAGES.showcase[3],
    alt: '작업대 위에 정렬된 LED 모듈과 프레임 부품 촬영',
    caption: '실내 고해상도 모듈 구성',
  },
  {
    env: '실내 대형',
    pitch: 'P2.5 – P4',
    title: '강당 뒷줄까지 닿는 화면',
    body: '체육관, 강당, 대회의실처럼 앞줄과 뒷줄 거리 차가 큰 공간입니다. 뒷줄까지 닿으려면 화면을 키워야 하는데, 화소 간격은 그만큼 넓혀도 됩니다.',
    dot: 7,
    specs: [
      { k: '권장 시청거리', v: '3 m 이상' },
      { k: '설치', v: '무대 배면 · 천장 행잉' },
      { k: '밝기', v: '1,000 – 1,500 nit' },
    ],
    img: IMAGES.showcase[0],
    alt: 'LED 캐비닛의 모듈·프레임·전원부를 층별로 분해해 배치한 구조 촬영',
    caption: '캐비닛 층 구조 — 모듈 / 프레임 / 전원부',
  },
  {
    env: '옥외 고휘도',
    pitch: 'P4 – P8',
    title: '햇빛 아래에서 읽히는 화면',
    body: '정문 전자현수막이나 진입로 안내판입니다. 햇빛과 빗물을 같이 견뎌야 해서 실내용과는 캐비닛 자체가 다릅니다.',
    dot: 9,
    specs: [
      { k: '권장 시청거리', v: '5 m 이상' },
      { k: '설치', v: '옥외 벽부 · 독립 지주' },
      { k: '밝기', v: '5,000 – 6,000 nit급' },
    ],
    img: IMAGES.showcase[2],
    alt: '옥외 LED 캐비닛 측면의 방열 루버와 실링 마감 근접 촬영',
    caption: '옥외 캐비닛 방열 루버 · 실링 마감',
  },
  {
    env: '옥외 대형',
    pitch: 'P6 – P10',
    title: '멀리서 보는 화면',
    body: '광장이나 도로변처럼 10m 넘게 떨어져서 보는 자리입니다. 멀리서 보니까 화소 간격을 넓혀도 되고, 그러면 면적당 비용과 전기요금이 같이 내려갑니다.',
    dot: 12,
    specs: [
      { k: '권장 시청거리', v: '10 m 이상' },
      { k: '설치', v: '구조물 취부 · 지주' },
      { k: '유지보수', v: '전면 정비 구조' },
    ],
    img: IMAGES.showcase[1],
    alt: 'LED 캐비닛 후면의 전원·신호 배선과 커넥터 정리 상태 촬영',
    caption: '후면 배선 — 점검 동선 기준으로 정리',
  },
]

export function ProductShowcase() {
  return (
    <section id="products" aria-labelledby="prod-h" className="wk-sec bg-white">
      <div className="wk-wrap">
        <p className="wk-eyebrow">제품 구성</p>
        <SplitText
          as="h2"
          text="쓰는 자리부터 정합니다"
          className="wk-h2 max-w-[16ch] text-wk-ink"
        />
        <Reveal y={16} delay={0.12}>
          <p className="wk-lead mt-5">
            모델명이 아니라 설치 장소와 보는 거리로 고릅니다. 화소 간격이 정해지면 밝기와 캐비닛
            규격이 따라옵니다.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-5 lg:grid-cols-2" y={18} gap={0.08}>
          {PRODUCTS.map((p) => (
            <article
              key={p.env}
              className="flex h-full flex-col overflow-hidden rounded-card border border-wk-line bg-white shadow-wk-1"
            >
              {/* 사진 — aspect-ratio 고정으로 CLS 0 */}
              <div className="relative aspect-[16/10] overflow-hidden bg-wk-bg">
                <Image
                  src={p.img}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                {/* 화소 밀도 지표 — 카드마다 격자가 성겨진다 */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at center, rgba(0,0,0,.55) 1px, transparent 1.3px)',
                    backgroundSize: `${p.dot}px ${p.dot}px`,
                  }}
                />
                <p className="wk-scrim-b absolute inset-x-0 bottom-0 px-5 pb-3.5 pt-10 text-caption text-white/85">
                  {p.caption}
                </p>
              </div>

              <div className="flex flex-1 flex-col p-6 lg:p-7">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="wk-h3 text-wk-ink">{p.env}</h3>
                  <span className="wk-metric text-body-lg font-semibold text-wk-cta">{p.pitch}</span>
                </div>
                <p className="mt-1.5 text-body-lg font-medium text-wk-ink2">{p.title}</p>
                <p className="mt-3 text-label leading-relaxed text-wk-ink3">{p.body}</p>

                <dl className="mt-6 grid grid-cols-[minmax(96px,.7fr)_1.3fr] gap-x-4 border-t border-wk-line pt-4 text-label">
                  {p.specs.map((s) => (
                    <div key={s.k} className="contents">
                      <dt className="border-b border-wk-line py-2.5 text-wk-ink3">{s.k}</dt>
                      <dd className="wk-metric border-b border-wk-line py-2.5 font-medium text-wk-ink">
                        {s.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </Stagger>

        <div className="mt-8 flex flex-col gap-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 self-start text-body-lg font-semibold text-wk-cta underline-offset-4 hover:underline"
          >
            제품별 상세 규격 보기
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <p className="wk-cap">
            화소 간격·밝기 범위는 제품 규격서 기준값이며 모델에 따라 다릅니다. 확정 사양은 현장 실측
            후 규격서로 제공합니다.
          </p>
        </div>
      </div>
    </section>
  )
}
