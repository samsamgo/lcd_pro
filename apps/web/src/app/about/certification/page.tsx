import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { PageHeader } from '@/components/PageHeader'
import { CertGallery } from '@/components/about/CertGallery'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { IMAGES } from '@/lib/imageAssets'
import { RRA_SEARCH } from '@/lib/credentials'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '인증 · 서류',
  description:
    '우강테크가 발급받은 인증·등록 서류 원본입니다. KC 적합등록, 정보통신공사업 등록증, 공장등록증명서, 연구개발전담부서 인정서 등을 PDF 로 내려받으실 수 있습니다.',
  path: '/about/certification',
})

/**
 * 인증 · 서류 — **별도 페이지.**
 *
 * 🔴 2026-09-08 CEO "KC 인증서는 따로 페이지 만들어서 관리".
 * 🔴 2026-09-09 CEO "KC 인증서 PDF 있으니 다른 회사처럼 보여줘라."
 *    번호만 적던 카드 목록을 **온빛전자식 스캔 이미지 갤러리**로 바꿨다.
 *    담당자가 확인하는 것은 로고 배지가 아니라 도장 찍힌 종이다.
 *
 * 서류를 추가하려면 `lib/credentials.ts` 의 CREDENTIALS 에 한 줄 넣고
 * 스캔·썸네일·PDF 세 파일을 규칙대로 넣으면 된다. 이 페이지는 손대지 않는다.
 *
 * ⚠️ 개수를 세지 않는다("8종" 금지). 세면 그 숫자가 작다는 사실만 부각된다.
 * ⚠️ 취득하지 않은 인증을 "진행 중" 으로 적지 않는다. 관공서 상대 허위표기는 제재 사유다.
 */
export default function CertificationPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-certification"
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '회사소개', url: absoluteUrl('/about') },
          { name: '인증 · 서류', url: absoluteUrl('/about/certification') },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHeader
          group="회사소개"
          title="인증 · 서류"
          lead="발급기관에서 받은 원본을 그대로 올려 둡니다. 눌러서 크게 보고, PDF 로 받으실 수 있습니다."
          image={IMAGES.pageHeaders.certification}
        />

        <section className="wk-sec bg-white" aria-labelledby="cert-h">
          <div className="wk-wrap">
            <h2 id="cert-h" className="sr-only">
              보유 인증 · 등록 서류
            </h2>
            <CertGallery />

            <div className="mt-10 rounded-card border border-wk-line bg-wk-bgFaint px-6 py-6">
              <p className="text-label leading-relaxed text-wk-ink2">
                KC 적합등록 번호는 국립전파연구원 적합성평가 현황에서 직접 조회하실 수 있습니다.
                납품 서류에 필요한 형식(원본대조필 사본 등)이 있으면 견적 단계에서 맞춰 드립니다.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                <a
                  href={RRA_SEARCH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-label font-semibold text-wk-cta hover:underline"
                >
                  적합성평가 현황에서 조회
                  <ExternalLink size={14} aria-hidden="true" />
                  <span className="sr-only"> (새 창)</span>
                </a>
                <Link
                  href="/support/downloads"
                  className="text-label font-semibold text-wk-ink2 underline-offset-4 hover:underline"
                >
                  자료실에서 한 번에 받기
                </Link>
              </div>
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
