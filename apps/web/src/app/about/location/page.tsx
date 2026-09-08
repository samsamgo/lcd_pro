import type { Metadata } from 'next'

import { NavBar } from '@/components/NavBar'
import { PageHeader } from '@/components/PageHeader'
import { IMAGES } from '@/lib/imageAssets'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { CompanyLocation } from '@/components/public/CompanyLocation'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { SITE, absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '오시는 길',
  description: `${SITE.legalName} · ${SITE.addressFull}`,
  path: '/about/location',
})

/** 오시는 길 — 2026-09-08 CEO 지시 "페이지 방식 하나로 통일". /about#location 앵커를 실제 페이지로. */
export default function LocationPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-location"
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '회사소개', url: absoluteUrl('/about') },
          { name: '오시는 길', url: absoluteUrl('/about/location') },
        ])}
      />
      <NavBar />
      <main id="main">
        <PageHeader
          group="회사소개"
          title="오시는 길"
          lead={SITE.addressFull}
          image={IMAGES.pageHeaders.location}
        />
        <div className="pt-16 md:pt-20" />
        <CompanyLocation hideHeading />
        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
