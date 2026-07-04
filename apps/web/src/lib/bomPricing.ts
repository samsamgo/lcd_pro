// BOM → 판매가 범위 산출 (고객 견적 표시용)
// 단가 단일 원천. 원자재-견적-계산기-20260614.xlsx 와 동일 값·로직.
// 정책: AS충당 5% 포함, 마진 30~45% (pricing.ts 와 통일).
// 미검증 단가(SMPS·컨트롤러·구조)는 Hangte 견적·총판 RFQ 회수 후 본 파일 한 곳만 갱신.

import type { BOM, Environment, FamilyCode } from './standardBlock'

// ── 단가 (편집 단일 지점) ────────────────────────────────
const MODULE_COST_BY_FAMILY: Record<FamilyCode, number> = {
  'F-IN-P3': 22_500,    // 시장 중앙값
  'F-IN-P2.5': 30_000,  // 추정
  'F-OUT-P5': 22_000,   // 실측 기반
}
const SMPS_COST: Record<Environment, number> = { indoor: 35_000, outdoor: 45_000 } // ⚠ 미검증(Hangte 대기)
const RECEIVING_CARD_COST = 50_000 // 추정
const CONTROLLER_COST: Record<'TB30' | 'TB50' | 'TB60', number> = {
  TB30: 620_000, TB50: 1_030_000, TB60: 1_170_000, // 1차추정(RFQ 대기)
}
const STRUCTURE_PER_M2: Record<Environment, { low: number; high: number }> = {
  indoor: { low: 150_000, high: 350_000 },   // 실내 구조 추정
  outdoor: { low: 400_000, high: 569_000 },  // 고=남양주 실측
}
const CABLE_PER_M2 = 30_000
const INSTALL_DAY_COST = 280_000
const OUTDOOR_INSTALL_MULTIPLIER = 1.35
const AS_RESERVE_PCT = 0.05
const MARGIN_MIN = 0.30
const MARGIN_MAX = 0.45

export interface PriceRange {
  min: number // 판매가 하한 (원가 저 · 마진 30%)
  max: number // 판매가 상한 (원가 고 · 마진 45%)
  materialLow: number
  materialHigh: number
}

// 면적 구간별 시공 인건비 (quote-formula-v2.1 양평 실측 기반)
function installCost(areaM2: number, env: Environment): number {
  const laborDays = areaM2 <= 5 ? 2 * 3 : areaM2 <= 15 ? 3 * 9 : 4 * 12
  const mul = env === 'outdoor' ? OUTDOOR_INSTALL_MULTIPLIER : 1
  return laborDays * INSTALL_DAY_COST * mul
}

const round10k = (v: number) => Math.round(v / 10_000) * 10_000

/** BOM + 환경 → 고객 표시용 판매가 범위. 견적 차단/면적 0이면 null. */
export function priceFromBom(bom: BOM, env: Environment): PriceRange | null {
  if (!bom || bom.area_m2 <= 0) return null

  const modules = bom.module_count + bom.spare_modules
  const moduleCost = modules * MODULE_COST_BY_FAMILY[bom.family_code]
  const smpsCost = bom.smps_count * SMPS_COST[env]
  const rcCost = bom.receiving_card_count * RECEIVING_CARD_COST
  const controllerCost = bom.controller_count * CONTROLLER_COST[bom.controller_model]
  const cable = bom.area_m2 * CABLE_PER_M2

  const structLow = bom.area_m2 * STRUCTURE_PER_M2[env].low
  const structHigh = bom.area_m2 * STRUCTURE_PER_M2[env].high

  const materialLow = moduleCost + smpsCost + rcCost + controllerCost + cable + structLow
  const materialHigh = moduleCost + smpsCost + rcCost + controllerCost + cable + structHigh

  const install = installCost(bom.area_m2, env)
  const costWithAsLow = (materialLow + install) * (1 + AS_RESERVE_PCT)
  const costWithAsHigh = (materialHigh + install) * (1 + AS_RESERVE_PCT)

  return {
    min: round10k(costWithAsLow / (1 - MARGIN_MIN)),
    max: round10k(costWithAsHigh / (1 - MARGIN_MAX)),
    materialLow: Math.round(materialLow),
    materialHigh: Math.round(materialHigh),
  }
}
