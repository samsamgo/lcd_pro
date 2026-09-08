import Image from 'next/image'
import Link from 'next/link'

import { PRODUCT_CATEGORIES, categorySpecs } from '@/lib/productCategories'
import { IMAGES } from '@/lib/imageAssets'
import { Reveal, RiseMask, Stagger } from '@/components/motion'

/**
 * 제품 카테고리 카드(PRODUCT_CATEGORIES 전부) — 사진 카드. /products 와 홈(ProductShowcase 자리)이 같은 것을 쓴다.
 * 이름·사진·한 줄은 lib/productCategories.ts 에서 온다. 여기서 문장을 만들지 않는다.
 */
export function ProductCategoryGrid({
  eyebrow = '제품',
  heading = '자리에 따라 고릅니다',
  showMore = false,
}: {
  eyebrow?: string
  heading?: string
  /** 홈에서 true — 하단에 규격 비교표 링크를 붙인다 */
  showMore?: boolean
}) {
  return (
    <section id="products" aria-labelledby="pcat-h" className="wk-sec bg-white">
      <div className="wk-wrap">
        <Reveal y={10}>
          <p className="wk-eyebrow">{eyebrow}</p>
        </Reveal>
        <RiseMask delay={0.06}>
          <h2 id="pcat-h" className="wk-h2 text-wk-ink">
            {heading}
          </h2>
        </RiseMask>

        <Stagger className="mt-10 grid gap-4 md:grid-cols-3" y={14} gap={0.07}>
          {PRODUCT_CATEGORIES.map((c) => {
            const specs = categorySpecs(c)
            return (
              <Link
                key={c.slug}
                href={`/products/${c.slug}`}
                className="group block overflow-hidden rounded-card border border-wk-line bg-white transition-shadow duration-state ease-state hover:shadow-wk-2"
              >
                <span className="relative block aspect-[4/3] overflow-hidden bg-wk-ink">
                  <Image
                    src={IMAGES.homeCategoryCards[c.slug] ?? c.heroImage}
                    alt={c.heroImageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-105"
                  />
                </span>
                <span className="block p-6">
                  <span className="block text-h3 font-bold leading-tight tracking-[-0.015em] text-wk-ink">
                    {c.name}
                  </span>
                  <span className="mt-2 block text-label leading-relaxed text-wk-ink3">{c.lead}</span>
                  <span className="mt-5 flex flex-wrap gap-x-5 gap-y-1 border-t border-wk-line pt-4">
                    {specs.slice(0, 2).map((s) => (
                      <span key={s.k} className="text-caption text-wk-ink3">
                        {s.k}{' '}
                        <b className="wk-metric font-semibold text-wk-ink">{s.v}</b>
                      </span>
                    ))}
                  </span>
                </span>
              </Link>
            )
          })}
        </Stagger>

        {showMore && (
          <Reveal y={10} delay={0.1}>
            <div className="mt-8">
              <Link
                href="/products/specs"
                className="text-label font-semibold text-wk-cta underline-offset-4 hover:underline"
              >
                규격 비교표 보기
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
