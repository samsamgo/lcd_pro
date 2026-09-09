import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/Footer'
import { CtaSection } from '@/components/landing/CtaSection'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { JsonLd } from '@/components/seo/JsonLd'
import { PRODUCTS } from '@/lib/products'
import { INDUSTRIES } from '@/lib/industries'
import Link from 'next/link'
import { categoryOf, skuToSegment } from '@/lib/productCategories'
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
  // 🔴 2026-09-09 — canonical 에 params.sku 를 그대로 쓰면 대소문자 변형이 각자 자기를 정본이라고 말한다.
  //    `/products/in-s` 와 `/products/IN-S` 가 둘 다 200 이고 둘 다 self-canonical 이면 중복 색인이다.
  //    정규화된 세그먼트 하나만 정본으로 가리킨다.
  const segment = skuToSegment(product.sku)
  return buildMetadata({
    title: product.name,
    description: product.summary,
    path: `/products/${segment}`,
  })
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
  /** 이 모델을 권장하는 설치 자리 — 제품에서 시공사례로 건너가는 길 */
  const uses = INDUSTRIES.filter((i) => i.recommendedSkus.includes(product.sku))
  /** 같은 카테고리의 다른 모델 — 되돌아가지 않고 옆으로 비교한다 */
  const siblings = category
    ? category.skus.filter((s) => s !== product.sku).map((s) => PRODUCTS.find((p) => p.sku === s)).filter((p): p is (typeof PRODUCTS)[number] => !!p)
    : []
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
          { name: product.name, url: absoluteUrl(`/products/${params.sku}`) },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHeader
          group="제품"
          title={product.name}
          lead={product.tag}
          image={product.img}
          imageAlt={product.imgAlt}
        />
        {/* 🔴 2026-09-09 — 카테고리 페이지가 사라져 돌아갈 곳은 제품 전체뿐이다.
            이 라우트(견적 SKU 6종)는 견적엔진이 참조하므로 **주소는 살려 두되**
            네비·카드 어디에서도 링크하지 않는다. */}

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

              {/* 2026-09-08 2차 — 제품에서 막다른 길이 되지 않게 옆길 둘을 둔다.
                  ① 이 모델이 들어가는 자리(시공사례 상세) ② 같은 카테고리의 다른 모델. 사진은 붙이지 않는다 */}
              {uses.length > 0 && (
                <div className="mt-8 border-t border-wk-line pt-6">
                  <p className="text-caption font-semibold text-wk-ink3">이 모델이 들어가는 자리</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {uses.map((i) => (
                      <Link
                        key={i.slug}
                        href={`/industries/${i.slug}`}
                        className="rounded-full border border-wk-line2 px-3.5 py-1.5 text-label font-semibold text-wk-ink2 transition-colors duration-150 hover:border-wk-ink hover:text-wk-ink"
                      >
                        {i.nameKo}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {siblings.length > 0 && (
                <div className="mt-6 border-t border-wk-line pt-6">
                  <p className="text-caption font-semibold text-wk-ink3">{category?.name}의 다른 모델</p>
                  <ul className="mt-3 space-y-2">
                    {siblings.map((p) => (
                      <li key={p.sku}>
                        <Link
                          href={`/products/${skuToSegment(p.sku)}`}
                          className="flex items-baseline justify-between gap-3 text-label text-wk-ink2 underline-offset-4 hover:text-wk-ink hover:underline"
                        >
                          <span className="font-semibold">{p.name}</span>
                          <span className="wk-metric shrink-0 text-caption text-wk-ink3"><b className="text-wk-cta">{p.pitch}</b> · {p.brightness}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
