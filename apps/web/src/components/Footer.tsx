import Link from 'next/link'
import { SITE } from '@/lib/seo/site'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-zinc-200 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div>
            <p className="text-xl font-bold tracking-tight">
              <span className="text-gradient">{SITE.nameKo}</span>
              <span className="ml-2 text-base font-medium text-zinc-500">{SITE.nameEn}</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-600">
              {SITE.sloganKo}
            </p>
            <p className="mt-1 max-w-xs text-xs italic text-zinc-600">
              {SITE.sloganEn}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div className="space-y-3">
              <p className="font-semibold text-zinc-700">서비스</p>
              <Link href="/#services" className="block text-zinc-600 hover:text-zinc-900">서비스</Link>
              <Link href="/#products" className="block text-zinc-600 hover:text-zinc-900">제품 라인업</Link>
              <Link href="/#packages" className="block text-zinc-600 hover:text-zinc-900">패키지</Link>
              <Link href="/quote" className="block text-zinc-600 hover:text-zinc-900">견적 요청</Link>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-zinc-700">리소스</p>
              <Link href="/blog" className="block text-zinc-600 hover:text-zinc-900">블로그</Link>
              <Link href="/faq" className="block text-zinc-600 hover:text-zinc-900">FAQ</Link>
              <Link href="/about" className="block text-zinc-600 hover:text-zinc-900">회사 소개</Link>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-zinc-700">고객지원</p>
              {SITE.phone && (
                <a href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`} className="block text-zinc-600 hover:text-zinc-900">전화 문의</a>
              )}
              <Link href="/quote" className="block text-zinc-600 hover:text-zinc-900">견적 요청</Link>
              <Link href="/privacy" className="block text-zinc-600 hover:text-zinc-900">개인정보처리방침</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6 text-xs text-zinc-600">
          <p>© {year} {SITE.nameKo} · {SITE.nameEn}. All rights reserved.</p>
          {/* 사업자등록번호·대표·통신판매업신고 번호는 실제 값 확정 후 표기 (가짜 번호 노출 금지) */}
        </div>
      </div>
    </footer>
  )
}
