import type { Metadata } from 'next'
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
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

type PageProps = { params: { slug: string } }

export function generateStaticParams() {
  return INDUSTRIES.map((industry) => ({ slug: industry.slug }))
}

const clip155 = (t: string) => (t.length <= 155 ? t : `${t.slice(0, 152).replace(/[,\s·]+\S*$/, '')}…`)

export function generateMetadata({ params }: PageProps): Metadata {
  const industry = getIndustry(params.slug)
  if (!industry) notFound()

  return buildMetadata({
    title: `${industry.keyword}`,
    // 2026-09-09 점검: solutions 를 전부 이어붙이면 300자를 넘어 검색 결과에서 잘린다 → 155자에서 끊는다
    description: clip155(`${industry.description} ${industry.solutions.map((solution) => solution.desc).join(' ')}`),
    path: `/industries/${industry.slug}`,
    ogImage: industry.heroImage,
  })
}

export default function IndustryPage({ params }: PageProps) {
  const industry = getIndustry(params.slug)
  if (!industry) notFound()

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
            {/* 상세 페이지에선 대표 사진이 첫 화면이다 — 지연 로딩이면 폰에서 검은 상자로 먼저 보인다(2026-09-09 실측) */}
            <IndustryGallery industry={industry} priority />
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

        {/* 2026-09-09 CEO "설치기준 SKU 다 지워, 이제 안 써" — 권장 SKU 카드 섹션 제거. 제품은 /products 시리즈 12종만 */}

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
