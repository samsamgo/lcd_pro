import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/Footer'
import { CtaSection } from '@/components/landing/CtaSection'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { SubNav } from '@/components/SubNav'
import { JsonLd } from '@/components/seo/JsonLd'
import { INDUSTRIES, getIndustry } from '@/lib/industries'
import { IMAGES } from '@/lib/imageAssets'
import { PRODUCTS } from '@/lib/products'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

type PageProps = { params: { slug: string } }

export function generateStaticParams() {
  return INDUSTRIES.map((industry) => ({ slug: industry.slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const industry = getIndustry(params.slug)
  if (!industry) notFound()

  return buildMetadata({
    title: `${industry.keyword}`,
    description: industry.description,
    path: `/industries/${params.slug}`,
  })
}

export default function IndustryPage({ params }: PageProps) {
  const industry = getIndustry(params.slug)
  if (!industry) notFound()

  const products = industry.recommendedSkus
    .map((sku) => PRODUCTS.find((product) => product.sku === sku))
    .filter((product): product is (typeof PRODUCTS)[number] => Boolean(product))

  return (
    <>
      <JsonLd
        id={`ld-breadcrumb-industry-${industry.slug}`}
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '시공사례', url: absoluteUrl('/industries') },
          { name: industry.nameKo, url: absoluteUrl(`/industries/${industry.slug}`) },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHeader
          group="시공사례"
          title={industry.nameKo}
          lead={industry.description}
          image={IMAGES.industryDetail[industry.slug] ?? industry.heroImage}
          imageAlt={industry.heroImageAlt}
        />

        {/* 같은 시설군의 형제 페이지로 바로 넘어간다 — 목록으로 돌아가지 않아도 된다 */}
        <SubNav
          back={{ label: '시공사례 전체', href: '/industries' }}
          items={INDUSTRIES.filter((i) => i.group === industry.group).map((i) => ({
            label: i.nameKo,
            href: `/industries/${i.slug}`,
          }))}
          current={`/industries/${industry.slug}`}
        />

        <section className="wk-sec bg-wk-bg">
          <div className="wk-wrap">
            <p className="wk-eyebrow">이런 점이 불편합니다</p>
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {industry.pains.map((pain) => (
                <li key={pain} className="rounded-card border border-wk-line bg-white p-6 text-wk-ink">
                  {pain}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="wk-sec bg-white">
          <div className="wk-wrap">
            <p className="wk-eyebrow">해결 방법</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {industry.solutions.map((solution) => (
                <article key={solution.title} className="rounded-card border border-wk-line bg-wk-bg p-6">
                  <h2 className="text-body-lg font-semibold text-wk-ink">{solution.title}</h2>
                  <p className="mt-3 text-label leading-relaxed text-wk-ink3">{solution.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 권장 제품 — 글자 카드였던 것을 사진 카드로 바꿨다(CEO 지시 2026-09-08).
            제품 이름만 적힌 카드는 담당자에게 아무것도 알려주지 않는다. 사진을 먼저 보이고
            화소·밝기를 그 아래 한 줄로 붙인 다음, 누르면 제품 상세로 보낸다. */}
        {products.length > 0 && (
          <section className="wk-sec bg-wk-bg">
            <div className="wk-wrap">
              <p className="wk-eyebrow">권장 제품</p>
              {/* 사진 없이 행으로 — 모델 사진은 /products 에만 둔다(이미지 1장 = 1페이지, CEO 지시 2026-09-08) */}
              <ul className="mt-6 divide-y divide-wk-line overflow-hidden rounded-card border border-wk-line bg-white">
                {products.map((product) => (
                  <li key={product.sku}>
                    <Link
                      href={`/products/${product.sku.toLowerCase().replace('.', '-')}`}
                      className="flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-150 hover:bg-wk-bgFaint"
                    >
                      <span className="min-w-0">
                        <span className="block text-body font-semibold text-wk-ink">{product.name}</span>
                        <span className="mt-0.5 block text-label text-wk-ink3">{product.tag}</span>
                      </span>
                      <span className="wk-metric shrink-0 text-right text-label text-wk-ink2">
                        <b className="text-wk-cta">{product.pitch}</b> · {product.brightness}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
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
