import { SITE } from '@/lib/seo/site'

/**
 * 우강테크 / WOOKANG TECH 브랜드 심볼 (v5, 2026-07 · flat isometric)
 * - 브랜드 가이드의 비스듬한(아이소메트릭) 열린 프레임: 상단+우측 오렌지 빔, 네이비 좌하 프레임, LED 픽셀 그리드
 * - 오렌지(#FF6A00/#FF8A3D)는 고정, 네이비는 `currentColor` → 배경(라이트/다크) 자동 적응
 * - 원본 벡터: public/brand/logo-symbol.svg (Codex 제작 · COO 검수)
 */
export function BrandMark({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="우강테크 심볼"
    >
      {/* 네이비 열린 프레임 (좌측 사선획 + 하단획) — currentColor 적응 */}
      <path d="M24 38 L37 36 L27 89 L14 91 Z" fill="currentColor" />
      <path d="M15 90 L84 79 L82 92 L13 103 Z" fill="currentColor" />
      {/* 오렌지 빔 (상단 + 우상단 코너) */}
      <path d="M25 27 L99 15 L95 38 L82 40 L84 29 L22 39 Z" fill="#FF6A00" />
      <path d="M25 27 L99 15 L98.25 19 L24.25 31 Z" fill="#FF8A3D" />
      {/* LED 픽셀 3×4 — 위 오렌지 → 아래 네이비 대각선 */}
      <path d="M49 44 L58 42.5 L56.5 50.5 L47.5 52 Z" fill="#FF6A00" />
      <path d="M63.5 41.5 L72.5 40 L71 48 L62 49.5 Z" fill="#FF8A3D" />
      <path d="M78 39 L87 37.5 L85.5 45.5 L76.5 47 Z" fill="#FF8A3D" />
      <path d="M47 55.5 L56 54 L54.5 62 L45.5 63.5 Z" fill="#FF6A00" />
      <path d="M61.5 53 L70.5 51.5 L69 59.5 L60 61 Z" fill="#FF6A00" />
      <path d="M76 50.5 L85 49 L83.5 57 L74.5 58.5 Z" fill="#FF8A3D" />
      <path d="M45 67 L54 65.5 L52.5 73.5 L43.5 75 Z" fill="currentColor" />
      <path d="M59.5 64.5 L68.5 63 L67 71 L58 72.5 Z" fill="currentColor" />
      <path d="M74 62 L83 60.5 L81.5 68.5 L72.5 70 Z" fill="#FF6A00" />
      <path d="M43 78.5 L52 77 L50.5 85 L41.5 86.5 Z" fill="currentColor" opacity="0.72" />
      <path d="M57.5 76 L66.5 74.5 L65 82.5 L56 84 Z" fill="currentColor" opacity="0.72" />
      <path d="M72 73.5 L81 72 L79.5 80 L70.5 81.5 Z" fill="currentColor" />
    </svg>
  )
}

/**
 * 헤더·푸터용 가로 로크업. 부모의 text-color가 프레임/영문 워드마크에 상속된다.
 * (다크 히어로 위: text-white / 라이트: text-[#1F2937])
 */
export function BrandLogo({
  markSize = 40,
  withText = true,
  className = '',
}: {
  markSize?: number
  withText?: boolean
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <BrandMark size={markSize} />
      {withText && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-extrabold tracking-[0.05em]">WOOKANG TECH</span>
          <span className="mt-1 text-[10px] font-semibold tracking-[0.3em] text-[#FF6A00]">
            {SITE.nameKo}
          </span>
        </span>
      )}
    </span>
  )
}
