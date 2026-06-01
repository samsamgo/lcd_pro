// 표준 블록 견적엔진 — STANDARD-LAYOUT-MATRIX-20260519 단일 진실원
// 원본 검증: lcd_pro/scripts/verify-standard-block-20260519.mjs
//
// 출력은 결정적(deterministic). RFQ 미확정 수치는 CANDIDATE 라벨로 별도 노출.

export type FamilyCode = 'F-IN-P3' | 'F-IN-P2.5' | 'F-OUT-P5'
export type Environment = 'indoor' | 'outdoor'
export type Classification = 'STANDARD_LAYOUT' | 'STANDARD_ZONE' | 'ENGINEERING_CUSTOM'
export type PackageTier = 'BASIC' | 'STANDARD' | 'PREMIUM' | 'RENTAL'

export interface FamilySpec {
  family_code: FamilyCode
  env: Environment
  pitch: string
  cab_px_w: number
  cab_px_h: number
  max_w_per_m2: number
  candidate: boolean
}

export interface LayoutSpec {
  code: string
  cols: number
  rows: number
}

export const CABINET_W_MM = 640
export const CABINET_H_MM = 480
export const MODULES_PER_CABINET = 6

export const FAMILIES: Record<FamilyCode, FamilySpec> = {
  'F-IN-P3': {
    family_code: 'F-IN-P3', env: 'indoor', pitch: 'P3',
    cab_px_w: 208, cab_px_h: 156, max_w_per_m2: 600, candidate: true,
  },
  'F-IN-P2.5': {
    family_code: 'F-IN-P2.5', env: 'indoor', pitch: 'P2.5',
    cab_px_w: 256, cab_px_h: 192, max_w_per_m2: 600, candidate: true,
  },
  'F-OUT-P5': {
    family_code: 'F-OUT-P5', env: 'outdoor', pitch: 'P5',
    cab_px_w: 128, cab_px_h: 96, max_w_per_m2: 800, candidate: true,
  },
}

export const LAYOUTS: LayoutSpec[] = [
  { code: 'A-2x1',  cols: 2,  rows: 1 },
  { code: 'A-2x2',  cols: 2,  rows: 2 },
  { code: 'A-3x2',  cols: 3,  rows: 2 },
  { code: 'A-4x2',  cols: 4,  rows: 2 },
  { code: 'A-4x3',  cols: 4,  rows: 3 },
  { code: 'A-4x4',  cols: 4,  rows: 4 },
  { code: 'A-5x3',  cols: 5,  rows: 3 },
  { code: 'A-5x4',  cols: 5,  rows: 4 },
  { code: 'A-5x5',  cols: 5,  rows: 5 },
  { code: 'A-6x4',  cols: 6,  rows: 4 },
  { code: 'A-8x4',  cols: 8,  rows: 4 },
  { code: 'A-10x5', cols: 10, rows: 5 },
]

export const ZONE_A: LayoutSpec = { code: 'ZONE-A', cols: 5, rows: 5 }
export const MAX_ZONE_REPEAT = 4

export interface ControllerSpec {
  model: 'TB30' | 'TB50' | 'TB60'
  max_px: number
  lan_ports: number
  hdmi_in: boolean
}

export const CONTROLLERS: ControllerSpec[] = [
  { model: 'TB30', max_px:   478_400, lan_ports: 2, hdmi_in: false },
  { model: 'TB50', max_px:   956_800, lan_ports: 2, hdmi_in: true  },
  { model: 'TB60', max_px: 1_692_800, lan_ports: 4, hdmi_in: true  },
]

export const LAN_PORT_MAX_PX_CANDIDATE = 400_000
export const CIRCUIT_USABLE_W = 220 * 16 * 0.8
export const RACK_THRESHOLD_CABS = 20
export const RACK_THRESHOLD_W = 3_000
export const COOLING_REVIEW_W = 3_500
export const COOLING_REQUIRED_W = 8_000
export const OUTDOOR_AREA_ENG_THRESHOLD_M2 = 5
export const AREA_OVERSHOOT_RATIO = 1.5

export const SPARE_RATE: Record<PackageTier, number> = {
  BASIC: 0.05, STANDARD: 0.05, PREMIUM: 0.10, RENTAL: 0.10,
}

// ─────────────────────────────────────────────────────────────
// Input / Output types
// ─────────────────────────────────────────────────────────────

export interface ProjectInput {
  width_mm: number
  height_mm: number
  family_code: FamilyCode
  packageTier?: PackageTier
  needs_live_input?: boolean
  special_shape?: string             // 곡면/코너/기둥/천장/바닥/투명/렌탈 등
  exact_size_required?: boolean      // 고객이 정확치수 요구
  is_public_procurement?: boolean    // 조달/공공 도면 제출 필요
  is_broadcast_event?: boolean       // 방송·이벤트·고주사율
}

export interface LayoutSelection {
  type: 'STANDARD_LAYOUT' | 'STANDARD_ZONE' | 'ENGINEERING_CUSTOM'
  layout_code: string
  cols: number
  rows: number
  standard_w_mm: number
  standard_h_mm: number
  cabinet_count: number
  delta_w_mm: number
  delta_h_mm: number
  zone_count: number
  reason?: string
}

export interface BOM {
  family_code: FamilyCode
  layout_code: string
  cabinet_count: number
  module_count: number
  spare_modules: number
  screen_px_w: number
  screen_px_h: number
  total_px: number
  controller_model: 'TB30' | 'TB50' | 'TB60'
  controller_count: number
  lan_ports_needed_per_controller: number
  lan_ports_available: number
  lan_overflow: boolean
  receiving_card_count: number
  area_m2: number
  smps_count: number
  peak_power_w: number
  circuit_count: number
  needs_rack: boolean
  needs_cooling_review: boolean
  cooling_required: boolean
}

export interface ProjectEstimate {
  requested: { width_mm: number; height_mm: number; family_code: FamilyCode }
  standard: { width_mm: number; height_mm: number; delta_w_mm: number; delta_h_mm: number } | null
  classification: Classification
  classification_reasons: string[]
  layout_code: string | null
  zone_count: number
  bom: BOM | null
  pricing_blocked: boolean
  action?: string
}

// ─────────────────────────────────────────────────────────────
// classifyProject — special-case fast-track to ENGINEERING_CUSTOM
// ─────────────────────────────────────────────────────────────

function classifyProject(input: ProjectInput): { classification: Classification | null; reasons: string[] } {
  const reasons: string[] = []
  if (input.special_shape) {
    reasons.push(`특수 구조: ${input.special_shape}`)
    return { classification: 'ENGINEERING_CUSTOM', reasons }
  }
  if (input.exact_size_required) {
    reasons.push('고객이 정확한 물리치수 요구 — 표준 적용 거부')
    return { classification: 'ENGINEERING_CUSTOM', reasons }
  }
  if (input.is_public_procurement) {
    reasons.push('공공기관/조달 도면·인증 제출 필요')
    return { classification: 'ENGINEERING_CUSTOM', reasons }
  }
  if (input.is_broadcast_event) {
    reasons.push('방송·이벤트·고주사율 특수 요건')
    return { classification: 'ENGINEERING_CUSTOM', reasons }
  }
  return { classification: null, reasons }
}

// ─────────────────────────────────────────────────────────────
// pickNearestLayout — choose smallest covering standard layout
// ─────────────────────────────────────────────────────────────

export function pickNearestLayout(req_w_mm: number, req_h_mm: number): LayoutSelection {
  const fits = LAYOUTS.filter(L => {
    const w = L.cols * CABINET_W_MM
    const h = L.rows * CABINET_H_MM
    return w >= req_w_mm && h >= req_h_mm
  })
  if (fits.length > 0) {
    fits.sort((a, b) => (a.cols * a.rows) - (b.cols * b.rows))
    const L = fits[0]
    return {
      type: 'STANDARD_LAYOUT',
      layout_code: L.code,
      cols: L.cols, rows: L.rows,
      standard_w_mm: L.cols * CABINET_W_MM,
      standard_h_mm: L.rows * CABINET_H_MM,
      cabinet_count: L.cols * L.rows,
      delta_w_mm: (L.cols * CABINET_W_MM) - req_w_mm,
      delta_h_mm: (L.rows * CABINET_H_MM) - req_h_mm,
      zone_count: 1,
    }
  }
  return tryZoneRepeat(req_w_mm, req_h_mm)
}

function tryZoneRepeat(req_w_mm: number, req_h_mm: number): LayoutSelection {
  const zone_w = ZONE_A.cols * CABINET_W_MM
  const zone_h = ZONE_A.rows * CABINET_H_MM
  const zones_cols = Math.ceil(req_w_mm / zone_w)
  const zones_rows = Math.ceil(req_h_mm / zone_h)
  const zone_count = zones_cols * zones_rows
  const total_cols = zones_cols * ZONE_A.cols
  const total_rows = zones_rows * ZONE_A.rows
  const total_cabs = total_cols * total_rows

  if (zone_count > MAX_ZONE_REPEAT) {
    return {
      type: 'ENGINEERING_CUSTOM',
      layout_code: `ZONE-A x ${zone_count} (초과)`,
      cols: total_cols, rows: total_rows,
      standard_w_mm: total_cols * CABINET_W_MM,
      standard_h_mm: total_rows * CABINET_H_MM,
      cabinet_count: total_cabs,
      delta_w_mm: (total_cols * CABINET_W_MM) - req_w_mm,
      delta_h_mm: (total_rows * CABINET_H_MM) - req_h_mm,
      zone_count,
      reason: `요청 크기가 ZONE-A × ${MAX_ZONE_REPEAT} 초과 (${zone_count}존 필요)`,
    }
  }

  return {
    type: 'STANDARD_ZONE',
    layout_code: `ZONE-A x ${zone_count}`,
    cols: total_cols, rows: total_rows,
    standard_w_mm: total_cols * CABINET_W_MM,
    standard_h_mm: total_rows * CABINET_H_MM,
    cabinet_count: total_cabs,
    delta_w_mm: (total_cols * CABINET_W_MM) - req_w_mm,
    delta_h_mm: (total_rows * CABINET_H_MM) - req_h_mm,
    zone_count,
  }
}

// ─────────────────────────────────────────────────────────────
// computeBOM
// ─────────────────────────────────────────────────────────────

export function computeBOM(
  family_code: FamilyCode,
  layout: LayoutSelection,
  packageTier: PackageTier = 'STANDARD',
  needs_live_input = false,
): BOM {
  const F = FAMILIES[family_code]
  const cabs = layout.cabinet_count
  const modules = cabs * MODULES_PER_CABINET
  const spare = Math.ceil(modules * (SPARE_RATE[packageTier] ?? 0.05))

  const screen_px_w = F.cab_px_w * layout.cols
  const screen_px_h = F.cab_px_h * layout.rows
  const total_px = screen_px_w * screen_px_h

  let controller_count = layout.zone_count || 1
  const px_per_controller = Math.ceil(total_px / controller_count)
  let controller = CONTROLLERS.find(c => px_per_controller <= c.max_px)
  if (!controller) {
    controller = CONTROLLERS[CONTROLLERS.length - 1]
    controller_count = Math.ceil(total_px / controller.max_px)
  }
  if (needs_live_input && controller.model === 'TB30') {
    controller = CONTROLLERS[1] // TB50
  }

  const lan_ports_needed = Math.ceil(px_per_controller / LAN_PORT_MAX_PX_CANDIDATE)
  const lan_ports_available = controller.lan_ports * controller_count
  const lan_overflow = (lan_ports_needed * controller_count) > lan_ports_available

  const area_m2 = ((layout.cols * CABINET_W_MM) * (layout.rows * CABINET_H_MM)) / 1_000_000
  const peak_power_w = Math.round(area_m2 * F.max_w_per_m2)
  const smps_count = cabs
  const circuit_count = Math.ceil(peak_power_w / CIRCUIT_USABLE_W)

  const needs_rack = cabs >= RACK_THRESHOLD_CABS || peak_power_w >= RACK_THRESHOLD_W
  const needs_cooling_review = cabs >= RACK_THRESHOLD_CABS || peak_power_w >= COOLING_REVIEW_W
  const cooling_required = peak_power_w >= COOLING_REQUIRED_W

  return {
    family_code,
    layout_code: layout.layout_code,
    cabinet_count: cabs,
    module_count: modules,
    spare_modules: spare,
    screen_px_w, screen_px_h, total_px,
    controller_model: controller.model,
    controller_count,
    lan_ports_needed_per_controller: lan_ports_needed,
    lan_ports_available,
    lan_overflow,
    receiving_card_count: cabs,
    area_m2: Number(area_m2.toFixed(2)),
    smps_count,
    peak_power_w,
    circuit_count,
    needs_rack,
    needs_cooling_review,
    cooling_required,
  }
}

// ─────────────────────────────────────────────────────────────
// estimateProject — full pipeline
// ─────────────────────────────────────────────────────────────

export function estimateProject(input: ProjectInput): ProjectEstimate {
  // 1) 사전 특수 분류
  const pre = classifyProject(input)
  if (pre.classification === 'ENGINEERING_CUSTOM') {
    return {
      requested: { width_mm: input.width_mm, height_mm: input.height_mm, family_code: input.family_code },
      standard: null,
      classification: 'ENGINEERING_CUSTOM',
      classification_reasons: pre.reasons,
      layout_code: null,
      zone_count: 0,
      bom: null,
      pricing_blocked: true,
      action: '엔지니어링 설계비 견적 + CEO/11-부서 승인 필요',
    }
  }

  // 2) 레이아웃 선택
  const layout = pickNearestLayout(input.width_mm, input.height_mm)
  if (layout.type === 'ENGINEERING_CUSTOM') {
    return {
      requested: { width_mm: input.width_mm, height_mm: input.height_mm, family_code: input.family_code },
      standard: {
        width_mm: layout.standard_w_mm, height_mm: layout.standard_h_mm,
        delta_w_mm: layout.delta_w_mm, delta_h_mm: layout.delta_h_mm,
      },
      classification: 'ENGINEERING_CUSTOM',
      classification_reasons: [layout.reason ?? '표준 매트릭스 초과'],
      layout_code: layout.layout_code,
      zone_count: layout.zone_count,
      bom: null,
      pricing_blocked: true,
      action: '엔지니어링 라우팅',
    }
  }

  // 3) BOM 계산
  const bom = computeBOM(input.family_code, layout, input.packageTier ?? 'STANDARD', input.needs_live_input)

  // 4) 분류 확정 + post-gate 검사
  let classification: Classification = layout.type
  const reasons: string[] = []

  // 면적 초과율 게이트 (1.5×)
  const requested_area_m2 = (input.width_mm / 1000) * (input.height_mm / 1000)
  const area_ratio = bom.area_m2 / requested_area_m2
  if (area_ratio > AREA_OVERSHOOT_RATIO) {
    reasons.push(`표준 적용 면적 ${bom.area_m2}m² / 요청 ${requested_area_m2.toFixed(2)}m² = ${area_ratio.toFixed(2)}× — 50% 이상 초과, 별도 설계 권장`)
    classification = 'ENGINEERING_CUSTOM'
  }
  // 옥외 면적 게이트
  const F = FAMILIES[input.family_code]
  if (F.env === 'outdoor' && bom.area_m2 > OUTDOOR_AREA_ENG_THRESHOLD_M2) {
    reasons.push(`옥외 ${bom.area_m2}m² > ${OUTDOOR_AREA_ENG_THRESHOLD_M2}m² → 풍하중·구조 검토 필요`)
    classification = 'ENGINEERING_CUSTOM'
  }
  // LAN 포트 초과
  if (bom.lan_overflow) {
    reasons.push(`LAN 포트 부족 (필요 ${bom.lan_ports_needed_per_controller}/사용가능 ${bom.lan_ports_available})`)
    classification = 'ENGINEERING_CUSTOM'
  }
  // 다중 컨트롤러 → 최소 STANDARD_ZONE
  if (bom.controller_count > 1) {
    reasons.push(`다중 컨트롤러 (${bom.controller_count}대) — 동기·기술 검수 필요`)
    if (classification === 'STANDARD_LAYOUT') classification = 'STANDARD_ZONE'
  }
  if (reasons.length === 0) {
    if (classification === 'STANDARD_LAYOUT') reasons.push('표준 레이아웃 + 단일 컨트롤러 + 게이트 통과')
    else if (classification === 'STANDARD_ZONE') reasons.push('표준 존 반복 — 자동견적 + 기술검수 플래그')
  }

  return {
    requested: { width_mm: input.width_mm, height_mm: input.height_mm, family_code: input.family_code },
    standard: {
      width_mm: layout.standard_w_mm, height_mm: layout.standard_h_mm,
      delta_w_mm: layout.delta_w_mm, delta_h_mm: layout.delta_h_mm,
    },
    classification,
    classification_reasons: reasons,
    layout_code: layout.layout_code,
    zone_count: layout.zone_count,
    bom,
    pricing_blocked: classification === 'ENGINEERING_CUSTOM',
    action: classification === 'ENGINEERING_CUSTOM' ? '엔지니어링 라우팅' : undefined,
  }
}

// ─────────────────────────────────────────────────────────────
// recommendFamily — environment + highRes hint helper for UI
// ─────────────────────────────────────────────────────────────

export function recommendFamily(env: Environment, highRes: boolean): FamilyCode {
  if (env === 'outdoor') return 'F-OUT-P5'
  return highRes ? 'F-IN-P2.5' : 'F-IN-P3'
}
