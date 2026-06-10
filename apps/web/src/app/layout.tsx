import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { SITE, absoluteUrl } from '@/lib/seo/site'
import { organizationLd, localBusinessLd, websiteLd } from '@/lib/seo/jsonld'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

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
    '우강테크(WK Tech)는 카페·식당·헬스장 등 소상공인을 위한 LED 사이니지 표준화 시공 + CMS 구독 플랫폼입니다. 사진 3장으로 30분 내 범위 견적을 받아보세요.',
  applicationName: SITE.nameKo,
  authors: [{ name: SITE.nameKo }],
  generator: 'Next.js',
  keywords: [
    'LED 사이니지', 'LED 전광판', '우강테크', 'WK Tech',
    '전광판 설치', '전광판 견적', '디지털 사이니지',
    'NovaStar', 'VNNOX', 'CMS 구독', '카페 LED', '식당 LED',
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
    // TODO(COO): GSC + Naver Search Advisor 등록 후 실제 토큰 주입
    // google: 'GSC_TOKEN_PLACEHOLDER',
    // other: { 'naver-site-verification': 'NAVER_TOKEN_PLACEHOLDER' },
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
    <html lang="ko">
      <head>
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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
