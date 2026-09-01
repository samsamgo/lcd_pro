import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { PageHero } from '@/components/PageHero'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'
import { INDUSTRIES } from '@/lib/industries'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '업종별 LED 전광판·사이니지',
  description:
    '관공서·민원실, 학교·강당, 전자현수막, 공공기관·시설관리를 위한 LED 전광판과 안내 사이니지 구성을 확인하세요.',
  path: '/industries',
})

export default function IndustriesPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-industries"
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '업종별', url: absoluteUrl('/industries') },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHero
          eyebrow="Industries"
          title="공공 현장에 맞는 LED 사이니지"
          description="민원실, 학교, 로비, 옥외 게시대는 시청 거리와 운영 내용이 서로 다릅니다. 설치 장소와 담당자의 실제 업무를 확인해 화면 구성을 제안합니다."
          crumbs={[{ name: '홈', href: '/' }, { name: '업종별' }]}
        />
        <section className="py-20 px-4">
          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2">
            {INDUSTRIES.map((ind) => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="group rounded-2xl border border-zinc-200 bg-white p-7 transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-blue-600">{ind.eyebrow}</p>
                <h2 className="mt-2 text-xl font-bold text-zinc-900">{ind.nameKo} LED 사이니지</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{ind.description}</p>
                <p className="mt-4 text-sm font-medium text-zinc-500">{ind.priceHint}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2">
                  자세히 보기 <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </section>
        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
