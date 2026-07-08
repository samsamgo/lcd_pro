import Link from 'next/link'
import { SITE } from '@/lib/seo/site'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-zinc-200 px-4 pb-28 pt-12 md:pb-12">
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
              <Link href="/services" className="block text-zinc-600 hover:text-zinc-900">서비스</Link>
              <Link href="/products" className="block text-zinc-600 hover:text-zinc-900">제품 라인업</Link>
              <Link href="/packages" className="block text-zinc-600 hover:text-zinc-900">패키지</Link>
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
                <a href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`} className="block text-zinc-600 hover:text-zinc-900">전화 {SITE.phone}</a>
              )}
              <Link href="/quote" className="block text-zinc-600 hover:text-zinc-900">견적 요청</Link>
              <a href={`mailto:${SITE.email}`} className="block text-zinc-600 hover:text-zinc-900">{SITE.email}</a>
              {SITE.kakaoChannelUrl && (
                <a href={SITE.kakaoChannelUrl} target="_blank" rel="noopener" className="block text-zinc-600 hover:text-zinc-900">카카오톡 상담</a>
              )}
              {SITE.naverTalkUrl && (
                <a href={SITE.naverTalkUrl} target="_blank" rel="noopener" className="block text-zinc-600 hover:text-zinc-900">네이버 톡톡</a>
              )}
              {SITE.naverPlaceUrl && (
                <a href={SITE.naverPlaceUrl} target="_blank" rel="noopener" className="block text-zinc-600 hover:text-zinc-900">네이버 플레이스</a>
              )}
              <Link href="/privacy" className="block text-zinc-600 hover:text-zinc-900">개인정보처리방침</Link>
            </div>
          </div>
        </div>

        {/* 사업자 실체 정보 — 실제 값(env)이 설정된 항목만 노출. 가짜 값 노출 금지 원칙 유지 */}
        {(SITE.ceoName || SITE.bizRegNo || SITE.addressFull || SITE.openingHours) && (
          <div className="mt-10 border-t border-zinc-200 pt-6 text-xs leading-relaxed text-zinc-500">
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              {SITE.ceoName && <span>대표 {SITE.ceoName}</span>}
              {SITE.bizRegNo && <span>사업자등록번호 {SITE.bizRegNo}</span>}
              {SITE.addressFull && <span>{SITE.addressFull}</span>}
              {SITE.openingHours && <span>고객센터 {SITE.openingHours}</span>}
            </p>
          </div>
        )}

        <div className="mt-6 border-t border-zinc-200 pt-6 text-xs text-zinc-600">
          <p>© {year} {SITE.nameKo} · {SITE.nameEn}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
