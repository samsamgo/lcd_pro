import type { Metadata } from 'next'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { PageHeader } from '@/components/PageHeader'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { IMAGES } from '@/lib/imageAssets'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'
import { DownloadList } from '@/components/support/DownloadList'
import { RESOURCES } from '@/lib/resources'

export const metadata: Metadata = buildMetadata({
  title: '자료실',
  description: '규격서 · 시공사례집 · 운영 안내서 자료실.',
  path: '/support/downloads',
})

/**
 * 자료실 — 별도 페이지, **게시판 형식** (2026-09-09 CEO 지시).
 * 자료는 `lib/resources.ts` 에 한 줄씩 추가한다. 비어 있어도 표를 그린다.
 */
export default function DownloadsPage() {
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
          lead="규격서 · 시공사례집 · 운영 안내서를 올립니다."
          image={IMAGES.support}
        />
        <section className="wk-sec bg-wk-bg" aria-label="자료 목록">
          <div className="wk-wrap">
            <DownloadList resources={RESOURCES} />
          </div>
        </section>
        {/* 2026-09-09 CEO 지시 — 고객지원 페이지에서 하단 문의 칸(예산 잡기 전이어도…) 제거 */}
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
