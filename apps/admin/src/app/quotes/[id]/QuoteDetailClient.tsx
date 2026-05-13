'use client'

import { useEffect, useState } from 'react'
import { Check, AlertTriangle, ChevronLeft, Download, X, ImageOff } from 'lucide-react'
import Link from 'next/link'

const STATUS_MAP: Record<string, { label: string; color: string; next: string[] }> = {
  pending:    { label: '접수됨',   color: 'text-yellow-300', next: ['reviewing', 'rejected'] },
  reviewing:  { label: '검토중',   color: 'text-blue-300',   next: ['estimated', 'rejected'] },
  estimated:  { label: '견적발송', color: 'text-purple-300', next: ['site_check', 'rejected'] },
  site_check: { label: '현장실사', color: 'text-orange-300', next: ['confirmed', 'rejected'] },
  confirmed:  { label: '확정',     color: 'text-green-300',  next: ['contracted', 'rejected'] },
  contracted: { label: '계약완료', color: 'text-emerald-300',next: [] },
  rejected:   { label: '거절',     color: 'text-red-300',    next: [] },
  expired:    { label: '만료',     color: 'text-zinc-400',   next: [] },
}

const STATUS_LABELS: Record<string, string> = {
  reviewing: '검토 시작', estimated: '범위 견적 발송', site_check: '현장실사 예정',
  confirmed: '최종 확정', contracted: '계약 완료', rejected: '거절/취소',
}

interface Props {
  quote: any
  products: any[]
}

function recommendSKU(quote: any): { sku: string; reason: string } | null {
  const env = quote.environment
  const w = quote.desired_width_mm ?? 0
  const h = quote.desired_height_mm ?? 0
  const area = (w * h) / 1_000_000 // m²

  if (env === 'indoor') {
    if (area <= 0.6 || area === 0) return { sku: 'IN-S', reason: `실내 소형 (${area.toFixed(1)}m² 이하)` }
    if (area <= 2) return { sku: 'IN-M', reason: `실내 중형 (${area.toFixed(1)}m²)` }
    return { sku: 'P2.5', reason: `실내 대형·프리미엄 (${area.toFixed(1)}m²)` }
  } else {
    if (area <= 0.8) return { sku: 'OUT-S', reason: `옥외 소형 (${area.toFixed(1)}m²)` }
    if (area <= 4) return { sku: 'OUT-M', reason: `옥외 중형 (${area.toFixed(1)}m²)` }
    return { sku: 'OUT-L', reason: `옥외 대형 (${area.toFixed(1)}m²)` }
  }
}

function calcEstimate(product: any, pkg: any) {
  if (!product) return null
  const base = product.base_price_krw * (pkg?.price_multiplier ?? 1)
  const install = product.install_price_krw
  const min = Math.round((base + install) * 0.9)
  const max = Math.round((base + install) * 1.3)
  return { min, max, monthly: product.monthly_cms_krw }
}

export function QuoteDetailClient({ quote, products }: Props) {
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(quote.status)
  const [adminNotes, setAdminNotes] = useState(quote.admin_notes ?? '')
  const [estimateMin, setEstimateMin] = useState(quote.estimate_min_krw ?? '')
  const [estimateMax, setEstimateMax] = useState(quote.estimate_max_krw ?? '')
  const [saved, setSaved] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const sortedPhotos: any[] = (quote.quote_photos ?? [])
    .slice()
    .sort((a: any, b: any) => a.sort_order - b.sort_order)

  useEffect(() => {
    if (lightboxIndex === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i === null ? null : Math.min(i + 1, sortedPhotos.length - 1)))
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i === null ? null : Math.max(i - 1, 0)))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, sortedPhotos.length])

  const statusInfo = STATUS_MAP[status]
  const recommendation = recommendSKU(quote)
  const recommendedProduct = products.find((p) => p.sku === recommendation?.sku)
  const autoEstimate = calcEstimate(recommendedProduct, { price_multiplier: 1.25 }) // standard

  async function handleSave() {
    setSaving(true)
    try {
      await fetch(`/api/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          admin_notes: adminNotes,
          estimate_min_krw: estimateMin ? Number(estimateMin) : null,
          estimate_max_krw: estimateMax ? Number(estimateMax) : null,
          recommended_sku: recommendation?.sku ?? null,
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6">
      <Link href="/quotes" className="mb-5 flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white">
        <ChevronLeft size={16} /> 목록으로
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {quote.customers?.business_name ?? quote.customers?.name}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm">
            <span className={statusInfo?.color}>{statusInfo?.label}</span>
            <span className="text-zinc-700">·</span>
            <span className="text-zinc-500">{new Date(quote.created_at).toLocaleString('ko-KR')}</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
        >
          {saved ? <Check size={16} /> : null}
          {saving ? '저장 중...' : saved ? '저장됨' : '저장'}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* 고객 정보 */}
        <div className="glass rounded-xl p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">고객 정보</p>
          <dl className="space-y-2.5 text-sm">
            {[
              { label: '상호', value: quote.customers?.business_name },
              { label: '담당자', value: quote.customers?.name },
              { label: '전화', value: quote.customers?.phone },
              { label: '지역', value: quote.customers?.region },
              { label: '업종', value: quote.customers?.business_type },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <dt className="text-zinc-500">{label}</dt>
                <dd className="font-medium text-zinc-200">{value ?? '-'}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 요청 정보 */}
        <div className="glass rounded-xl p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">요청 정보</p>
          <dl className="space-y-2.5 text-sm">
            {[
              { label: '환경', value: quote.environment === 'indoor' ? '실내' : '옥외' },
              { label: '크기', value: quote.desired_width_mm && quote.desired_height_mm ? `${quote.desired_width_mm / 10}cm × ${quote.desired_height_mm / 10}cm` : '-' },
              { label: '시청거리', value: quote.viewing_distance_m ? `${quote.viewing_distance_m}m` : '-' },
              { label: '긴급도', value: { low:'여유', normal:'보통', high:'빠름', urgent:'긴급' }[quote.urgency as string] ?? quote.urgency },
              { label: '목적', value: quote.purpose },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-2">
                <dt className="shrink-0 text-zinc-500">{label}</dt>
                <dd className="text-right font-medium text-zinc-200">{value ?? '-'}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* SKU 추천 */}
        <div className="glass rounded-xl p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">SKU 추천</p>
          {recommendation ? (
            <div>
              <div className="mb-3 rounded-lg bg-blue-600/10 p-3">
                <p className="font-mono text-lg font-bold text-blue-300">{recommendation.sku}</p>
                <p className="text-xs text-zinc-500">{recommendation.reason}</p>
              </div>
              {autoEstimate && (
                <div className="text-sm">
                  <p className="text-zinc-500">자동 범위 견적 (스탠다드)</p>
                  <p className="mt-1 font-semibold text-white">
                    ₩{(autoEstimate.min / 10000).toFixed(0)}만 ~ ₩{(autoEstimate.max / 10000).toFixed(0)}만
                  </p>
                  <p className="text-xs text-blue-400">+ CMS 월 {(autoEstimate.monthly / 10000).toFixed(0)}만원</p>
                  <button
                    type="button"
                    onClick={() => { setEstimateMin(String(autoEstimate.min)); setEstimateMax(String(autoEstimate.max)) }}
                    className="mt-2 text-xs text-blue-400 underline hover:text-blue-300"
                  >
                    이 값으로 채우기
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <AlertTriangle size={14} className="text-yellow-400" />
              크기 정보 부족
            </div>
          )}
        </div>
      </div>

      {/* 관리자 작업 영역 */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* 상태 변경 */}
        <div className="glass rounded-xl p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">상태 변경</p>
          <div className="flex flex-wrap gap-2">
            {statusInfo?.next.map((nextStatus) => (
              <button
                key={nextStatus}
                onClick={() => setStatus(nextStatus)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  status === nextStatus
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                    : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500'
                }`}
              >
                → {STATUS_LABELS[nextStatus] ?? nextStatus}
              </button>
            ))}
            {statusInfo?.next.length === 0 && (
              <p className="text-sm text-zinc-600">더 이상 진행할 수 없는 상태입니다.</p>
            )}
          </div>
        </div>

        {/* 범위 견적 입력 */}
        <div className="glass rounded-xl p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">범위 견적 설정</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={estimateMin}
              onChange={(e) => setEstimateMin(e.target.value)}
              placeholder="최소 (원)"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/60 focus:outline-none"
            />
            <span className="text-zinc-600">~</span>
            <input
              type="number"
              value={estimateMax}
              onChange={(e) => setEstimateMax(e.target.value)}
              placeholder="최대 (원)"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/60 focus:outline-none"
            />
          </div>
          <p className="mt-1.5 text-xs text-zinc-600">
            최소 마진 30% 확인 후 발송. 현장 실사 후 최종 확정 필요.
          </p>
        </div>
      </div>

      {/* 관리자 메모 */}
      <div className="mt-5 glass rounded-xl p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">관리자 메모</p>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={4}
          placeholder="현장 실사 결과, 특이사항, 파트너 배정 등..."
          className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/60 focus:outline-none"
        />
      </div>

      {/* 업로드 사진 */}
      {sortedPhotos.length > 0 && (
        <div className="mt-5 glass rounded-xl p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            첨부 사진 ({sortedPhotos.length}장)
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {sortedPhotos.map((photo: any, idx: number) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => photo.signed_url && setLightboxIndex(idx)}
                title={photo.file_name}
                className="group relative aspect-square overflow-hidden rounded-lg bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {photo.signed_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.signed_url}
                    alt={photo.file_name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-zinc-600">
                    <ImageOff size={18} />
                    <span className="px-1 text-center text-[10px] leading-tight">{photo.file_name}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {lightboxIndex !== null && sortedPhotos[lightboxIndex]?.signed_url && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null) }}
            aria-label="닫기"
            className="absolute right-4 top-4 rounded-full bg-zinc-900/80 p-2 text-white hover:bg-zinc-800"
          >
            <X size={18} />
          </button>
          <a
            href={sortedPhotos[lightboxIndex].signed_url}
            download={sortedPhotos[lightboxIndex].file_name}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-16 top-4 flex items-center gap-1.5 rounded-full bg-zinc-900/80 px-3 py-2 text-xs text-white hover:bg-zinc-800"
          >
            <Download size={14} /> 원본
          </a>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900/80 px-3 py-1 text-xs text-zinc-300">
            {lightboxIndex + 1} / {sortedPhotos.length} · {sortedPhotos[lightboxIndex].file_name}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sortedPhotos[lightboxIndex].signed_url}
            alt={sortedPhotos[lightboxIndex].file_name}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  )
}
