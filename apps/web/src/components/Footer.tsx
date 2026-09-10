import Link from 'next/link'
import { SITE } from '@/lib/seo/site'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { PRODUCT_SUBNAV } from '@/lib/subnav'

// 폰: 탭 타깃 36px(min-h-9) + 줄 간격 4px = 피치 40px. 44px 로 하면 링크 13개가 푸터를 다시 1,200px 로 키운다(Codex 검토 2026-09-10 조정 채택)
const LINK_CLASS = 'flex min-h-9 items-center text-wk-ink3 transition-colors duration-150 hover:text-wk-ink sm:block sm:min-h-0'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-wk-line bg-wk-bgFaint pb-20 pt-12 sm:pt-16 md:pb-16">
      <div className="wk-wrap">
        {/* 폰(<sm): 회사 → 문의(전화 크게) → 링크 2열(회사소개+시공사례 | 제품+고객지원) 로 균형을 맞춘다.
            2026-09-10 CEO "푸터를 핸드폰에 맞게" — 이전엔 5열 그리드가 2열로 접히며 열 높이가 4·2·5·(빈칸) 으로
            들쭉날쭉했고 전화번호가 맨 아래(세로 1,130px) 에 묻혔다. sm 이상은 종전 5열 그대로. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-5 sm:gap-8">
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

          {/* 문의 — 폰에선 회사 바로 아래, 데스크톱에선 맨 오른쪽 열 */}
          <div className="col-span-2 space-y-1 text-sm sm:order-last sm:col-span-1 sm:space-y-3">
            <p className="font-semibold text-wk-ink2">문의</p>
            {SITE.phone && (
              <a
                href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`}
                className="flex min-h-9 items-center text-xl font-semibold tracking-tight text-wk-ink sm:block sm:min-h-0 sm:text-sm sm:font-normal sm:tracking-normal sm:text-wk-ink3 sm:hover:text-wk-ink"
              >
                {SITE.phone}
              </a>
            )}
            <a href={`mailto:${SITE.email}`} className={LINK_CLASS}>{SITE.email}</a>
            {SITE.openingHours && <p className="text-wk-ink3 sm:hidden">운영시간 {SITE.openingHours}</p>}
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

          {/* 회사소개 + 시공사례 — 네비 순서와 같게 */}
          <div className="space-y-1 text-sm sm:space-y-3">
            <p className="font-semibold text-wk-ink2">회사소개</p>
            {/* 앵커는 /about 의 실제 섹션 id(greeting/history/certification/location)와 맞춘다 — lib/subnav.ts ABOUT_SECTIONS 가 정본 */}
            <Link href="/about#greeting" className={LINK_CLASS}>인사말</Link>
            <Link href="/about#history" className={LINK_CLASS}>연혁</Link>
            <Link href="/about/certification" className={LINK_CLASS}>인증 · 서류</Link>
            <Link href="/about#location" className={LINK_CLASS}>오시는 길</Link>
            <p className="pt-3 font-semibold text-wk-ink2">시공사례</p>
            <Link href="/industries" className={LINK_CLASS}>시공사례</Link>
          </div>

          {/* 제품 + 고객지원 — 폰에선 한 칸에 세로로, sm 이상은 각각 한 열(contents) */}
          <div className="space-y-1 text-sm sm:contents sm:space-y-0">
            <div className="space-y-1 sm:space-y-3">
              <p className="font-semibold text-wk-ink2">제품</p>
              {/* 2026-09-09 CEO "이상한 거 다 지우고" — 카테고리 6종 대신 네비와 같은 4개 */}
              {PRODUCT_SUBNAV.map((c) => (
                <Link key={c.href} href={c.href} className={LINK_CLASS}>{c.label}</Link>
              ))}
            </div>
            <div className="space-y-1 pt-3 sm:space-y-3 sm:pt-0">
              <p className="font-semibold text-wk-ink2">고객지원</p>
              <Link href="/support" className={LINK_CLASS}>A/S 신청</Link>
              <Link href="/support/faq" className={LINK_CLASS}>자주 묻는 질문</Link>
              <Link href="/support/notice" className={LINK_CLASS}>공지사항</Link>
              <Link href="/support/downloads" className={LINK_CLASS}>자료실</Link>
              <Link href="/quote" className={LINK_CLASS}>견적 문의</Link>
            </div>
          </div>
        </div>

        {/* 사업자 실체 정보 — 실제 값(env)이 설정된 항목만 노출. 가짜 값 노출 금지 원칙 유지 */}
        {/* 🔴 2026-09-08 CEO 지시로 사업자등록번호를 뺐다(법인등록번호는 앞서 전체 제거).
            판단 근거를 남긴다 — 이 사이트는 온라인 판매를 하지 않아 전자상거래법상 표기 의무 대상이
            아니다. 다만 관공서 담당자가 업체 조회에 쓰는 번호라, 계약 단계에서는 견적서·사업자등록증
            사본으로 제공한다. 다시 넣으려면 SITE.bizRegNo 를 이 줄에 되살리면 된다. */}
        {(SITE.ceoName || SITE.addressFull || SITE.openingHours) && (
          <div className="mt-8 border-t border-wk-line pt-5 wk-cap sm:mt-10 sm:pt-6">
            <p className="flex flex-col gap-y-1 sm:flex-row sm:flex-wrap sm:gap-x-4">
              {SITE.ceoName && <span>대표 {SITE.ceoName}</span>}
              {SITE.addressFull && <span>{SITE.addressFull}</span>}
              {SITE.openingHours && <span className="hidden sm:inline">운영시간 {SITE.openingHours}</span>}
            </p>
          </div>
        )}

        <div className="mt-5 border-t border-wk-line pt-5 wk-cap sm:mt-6 sm:pt-6">
          <p>© {year} {SITE.nameKo} · {SITE.nameEn}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
