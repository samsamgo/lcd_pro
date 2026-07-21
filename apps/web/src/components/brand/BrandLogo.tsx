import { SITE } from '@/lib/seo/site'

/**
 * 우강테크 / WOOKANG TECH 브랜드 심볼 (v4, 2026-07 · flat isometric)
 * - 브랜드 가이드의 비스듬한(아이소메트릭) 열린 프레임을 평면 색면으로 구현
 * - 오렌지(#FF6A00/#FF8A3D)는 고정, 네이비 프레임/픽셀은 `currentColor` → 배경 자동 적응
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
      <path d="M23 39 L39 36 L29 91 L13 94 Z" fill="currentColor" />
      <path d="M14 89 L84 78 L82 94 L12 105 Z" fill="currentColor" />
      {/* 오렌지 상단 빔 */}
      <path d="M25 29 L96 18 L93 36 L22 47 Z" fill="#FF6A00" />
      <path d="M25 29 L96 18 L95 22 L24 33 Z" fill="#FF8A3D" />
      {/* LED 픽셀 3×4 — 아이소 평면, 위 오렌지 → 아래 네이비 */}
      <path d="M44 48 L53 46.5 L51.5 54.5 L42.5 56 Z" fill="#FF6A00" />
      <path d="M59 45.5 L68 44 L66.5 52 L57.5 53.5 Z" fill="#FF8A3D" />
      <path d="M74 43 L83 41.5 L81.5 49.5 L72.5 51 Z" fill="#FF8A3D" />
      <path d="M42 59.5 L51 58 L49.5 66 L40.5 67.5 Z" fill="#FF6A00" />
      <path d="M57 57 L66 55.5 L64.5 63.5 L55.5 65 Z" fill="#FF6A00" />
      <path d="M72 54.5 L81 53 L79.5 61 L70.5 62.5 Z" fill="#FF8A3D" />
      <path d="M40 71 L49 69.5 L47.5 77.5 L38.5 79 Z" fill="currentColor" />
      <path d="M55 68.5 L64 67 L62.5 75 L53.5 76.5 Z" fill="currentColor" />
      <path d="M70 66 L79 64.5 L77.5 72.5 L68.5 74 Z" fill="#FF6A00" />
      <path d="M38 82.5 L47 81 L45.5 89 L36.5 90.5 Z" fill="currentColor" opacity="0.72" />
      <path d="M53 80 L62 78.5 L60.5 86.5 L51.5 88 Z" fill="currentColor" opacity="0.72" />
      <path d="M68 77.5 L77 76 L75.5 84 L66.5 85.5 Z" fill="currentColor" />
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
