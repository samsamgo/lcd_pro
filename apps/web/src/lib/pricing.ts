// 견적 산출 모듈 — 04-finance-accounting/workspace/quote-formula-pseudocode.md 기반
// 절대 원칙:
//   - 마진 30% 미만 자동 차단 (MIN_MARGIN_PCT)
//   - 모든 출력은 "예상 범위" — 확정가 금지
//   - AS 충당금 5% 포함

export type Sku = 'IN-S' | 'IN-M' | 'P2.5' | 'OUT-S' | 'OUT-M' | 'OUT-L'
export type PackageTier = 'BASIC' | 'STANDARD' | 'PREMIUM' | 'RENTAL'

// ─────────────────────────────────────────────────────────────────────────
// 표시용 가격 단일 원천 (DISPLAY ONLY)
// 모든 UI 섹션은 여기 한 곳만 참조한다. 가격 상충/불일치 방지.
// - 모든 금액은 "설치비 기준가(예상 범위)" · VAT 별도 · 현장 변수에 따라 변동.
// - CMS 월 구독가는 표기하지 않는다 (서비스 준비중). CMS_STATUS 참고.
// ─────────────────────────────────────────────────────────────────────────

/** 전체 견적 범위 (홈/차별화/SEO 공통) */
export const PRICE_RANGE_KRW = {
  min: 2_000_000,
  max: 30_000_000,
} as const

/** 사람이 읽는 전체 범위 표기 */
export const PRICE_RANGE_LABEL = '₩200만 ~ ₩3,000만'
/** Schema.org priceRange (원 단위 풀표기) */
export const PRICE_RANGE_SCHEMA = '₩2,000,000 ~ ₩30,000,000'

/** SKU별 설치비 기준가(부터) — 표시용 단일 소스 */
export const SKU_PRICE_FROM: Record<Sku, string> = {
  'IN-S': '200만원~',
  'IN-M': '350만원~',
  'P2.5': '500만원~',
  'OUT-S': '300만원~',
  'OUT-M': '560만원~',
  'OUT-L': '1,050만원~',
}

/** 업종별 추천 구성 가격대 (표시용) */
export const SEGMENT_PRICE_LABEL: Record<string, string> = {
  food: '₩200만 ~ ₩280만',
  health: '₩280만 ~ ₩470만',
  franchise: '수량 협의 (10개+ 할인)',
  outdoor: '₩470만 ~ ₩850만+',
  event: '기간·규모별 협의',
}

/** CMS 구독 서비스 상태 — 준비중 (월 구독가 미표기) */
export const CMS_STATUS = '준비중' as const
export const CMS_LABEL = '원격 콘텐츠 관리 (준비중)' as const

/** 공통 가격 면책 문구 */
export const PRICE_DISCLAIMER =
  '표시 금액은 설치비 기준 예상 범위입니다. VAT 별도, 최종 금액은 현장 실측 후 확정됩니다.'

// 1m² 기준 원가 (KRW, VAT 별도) — 02-product-hardware v1 추정
export const COST_PER_M2: Record<Sku, number> = {
  'IN-S': 825_000,
  'IN-M': 790_000,
  'P2.5': 1_165_000,
  'OUT-S': 1_160_000,
  'OUT-M': 1_080_000,
  'OUT-L': 1_020_000,
}

export const AS_RESERVE_PCT = 0.05
export const MIN_MARGIN_PCT = 0.30
export const MAX_MARGIN_PCT = 0.45

// 패키지별 가산 (1m² 기준)
export const PACKAGE_ADJUSTMENT_PER_M2: Record<PackageTier, number> = {
  BASIC: -250_000,
  STANDARD: 0,
  PREMIUM: 450_000,
  RENTAL: 0, // 별도 계산
}

export interface QuoteInput {
  sku: Sku
  areaM2: number
  packageTier: PackageTier
  isOutdoor?: boolean
}

export interface QuoteEstimate {
  estimateMin: number
  estimateMax: number
  asReserve: number
  costWithAs: number
  requiresOutdoorPermit: boolean
  disclaimer: string
}

export class MarginGuardError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MarginGuardError'
  }
}

export function estimateQuote(input: QuoteInput): QuoteEstimate {
  if (input.areaM2 <= 0) {
    throw new Error('areaM2 must be > 0')
  }

  const baseCost = COST_PER_M2[input.sku] * input.areaM2
  const adj = PACKAGE_ADJUSTMENT_PER_M2[input.packageTier] * input.areaM2
  const subtotal = baseCost + adj
  const asReserve = subtotal * AS_RESERVE_PCT
  const costWithAs = subtotal + asReserve

  const estimateMin = Math.round(costWithAs / (1 - MIN_MARGIN_PCT))
  const estimateMax = Math.round(costWithAs / (1 - MAX_MARGIN_PCT))

  // 마진 가드 — 견적이 비정상적으로 낮을 때 (수동 할인 등) 30% 미만 차단
  const minMarginActual = (estimateMin - costWithAs) / estimateMin
  if (minMarginActual < MIN_MARGIN_PCT - 0.001) {
    throw new MarginGuardError(
      `마진 ${(minMarginActual * 100).toFixed(1)}% — 30% 미달, CEO 결재 필요`,
    )
  }

  const requiresOutdoorPermit = (input.isOutdoor ?? false) && input.areaM2 >= 5

  return {
    estimateMin,
    estimateMax,
    asReserve,
    costWithAs,
    requiresOutdoorPermit,
    disclaimer: '최종 견적은 현장 실측 후 확정됩니다. 표시 금액은 VAT 별도입니다.',
  }
}

// admin 측에서 사장이 수동 할인 시도 시 마진 검증용
export function verifyMarginOk(finalAmount: number, costWithAs: number): boolean {
  if (finalAmount <= 0) return false
  const margin = (finalAmount - costWithAs) / finalAmount
  return margin >= MIN_MARGIN_PCT - 0.001
}

// SKU 추천 — environment + 면적 기반
// 02-product-hardware/workspace/sku-spec-sheet-v1.md의 권장 면적표 기반
export function recommendSku(input: {
  environment: 'indoor' | 'outdoor'
  areaM2: number
  highRes?: boolean // P2.5 강제 요청 (회의실·바 등)
}): Sku {
  if (input.environment === 'indoor') {
    if (input.highRes) return 'P2.5'
    if (input.areaM2 <= 4) return 'IN-S'
    return 'IN-M'
  }
  // outdoor
  if (input.areaM2 <= 6) return 'OUT-S'
  if (input.areaM2 <= 20) return 'OUT-M'
  return 'OUT-L'
}

// 패키지 디폴트 — MVP1 영업 표준 = Standard
// 면적 ≥ 20m² 또는 outdoor + ≥ 10m²면 Premium 권장 (예비부품·SLA 필요)
export function recommendPackage(input: {
  environment: 'indoor' | 'outdoor'
  areaM2: number
}): PackageTier {
  if (input.areaM2 >= 20) return 'PREMIUM'
  if (input.environment === 'outdoor' && input.areaM2 >= 10) return 'PREMIUM'
  return 'STANDARD'
}

// 한 번에: 사진 3장 → 즉석 범위 견적 자동 산출
export function autoEstimate(input: {
  environment: 'indoor' | 'outdoor'
  widthMm?: number | null
  heightMm?: number | null
  highRes?: boolean
}): (QuoteEstimate & { sku: Sku; packageTier: PackageTier; areaM2: number }) | null {
  const w = input.widthMm ?? 0
  const h = input.heightMm ?? 0
  if (w <= 0 || h <= 0) return null

  const areaM2 = (w / 1000) * (h / 1000)
  const sku = recommendSku({ environment: input.environment, areaM2, highRes: input.highRes })
  const packageTier = recommendPackage({ environment: input.environment, areaM2 })

  const est = estimateQuote({
    sku,
    areaM2,
    packageTier,
    isOutdoor: input.environment === 'outdoor',
  })

  return { ...est, sku, packageTier, areaM2 }
}
