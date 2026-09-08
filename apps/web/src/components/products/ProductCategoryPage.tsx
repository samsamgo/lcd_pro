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
            {/* 사진 없이 행으로 — 모델 사진은 /products(제품 전체)와 모델 상세에만 둔다(이미지 1장 = 1페이지) */}
            <ul className="mt-6 divide-y divide-wk-line overflow-hidden rounded-card border border-wk-line bg-white">
              {models.map((p) => (
                <li key={p.sku}>
                  <Link
                    href={`/products/${skuToSegment(p.sku)}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-150 hover:bg-wk-bgFaint"
                  >
                    <span className="min-w-0">
                      <span className="block text-body font-semibold text-wk-ink">{p.name}</span>
                      <span className="mt-0.5 block text-label text-wk-ink3">{p.tag}</span>
                    </span>
                    <span className="wk-metric shrink-0 text-right text-label text-wk-ink2">
                      <b className="text-wk-cta">{p.pitch}</b> · {p.brightness} · {p.viewingDistance}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
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

        {/* ④ 쓰이는 자리 — 링크 칩. 사진은 시공사례 목록에만 둔다(이미지 1장 = 1페이지) */}
        {uses.length > 0 && (
          <section className="wk-sec-sm bg-white">
            <div className="wk-wrap">
              <p className="wk-eyebrow">쓰이는 자리</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {uses.map((i) => (
                  <Link
                    key={i.slug}
                    href={`/industries/${i.slug}`}
                    className="rounded-full border border-wk-line2 px-4 py-2 text-label font-semibold text-wk-ink2 transition-colors duration-150 hover:border-wk-ink hover:text-wk-ink"
                  >
                    {i.nameKo}
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
