import Image from 'next/image'
import Link from 'next/link'

import { Reveal, RiseMask, Stagger } from '@/components/motion'
import { PRODUCT_MODELS, pitchRange } from '@/lib/productModels'

/**
 * 홈 — "PRODUCT INTRODUCTION". 무엇을 파는가.
 *
 * 🔴 2026-09-09 CEO 지시 원문: "메인 페이지 제품 부분은 온빛전자처럼 제품(렌더)으로 넣어봐.
 *    사진 같은 이상한 설명 지우고 제대로 된 이미지 써 — 사람이 찍은 것 같은 사진 말고."
 *    전에 이 자리에 있던 ProductCategoryGrid 는 카테고리 6장을 **연출 사진**으로 깔고
 *    규격 요약을 붙이는 형태였다. 사진은 우리가 시공한 현장이 아니라 자료컷이라,
 *    제품 자리에 놓이면 "이 회사가 저기 시공했다"로 읽힌다. 그래서 제품 자리에서는
 *    **렌더만** 쓴다 — 렌더는 물건 그림이지 현장 주장이 아니다.
 *
 * 규칙
 *  · 이미지는 `public/images/products/{slug}-1.png` 렌더만. `IMAGES.category` 같은 사진 금지.
 *  · 카드에 적는 것은 셋 — 시리즈명(대문자) / 한글 한 줄 / 화소 간격 범위. 그 이상 쓰지 않는다.
 *  · "사진은 예시입니다" 류 각주를 달지 마라. 렌더에는 붙일 이유가 없다.
 *  · 대제목은 두 톤(먹 + 주황) — 온빛 홈의 대제목 규칙. WhyWookang 과 같은 형식이다.
 *
 * 홈에는 대표 4종만 세우고 나머지는 /products 로 보낸다. 12종을 홈에 다 펼치면
 * 홈이 목록 페이지가 된다 — 홈의 일은 "안쪽으로 보내는 것"이다.
 */
const FEATURED = ['core-i', 'cob', 'core-o', 'shield-o'] as const

const MODELS = FEATURED.map((slug) => {
  const m = PRODUCT_MODELS.find((x) => x.slug === slug)
  if (!m) throw new Error(`[ProductIntro] 시리즈 ${slug} 를 찾지 못했다`)
  return m
})

export function ProductIntro() {
  return (
    <section aria-labelledby="product-intro-h" className="wk-sec bg-wk-bg">
      <div className="wk-wrap">
        <h2 id="product-intro-h" className="wk-display leading-[0.95] tracking-[-0.03em]">
          <RiseMask className="text-wk-ink">PRODUCT</RiseMask>
          <RiseMask delay={0.08} className="text-wk-cta">
            INTRODUCTION
          </RiseMask>
        </h2>

        <Reveal y={12} delay={0.16}>
          <p className="wk-lead mt-6">실내용부터 실외용까지, 시리즈 12종을 직접 구성해 드립니다.</p>
        </Reveal>

        <Stagger
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
          y={16}
          gap={0.08}
        >
          {MODELS.map((m) => (
            <article key={m.slug} className="flex h-full flex-col overflow-hidden rounded-card bg-white ring-1 ring-black/5">
              <div className="relative aspect-[4/3] bg-white">
                <Image
                  src={m.images[0].src}
                  alt={m.images[0].alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-contain p-6"
                />
              </div>
              <div className="flex flex-1 flex-col border-t border-wk-line px-5 py-5">
                <p className="wk-metric text-body-lg font-extrabold uppercase tracking-[0.02em] text-wk-ink">
                  {m.series}
                </p>
                <p className="mt-1.5 text-label text-wk-ink3">{m.name}</p>
                <p className="wk-metric mt-2 text-caption font-semibold text-wk-cta">{pitchRange(m)}</p>
                <Link
                  href={`/products/models/${m.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 self-start border-b border-wk-ink pb-0.5 text-label font-semibold text-wk-ink transition-colors duration-150 hover:border-wk-cta hover:text-wk-cta"
                >
                  제품 보러가기
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </Stagger>

        <Reveal y={10} delay={0.1}>
          <p className="mt-12 border-t border-wk-line pt-6 text-label text-wk-ink3">
            시리즈 12종 전체와 화소 간격별 규격은{' '}
            <Link href="/products" className="font-semibold text-wk-cta underline-offset-4 hover:underline">
              제품 페이지
            </Link>
            에서 보실 수 있습니다.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
