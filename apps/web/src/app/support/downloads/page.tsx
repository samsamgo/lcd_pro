import type { Metadata } from 'next'
import Link from 'next/link'

import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { IMAGES } from '@/lib/imageAssets'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { DownloadList } from '@/components/support/DownloadList'
import { RESOURCES } from '@/lib/resources'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { SITE, absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '자료실',
  description:
    '제품 규격서, 시공사례집, 인증 서류를 내려받으실 수 있습니다. 필요한 자료가 목록에 없으면 요청해 주십시오.',
  path: '/support/downloads',
})

/**
 * 자료실.
 *
 * 목록 데이터는 `lib/resources.ts` 한 곳에서 온다. PDF 를 public/docs/ 에 넣고
 * 그 배열에 한 줄 추가하면 여기 뜬다 — 이 페이지는 손대지 않는다.
 *
 * 파일이 아직 없을 때 목록을 지어내지 않는다. 담당자가 눌렀을 때 404 를 받으면
 * 그 한 번으로 신뢰가 끝난다. 비어 있으면 비어 있다고 쓰고, 요청 경로를 준다.
 */
export default function DownloadsPage() {
  const empty = RESOURCES.length === 0

  return (
    <>
      <JsonLd
        id="ld-breadcrumb-downloads"
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '고객지원', url: absoluteUrl('/support') },
          { name: '자료실', url: absoluteUrl('/support/downloads') },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHeader
          group="고객지원"
          title="자료실"
          lead="결재 서류에 첨부하실 자료를 내려받으십시오."
          image={IMAGES.pageHeaders.downloads}
        />

        <section className="wk-sec bg-wk-bg">
          <div className="wk-wrap">
            {empty ? (
              /* 빈 상태 — 준비 중이라고 쓰되, 담당자가 지금 당장 할 수 있는 것을 준다 */
              <div className="rounded-card border border-wk-line bg-white p-10 text-center md:p-14">
                <p className="text-body-lg font-semibold text-wk-ink">
                  자료를 준비하고 있습니다
                </p>
                <p className="mx-auto mt-3 max-w-[28em] text-label leading-relaxed text-wk-ink3">
                  필요한 서류를 알려주시면 그 형식에 맞춰 바로 보내드립니다.
                  규격서, 견적서, 사양 비교표 모두 됩니다.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
                  <Link
                    href="/quote"
                    className="rounded-btn bg-wk-cta px-5 py-3 text-sm font-bold text-white transition-colors duration-150 hover:bg-wk-ctaHover"
                  >
                    자료 요청하기
                  </Link>
                  <a
                    href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`}
                    className="rounded-btn border border-wk-line2 px-5 py-3 text-sm font-semibold text-wk-ink2 transition-colors duration-150 hover:bg-wk-bgFaint"
                  >
                    {SITE.phone}
                  </a>
                </div>
              </div>
            ) : (
              <DownloadList resources={RESOURCES} />
            )}
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
