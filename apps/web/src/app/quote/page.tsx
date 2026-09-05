import type { Metadata } from 'next'

import { QuoteWizard } from '@/components/quote/QuoteWizard'
import { NavBar } from '@/components/NavBar'
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
  title: '견적 요청',
  description:
    '설치 장소와 화면 크기, 현장 사진만 남겨주시면 개략 견적 범위와 제품 규격서를 보내드립니다. 예산을 잡기 전 단계에서도 요청하실 수 있습니다.',
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
          { name: '견적 요청', url: SITE.url + '/quote' },
        ])}
      />
      <NavBar />
      <main id="main" className="min-h-screen bg-wk-bgFaint pt-16">
        <div className="wk-wrap-read wk-sec-sm">
          <div className="mb-10">
            <p className="wk-eyebrow">견적 요청</p>
            <h1 className="wk-h2 text-wk-ink">
              설치 장소와 크기만
              <br className="hidden sm:block" /> 알려주시면 됩니다
            </h1>
            <p className="wk-lead mt-5">
              보내주신 내용으로 개략 견적 범위와 제품 규격서를 작성해 드립니다.
              확정 견적은 현장 실측 후에 나옵니다.
            </p>
          </div>

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
