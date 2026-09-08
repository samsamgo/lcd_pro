import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/Footer'
import { CtaSection } from '@/components/landing/CtaSection'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { SubNav, productSubNavItems } from '@/components/SubNav'
import { PRODUCTS } from '@/lib/products'
import { INDUSTRIES } from '@/lib/industries'
import { PRODUCT_CATEGORIES, categoryOf } from '@/lib/productCategories'
import { buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

type PageProps = { params: { sku: string } }

function skuToSegment(sku: string) {
  return sku.toLowerCase().replace('.', '-')
}

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

  return buildMetadata({
    title: product.name,
    description: product.summary,
    path: `/products/${params.sku}`,
  })
}

export default function ProductPage({ params }: PageProps) {
  const sku = segmentToSku(params.sku)
  const product = PRODUCTS.find((item) => item.sku === sku)
  if (!product) notFound()

  // 이 제품을 권장 제품으로 물고 있는 업종 = 이 제품이 실제로 들어가는 자리
  const placedIn = INDUSTRIES.filter((i) => i.recommendedSkus.includes(product.sku)).slice(0, 6)

  const specs = [
    ['피치', product.pitch],
    ['밝기', product.brightness],
    ['방수', product.ingress],
    ['거리', product.viewingDistance],
    ['설치 환경', product.env === 'indoor' ? '실내' : '실외'],
  ]

  return (
    <>
      <NavBar />
      <main id="main">
        <PageHeader
          group={categoryOf(product.sku)?.name ?? '제품'}
          title={product.name}
          lead={product.summary}
          image={product.img}
          imageAlt={product.imgAlt}
        />

        <SubNav
          back={{
            label: categoryOf(product.sku)?.name ?? '제품 전체',
            href: categoryOf(product.sku) ? `/products/${categoryOf(product.sku)!.slug}` : '/products',
          }}
          items={productSubNavItems(PRODUCT_CATEGORIES)}
          current={categoryOf(product.sku) ? `/products/${categoryOf(product.sku)!.slug}` : ''}
        />

        <section className="wk-sec bg-white">
          <div className="wk-wrap">
            <p className="wk-eyebrow">규격</p>
            <dl className="mt-8 overflow-hidden rounded-card border border-wk-line">
              {specs.map(([label, value]) => (
                <div key={label} className="grid grid-cols-3 border-b border-wk-line p-5 last:border-b-0">
                  <dt className="font-semibold text-wk-ink">{label}</dt>
                  <dd className="col-span-2 text-wk-ink3">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="wk-sec bg-wk-bg">
          <div className="wk-wrap grid gap-10 md:grid-cols-2">
            <div>
              <p className="wk-eyebrow">특징</p>
              <ul className="mt-6 space-y-3">
                {product.highlights.map((highlight) => (
                  <li key={highlight} className="rounded-card border border-wk-line bg-white p-5 text-wk-ink">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="wk-eyebrow">추천 장소</p>
              <ul className="mt-6 space-y-3">
                {product.bestFor.map((place) => (
                  <li key={place} className="rounded-card border border-wk-line bg-white p-5 text-wk-ink">
                    {place}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 이 제품이 실제로 들어가는 자리 — 사진으로 보여주고 해당 시공사례로 보낸다.
            ⚠️ 이미지 레지스트리 규칙(한 이미지 = 한 자리)의 의도된 예외다. 여기 쓰는 컷은
            그 업종 페이지의 히어로와 같은 사진이고, **같은 것을 가리키는 링크**라서
            같아야 맞다. 다른 사진을 쓰면 눌러 들어갔을 때 다른 곳에 온 것처럼 보인다. */}
        {placedIn.length > 0 && (
          <section className="wk-sec bg-white">
            <div className="wk-wrap">
              <p className="wk-eyebrow">이 제품이 들어가는 자리</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {placedIn.map((i) => (
                  <Link
                    key={i.slug}
                    href={`/industries/${i.slug}`}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-card bg-wk-ink ring-1 ring-black/5"
                  >
                    <Image
                      src={i.heroImage}
                      alt={i.heroImageAlt ?? `${i.nameKo} 현장의 LED 안내 화면`}
                      fill
                      sizes="(max-width: 640px) 100vw, 380px"
                      className="object-cover transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-105"
                    />
                    <div className="wk-scrim-card absolute inset-0" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-caption font-medium text-white/80">{i.eyebrow}</p>
                      <b className="mt-1 block text-body-lg font-bold tracking-[-0.025em] text-white">
                        {i.nameKo}
                      </b>
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
