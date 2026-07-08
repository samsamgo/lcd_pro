import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { SITE } from '@/lib/seo/site'
import { organizationLd, localBusinessLd, websiteLd } from '@/lib/seo/jsonld'
import { SiteModalsProvider } from '@/components/modals/SiteModals'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nameKo} | ${SITE.nameEn} — LED 사이니지 B2B 플랫폼`,
    template: `%s | ${SITE.nameKo}`,
  },
  description:
    '우강테크(WK Tech)는 카페·식당·헬스장 등 소상공인을 위한 LED 사이니지 표준화 시공 플랫폼입니다. 사진 3장으로 즉석 범위 견적을 화면에서 바로 확인하세요.',
  applicationName: SITE.nameKo,
  authors: [{ name: SITE.nameKo }],
  generator: 'Next.js',
  keywords: [
    'LED 사이니지', 'LED 전광판', '우강테크', 'WK Tech',
    '전광판 설치', '전광판 견적', '디지털 사이니지',
    'NovaStar', '전광판 AS', '카페 LED', '식당 LED',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${SITE.nameKo} — ${SITE.sloganKo}`,
    description: SITE.sloganEn,
    url: SITE.url,
    siteName: SITE.nameKo,
    locale: 'ko_KR',
    type: 'website',
    images: [
      { url: '/opengraph-image', width: 1200, height: 630, alt: `${SITE.nameKo} ${SITE.nameEn}` },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.nameKo} — ${SITE.nameEn}`,
    description: SITE.sloganEn,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  verification: {
    // GSC + Naver Search Advisor — env(NEXT_PUBLIC_*_SITE_VERIFICATION) 설정 시 자동 주입
    ...(SITE.googleSiteVerification ? { google: SITE.googleSiteVerification } : {}),
    ...(SITE.naverSiteVerification
      ? { other: { 'naver-site-verification': SITE.naverSiteVerification } }
      : {}),
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <head>
        {/* 한글 최적 웹폰트 Pretendard (동적 서브셋 — 사용 글자만 로드). 실패 시 시스템 한글 폰트로 폴백 */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* Organization + LocalBusiness + WebSite JSON-LD (홈에 항상 노출, AEO 핵심) */}
        <Script
          id="ld-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }}
        />
        <Script
          id="ld-localbusiness"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd()) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd()) }}
        />
      </head>
      <body className={inter.className}>
        <SiteModalsProvider>{children}</SiteModalsProvider>
      </body>
    </html>
  )
}
