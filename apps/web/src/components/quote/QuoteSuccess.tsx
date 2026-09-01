'use client'

import Link from 'next/link'
import { CheckCircle2, AlertTriangle, Layers, MessageCircle, Phone } from 'lucide-react'
import { SITE } from '@/lib/seo/site'
import { useSiteModals } from '@/components/modals/SiteModals'

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
  price?: { min: number; max: number; materialLow: number; materialHigh: number } | null
}

const fmtMan = (won: number) => `${(won / 10_000).toLocaleString()}만원`

const FAMILY_LABELS: Record<string, string> = {
  'F-IN-P1.86': '가까이 보는 실내 정밀형 (화소 간격 1.86mm)',
  'F-IN-P2.5': '가까이 보는 실내 정밀형 (화소 간격 2.5mm)',
  'F-IN-P3': '로비·강당용 실내형 (화소 간격 3mm)',
  'F-OUT-P5': '멀리서 보는 옥외형 (화소 간격 5mm)',
}

function familyLabel(code: string) {
  return FAMILY_LABELS[code] ?? '설치 장소와 보는 거리에 맞춘 화면'
}

function reasonLabel(reason?: string) {
  if (!reason) return '요청하신 조건에 맞춰 기본 제작 구성을 적용했습니다.'
  if (reason.includes('특수 구조:')) return '일반 직사각형이 아닌 형태여서 구조와 제작 방법을 별도로 검토해야 합니다.'
  if (reason.includes('ZONE-A')) return '요청 크기가 기본 제작 범위를 넘어 별도 설계가 필요합니다.'
  if (reason.includes('LAN 포트')) return '화면 제어 장비의 연결 수량을 추가로 검토해야 합니다.'
  if (reason.includes('다중 컨트롤러')) return '여러 화면 제어 장비의 동기 작동을 설치 전에 확인해야 합니다.'
  if (reason.includes('표준 레이아웃')) return '요청 크기에 맞는 기본 제작 구성을 적용했습니다.'
  if (reason.includes('표준 존 반복')) return '큰 화면을 여러 구역으로 나누어 구성하며 설치 전 기술 검수를 진행합니다.'
  return reason.replace('엔지니어링', '별도').replace('픽셀 피치', '화소 간격')
}

interface Props {
  estimate: EstimateSummary | null
}

export function QuoteSuccess({ estimate }: Props) {
  const { openConsult } = useSiteModals()
  const blocked = estimate?.pricing_blocked
  // 견적 산출 여부에 따라 정직하게 헤드라인 분기 (치수 미입력/엔지니어링 라우팅 시 "산출" 단언 금지)
  const hasEstimate = !!estimate && !blocked
  const heading = blocked
    ? '별도 설계 상담이 필요합니다'
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
          <li><span className="mr-2 font-bold text-blue-600">1.</span>{blocked ? '별도 설계 상담과 설계비 안내' : '화면의 예상 범위 견적 확인'}</li>
          <li><span className="mr-2 font-bold text-blue-600">2.</span>현장 실사 일정 조율 (1~3일)</li>
          <li><span className="mr-2 font-bold text-blue-600">3.</span>최종 견적 확정 + 계약</li>
          <li><span className="mr-2 font-bold text-blue-600">4.</span>표준 시공 + 운영</li>
        </ol>
      </div>

      <div className="rounded-xl bg-blue-600/5 p-5 text-center">
        <p className="text-sm font-semibold text-zinc-800">더 빠르게 진행하고 싶으신가요?</p>
        <p className="mt-1 text-xs text-zinc-600">담당자와 바로 연결해 현장 실측 일정을 잡아드립니다.</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => openConsult('quote-success')}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blue-500 active:scale-95"
          >
            <MessageCircle size={16} />
            상담·실측 예약
          </button>
          {SITE.phone && (
            <a
              href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-100"
            >
              <Phone size={16} className="text-blue-600" />
              전화 {SITE.phone}
            </a>
          )}
          {SITE.kakaoChannelUrl && (
            <a
              href={SITE.kakaoChannelUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-100"
            >
              카카오 상담
            </a>
          )}
        </div>
        <Link
          href="/"
          className="mt-4 inline-block text-xs font-medium text-zinc-500 underline-offset-2 hover:underline"
        >
          홈으로 돌아가기
        </Link>
      </div>

      {estimate && (
        <p className="mt-4 text-center text-[11px] text-zinc-600">
          본 금액은 기본 제작 규격으로 계산한 예상치입니다. 현장 확인과 자재 가격 확인 후 일부 수치가 달라질 수 있습니다.
        </p>
      )}
    </div>
  )
}

function EstimateBlock({ estimate }: { estimate: EstimateSummary }) {
  const { classification, classification_reasons, requested, standard, bom, pricing_blocked, price } = estimate

  if (pricing_blocked) {
    return (
      <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/5 p-5">
        <div className="mb-2 flex items-center gap-2 text-amber-700">
          <AlertTriangle size={18} />
          <span className="font-semibold">별도 설계가 필요한 요청입니다</span>
        </div>
        <p className="mb-3 text-sm text-zinc-700">
          요청하신 사양은 표준 자동 견적 범위를 벗어나므로 별도 설계 상담이 필요합니다.
        </p>
        <ul className="mb-3 list-inside list-disc space-y-1 text-xs text-zinc-600">
          {classification_reasons.map((r, i) => <li key={i}>{reasonLabel(r)}</li>)}
        </ul>
        {standard && (
          <p className="text-xs text-zinc-500">
            참고할 수 있는 기본 제작 크기: {standard.width_mm}×{standard.height_mm}mm
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
          {classification === 'STANDARD_LAYOUT' ? '요청 크기에 가까운 기본 구성을 적용했습니다' : '큰 화면을 구역별로 나누어 구성합니다'}
        </span>
      </div>

      {price && (
        <div className="mb-4 rounded-xl border border-blue-500/40 bg-blue-600/5 p-4 text-center">
          <div className="text-[11px] uppercase tracking-wider text-zinc-500">예상 범위 견적 (설치비 포함)</div>
          <div className="text-2xl font-bold text-blue-700">
            약 {fmtMan(price.min)} ~ {fmtMan(price.max)}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            VAT 별도 · 현장 실측 후 확정되는 예상치이며 확정가가 아닙니다.
          </div>
        </div>
      )}

      <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
        <SizeBox label="요청 크기" w={requested.width_mm} h={requested.height_mm} subtle />
        {standard && (
          <SizeBox
            label="표준 적용"
            w={standard.width_mm}
            h={standard.height_mm}
            note={`요청보다 가로 ${standard.delta_w_mm}mm, 세로 ${standard.delta_h_mm}mm 큼`}
          />
        )}
      </div>

      {bom && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-zinc-600 sm:grid-cols-3">
          <Row k="화면 유형"      v={familyLabel(bom.family_code)} />
          <Row k="화면 구성 단위" v={`${bom.cabinet_count}개`} />
          <Row k="표시 해상도"    v={`${bom.screen_px_w}×${bom.screen_px_h}화소`} />
          <Row k="화면 면적"      v={`${bom.area_m2}m²`} />
          <Row k="최대 소비전력"  v={`${bom.peak_power_w.toLocaleString()}W`} />
          <Row k="전원 회로"      v={`${bom.circuit_count}개`} />
          <Row k="별도 전원함"    v={bom.needs_rack ? '필요' : '불필요'} />
          <Row k="냉각 설비 검토" v={bom.cooling_required ? '필수' : bom.needs_cooling_review ? '필요' : '불필요'} />
        </dl>
      )}

      <p className="mt-3 border-t border-blue-500/20 pt-3 text-[11px] text-zinc-500">
        {reasonLabel(classification_reasons[0])}
      </p>
    </div>
  )
}

function SizeBox({ label, w, h, note, subtle }: { label: string; w: number; h: number; note?: string; subtle?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 ${subtle ? 'border-zinc-200 bg-white/40' : 'border-blue-500/30 bg-blue-500/10'}`}>
      <div className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="text-sm font-semibold text-zinc-800">{w} × {h} mm</div>
      {note && <div className="mt-0.5 text-[10px] text-zinc-500">{note}</div>}
    </div>
  )
}

function Row({ k, v }: { k: string; v: string | number }) {
  return (
    <>
      <dt className="text-zinc-500">{k}</dt>
      <dd className="text-zinc-700">{v}</dd>
    </>
  )
}
