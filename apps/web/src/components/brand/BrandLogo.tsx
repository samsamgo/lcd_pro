/* eslint-disable @next/next/no-img-element */
import { SITE } from '@/lib/seo/site'

/**
 * 우강테크 브랜드 로고.
 *
 * ⚠️ 임의 제작 금지. 아래 파일은 **원본 로고에서 추출한 실제 도형**이다.
 *    원본: `자료/우강테그 로코.svg` (Adobe Illustrator)
 *    - `/brand/wk-mark.svg`      심볼만 (viewBox 실측 232.96 57.67 132.64 176.56)
 *    - `/brand/wk-logo.svg`      원본 로크업 — 심볼 + WOOKANG TECH + 우강테크 (세로 조합)
 *    - `/brand/wk-logo-dark.svg` 어두운 배경용 흰색 버전
 *
 *    팔레트 실측: 주황 #de671d · 네이비블랙 #03111f · 회색 #6c7073
 */

/** 심볼 비율 — 정사각형이 아니다(가로 132.64 : 세로 176.56) */
const MARK_RATIO = 132.64 / 176.56

/** 심볼만. `size`는 높이 기준이며 가로는 비율로 계산된다. */
export function BrandMark({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      src="/brand/wk-mark.svg"
      alt=""
      width={Math.round(size * MARK_RATIO)}
      height={size}
      className={className}
      aria-hidden="true"
    />
  )
}

/**
 * 원본 로크업 전체(심볼 + 워드마크 세로 조합).
 * 세로로 긴 형태라 푸터·문서·인쇄물처럼 공간이 있는 곳에 쓴다.
 * 헤더처럼 높이가 좁은 곳에는 BrandLogo(가로형)를 쓴다.
 */
export function BrandLockup({
  height = 72,
  dark = false,
  className = '',
}: {
  height?: number
  dark?: boolean
  className?: string
}) {
  return (
    <img
      src={dark ? '/brand/wk-logo-dark.svg' : '/brand/wk-logo.svg'}
      alt={`${SITE.nameKo} ${SITE.nameEn}`}
      height={height}
      width={Math.round(height * (323.93 / 265))}
      className={className}
    />
  )
}

/**
 * 헤더용 가로형 로크업 — 원본 심볼 + 조판된 워드마크.
 *
 * 원본 로크업은 세로 조합이라 높이 56~64px 헤더에서는 글자가 판독 불가 수준으로
 * 작아진다. 그래서 헤더에서는 심볼(원본 파일)만 쓰고 회사명은 웹폰트로 조판한다.
 */
export function BrandLogo({
  markSize = 32,
  withText = true,
  className = '',
}: {
  markSize?: number
  withText?: boolean
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <BrandMark size={markSize} />
      {withText && (
        <span className="flex flex-col leading-none">
          <span className="text-[17px] font-bold tracking-[-0.03em]">{SITE.nameKo}</span>
          <span className="mt-1 text-[8.5px] font-semibold uppercase tracking-[0.22em] text-wk-ink4">
            Wookang Tech
          </span>
        </span>
      )}
    </span>
  )
}
