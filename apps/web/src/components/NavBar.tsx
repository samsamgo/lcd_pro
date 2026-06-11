'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { SITE } from '@/lib/seo/site'

// 단일 페이지 통합 — 메뉴는 홈(/) 섹션 앵커로 부드럽게 스크롤한다.
// 블로그만 실제 라우트. (services/faq 등은 홈 섹션으로 흡수됨)
const NAV_LINKS = [
  { href: '/#services', label: '서비스' },
  { href: '/#how', label: '진행 방식' },
  { href: '/#products', label: '제품' },
  { href: '/#packages', label: '패키지' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/blog', label: '블로그' },
]

export function NavBar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // 애플식 sticky 헤더 — 스크롤 시 배경/그림자 페이드 인
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 상단(스크롤 전)에는 다크 히어로 위에 떠 있으므로 밝은 텍스트, 스크롤 후 흰 배경+진한 텍스트
  const onDark = !scrolled && !open

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'border-b border-zinc-200 bg-white/80 shadow-sm backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg"
          aria-label={`${SITE.nameKo} 홈`}
        >
          <span className="text-xl font-bold tracking-tight">
            <span className={onDark ? 'text-white' : 'text-gradient'}>우강테크</span>
            <span
              className={`ml-1.5 text-sm font-medium ${
                onDark ? 'text-zinc-300' : 'text-zinc-600'
              }`}
            >
              WK Tech
            </span>
          </span>
        </Link>

        <nav aria-label="주요 메뉴" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded text-sm transition-colors ${
                onDark
                  ? 'text-zinc-200 hover:text-white'
                  : 'text-zinc-700 hover:text-zinc-900'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/quote"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-95 glow"
          >
            견적 요청하기
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/quote"
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-95"
          >
            견적
          </Link>
          <button
            className={`rounded-lg p-2 ${onDark ? 'text-white' : 'text-zinc-700'}`}
            onClick={() => setOpen(!open)}
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-zinc-200 bg-white px-4 pb-4 pt-2 md:hidden"
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded py-3 text-sm text-zinc-700 hover:text-zinc-900"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/quote"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            견적 요청하기
          </Link>
        </div>
      )}
    </header>
  )
}
