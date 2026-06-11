import Link from 'next/link'
import { CheckCircle2, AlertTriangle, Layers } from 'lucide-react'

// API → 클라이언트로 돌아오는 견적 요약 (route.ts 와 일치)
export interface EstimateSummary {
  classification: 'STANDARD_LAYOUT' | 'STANDARD_ZONE' | 'ENGINEERING_CUSTOM'
  classification_reasons: string[]
  layout_code: string | null
  requested: { width_mm: number; height_mm: number; family_code: string }
  standard: { width_mm: number; height_mm: number; delta_w_mm: number; delta_h_mm: number } | null
  bom: {
    family_code: string
    layout_code: string
    cabinet_count: number
    module_count: number
    spare_modules: number
    screen_px_w: number
    screen_px_h: number
    total_px: number
    controller_model: string
    controller_count: number
    lan_ports_needed_per_controller: number
    lan_ports_available: number
    receiving_card_count: number
    area_m2: number
    smps_count: number
    peak_power_w: number
    circuit_count: number
    needs_rack: boolean
    needs_cooling_review: boolean
    cooling_required: boolean
  } | null
  pricing_blocked: boolean
  action?: string
}

interface Props {
  estimate: EstimateSummary | null
}

export function QuoteSuccess({ estimate }: Props) {
  const blocked = estimate?.pricing_blocked
  const cls = estimate?.classification
  // 견적 산출 여부에 따라 정직하게 헤드라인 분기 (치수 미입력/엔지니어링 라우팅 시 "산출" 단언 금지)
  const hasEstimate = !!estimate && !blocked
  const heading = blocked
    ? '엔지니어링 상담이 필요합니다'
    : hasEstimate
      ? '범위 견적이 산출되었습니다'
      : '견적 요청이 접수되었습니다'
  const subtext = blocked
    ? '요청하신 사양은 표준 자동 견적 범위를 벗어나, 별도 설계 상담으로 정밀 견적을 안내드립니다.'
    : hasEstimate
      ? '아래에 예상 범위 견적이 표시됩니다. 정밀 견적은 현장 실측 상담으로 진행됩니다.'
      : '담당자가 입력 정보를 검토한 뒤, 예상 범위 견적과 현장 실측 일정을 안내드립니다.'

  return (
    <div className="glass rounded-2xl p-8">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/10">
          <CheckCircle2 size={32} className="text-blue-600" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-zinc-900">{heading}</h2>
        <p className="text-zinc-700">{subtext}</p>
      </div>

      {estimate && <EstimateBlock estimate={estimate} />}

      <div className="mb-6 rounded-xl border border-zinc-200 bg-white/60 p-5 text-left text-sm text-zinc-700">
        <p className="mb-2 font-semibold text-zinc-800">다음 단계</p>
        <ol className="space-y-1.5">
          <li><span className="mr-2 font-bold text-blue-600">1.</span>{blocked ? '엔지니어링 상담 (별도 설계비 안내)' : '화면의 예상 범위 견적 확인'}</li>
          <li><span className="mr-2 font-bold text-blue-600">2.</span>현장 실사 일정 조율 (1~3일)</li>
          <li><span className="mr-2 font-bold text-blue-600">3.</span>최종 견적 확정 + 계약</li>
          <li><span className="mr-2 font-bold text-blue-600">4.</span>표준 시공 + 운영</li>
        </ol>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className="rounded-xl border border-zinc-300 px-6 py-3 text-center text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
        >
          홈으로
        </Link>
      </div>

      {cls && (
        <p className="mt-4 text-center text-[11px] text-zinc-600">
          분류: {cls} · 본 출력은 표준 블록 견적엔진(STANDARD-LAYOUT-MATRIX-20260519) 기반 추정치이며,
          공급사 RFQ 확정 후 일부 수치가 갱신될 수 있습니다.
        </p>
      )}
    </div>
  )
}

function EstimateBlock({ estimate }: { estimate: EstimateSummary }) {
  const { classification, classification_reasons, requested, standard, bom, pricing_blocked, layout_code } = estimate

  if (pricing_blocked) {
    return (
      <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
        <div className="mb-2 flex items-center gap-2 text-amber-700">
          <AlertTriangle size={18} />
          <span className="font-semibold">엔지니어링 설계 라우팅</span>
        </div>
        <p className="mb-3 text-sm text-zinc-700">
          요청하신 사양은 표준 자동 견적 범위를 벗어나므로 별도 설계 상담이 필요합니다.
        </p>
        <ul className="mb-3 list-inside list-disc space-y-1 text-xs text-zinc-600">
          {classification_reasons.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
        {standard && (
          <p className="text-xs text-zinc-500">
            참고 표준 크기: {standard.width_mm}×{standard.height_mm}mm
            {layout_code && ` (${layout_code})`}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="mb-6 rounded-xl border border-blue-500/30 bg-blue-500/5 p-5">
      <div className="mb-3 flex items-center gap-2 text-blue-700">
        <Layers size={18} />
        <span className="font-semibold">
          {classification === 'STANDARD_LAYOUT' ? '표준 레이아웃 적용' : '표준 존 반복 적용 (기술검수 포함)'}
        </span>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
        <SizeBox label="요청 크기" w={requested.width_mm} h={requested.height_mm} subtle />
        {standard && (
          <SizeBox
            label="표준 적용"
            w={standard.width_mm}
            h={standard.height_mm}
            note={`∆ +${standard.delta_w_mm} / +${standard.delta_h_mm}mm`}
          />
        )}
      </div>

      {bom && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-zinc-600 sm:grid-cols-3">
          <Row k="family"        v={bom.family_code} />
          <Row k="layout"        v={layout_code ?? bom.layout_code} />
          <Row k="캐비닛"        v={`${bom.cabinet_count}대`} />
          <Row k="모듈"          v={`${bom.module_count}장 (예비 ${bom.spare_modules})`} />
          <Row k="픽셀"          v={`${bom.screen_px_w}×${bom.screen_px_h}`} />
          <Row k="컨트롤러"      v={`${bom.controller_model}×${bom.controller_count}`} />
          <Row k="LAN 포트"      v={`${bom.lan_ports_needed_per_controller}/${bom.lan_ports_available}`} />
          <Row k="수신카드"      v={`${bom.receiving_card_count}장`} />
          <Row k="면적"          v={`${bom.area_m2} m²`} />
          <Row k="SMPS"          v={`${bom.smps_count}개`} />
          <Row k="피크 전력"     v={`${bom.peak_power_w.toLocaleString()} W`} />
          <Row k="전원 회로"     v={`${bom.circuit_count}개`} />
          <Row k="랙/전원함"     v={bom.needs_rack ? '필요' : '불필요'} />
          <Row k="냉각 검토"     v={bom.cooling_required ? '필수' : bom.needs_cooling_review ? '필요' : '불필요'} />
        </dl>
      )}

      <p className="mt-3 border-t border-blue-500/20 pt-3 text-[11px] text-zinc-500">
        {classification_reasons[0]}
      </p>
    </div>
  )
}

function SizeBox({ label, w, h, note, subtle }: { label: string; w: number; h: number; note?: string; subtle?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${subtle ? 'border-zinc-200 bg-white/40' : 'border-blue-500/30 bg-blue-500/10'}`}>
      <div className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="font-mono text-sm text-zinc-800">{w} × {h} mm</div>
      {note && <div className="mt-0.5 text-[10px] text-zinc-500">{note}</div>}
    </div>
  )
}

function Row({ k, v }: { k: string; v: string | number }) {
  return (
    <>
      <dt className="text-zinc-500">{k}</dt>
      <dd className="font-mono text-zinc-700">{v}</dd>
    </>
  )
}
