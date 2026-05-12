import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LCD PRO — LED 전광판 전문 플랫폼',
  description:
    '매장 사진 3장으로 30분 내 견적. 표준화된 설치 + 원격 CMS + 유지보수 구독.',
  keywords: ['LED 전광판', '전광판 설치', '전광판 견적', 'LED 간판', 'CMS'],
  openGraph: {
    title: 'LCD PRO — LED 전광판 전문 플랫폼',
    description: '사진 3장 → 30분 내 견적 → 표준 설치 → 원격 관리',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
