import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/Footer'
import { CtaSection } from '@/components/landing/CtaSection'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { SubNav } from '@/components/SubNav'
import { productSubNavItems } from '@/lib/subnav'
import { JsonLd } from '@/components/seo/JsonLd'
import { PRODUCTS } from '@/lib/products'
import { IMAGES } from '@/lib/imageAssets'
import { PRODUCT_CATEGORIES, categoryOf, skuToSegment } from '@/lib/productCategories'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

type PageProps = { params: { sku: string } }

function segmentToSku(segment: string) {
  return PRODUCTS.find((product) => skuToSegment(product.sku) === segment)?.sku
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ sku: skuToSegment(product.sku) }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const sku = segmentToSku(params.sku)
  const product = PRODUCTS.find((item) => item.sku === sku)
  if (!product) notFound()
  return buildMetadata({ title: product.name, description: product.summary, path: `/products/${params.sku}` })
}

/**
 * 모델 상세 — **큰 사진 1장 + 간단한 표 + 짧은 설명.** 그 이상 넣지 않는다.
 * 🔴 2026-09-08 CEO 지시 "각각 누를 때마다 사진 한 개만 크게 띄우고 아래에 간단한 표하고 설명만".
 *    전에 있던 '특징'·'추천 장소'·'이 제품이 들어가는 자리' 세 섹션을 걷어냈다.
 *    사진은 PageHeader 가 화면 폭으로 띄운다. 그 아래 표 한 장, 문장 한 단락.
 */
export default function ProductPage({ params }: PageProps) {
  const sku = segmentToSku(params.sku)
  const product = PRODUCTS.find((item) => item.sku === sku)
  if (!product) notFound()

  const category = categoryOf(product.sku)
  const specs: [string, string][] = [
    ['화소 간격', product.pitch],
    ['밝기', product.brightness],
    ['방진·방수', product.ingress],
    ['권장 시청거리', product.viewingDistance],
    ['설치 환경', product.env === 'indoor' ? '실내' : '실외'],
    ['추천 장소', product.bestFor.join(' · ')],
  ]

  return (
    <>
      <JsonLd
        id={`ld-breadcrumb-product-${params.sku}`}
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '제품', url: absoluteUrl('/products') },
          ...(category ? [{ name: category.name, url: absoluteUrl(`/products/${category.slug}`) }] : []),
          { name: product.name, url: absoluteUrl(`/products/${params.sku}`) },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHeader
          group={category?.name ?? '제품'}
          title={product.name}
          lead={product.tag}
          image={IMAGES.productDetail[product.sku] ?? product.img}
          imageAlt={product.imgAlt}
        />
        <SubNav
          back={{ label: category?.name ?? '제품 전체', href: category ? `/products/${category.slug}` : '/products' }}
          items={productSubNavItems(PRODUCT_CATEGORIES)}
          current={category ? `/products/${category.slug}` : ''}
        />

        <section className="wk-sec bg-white">
          <div className="wk-wrap grid gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
            {/* 표 */}
            <dl className="overflow-hidden rounded-card border border-wk-line">
              {specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(110px,1fr)_2fr] border-b border-wk-line last:border-b-0">
                  <dt className="bg-wk-bgFaint px-5 py-4 text-label font-semibold text-wk-ink2">{k}</dt>
                  <dd className="wk-metric px-5 py-4 text-body text-wk-ink">{v}</dd>
                </div>
              ))}
            </dl>

            {/* 설명 */}
            <div>
              <p className="wk-eyebrow">설명</p>
              <p className="text-body leading-relaxed text-wk-ink2">{product.summary}</p>
              <ul className="mt-5 space-y-2 border-t border-wk-line pt-5">
                {product.highlights.map((h) => (
                  <li key={h} className="flex gap-2.5 text-label text-wk-ink3">
                    <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-wk-cta" />
                    {h}
                  </li>
                ))}
              </ul>
              <p className="wk-cap mt-6">규격은 제품 규격서 기준값입니다. 확정 사양은 현장 실측 후 정해집니다.</p>
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
