import type { Metadata } from 'next'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { PageHero } from '@/components/PageHero'
import { ProductSection } from '@/components/landing/ProductSection'
import { TargetSection } from '@/components/landing/TargetSection'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { SITE, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '설치 장소별 안내판',
  description:
    '민원실 안내판부터 옥외 대형 전광판까지, 설치 장소와 보는 거리에 맞춰 표준 규격으로 제작합니다. 기준 가격과 포함 범위를 그대로 공개합니다.',
  path: '/products',
})

export default function ProductsPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-products"
        data={breadcrumbLd([
          { name: '홈', url: SITE.url + '/' },
          { name: '설치 장소별 안내판', url: SITE.url + '/products' },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHero
          eyebrow="설치 장소별 안내"
          title="보는 거리와 설치 장소로 고르세요"
          description="민원실 창구처럼 가까이 보는 화면부터 건물 밖에서 멀리 보는 화면까지 나누어 안내합니다. 화면 크기와 설치 위치를 알려주시면 맞는 구성을 제안해 드립니다."
          crumbs={[{ name: '홈', href: '/' }, { name: '설치 장소별 안내판' }]}
        />
        <ProductSection hideHeader />
        <TargetSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
