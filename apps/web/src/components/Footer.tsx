import Link from 'next/link'
import { SITE } from '@/lib/seo/site'
import { BrandLogo } from '@/components/brand/BrandLogo'

const LINK_CLASS = 'block text-wk-ink3 transition-colors duration-150 hover:text-wk-ink'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-wk-line bg-wk-bgFaint pb-28 pt-16 md:pb-16">
      <div className="wk-wrap">
        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-8">
          {/* 회사 */}
          <div className="col-span-2 sm:col-span-1">
            <BrandLogo markSize={34} />
            <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-wk-ink3">
              {SITE.sloganKo}
            </p>
            <p className="mt-1 max-w-[18rem] text-caption italic text-wk-ink3">
              {SITE.sloganEn}
            </p>
          </div>

          {/* 제품·솔루션 */}
          <div className="space-y-3 text-sm">
            <p className="font-semibold text-wk-ink2">제품 · 솔루션</p>
            <Link href="/products" className={LINK_CLASS}>제품 라인업</Link>
            <Link href="/services" className={LINK_CLASS}>공급 범위</Link>
            <Link href="/industries" className={LINK_CLASS}>업종별 도입 사례</Link>
            <Link href="/quote" className={LINK_CLASS}>견적 요청</Link>
          </div>

          {/* 고객지원 */}
          <div className="space-y-3 text-sm">
            <p className="font-semibold text-wk-ink2">고객지원</p>
            <Link href="/support#as" className={LINK_CLASS}>A/S 신청</Link>
            <Link href="/support#faq" className={LINK_CLASS}>FAQ</Link>
            <Link href="/about" className={LINK_CLASS}>회사 정보</Link>
            <Link href="/about#location" className={LINK_CLASS}>회사 위치</Link>
          </div>

          {/* 사업자정보 · 연락처 */}
          <div className="col-span-2 space-y-3 text-sm sm:col-span-1">
            <p className="font-semibold text-wk-ink2">문의</p>
            {SITE.phone && (
              <a href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`} className={LINK_CLASS}>{SITE.phone}</a>
            )}
            <a href={`mailto:${SITE.email}`} className={LINK_CLASS}>{SITE.email}</a>
            {SITE.kakaoChannelUrl && (
              <a href={SITE.kakaoChannelUrl} target="_blank" rel="noopener" className={LINK_CLASS}>카카오톡 상담</a>
            )}
            {SITE.naverTalkUrl && (
              <a href={SITE.naverTalkUrl} target="_blank" rel="noopener" className={LINK_CLASS}>네이버 톡톡</a>
            )}
            {SITE.naverPlaceUrl && (
              <a href={SITE.naverPlaceUrl} target="_blank" rel="noopener" className={LINK_CLASS}>네이버 플레이스</a>
            )}
            <Link href="/privacy" className={LINK_CLASS}>개인정보처리방침</Link>
          </div>
        </div>

        {/* 사업자 실체 정보 — 실제 값(env)이 설정된 항목만 노출. 가짜 값 노출 금지 원칙 유지 */}
        {(SITE.ceoName || SITE.bizRegNo || SITE.addressFull || SITE.openingHours) && (
          <div className="mt-10 border-t border-wk-line pt-6 wk-cap">
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              {SITE.ceoName && <span>대표 {SITE.ceoName}</span>}
              {SITE.bizRegNo && <span>사업자등록번호 {SITE.bizRegNo}</span>}
              {SITE.addressFull && <span>{SITE.addressFull}</span>}
              {SITE.openingHours && <span>고객센터 {SITE.openingHours}</span>}
            </p>
          </div>
        )}

        <div className="mt-6 border-t border-wk-line pt-6 wk-cap">
          <p>© {year} {SITE.nameKo} · {SITE.nameEn}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
