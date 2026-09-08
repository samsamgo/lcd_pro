import Image from 'next/image'
import Link from 'next/link'

import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { SubNav } from '@/components/SubNav'
import { productSubNavItems } from '@/lib/subnav'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { INDUSTRIES } from '@/lib/industries'
import {
  PRODUCT_CATEGORIES,
  categoryProducts,
  categorySpecs,
  skuToSegment,
  type ProductCategory,
} from '@/lib/productCategories'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/seo/site'

/**
 * 제품 카테고리 페이지 — 카테고리 6종(lib/productCategories.ts)이 **같은 틀**을 쓴다.
 *
 * 틀은 다섯 덩어리, 순서 고정: ① 사진 머리 + 이름 + 한 줄
 * ② 모델(사진 카드) ③ 규격 요약 ④ 쓰이는 자리(사진 카드) ⑤ 문의.
 *
 * 🔴 2026-09-08 2차 — CEO "제품 소개는 최소한 이미지는 보여주면서 설명해라".
 *    모델을 글자 행으로만 두었던 것을 사진 카드로 되돌렸다. 이 페이지에서는 모델 사진이 각각
 *    한 번만 나오므로 중복이 아니다. '쓰이는 자리' 도 이름 칩 대신 현장 사진 카드로 —
 *    담당자는 이름보다 자기 현장과 닮은 사진을 보고 누른다.
 *    (/products 전체 페이지는 카테고리당 사진 한 장만 쓴다 — 거기서 모델 사진을 반복하지 않는다.)
 */
export function ProductCategoryPage({ category }: { category: ProductCategory }) {
  const models = categoryProducts(category)
  const specs = categorySpecs(category)
  const uses = category.uses
    .map((slug) => INDUSTRIES.find((i) => i.slug === slug))
    .filter((i): i is NonNullable<typeof i> => !!i)

  return (
    <>
      <JsonLd
        id={`ld-breadcrumb-products-${category.slug}`}
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '제품', url: absoluteUrl('/products') },
          { name: category.name, url: absoluteUrl(`/products/${category.slug}`) },
        ])}
      />
      <NavBar />
      <main id="main">
        {/* ① 공통 머리 */}
        <PageHeader
          group="제품"
          title={category.name}
          lead={category.lead}
          image={category.heroImage}
          imageAlt={category.heroImageAlt}
        />

        <SubNav
          back={{ label: '제품 전체', href: '/products' }}
          items={productSubNavItems(PRODUCT_CATEGORIES)}
          current={`/products/${category.slug}`}
        />

        {/* ② 모델 — 사진 카드. 누르면 모델 상세 */}
        <section className="wk-sec bg-white" aria-labelledby="models-h">
          <div className="wk-wrap">
            <p className="wk-eyebrow">모델</p>
            <h2 id="models-h" className="wk-h2 text-wk-ink">
              이 자리에 맞는 모델
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {models.map((p) => (
                <Link
                  key={p.sku}
                  href={`/products/${skuToSegment(p.sku)}`}
                  className="group block overflow-hidden rounded-card border border-wk-line bg-white transition-shadow duration-state ease-state hover:shadow-wk-2"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden bg-wk-ink">
                    <Image
                      src={p.img}
                      alt={p.imgAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      className="object-cover transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-105"
                    />
                  </span>
                  <span className="block p-5">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="text-body-lg font-semibold text-wk-ink">{p.name}</span>
                      <span className="wk-metric shrink-0 text-label font-semibold text-wk-cta">{p.pitch}</span>
                    </span>
                    <span className="mt-1 block text-label text-wk-ink3">{p.tag}</span>
                    <span className="wk-metric mt-3 block border-t border-wk-line pt-3 text-caption text-wk-ink2">
                      {p.brightness} · {p.viewingDistance} · {p.env === 'indoor' ? '실내' : p.ingress.split(' (')[0]}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ③ 규격 요약 */}
        <section className="wk-sec-sm bg-wk-bg" aria-labelledby="specs-h">
          <div className="wk-wrap">
            <p className="wk-eyebrow">규격 요약</p>
            <h2 id="specs-h" className="sr-only">
              {category.name} 규격 요약
            </h2>
            <dl className="mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-wk-line bg-wk-line lg:grid-cols-4">
              {specs.map((s) => (
                <div key={s.k} className="bg-white p-5">
                  <dt className="text-caption text-wk-ink3">{s.k}</dt>
                  <dd className="wk-metric mt-1.5 text-body-lg font-semibold text-wk-ink">{s.v}</dd>
                </div>
              ))}
            </dl>
            <p className="wk-cap mt-4">
              모델별 상세 규격은{' '}
              <Link href="/products/specs" className="font-semibold text-wk-cta underline-offset-4 hover:underline">
                규격 비교표
              </Link>
              에 있습니다. 확정 사양은 현장 실측 후 정해집니다.
            </p>
          </div>
        </section>

        {/* ④ 쓰이는 자리 — 현장 사진 카드. 누르면 시공사례 상세 */}
        {uses.length > 0 && (
          <section className="wk-sec bg-white" aria-labelledby="uses-h">
            <div className="wk-wrap">
              <p className="wk-eyebrow">쓰이는 자리</p>
              <h2 id="uses-h" className="wk-h2 text-wk-ink">
                이런 자리에 들어갑니다
              </h2>
              <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                {uses.map((i) => (
                  <Link
                    key={i.slug}
                    href={`/industries/${i.slug}`}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-card-m bg-wk-ink ring-1 ring-black/5 sm:rounded-card"
                  >
                    <Image
                      src={i.heroImage}
                      alt={i.heroImageAlt}
                      fill
                      sizes="(max-width: 1024px) 50vw, 280px"
                      className="object-cover transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-105"
                    />
                    <span className="wk-scrim-card absolute inset-0" />
                    <span className="absolute inset-x-0 bottom-0 p-4">
                      <span className="block text-caption text-white/80">{i.eyebrow}</span>
                      <span className="mt-0.5 block text-body font-bold text-white">{i.nameKo}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
