import type { Metadata } from 'next'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { PageHeader } from '@/components/PageHeader'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { IMAGES } from '@/lib/imageAssets'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'
import { NOTICES } from '@/lib/notices'
import { NoticeBoard } from './NoticeBoard'

export const metadata: Metadata = buildMetadata({
  title: '공지사항',
  description: '우강테크 공지사항 — 운영·A/S·자료 관련 안내를 올립니다.',
  path: '/support/notice',
})

/**
 * 공지사항 — 고객지원 첫 칸 (2026-09-09 CEO 지시로 신설).
 * 공지는 `lib/notices.ts` 에 한 줄씩 추가한다. 비어 있어도 표를 그린다.
 *
 * 🔴 하단 문의 CTA(CtaSection)를 넣지 마라 — 09-09 에 고객지원 세 페이지에서 이미 뺐다.
 */
export default function NoticePage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-notice"
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '고객지원', url: absoluteUrl('/support') },
          { name: '공지사항', url: absoluteUrl('/support/notice') },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHeader
          group="고객지원"
          title="공지사항"
          lead="운영·A/S·자료 관련 안내를 이 자리에 올립니다."
          image={IMAGES.support}
        />
        <section className="wk-sec bg-wk-bg" aria-label="공지 목록">
          <div className="wk-wrap">
            <NoticeBoard notices={NOTICES} />
          </div>
        </section>
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
