// 견적 산출 모듈 — 04-finance-accounting/workspace/quote-formula-pseudocode.md 기반
// 절대 원칙:
//   - 마진 30% 미만 자동 차단 (MIN_MARGIN_PCT)
//   - 모든 출력은 "예상 범위" — 확정가 금지
//   - AS 충당금 5% 포함

export type Sku = 'IN-S' | 'IN-M' | 'P2.5' | 'OUT-S' | 'OUT-M' | 'OUT-L'
export type PackageTier = 'BASIC' | 'STANDARD' | 'PREMIUM' | 'RENTAL'

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

// 한 번에: 사진 3장 → 30분 견적 자동 산출
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
