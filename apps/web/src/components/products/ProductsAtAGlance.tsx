import Image from 'next/image'
import Link from 'next/link'

import {
  PRODUCT_CATEGORIES,
  categoryProducts,
  categorySpecs,
  skuToSegment,
} from '@/lib/productCategories'

/**
 * /products — 제품 전체를 한 화면에.
 *
 * 🔴 2026-09-08 CEO 지적 "제품 페이지 들어가면 전체적으로 다 한눈에 보여야 하는데 안 된다".
 *    카테고리 6종 × 소속 모델을 **전부 펼친다.** 카테고리를 누르면 카테고리 페이지, 모델을 누르면 모델 페이지.
 *
 * 🔴 2026-09-08 2차 — "같은 이미지 중복으로 쓰지 마라".
 *    전에는 모델마다 사진 카드였는데, 모델 6종이 카테고리 6종에 겹쳐 속하다 보니 한 페이지에
 *    '도로변·게시대 화면' 사진이 네 번, '출입구·주차장 안내판' 사진이 세 번 떴다.
 *    이제 사진은 **카테고리당 한 장**(그 카테고리의 대표 컷)이고 모델은 규격이 적힌 행이다.
 *    모델 사진은 카테고리 페이지와 모델 상세에서 본다. 이 페이지에서 같은 사진은 두 번 나오지 않는다.
 *
 * 이름·사진·문장은 lib 에서 온다 — 여기서 만들지 않는다.
 */
export function ProductsAtAGlance() {
  return (
    <section aria-labelledby="pag-h" className="wk-sec bg-white">
      <div className="wk-wrap">
        <h2 id="pag-h" className="sr-only">
          제품 전체
        </h2>

        <div className="divide-y divide-wk-line">
          {PRODUCT_CATEGORIES.map((c, i) => {
            const models = categoryProducts(c)
            const specs = categorySpecs(c)
            return (
              <div
                key={c.slug}
                id={c.slug}
                className="grid gap-6 py-12 first:pt-0 last:pb-0 lg:grid-cols-12 lg:gap-10"
              >
                {/* 사진 — 카테고리 대표 컷 한 장. 누르면 카테고리 페이지 */}
                <Link
                  href={`/products/${c.slug}`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-card bg-wk-ink ring-1 ring-black/5 lg:col-span-5"
                >
                  <Image
                    src={c.heroImage}
                    alt={c.heroImageAlt}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-[1.04]"
                  />
                  <span className="wk-scrim-card absolute inset-0" />
                  <span className="absolute inset-x-0 bottom-0 p-5">
                    <span className="block text-h3 font-bold leading-tight tracking-[-0.02em] text-white">
                      {c.name}
                    </span>
                    <span className="mt-1.5 flex items-center gap-1.5 text-label font-semibold text-white/85">
                      자세히 보기
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-state ease-state motion-safe:group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </span>
                </Link>

                {/* 글 — 한 줄 + 규격 요약 + 소속 모델 행 */}
                <div className="lg:col-span-7">
                  <p className="text-body leading-relaxed text-wk-ink2">{c.lead}</p>

                  <dl className="mt-5 flex flex-wrap gap-x-7 gap-y-2 border-t border-wk-line pt-4">
                    {specs.map((s) => (
                      <div key={s.k} className="flex items-baseline gap-1.5">
                        <dt className="text-caption text-wk-ink3">{s.k}</dt>
                        <dd className="wk-metric text-label font-semibold text-wk-ink">{s.v}</dd>
                      </div>
                    ))}
                  </dl>

                  <p className="wk-eyebrow mt-7 !mb-2">모델</p>
                  <ul className="divide-y divide-wk-line overflow-hidden rounded-card border border-wk-line">
                    {models.map((p) => (
                      <li key={`${c.slug}-${p.sku}`}>
                        <Link
                          href={`/products/${skuToSegment(p.sku)}`}
                          className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors duration-150 hover:bg-wk-bgFaint"
                        >
                          <span className="min-w-0">
                            <span className="block text-body font-semibold text-wk-ink">{p.name}</span>
                            <span className="mt-0.5 block text-caption text-wk-ink3">{p.tag}</span>
                          </span>
                          <span className="wk-metric shrink-0 text-right text-caption text-wk-ink2 sm:text-label">
                            <b className="text-wk-cta">{p.pitch}</b> · {p.brightness}
                            <span className="hidden sm:inline"> · {p.viewingDistance}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
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
            전 모델 규격 비교표 보기 →
          </Link>
        </div>
      </div>
    </section>
  )
}
