import Image from 'next/image'
import Link from 'next/link'

import { NavBar } from '@/components/NavBar'
import { SubNav } from '@/components/SubNav'
import { productSubNavItems } from '@/lib/subnav'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { INDUSTRIES } from '@/lib/industries'
import { ModelGrid } from '@/components/products/ModelGrid'
import { ProductEnvHero } from '@/components/products/ProductEnvHero'
import { modelsByCategory } from '@/lib/productModels'
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
 * 제품 카테고리 페이지 — 카테고리 6종이 **같은 틀**을 쓴다.
 *
 * 🔴 2026-09-09 CEO 지시 "우리 제품을 온빛전자처럼 인도어/아웃도어로 멋있게 표현하고 소개해라".
 *    틀을 바꿨다. 순서 고정:
 *      ① 다크 배너(영문 한 단어 + 한글 이름 + 빵부스러기)
 *      ② 검정 배경 위 흰 카드 4열 — 공급사 규격서를 옮긴 **모델 시리즈**
 *      ③ 이 카테고리를 크기·보는 거리로 설명하는 글 + 요약 4칸
 *      ④ 이 자리에 맞는 기준 모델(견적 SKU) — 견적엔진과 묶인 층이라 그대로 유지한다
 *      ⑤ 쓰이는 자리(시공 유형) ⑥ 문의
 *
 * ③ 에서 밝기를 앞세우지 않는다(CEO "밝기로 쓰지 말고 크기로"). 밝기는 모델 상세 규격표 안에만 있다.
 */
export function ProductCategoryPage({ category }: { category: ProductCategory }) {
  const models = modelsByCategory(category.slug)
  const skuModels = categoryProducts(category)
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
        {/* ① 다크 배너 */}
        <ProductEnvHero
          display={category.display}
          title={category.name}
          lead={category.lead}
          image={category.heroImage}
          imageAlt={category.heroImageAlt}
          trail={[
            { label: '홈', href: '/' },
            { label: '제품', href: '/products' },
            { label: category.name },
          ]}
        />

        <SubNav
          back={{ label: '제품 전체', href: '/products' }}
          items={productSubNavItems(PRODUCT_CATEGORIES)}
          current={`/products/${category.slug}`}
        />

        {/* ② 모델 시리즈 — 검정 위 흰 카드 */}
        <ModelGrid
          models={models}
          eyebrow="시리즈"
          title={`${category.name} 시리즈`}
          note="화소 간격별 전체 규격은 각 시리즈를 누르면 표로 나옵니다. 값은 공급사 규격서 표기 그대로입니다."
        />

        {/* ③ 크기·보는 거리로 설명 */}
        <section className="wk-sec bg-white" aria-labelledby="size-h">
          <div className="wk-wrap grid gap-8 lg:grid-cols-[7fr_5fr] lg:gap-14">
            <div>
              <p className="wk-eyebrow">고르는 기준</p>
              <h2 id="size-h" className="wk-h2 text-wk-ink">
                크기가 먼저, 간격이 그다음
              </h2>
              <p className="mt-5 text-body leading-relaxed text-wk-ink2">{category.sizeLead}</p>
              <p className="wk-cap mt-5">
                화소 간격 1mm 당 약 1m — 간격이 2.5mm 면 2.5m 밖부터 글자가 뭉치지 않고 읽힙니다. 자리를 가늠하는
                어림값이고, 확정 사양은 현장 실측 뒤에 정합니다.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-card border border-wk-line bg-wk-line">
              {specs.map((s) => (
                <div key={s.k} className="bg-white p-5">
                  <dt className="text-caption text-wk-ink3">{s.k}</dt>
                  <dd className="wk-metric mt-1.5 text-body-lg font-semibold text-wk-ink">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ④ 이 자리에 맞는 기준 모델 — 견적엔진과 묶인 SKU 층 */}
        {skuModels.length > 0 && (
          <section className="wk-sec-sm bg-wk-bg" aria-labelledby="fit-h">
            <div className="wk-wrap">
              <p className="wk-eyebrow">이 자리에 맞는 모델</p>
              <h2 id="fit-h" className="wk-h2 text-wk-ink">
                견적이 바로 나오는 기준 구성
              </h2>
              <p className="mt-3 max-w-[44em] text-body text-wk-ink2">
                위 시리즈를 이 자리에 맞게 묶어 둔 기준 구성입니다. 누르면 규격과 기준 단가가 나오고, 그대로 견적으로
                이어집니다.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                {skuModels.map((p) => (
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
                        {p.viewingDistance} · {p.env === 'indoor' ? '실내' : p.ingress.split(' (')[0]}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ⑤ 쓰이는 자리 */}
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
