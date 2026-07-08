import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Check, X } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { PageHero } from '@/components/PageHero'
import { ProductGrid } from '@/components/landing/ProductGrid'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd, serviceLd } from '@/lib/seo/jsonld'
import { PRICE_RANGE_SCHEMA } from '@/lib/pricing'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'
import { INDUSTRIES, getIndustry } from '@/lib/industries'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const ind = getIndustry(params.slug)
  if (!ind) return {}
  return buildMetadata({
    title: `${ind.nameKo} LED 전광판·사이니지 | ${ind.keyword}`,
    description: ind.description,
    path: `/industries/${ind.slug}`,
  })
}

export default function IndustryPage({ params }: { params: { slug: string } }) {
  const ind = getIndustry(params.slug)
  if (!ind) notFound()

  return (
    <>
      <JsonLd
        id={`ld-industry-${ind.slug}`}
        data={serviceLd({
          name: `${ind.nameKo} LED 사이니지 시공`,
          description: ind.description,
          serviceType: `${ind.nameKo} LED 전광판 설계·시공·AS`,
          priceRange: PRICE_RANGE_SCHEMA,
          url: absoluteUrl(`/industries/${ind.slug}`),
        })}
      />
      <JsonLd
        id={`ld-breadcrumb-${ind.slug}`}
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '업종별', url: absoluteUrl('/industries') },
          { name: ind.nameKo, url: absoluteUrl(`/industries/${ind.slug}`) },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHero
          eyebrow={ind.eyebrow}
          title={ind.title}
          description={ind.description}
          crumbs={[
            { name: '홈', href: '/' },
            { name: '업종별', href: '/industries' },
            { name: ind.nameKo },
          ]}
        />

        {/* 문제 → 해결 */}
        <section className="py-20 px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-7">
                <p className="mb-4 text-sm font-semibold text-zinc-500">이런 고민 있으셨나요?</p>
                <ul className="space-y-3">
                  {ind.pains.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-zinc-700">
                      <X size={16} className="mt-0.5 shrink-0 text-zinc-400" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-blue-500/30 bg-blue-600/5 p-7">
                <p className="mb-4 text-sm font-semibold text-blue-700">우강테크는 이렇게 해결합니다</p>
                <ul className="space-y-4">
                  {ind.solutions.map((s) => (
                    <li key={s.title} className="flex items-start gap-2.5">
                      <Check size={16} className="mt-1 shrink-0 text-blue-600" />
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">{s.title}</p>
                        <p className="mt-0.5 text-sm text-zinc-600">{s.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-6 sm:flex-row">
              <div>
                <p className="text-sm text-zinc-500">{ind.nameKo} 예상 설치비</p>
                <p className="text-lg font-bold text-zinc-900">{ind.priceHint}</p>
              </div>
              <Link
                href={`/quote?type=${ind.quoteType}`}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blue-500 active:scale-95"
              >
                {ind.nameKo} 견적 받기
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* 추천 제품 */}
        <section className="surface-dark py-20 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
                추천 제품
              </p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                {ind.nameKo}에 맞는 표준 모델
              </h2>
              <p className="mt-3 text-zinc-400">카드를 누르면 상세 스펙과 예상 가격을 볼 수 있어요.</p>
            </div>
            <ProductGrid skus={ind.recommendedSkus} />
          </div>
        </section>

        {/* 다른 업종 */}
        <section className="bg-zinc-50 py-16 px-4">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mb-6 text-sm font-semibold text-zinc-500">다른 업종도 확인해보세요</p>
            <div className="flex flex-wrap justify-center gap-2">
              {INDUSTRIES.filter((i) => i.slug !== ind.slug).map((i) => (
                <Link
                  key={i.slug}
                  href={`/industries/${i.slug}`}
                  className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:border-blue-400 hover:text-blue-700"
                >
                  {i.nameKo}
                </Link>
              ))}
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
