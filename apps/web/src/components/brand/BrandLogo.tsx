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

/**
 * `wk-logo-dark.svg` 안에서 심볼이 차지하는 영역 —
 * `wk-mark.svg`의 좌표계 기준으로 오프셋 (-1.64, +403.16)만큼 어긋나 있다.
 * `wk-logo-dark.svg`의 viewBox 원점(137.84, 460.00) 기준 로컬 좌표로 환산하면:
 *   localX = 232.96 - 1.64 - 137.84 = 93.48
 *   localY = 57.67 + 403.16 - 460.00 = 0.83
 * 이 좌표만큼 이미지를 끌어올려서 overflow-hidden 박스로 심볼만 잘라 보여준다.
 */
const DARK_LOCAL_X = 93.48
const DARK_LOCAL_Y = 0.83
const DARK_FULL_W = 323.93
const DARK_FULL_H = 265

/** 심볼만. `size`는 높이 기준이며 가로는 비율로 계산된다. `dark`면 흰색 변형(크롭)을 쓴다. */
export function BrandMark({
  size = 32,
  className = '',
  dark = false,
}: {
  size?: number
  className?: string
  dark?: boolean
}) {
  const width = Math.round(size * MARK_RATIO)

  if (!dark) {
    return (
      <img
        src="/brand/wk-mark.svg"
        alt=""
        width={width}
        height={size}
        className={className}
        aria-hidden="true"
      />
    )
  }

  // 다크 배경용 — 새로 그리지 않고 wk-logo-dark.svg 에서 동일 심볼 영역만 크롭한다.
  const scale = size / 176.56
  return (
    <span
      className={`relative inline-block overflow-hidden ${className}`}
      style={{ width, height: size }}
      aria-hidden="true"
    >
      <img
        src="/brand/wk-logo-dark.svg"
        alt=""
        width={Math.round(DARK_FULL_W * scale)}
        height={Math.round(DARK_FULL_H * scale)}
        style={{
          position: 'absolute',
          left: -DARK_LOCAL_X * scale,
          top: -DARK_LOCAL_Y * scale,
          maxWidth: 'none',
        }}
      />
    </span>
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
  dark = false,
  className = '',
}: {
  markSize?: number
  withText?: boolean
  /** 어두운 배경(투명 헤더 등) 위에 놓일 때 — 심볼을 흰색 변형으로 바꾼다 */
  dark?: boolean
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <BrandMark size={markSize} dark={dark} />
      {withText && (
        <span className="flex flex-col leading-none">
          <span className="text-body font-bold tracking-[-0.03em]">{SITE.nameKo}</span>
          <span className={`mt-1 text-[8.5px] font-semibold uppercase tracking-[0.22em] ${dark ? 'text-white/60' : 'text-wk-ink3'}`}>
            Wookang Tech
          </span>
        </span>
      )}
    </span>
  )
}
