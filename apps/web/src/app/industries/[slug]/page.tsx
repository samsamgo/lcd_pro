import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/Footer'
import { CtaSection } from '@/components/landing/CtaSection'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { NavBar } from '@/components/NavBar'
import { JsonLd } from '@/components/seo/JsonLd'
import { INDUSTRIES, getIndustry } from '@/lib/industries'
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
        <section
          data-wk-dark-hero
          className="relative flex min-h-[62svh] items-end overflow-hidden bg-black md:min-h-[70svh]"
        >
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src={industry.heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/70" />
            <div className="wk-pixelgrid wk-pixelgrid-top wk-pixelgrid-coarse absolute inset-0" />
          </div>
          <div className="relative z-10 w-full pb-14 md:pb-20">
            <div className="wk-wrap">
              <p className="wk-eyebrow !text-white/70">{industry.eyebrow}</p>
              <h1 className="wk-h1 wk-emit-text max-w-[13em] text-white">{industry.title}</h1>
              <p className="wk-lead mt-7 !text-white/85">{industry.description}</p>
            </div>
          </div>
        </section>

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
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <Link
                    key={product.sku}
                    href={`/products/${product.sku.toLowerCase().replace('.', '-')}`}
                    className="group block overflow-hidden rounded-card border border-wk-line bg-white transition-shadow duration-state ease-state hover:shadow-wk-2"
                  >
                    <span className="relative block aspect-[4/3] overflow-hidden bg-wk-ink">
                      <Image
                        src={product.img}
                        alt={product.imgAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, 380px"
                        className="object-cover transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-105"
                      />
                    </span>
                    <span className="block p-5">
                      <span className="block text-body-lg font-semibold text-wk-ink">
                        {product.name}
                      </span>
                      <span className="mt-1.5 block text-label text-wk-ink3">
                        {product.pitch} · {product.brightness}
                      </span>
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
