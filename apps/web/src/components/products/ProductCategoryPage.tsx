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
 * 제품 카테고리 페이지 — 실내용 / 실외용 / 전자현수막 셋이 **같은 틀**을 쓴다.
 *
 * 틀은 다섯 덩어리, 순서 고정: ① 사진 히어로 + 이름 + 한 줄
 * ② 모델(사진 카드) ③ 규격 요약 ④ 쓰이는 자리(사진 카드) ⑤ 문의.
 * CEO 지시(2026-09-08) "사진과 함께 간단 명료하게". 문장은 데이터 파일의 것만 쓴다.
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

        {/* ② 모델 */}
        <section className="wk-sec bg-white">
          <div className="wk-wrap">
            <p className="wk-eyebrow">모델</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                      sizes="(max-width: 640px) 100vw, 380px"
                      className="object-cover transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-105"
                    />
                  </span>
                  <span className="block p-5">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="text-body-lg font-semibold text-wk-ink">{p.name}</span>
                      <span className="wk-metric shrink-0 text-label font-semibold text-wk-cta">{p.pitch}</span>
                    </span>
                    <span className="mt-1.5 block text-label text-wk-ink3">
                      {p.brightness} · {p.viewingDistance}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ③ 규격 요약 */}
        <section className="wk-sec-sm bg-wk-bg">
          <div className="wk-wrap">
            <p className="wk-eyebrow">규격 요약</p>
            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-wk-line bg-wk-line lg:grid-cols-4">
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

        {/* ④ 쓰이는 자리 */}
        {uses.length > 0 && (
          <section className="wk-sec bg-white">
            <div className="wk-wrap">
              <p className="wk-eyebrow">쓰이는 자리</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {uses.map((i) => (
                  <Link
                    key={i.slug}
                    href={`/industries/${i.slug}`}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-card bg-wk-ink ring-1 ring-black/5"
                  >
                    <Image
                      src={i.heroImage}
                      alt={i.heroImageAlt ?? `${i.nameKo} 현장의 LED 안내 화면`}
                      fill
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-cover transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-105"
                    />
                    <div className="wk-scrim-card absolute inset-0" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <b className="block text-body font-bold tracking-[-0.02em] text-white">{i.nameKo}</b>
                    </div>
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
