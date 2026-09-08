import type { Metadata } from 'next'

import { QuoteWizard } from '@/components/quote/QuoteWizard'
import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { IMAGES } from '@/lib/imageAssets'
import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { SITE, buildMetadata } from '@/lib/seo/site'

/**
 * 견적 요청.
 *
 * 제목에 회사명을 붙이지 않는다 — buildMetadata 의 template 이 `| 우강테크` 를
 * 자동으로 덧붙이기 때문에, 여기서 또 넣으면 "견적 요청 — 우강테크 | 우강테크" 가 된다.
 */
export const metadata: Metadata = buildMetadata({
  title: '견적 문의',
  description:
    '설치 장소와 화면 크기, 현장 사진만 남겨주시면 개략 견적 범위를 잡아 연락드립니다. 예산을 잡기 전 단계에서도 요청하실 수 있습니다.',
  path: '/quote',
})

export default function QuotePage({
  searchParams,
}: {
  searchParams: { type?: string }
}) {
  const type = searchParams?.type

  return (
    <>
      <JsonLd
        id="ld-breadcrumb-quote"
        data={breadcrumbLd([
          { name: '홈', url: SITE.url + '/' },
          { name: '견적 문의', url: SITE.url + '/quote' },
        ])}
      />
      <NavBar />
      <main id="main" className="min-h-screen bg-wk-bgFaint">
        <PageHeader
          group="고객지원"
          title="견적 문의"
          lead="설치 장소와 크기만 알려주시면 됩니다. 개략 견적 범위를 잡아 연락드리고, 확정 견적은 현장 실측 후에 나옵니다."
          image={IMAGES.quoteHero}
        />
        <div className="wk-wrap-read wk-sec-sm">
          <QuoteWizard defaultType={type} />

          <p className="wk-cap mt-8">
            남겨주신 연락처와 사진은 견적 산출과 회신에만 사용합니다.
            자세한 내용은 개인정보처리방침에서 확인하실 수 있습니다.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
