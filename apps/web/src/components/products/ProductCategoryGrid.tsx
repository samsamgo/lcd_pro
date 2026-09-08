import Image from 'next/image'
import Link from 'next/link'

import { PRODUCT_CATEGORIES, categorySpecs } from '@/lib/productCategories'
import { Reveal, RiseMask, Stagger } from '@/components/motion'

/**
 * 제품 카테고리 6장 — 홈의 본론.
 *
 * 🔴 2026-09-08 디자인 재설계 (CEO "메인 좀 더 예쁘게").
 *  · 사진을 카드 안에 가두지 않고 **세로 4:5 로 키웠다.** 전광판은 눈으로 보고 사는 물건이라
 *    사진이 크면 클수록 설득이 빠르다.
 *  · 이름은 사진 위에 얹는다 — 카드 아래 글 상자가 있으면 시선이 사진에서 한 번 끊긴다.
 *  · 규격은 사진 **밖** 한 줄로 뺐다. 사진 위에 숫자까지 얹으면 둘 다 안 읽힌다.
 *  · 호버에서 사진만 아주 조금 확대(1.04)되고 테두리가 진해진다. 그 이상은 싸구려로 보인다.
 *
 * 이름·사진·문장은 `lib/productCategories.ts` 에서 온다. 여기서 만들지 않는다.
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

        <Stagger
          className="mt-12 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:mt-16"
          y={16}
          gap={0.06}
        >
          {PRODUCT_CATEGORIES.map((c) => {
            const specs = categorySpecs(c)
            return (
              <Link key={c.slug} href={`/products/${c.slug}`} className="group block">
                {/* 사진 — 세로로 크게. 이름은 그 위에 */}
                <span className="relative block aspect-[4/5] overflow-hidden rounded-card bg-wk-ink ring-1 ring-black/5 transition-shadow duration-state ease-state group-hover:shadow-wk-2">
                  <Image
                    src={c.heroImage}
                    alt={c.heroImageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                    className="object-cover transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-[1.04]"
                  />
                  <span className="wk-scrim-card absolute inset-0" />
                  <span className="absolute inset-x-0 bottom-0 p-6">
                    <span className="block text-h3 font-bold leading-tight tracking-[-0.02em] text-white">
                      {c.name}
                    </span>
                    <span className="mt-2 flex items-center gap-1.5 text-label font-semibold text-white/85">
                      자세히 보기
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-state ease-state motion-safe:group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </span>
                </span>

                {/* 규격 — 사진 밖 한 줄 */}
                <span className="mt-4 block">
                  <span className="block text-label leading-relaxed text-wk-ink3">{c.lead}</span>
                  <span className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-wk-line pt-3">
                    {specs.slice(0, 2).map((s) => (
                      <span key={s.k} className="text-caption text-wk-ink3">
                        {s.k} <b className="wk-metric font-semibold text-wk-ink">{s.v}</b>
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
            <div className="mt-12 border-t border-wk-line pt-6">
              <Link
                href="/products/specs"
                className="text-label font-semibold text-wk-cta underline-offset-4 hover:underline"
              >
                전 모델 규격 비교표 보기 →
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
