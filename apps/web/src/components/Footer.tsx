import Link from 'next/link'
import { SITE } from '@/lib/seo/site'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { PRODUCT_SUBNAV } from '@/lib/subnav'

const LINK_CLASS = 'block text-wk-ink3 transition-colors duration-150 hover:text-wk-ink'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-wk-line bg-wk-bgFaint pb-28 pt-16 md:pb-16">
      <div className="wk-wrap">
        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-5 sm:gap-8">
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

          {/* 회사소개 — 네비 순서와 같게 */}
          <div className="space-y-3 text-sm">
            <p className="font-semibold text-wk-ink2">회사소개</p>
            <Link href="/about#intro" className={LINK_CLASS}>회사 소개</Link>
            <Link href="/about#process" className={LINK_CLASS}>설치 과정</Link>
            <Link href="/about/certification" className={LINK_CLASS}>인증 현황</Link>
            <Link href="/about#location" className={LINK_CLASS}>오시는 길</Link>
            <p className="pt-3 font-semibold text-wk-ink2">시공사례</p>
            <Link href="/industries" className={LINK_CLASS}>시공사례</Link>
          </div>

          {/* 제품 */}
          <div className="space-y-3 text-sm">
            <p className="font-semibold text-wk-ink2">제품</p>
            {/* 2026-09-09 CEO "이상한 거 다 지우고" — 카테고리 6종 대신 네비와 같은 4개 */}
            {PRODUCT_SUBNAV.map((c) => (
              <Link key={c.href} href={c.href} className={LINK_CLASS}>{c.label}</Link>
            ))}
          </div>

          {/* 고객지원 */}
          <div className="space-y-3 text-sm">
            <p className="font-semibold text-wk-ink2">고객지원</p>
            <Link href="/support/notice" className={LINK_CLASS}>공지사항</Link>
            <Link href="/support" className={LINK_CLASS}>A/S 신청</Link>
            <Link href="/support/faq" className={LINK_CLASS}>자주 묻는 질문</Link>
            <Link href="/support/downloads" className={LINK_CLASS}>자료실</Link>
            <Link href="/quote" className={LINK_CLASS}>견적 문의</Link>
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
        {/* 🔴 2026-09-08 CEO 지시로 사업자등록번호를 뺐다(법인등록번호는 앞서 전체 제거).
            판단 근거를 남긴다 — 이 사이트는 온라인 판매를 하지 않아 전자상거래법상 표기 의무 대상이
            아니다. 다만 관공서 담당자가 업체 조회에 쓰는 번호라, 계약 단계에서는 견적서·사업자등록증
            사본으로 제공한다. 다시 넣으려면 SITE.bizRegNo 를 이 줄에 되살리면 된다. */}
        {(SITE.ceoName || SITE.addressFull || SITE.openingHours) && (
          <div className="mt-10 border-t border-wk-line pt-6 wk-cap">
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              {SITE.ceoName && <span>대표 {SITE.ceoName}</span>}
              {SITE.addressFull && <span>{SITE.addressFull}</span>}
              {SITE.openingHours && <span>운영시간 {SITE.openingHours}</span>}
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
