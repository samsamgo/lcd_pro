// 표준 블록 견적엔진 검증 스크립트
// COO 메모 + STANDARD-LAYOUT-MATRIX-20260519 기반
// 목적: 가상 시나리오를 실제로 통과시켜 견적엔진 출력의 완전성 검증
// 실행: node scripts/verify-standard-block-20260519.mjs

// ─────────────────────────────────────────────────────────────
// 1. 데이터 — STANDARD-LAYOUT-MATRIX-20260519.md 와 1:1 일치
// ─────────────────────────────────────────────────────────────

const CABINET_W_MM = 640
const CABINET_H_MM = 480
const MODULES_PER_CABINET = 6  // 320x160 × 2×3

const FAMILIES = {
  'F-IN-P3':   { env: 'indoor',  pitch: 'P3',   cab_px_w: 208, cab_px_h: 156, max_w_per_m2: 600 },
  'F-IN-P2.5': { env: 'indoor',  pitch: 'P2.5', cab_px_w: 256, cab_px_h: 192, max_w_per_m2: 600 },
  'F-OUT-P5':  { env: 'outdoor', pitch: 'P5',   cab_px_w: 128, cab_px_h: 96,  max_w_per_m2: 800 },
}

// 매트릭스에 정사각형 중간 사이즈(A-4x4, A-5x5) 보강 — 검증 중 발견
const LAYOUTS = [
  { code: 'A-2x1',  cols: 2,  rows: 1 },
  { code: 'A-2x2',  cols: 2,  rows: 2 },
  { code: 'A-3x2',  cols: 3,  rows: 2 },
  { code: 'A-4x2',  cols: 4,  rows: 2 },
  { code: 'A-4x3',  cols: 4,  rows: 3 },
  { code: 'A-4x4',  cols: 4,  rows: 4 },  // 신규: 2560×1920 정사각 중간
  { code: 'A-5x3',  cols: 5,  rows: 3 },
  { code: 'A-5x4',  cols: 5,  rows: 4 },
  { code: 'A-5x5',  cols: 5,  rows: 5 },  // 신규: 3200×2400 (= ZONE-A 단일)
  { code: 'A-6x4',  cols: 6,  rows: 4 },
  { code: 'A-8x4',  cols: 8,  rows: 4 },
  { code: 'A-10x5', cols: 10, rows: 5 },
]

const ZONE_A = { code: 'ZONE-A', cols: 5, rows: 5 }  // 25 cabs, 3200×2400mm

// 컨트롤러 캐퍼시티 (80% 보수 룰)
const CONTROLLERS = [
  { model: 'TB30', max_px: 478_400, lan_ports: 2, hdmi_in: false },
  { model: 'TB50', max_px: 956_800, lan_ports: 2, hdmi_in: true  },
  { model: 'TB60', max_px: 1_692_800, lan_ports: 4, hdmi_in: true  },
]
const LAN_PORT_MAX_PX_CANDIDATE = 400_000  // CANDIDATE — RFQ B-Q2 검증 대기

// 전원·랙·냉각 임계값
const CIRCUIT_USABLE_W = 220 * 16 * 0.8   // 2,816 W
const RACK_THRESHOLD_CABS = 20
const RACK_THRESHOLD_W = 3_000
const COOLING_THRESHOLD_CABS = 20
const COOLING_THRESHOLD_W = 3_500
const COOLING_REQUIRED_W = 8_000  // A-10x5 영역

// 패키지별 예비 모듈 비율
const SPARE_RATE = { BASIC: 0.05, STANDARD: 0.05, PREMIUM: 0.10, RENTAL: 0.10 }

// ENGINEERING_CUSTOM 트리거 (옥외)
const OUTDOOR_AREA_ENG_THRESHOLD_M2 = 5  // 5m² 초과 옥외 → 풍하중·구조 검토

// ─────────────────────────────────────────────────────────────
// 2. classifyProject
// ─────────────────────────────────────────────────────────────

function classifyProject(input) {
  const reasons = []

  if (input.special_shape) {
    reasons.push(`특수 구조: ${input.special_shape}`)
    return { classification: 'ENGINEERING_CUSTOM', reasons }
  }
  if (input.exact_size_required) {
    reasons.push('고객이 정확한 물리치수 요구 — 표준 적용 거부')
    return { classification: 'ENGINEERING_CUSTOM', reasons }
  }
  if (input.is_public_procurement) {
    reasons.push('공공기관/조달청 도면·인증 제출 필요')
    return { classification: 'ENGINEERING_CUSTOM', reasons }
  }
  if (input.is_broadcast_event) {
    reasons.push('방송·이벤트·고주사율 특수 요건')
    return { classification: 'ENGINEERING_CUSTOM', reasons }
  }
  return { classification: null, reasons }  // null = 레이아웃 선택 후 재판정
}

// ─────────────────────────────────────────────────────────────
// 3. pickNearestLayout
// ─────────────────────────────────────────────────────────────

function pickNearestLayout(req_w, req_h) {
  // 요청 크기 이상을 커버하는 가장 작은 표준 레이아웃
  const fits = LAYOUTS.filter(L => {
    const actual_w = L.cols * CABINET_W_MM
    const actual_h = L.rows * CABINET_H_MM
    return actual_w >= req_w && actual_h >= req_h
  })

  if (fits.length === 0) {
    // 표준 매트릭스 초과 → ZONE 반복 또는 ENGINEERING
    return tryZoneRepeat(req_w, req_h)
  }

  // 면적 차이가 최소인 것
  fits.sort((a, b) => (a.cols * a.rows) - (b.cols * b.rows))
  const L = fits[0]
  return {
    type: 'STANDARD_LAYOUT',
    layout_code: L.code,
    cols: L.cols,
    rows: L.rows,
    standard_w_mm: L.cols * CABINET_W_MM,
    standard_h_mm: L.rows * CABINET_H_MM,
    cabinet_count: L.cols * L.rows,
    delta_w: (L.cols * CABINET_W_MM) - req_w,
    delta_h: (L.rows * CABINET_H_MM) - req_h,
    zone_count: 1,
  }
}

function tryZoneRepeat(req_w, req_h) {
  // ZONE-A = 5×5 cabinets = 3200×2400mm
  const zone_w = ZONE_A.cols * CABINET_W_MM
  const zone_h = ZONE_A.rows * CABINET_H_MM
  const zones_cols = Math.ceil(req_w / zone_w)
  const zones_rows = Math.ceil(req_h / zone_h)
  const zone_count = zones_cols * zones_rows
  const total_cols = zones_cols * ZONE_A.cols
  const total_rows = zones_rows * ZONE_A.rows
  const total_cabs = total_cols * total_rows

  // 4개 존(2×2) 초과 시 ENGINEERING (5존 이상은 컨트롤러·동기·구조 검토 영역)
  if (zone_count > 4) {
    return {
      type: 'ENGINEERING_CUSTOM',
      reason: `요청 크기가 ZONE-A × 3 초과 (${zone_count}존 필요)`,
      cols: total_cols, rows: total_rows, cabinet_count: total_cabs,
      standard_w_mm: total_cols * CABINET_W_MM,
      standard_h_mm: total_rows * CABINET_H_MM,
    }
  }
  return {
    type: 'STANDARD_ZONE',
    layout_code: `ZONE-A x ${zone_count}`,
    cols: total_cols,
    rows: total_rows,
    standard_w_mm: total_cols * CABINET_W_MM,
    standard_h_mm: total_rows * CABINET_H_MM,
    cabinet_count: total_cabs,
    delta_w: (total_cols * CABINET_W_MM) - req_w,
    delta_h: (total_rows * CABINET_H_MM) - req_h,
    zone_count,
  }
}

// ─────────────────────────────────────────────────────────────
// 4. computeBOM
// ─────────────────────────────────────────────────────────────

function computeBOM(family_code, layout, packageTier = 'STANDARD', needs_live_input = false) {
  const F = FAMILIES[family_code]
  if (!F) throw new Error(`unknown family: ${family_code}`)

  const cabs = layout.cabinet_count
  const modules = cabs * MODULES_PER_CABINET
  const spare = Math.ceil(modules * (SPARE_RATE[packageTier] ?? 0.05))

  // 픽셀
  const screen_px_w = F.cab_px_w * layout.cols
  const screen_px_h = F.cab_px_h * layout.rows
  const total_px = screen_px_w * screen_px_h

  // 컨트롤러 선택
  let controller_count = layout.zone_count ?? 1
  // 존이 있으면 zone당 컨트롤러 1대, 그 zone 픽셀로 모델 선택
  const px_per_controller = Math.ceil(total_px / controller_count)
  let controller = CONTROLLERS.find(c => px_per_controller <= c.max_px)
  if (!controller) {
    // 단일 컨트롤러로 안 됨 → 추가 분할 (다중 TB60)
    controller = CONTROLLERS[CONTROLLERS.length - 1]
    controller_count = Math.ceil(total_px / controller.max_px)
  }
  // HDMI 라이브 입력 필요 시 TB50 이상 강제
  if (needs_live_input && controller.model === 'TB30') {
    controller = CONTROLLERS[1]  // TB50
  }

  // LAN 포트
  const lan_ports_needed = Math.ceil(px_per_controller / LAN_PORT_MAX_PX_CANDIDATE)
  const lan_ports_available = controller.lan_ports * controller_count
  const lan_overflow = lan_ports_needed * controller_count > lan_ports_available

  // 수신카드 = 캐비닛 1장당 1
  const receiving_cards = cabs

  // 면적·전력
  const area_m2 = ((layout.cols * CABINET_W_MM) * (layout.rows * CABINET_H_MM)) / 1_000_000
  const peak_power_w = Math.round(area_m2 * F.max_w_per_m2)
  const smps_count = cabs  // 캐비닛당 SMPS 1개 (현재 가정)
  const circuit_count = Math.ceil(peak_power_w / CIRCUIT_USABLE_W)

  // 랙·냉각
  const needs_rack = cabs >= RACK_THRESHOLD_CABS || peak_power_w >= RACK_THRESHOLD_W
  const needs_cooling_review = cabs >= COOLING_THRESHOLD_CABS || peak_power_w >= COOLING_THRESHOLD_W
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
    receiving_card_count: receiving_cards,
    smps_count,
    area_m2: Number(area_m2.toFixed(2)),
    peak_power_w,
    circuit_count,
    needs_rack,
    needs_cooling_review,
    cooling_required,
  }
}

// ─────────────────────────────────────────────────────────────
// 5. estimateProject — 전체 파이프라인
// ─────────────────────────────────────────────────────────────

function estimateProject(input) {
  // 1) 사전 분류 (특수 구조)
  let cls = classifyProject(input)
  if (cls.classification === 'ENGINEERING_CUSTOM') {
    return {
      requested: { width_mm: input.width_mm, height_mm: input.height_mm, family_code: input.family_code },
      classification: 'ENGINEERING_CUSTOM',
      classification_reasons: cls.reasons,
      pricing_blocked: true,
      action: '엔지니어링 설계비 견적 + CEO/11-부서 승인 필요',
    }
  }

  // 2) 레이아웃 선택
  const layout = pickNearestLayout(input.width_mm, input.height_mm)

  let classification, reasons = []
  if (layout.type === 'ENGINEERING_CUSTOM') {
    return {
      requested: { width_mm: input.width_mm, height_mm: input.height_mm, family_code: input.family_code },
      classification: 'ENGINEERING_CUSTOM',
      classification_reasons: [layout.reason],
      pricing_blocked: true,
      action: '엔지니어링 설계비 견적 + CEO/11-부서 승인 필요',
    }
  }

  // 3) BOM 계산
  const bom = computeBOM(input.family_code, layout, input.packageTier ?? 'STANDARD', input.needs_live_input)

  // 4) 분류 확정
  classification = layout.type  // STANDARD_LAYOUT or STANDARD_ZONE

  // 면적 초과율 게이트 — 표준 적용 면적이 요청의 1.5배 초과 시 엔지니어링 라우팅
  const requested_area_m2 = (input.width_mm / 1000) * (input.height_mm / 1000)
  const area_ratio = bom.area_m2 / requested_area_m2
  if (area_ratio > 1.5) {
    reasons.push(`표준 적용 면적 ${bom.area_m2}m² / 요청 ${requested_area_m2.toFixed(2)}m² = ${area_ratio.toFixed(2)}× — 50% 이상 초과, 별도 설계 권장`)
    classification = 'ENGINEERING_CUSTOM'
  }

  // 옥외 가산 트리거
  const F = FAMILIES[input.family_code]
  const outdoor_eng = F?.env === 'outdoor' && bom.area_m2 > OUTDOOR_AREA_ENG_THRESHOLD_M2
  if (outdoor_eng) {
    reasons.push(`옥외 ${bom.area_m2}m² > 5m² → 풍하중·구조 검토 필요`)
    classification = 'ENGINEERING_CUSTOM'
  }
  if (bom.lan_overflow) {
    reasons.push(`LAN 포트 부족 (필요 ${bom.lan_ports_needed_per_controller}/사용가능 ${bom.lan_ports_available})`)
    classification = 'ENGINEERING_CUSTOM'
  }
  if (bom.controller_count > 1) {
    reasons.push(`다중 컨트롤러 (${bom.controller_count}대) — 동기·기술 검수 필요`)
    if (classification === 'STANDARD_LAYOUT') classification = 'STANDARD_ZONE'
  }
  if (classification === 'STANDARD_LAYOUT') reasons.push('표준 레이아웃 + 단일 컨트롤러 + 옥외 검토 없음')
  if (classification === 'STANDARD_ZONE')   reasons.push('표준 존 반복 — 자동견적 + 기술검수 플래그')

  return {
    requested: { width_mm: input.width_mm, height_mm: input.height_mm, family_code: input.family_code },
    standard: { width_mm: layout.standard_w_mm, height_mm: layout.standard_h_mm, delta_w: layout.delta_w, delta_h: layout.delta_h },
    classification,
    classification_reasons: reasons,
    layout_code: layout.layout_code,
    zone_count: layout.zone_count,
    ...bom,
    pricing_blocked: classification === 'ENGINEERING_CUSTOM',
  }
}

// ─────────────────────────────────────────────────────────────
// 6. 가상 시나리오 실행
// ─────────────────────────────────────────────────────────────

const scenarios = [
  {
    title: '시나리오 1: 카페 메뉴판 (실내, P3, 1800×900mm)',
    input: { width_mm: 1800, height_mm: 900, family_code: 'F-IN-P3', packageTier: 'STANDARD' },
    expect: 'STANDARD_LAYOUT / A-3x2 / TB30 / 단일 회로',
    assert: { classification: 'STANDARD_LAYOUT', layout_code: 'A-3x2', controller_model: 'TB30', cabinet_count: 6 },
  },
  {
    title: '시나리오 2: 식당 외부 광고 (옥외, P5, 3000×2000mm)',
    input: { width_mm: 3000, height_mm: 2000, family_code: 'F-OUT-P5', packageTier: 'STANDARD' },
    expect: '옥외 5m² 초과 → ENGINEERING_CUSTOM',
    assert: { classification: 'ENGINEERING_CUSTOM', reasonContains: '풍하중' },
  },
  {
    title: '시나리오 3: 병원 로비 (실내, P2.5, 4000×2500mm)',
    input: { width_mm: 4000, height_mm: 2500, family_code: 'F-IN-P2.5', packageTier: 'PREMIUM' },
    expect: 'ENGINEERING (면적 초과 게이트)',
    assert: { classification: 'ENGINEERING_CUSTOM', reasonContains: '50% 이상 초과' },
  },
  {
    title: '시나리오 4: 헬스장 입구 (실내, P3, 2500×1500mm)',
    input: { width_mm: 2500, height_mm: 1500, family_code: 'F-IN-P3', packageTier: 'STANDARD' },
    expect: 'STANDARD_LAYOUT / A-4x4 / TB50',
    assert: { classification: 'STANDARD_LAYOUT', layout_code: 'A-4x4', controller_model: 'TB50', cabinet_count: 16 },
  },
  {
    title: '시나리오 5: 교회 정면 (실내, P2.5, 5000×3000mm, HDMI 라이브)',
    input: { width_mm: 5000, height_mm: 3000, family_code: 'F-IN-P2.5', packageTier: 'PREMIUM', needs_live_input: true },
    expect: 'ENGINEERING (면적 초과 게이트)',
    assert: { classification: 'ENGINEERING_CUSTOM', reasonContains: '50% 이상 초과' },
  },
  {
    title: '시나리오 6: 빌딩 외벽 곡면 (옥외, P6, 8000×5000mm, 곡면)',
    input: { width_mm: 8000, height_mm: 5000, family_code: 'F-OUT-P5', packageTier: 'PREMIUM', special_shape: '곡면' },
    expect: 'ENGINEERING_CUSTOM',
    assert: { classification: 'ENGINEERING_CUSTOM', reasonContains: '곡면' },
  },
  {
    title: '시나리오 7: 매장 정확치수 요구 (실내, P3, 1850×920mm, exact)',
    input: { width_mm: 1850, height_mm: 920, family_code: 'F-IN-P3', packageTier: 'STANDARD', exact_size_required: true },
    expect: 'ENGINEERING_CUSTOM (정확치수 거부)',
    assert: { classification: 'ENGINEERING_CUSTOM', reasonContains: '정확' },
  },
]

function fmt(n) { return typeof n === 'number' ? n.toLocaleString('en-US') : String(n) }

console.log('━'.repeat(80))
console.log('표준 블록 견적엔진 검증 — 2026-05-19')
console.log('━'.repeat(80))

for (const s of scenarios) {
  console.log('\n▶ ' + s.title)
  console.log('  입력:', JSON.stringify(s.input))
  console.log('  기대:', s.expect)
  const r = estimateProject(s.input)
  console.log('  ──────')
  if (r.pricing_blocked) {
    console.log('  분류        : ' + r.classification + '  [자동 가격 차단]')
    console.log('  근거        : ' + r.classification_reasons.join(' | '))
    console.log('  다음 액션   : ' + (r.action ?? '엔지니어링 라우팅'))
    if (r.standard) {
      console.log('  참고 표준   : ' + r.standard.width_mm + ' × ' + r.standard.height_mm + 'mm (∆ ' + r.standard.delta_w + '/' + r.standard.delta_h + ')')
    }
    continue
  }
  console.log('  요청 크기   : ' + r.requested.width_mm + ' × ' + r.requested.height_mm + 'mm')
  console.log('  표준 적용   : ' + r.standard.width_mm + ' × ' + r.standard.height_mm + 'mm  (∆ +' + r.standard.delta_w + ' / +' + r.standard.delta_h + 'mm)')
  console.log('  레이아웃    : ' + r.layout_code + (r.zone_count > 1 ? ` (zone ${r.zone_count})` : ''))
  console.log('  분류        : ' + r.classification)
  console.log('  분류 근거   : ' + r.classification_reasons.join(' | '))
  console.log('  ── BOM ──')
  console.log('  family      : ' + r.family_code)
  console.log('  cabinet     : ' + r.cabinet_count + '대')
  console.log('  module      : ' + r.module_count + '장  (예비 ' + r.spare_modules + '장)')
  console.log('  스크린 픽셀 : ' + fmt(r.screen_px_w) + ' × ' + fmt(r.screen_px_h) + ' = ' + fmt(r.total_px) + ' px')
  console.log('  controller  : ' + r.controller_model + ' × ' + r.controller_count + '대')
  console.log('  LAN 포트    : ' + r.lan_ports_needed_per_controller + ' 필요 / ' + r.lan_ports_available + ' 가용  ' + (r.lan_overflow ? '⚠ 초과' : 'OK'))
  console.log('  수신카드    : ' + r.receiving_card_count + '장')
  console.log('  면적        : ' + r.area_m2 + ' m²')
  console.log('  SMPS        : ' + r.smps_count + '개')
  console.log('  peak power  : ' + fmt(r.peak_power_w) + ' W')
  console.log('  전원 회로   : ' + r.circuit_count + '개')
  console.log('  랙/전원함   : ' + (r.needs_rack ? '필요' : '불필요'))
  console.log('  냉각 검토   : ' + (r.cooling_required ? '필수' : (r.needs_cooling_review ? '필요' : '불필요')))
}

// ─────────────────────────────────────────────────────────────
// 7. Assertion 검증 (회귀 테스트)
// ─────────────────────────────────────────────────────────────

console.log('\n' + '━'.repeat(80))
console.log('회귀 검증 (assertions)')
console.log('━'.repeat(80))

let failed = 0
for (const s of scenarios) {
  const r = estimateProject(s.input)
  const exp = s.assert
  if (!exp) continue
  const errs = []
  if (exp.classification && r.classification !== exp.classification) {
    errs.push(`classification: 기대=${exp.classification} 실제=${r.classification}`)
  }
  if (exp.layout_code && r.layout_code !== exp.layout_code) {
    errs.push(`layout_code: 기대=${exp.layout_code} 실제=${r.layout_code}`)
  }
  if (exp.controller_model && r.controller_model !== exp.controller_model) {
    errs.push(`controller_model: 기대=${exp.controller_model} 실제=${r.controller_model}`)
  }
  if (typeof exp.cabinet_count === 'number' && r.cabinet_count !== exp.cabinet_count) {
    errs.push(`cabinet_count: 기대=${exp.cabinet_count} 실제=${r.cabinet_count}`)
  }
  if (exp.reasonContains) {
    const joined = (r.classification_reasons ?? []).join(' | ')
    if (!joined.includes(exp.reasonContains)) {
      errs.push(`reason 미포함 "${exp.reasonContains}" — 실제: ${joined}`)
    }
  }
  if (errs.length) {
    failed++
    console.log(`✗ ${s.title}`)
    errs.forEach(e => console.log('   ' + e))
  } else {
    console.log(`✓ ${s.title}`)
  }
}

console.log('━'.repeat(80))
if (failed > 0) {
  console.log(`검증 실패: ${failed} / ${scenarios.length}`)
  process.exit(1)
}
console.log(`검증 통과: ${scenarios.length} / ${scenarios.length}`)
