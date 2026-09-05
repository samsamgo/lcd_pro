import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
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
    '우강테크(WK Tech)는 관공서·공공기관·학교에 LED 전광판과 전자현수막을 공급합니다. 실측부터 제작, 시공, A/S까지 하청 없이 직접 합니다.',
  applicationName: SITE.nameKo,
  authors: [{ name: SITE.nameKo }],
  generator: 'Next.js',
  keywords: [
    'LED 전광판', '전자현수막', '우강테크', 'WK Tech',
    '관공서 전광판', '학교 전광판', '지자체 전자현수막',
    '전광판 설치', '전광판 견적', '전광판 제작', '전광판 AS',
    '조달 전광판', '디지털 사이니지',
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
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-touch-icon.png',
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
        {/* Pretendard 는 globals.css → pretendard.css 에서 자가호스팅으로 로드한다.
            CDN 스타일시트는 렌더 블로킹이라 첫 화면 텍스트가 늦게 떴다. */}
        {/* Organization + LocalBusiness + WebSite JSON-LD (홈에 항상 노출, AEO 핵심) */}
        {/* 구조화 데이터는 정적 HTML 에 남겨야 JS 를 실행하지 않는 크롤러(네이버·다음)도 읽는다.
            next/script 의 beforeInteractive 는 app router 에서 클라이언트 주입이라 소스에 안 남는다. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd()) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]
 focus:rounded-btn focus:bg-wk-cta focus:px-4 focus:py-2.5 focus:text-white"
        >
          본문으로 건너뛰기
        </a>
        <SiteModalsProvider>{children}</SiteModalsProvider>
      </body>
    </html>
  )
}
