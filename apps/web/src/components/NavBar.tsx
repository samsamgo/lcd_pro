'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { SITE } from '@/lib/seo/site'

const NAV_LINKS = [
  { href: '/services', label: '서비스' },
  { href: '/#how-it-works', label: '진행 방식' },
  { href: '/#products', label: '제품' },
  { href: '/blog', label: '블로그' },
  { href: '/faq', label: 'FAQ' },
]

export function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#080808]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label={`${SITE.nameKo} 홈`}
        >
          <span className="text-xl font-bold tracking-tight">
            <span className="text-gradient">우강테크</span>
            <span className="ml-1.5 text-sm font-medium text-zinc-500">WK Tech</span>
          </span>
        </Link>

        <nav aria-label="주요 메뉴" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-zinc-400 transition-colors hover:text-white"
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

        <button
          className="p-2 text-zinc-400 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="메뉴"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/[0.06] bg-[#080808] px-4 pb-4 pt-2 md:hidden">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm text-zinc-400 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/quote"
            className="mt-2 block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            견적 요청하기
          </Link>
        </div>
      )}
    </header>
  )
}
