import Image from 'next/image'
import Link from 'next/link'

import {
  PRODUCT_CATEGORIES,
  categoryProducts,
  skuToSegment,
} from '@/lib/productCategories'

/**
 * /products — 제품 전체를 한 화면에.
 *
 * 🔴 2026-09-08 CEO 지적 "제품 페이지 들어가면 전체적으로 다 한눈에 보여야 하는데 안 된다".
 *    카테고리 카드 3장만 두고 모델은 한 단계 더 들어가야 보이게 해 놓았었다. 여기서는
 *    카테고리 6종 × 소속 모델(6종, 중복 소속 포함)을 **전부 펼친다.** 카테고리 이름을 누르면 카테고리 페이지,
 *    모델을 누르면 모델 페이지. 이름·사진·문장은 lib 에서 온다 — 여기서 만들지 않는다.
 */
export function ProductsAtAGlance() {
  return (
    <section aria-labelledby="pag-h" className="wk-sec bg-white">
      <div className="wk-wrap">
        <h2 id="pag-h" className="sr-only">
          제품 전체
        </h2>

        <div className="divide-y divide-wk-line">
          {PRODUCT_CATEGORIES.map((c) => {
            const models = categoryProducts(c)
            return (
              <div key={c.slug} id={c.slug} className="grid gap-6 py-12 first:pt-0 last:pb-0 lg:grid-cols-[4fr_8fr] lg:gap-10">
                {/* 왼쪽 — 카테고리 이름·한 줄·이동 */}
                <div>
                  <Link href={`/products/${c.slug}`} className="group inline-block">
                    <span className="block text-h3 font-bold leading-tight tracking-[-0.015em] text-wk-ink group-hover:text-wk-cta">
                      {c.name}
                    </span>
                  </Link>
                  <p className="mt-3 max-w-[26em] text-label leading-relaxed text-wk-ink3">{c.lead}</p>
                  <Link
                    href={`/products/${c.slug}`}
                    className="mt-5 inline-block text-label font-semibold text-wk-cta underline-offset-4 hover:underline"
                  >
                    {c.name} 자세히 보기
                  </Link>
                </div>

                {/* 오른쪽 — 소속 모델 전부 */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {models.map((p) => (
                    <Link
                      key={`${c.slug}-${p.sku}`}
                      href={`/products/${skuToSegment(p.sku)}`}
                      className="group block overflow-hidden rounded-card border border-wk-line bg-white transition-shadow duration-state ease-state hover:shadow-wk-2"
                    >
                      <span className="relative block aspect-[4/3] overflow-hidden bg-wk-ink">
                        <Image
                          src={p.img}
                          alt={p.imgAlt}
                          fill
                          sizes="(max-width: 640px) 100vw, 300px"
                          className="object-cover transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-105"
                        />
                      </span>
                      <span className="block p-4">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="text-body font-semibold text-wk-ink">{p.name}</span>
                          <span className="wk-metric shrink-0 text-caption font-semibold text-wk-cta">{p.pitch}</span>
                        </span>
                        <span className="mt-1 block text-caption text-wk-ink3">
                          {p.brightness} · {p.viewingDistance}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-10 border-t border-wk-line pt-6">
          <Link
            href="/products/specs"
            className="text-label font-semibold text-wk-cta underline-offset-4 hover:underline"
          >
            전 모델 규격 비교표 보기
          </Link>
        </div>
      </div>
    </section>
  )
}
