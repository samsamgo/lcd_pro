import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-gradient">LCD</span>
              <span className="text-white">PRO</span>
            </span>
            <p className="mt-2 max-w-xs text-sm text-zinc-600">
              LED 전광판 설치 + CMS + 유지보수를 하나로.
              <br />
              빠르고, 투명하고, 표준화된 플랫폼.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="space-y-3">
              <p className="font-semibold text-zinc-400">서비스</p>
              <Link href="#products" className="block text-zinc-600 hover:text-white">제품 라인업</Link>
              <Link href="#packages" className="block text-zinc-600 hover:text-white">패키지</Link>
              <Link href="/quote" className="block text-zinc-600 hover:text-white">견적 요청</Link>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-zinc-400">고객지원</p>
              <a href="tel:0000000000" className="block text-zinc-600 hover:text-white">전화 문의</a>
              <a href="http://pf.kakao.com/_lcdpro" target="_blank" rel="noopener noreferrer" className="block text-zinc-600 hover:text-white">카카오 채널</a>
              <Link href="/privacy" className="block text-zinc-600 hover:text-white">개인정보처리방침</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/[0.06] pt-6 text-xs text-zinc-700">
          <p>© 2024 LCD PRO. All rights reserved.</p>
          <p className="mt-1">사업자등록번호: 000-00-00000 | 대표: 000 | 통신판매업신고: 제0000-서울-00000호</p>
        </div>
      </div>
    </footer>
  )
}
