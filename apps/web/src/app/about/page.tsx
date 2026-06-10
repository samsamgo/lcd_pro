import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata, SITE } from '@/lib/seo/site'
import { organizationLd, breadcrumbLd } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '회사 소개',
  description:
    '우강테크(WK Tech)는 한국 LED 사이니지 B2B 플랫폼입니다. NovaStar Taurus 기반 표준 시공·AS·즉석 범위 견적으로, 소상공인이 기술을 몰라도 디지털 사이니지를 안정적으로 도입할 수 있도록 돕습니다.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-3xl px-4 py-24">
      <JsonLd id="ld-org-about" data={organizationLd()} />
      <JsonLd
        id="ld-breadcrumb-about"
        data={breadcrumbLd([
          { name: '홈', url: SITE.url + '/' },
          { name: '회사 소개', url: SITE.url + '/about' },
        ])}
      />

      <header className="mb-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">
          About {SITE.nameKo}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          {SITE.nameKo} <span className="text-zinc-500">/ {SITE.nameEn}</span>
        </h1>
        <p className="mt-3 text-base leading-relaxed text-zinc-700">
          {SITE.sloganKo}
        </p>
      </header>

      <section className="space-y-6 text-base leading-[1.8] text-zinc-700">
        <p>
          <strong className="text-zinc-900">{SITE.nameKo}({SITE.nameEn})</strong>는
          한국 LED 사이니지(전광판) B2B 플랫폼입니다.
          카페·식당·헬스장 등 소상공인을 위해 NovaStar 기반의 표준화된 설치
          절차와 AS를 한 곳에서 제공합니다.
        </p>

        <h2 className="mt-10 text-2xl font-bold tracking-tight text-zinc-900">
          왜 우강테크인가
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong className="text-zinc-900">표준화된 시공</strong> — 동네 간판집의
            비표준성과 대형 SI의 느린 일정 사이의 빈 자리.
          </li>
          <li>
            <strong className="text-zinc-900">NovaStar Taurus 단일 표준</strong> —
            TB30(보급)·TB50(표준)·TB60(프리미엄) 3-tier 라인업.
            한 가지 운영 도구(VNNOX/ViPlex)로 모든 고객을 관리.
          </li>
          <li>
            <strong className="text-zinc-900">사진 3장 → 즉석 범위 견적</strong> — 현장
            실측 전 의미 있는 범위 가격을 화면에서 바로 확인하도록 절차를 압축.
          </li>
          <li>
            <strong className="text-zinc-900">설치 후 유지보수</strong> —
            모듈 단위 교체와 정기 점검으로 설치 1회 이후의 운영까지 책임.
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-bold tracking-tight text-zinc-900">
          우리의 약속
        </h2>
        <p>
          확정 가격이 아닌 <strong className="text-zinc-900">예상 범위</strong>로
          정직하게 시작합니다. 현장 실측 후 확정 견적을 별도로 드립니다.
          광고성 표현보다 <strong className="text-zinc-900">검증 가능한 사실</strong>로
          소통합니다.
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            사진 3장으로 견적 받기 →
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-800 hover:border-blue-500/40"
          >
            블로그 가이드 보기 →
          </Link>
        </div>
      </section>
      </main>
      <Footer />
    </>
  )
}
