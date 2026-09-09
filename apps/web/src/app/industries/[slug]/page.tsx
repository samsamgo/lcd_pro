import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/Footer'
import { CtaSection } from '@/components/landing/CtaSection'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { IndustryGallery } from '@/components/public/IndustryGallery'
import { JsonLd } from '@/components/seo/JsonLd'
import { INDUSTRIES, getIndustry } from '@/lib/industries'
import { PRODUCTS } from '@/lib/products'
import { skuToSegment } from '@/lib/productCategories'
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
    description: `${industry.description} ${industry.solutions.map((solution) => solution.desc).join(' ')}`,
    path: `/industries/${industry.slug}`,
    ogImage: industry.heroImage,
  })
}

export default function IndustryPage({ params }: PageProps) {
  const industry = getIndustry(params.slug)
  if (!industry) notFound()

  const products = industry.recommendedSkus
    .map((sku) => PRODUCTS.find((product) => product.sku === sku))
    .filter((product): product is (typeof PRODUCTS)[number] => Boolean(product))
  const industryIndex = INDUSTRIES.findIndex((item) => item.slug === industry.slug)
  const relatedIndustries = Array.from(
    { length: Math.min(3, INDUSTRIES.length - 1) },
    (_, offset) => INDUSTRIES[(industryIndex + offset + 1) % INDUSTRIES.length],
  )

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
          image={industry.heroImage}
          imageAlt={industry.heroImageAlt}
        />

        {/* 같은 시설군의 형제 페이지로 바로 넘어간다 — 목록으로 돌아가지 않아도 된다 */}

        {/* 케이시스 설치사례 상세와 같은 구성 — 큰 사진 + 썸네일 + 구축정보 표.
            모달(`IndustryModal`)과 같은 컴포넌트를 쓴다. 두 경로로 보여주면서
            내용이 갈리는 사고를 2026-09-08 에 한 번 냈다. */}
        <section className="wk-sec bg-white">
          <div className="wk-wrap max-w-[900px]">
            <IndustryGallery industry={industry} />
          </div>
        </section>

        {/* 이런 상황에서 씁니다 / 우리가 하는 일 — 표 아래로 내렸다.
            사진과 규격이 먼저고 글은 그 다음이다. */}
        <section className="wk-sec bg-wk-bg">
          <div className="wk-wrap">
            <p className="wk-eyebrow">이런 상황에서 씁니다</p>
            <ul className="m-0 mt-6 grid list-none gap-3 p-0 md:grid-cols-2">
              {industry.pains.map((pain) => (
                <li key={pain} className="rounded-card-m border border-wk-line bg-white p-5 text-label text-wk-ink2">
                  {pain}
                </li>
              ))}
            </ul>

            <p className="wk-eyebrow mt-12">이 자리에서 하는 일</p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {industry.solutions.map((solution) => (
                <article key={solution.title} className="rounded-card-m border border-wk-line bg-white p-5">
                  <h3 className="text-body-lg font-semibold text-wk-ink">{solution.title}</h3>
                  <p className="mt-2 text-label leading-relaxed text-wk-ink3">{solution.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 권장 제품 — 사진 카드. 2026-09-08 CEO "제품 소개는 최소한 이미지는 보여주면서". */}
        {products.length > 0 && (
          <section className="wk-sec bg-white" aria-labelledby="rec-h">
            <div className="wk-wrap">
              <p className="wk-eyebrow">권장 제품</p>
              <h2 id="rec-h" className="wk-h2 text-wk-ink">
                이 자리에 맞는 모델
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                {products.map((product) => (
                  <Link
                    key={product.sku}
                    href={`/products/${skuToSegment(product.sku)}`}
                    className="group block overflow-hidden rounded-card border border-wk-line bg-white transition-shadow duration-state ease-state hover:shadow-wk-2"
                  >
                    <span className="relative block aspect-[4/3] overflow-hidden bg-wk-ink">
                      <Image
                        src={product.img}
                        alt={product.imgAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                        className="object-cover transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-105"
                      />
                    </span>
                    <span className="block p-5">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="text-body-lg font-semibold text-wk-ink">{product.name}</span>
                        <span className="wk-metric shrink-0 text-label font-semibold text-wk-cta">{product.pitch}</span>
                      </span>
                      <span className="mt-1 block text-label text-wk-ink3">{product.tag}</span>
                      <span className="wk-metric mt-3 block border-t border-wk-line pt-3 text-caption text-wk-ink2">
                        {product.brightness} · {product.viewingDistance}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="wk-sec bg-wk-bg" aria-labelledby="related-industries-h">
          <div className="wk-wrap">
            <h2 id="related-industries-h" className="wk-h2 text-wk-ink">다른 설치 자리</h2>
            <ul className="mt-6 grid gap-3 md:grid-cols-3">
              {relatedIndustries.map((related) => (
                <li key={related.slug}>
                  <Link href={`/industries/${related.slug}`} className="block rounded-card-m border border-wk-line bg-white p-5 text-label font-semibold text-wk-ink transition-colors hover:border-wk-ink">
                    {related.nameKo} 자세히 보기 →
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/industries" className="mt-7 inline-block text-label font-semibold text-wk-cta underline-offset-4 hover:underline">
              시공사례 목록으로 돌아가기
            </Link>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
