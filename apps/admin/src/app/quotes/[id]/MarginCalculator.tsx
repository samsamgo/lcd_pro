'use client'

import { useState } from 'react'

interface Props {
  products: any[]
}

const PACKAGE_MULTIPLIERS: Record<string, number> = {
  basic: 1.0,
  standard: 1.25,
  premium: 1.55,
}

export function MarginCalculator({ products }: Props) {
  const [selectedSku, setSelectedSku] = useState('')
  const [selectedPkg, setSelectedPkg] = useState('standard')
  const [widthCm, setWidthCm] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [discountPct, setDiscountPct] = useState('0')

  const product = products.find((p) => p.sku === selectedSku)

  const areaSqm = widthCm && heightCm
    ? (parseFloat(widthCm) * parseFloat(heightCm)) / 10000
    : 1

  const multiplier = PACKAGE_MULTIPLIERS[selectedPkg] ?? 1
  const baseHardware = product ? product.base_price_krw * areaSqm : 0
  const installCost = product ? product.install_price_krw : 0
  const monthlyCms = product ? product.monthly_cms_krw : 0

  const totalCost = baseHardware + installCost
  const discount = parseFloat(discountPct) / 100
  const salePrice = totalCost * multiplier * (1 - discount)
  const margin = salePrice > 0 ? ((salePrice - totalCost) / salePrice) * 100 : 0
  const annualRevenue = salePrice + monthlyCms * 12

  const marginColor = margin >= 40 ? 'text-emerald-400' : margin >= 30 ? 'text-green-400' : margin >= 20 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="glass rounded-xl p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">마진 계산기</p>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-zinc-500">SKU</label>
          <select
            value={selectedSku}
            onChange={(e) => setSelectedSku(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500/60 focus:outline-none"
          >
            <option value="">SKU 선택</option>
            {products.map((p) => (
              <option key={p.sku} value={p.sku}>{p.sku} — {p.display_name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-zinc-500">패키지</label>
          <select
            value={selectedPkg}
            onChange={(e) => setSelectedPkg(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500/60 focus:outline-none"
          >
            <option value="basic">베이직 (×1.0)</option>
            <option value="standard">스탠다드 (×1.25)</option>
            <option value="premium">프리미엄 (×1.55)</option>
          </select>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <div>
          <label className="mb-1 block text-xs text-zinc-500">가로 (cm)</label>
          <input
            type="number"
            value={widthCm}
            onChange={(e) => setWidthCm(e.target.value)}
            placeholder="200"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500/60 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-zinc-500">세로 (cm)</label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value)}
            placeholder="100"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500/60 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-zinc-500">할인율 (%)</label>
          <input
            type="number"
            min="0"
            max="30"
            value={discountPct}
            onChange={(e) => setDiscountPct(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500/60 focus:outline-none"
          />
        </div>
      </div>

      {product && (
        <div className="space-y-2 border-t border-white/[0.06] pt-4 text-sm">
          <div className="flex justify-between text-zinc-500">
            <span>면적</span>
            <span>{areaSqm.toFixed(2)}m²</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>하드웨어 원가</span>
            <span>₩{baseHardware.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>설치비 원가</span>
            <span>₩{installCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-medium text-zinc-300">
            <span>총 원가</span>
            <span>₩{totalCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-white">
            <span>판매가 (패키지+할인)</span>
            <span>₩{salePrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">마진율</span>
            <span className={`font-bold ${marginColor}`}>{margin.toFixed(1)}%</span>
          </div>
          {margin < 30 && (
            <p className="text-xs text-red-400">⚠ 최소 마진 30% 미달 — 견적 발송 불가</p>
          )}
          <div className="flex justify-between border-t border-white/[0.06] pt-2 text-zinc-500">
            <span>CMS 월 구독</span>
            <span>₩{monthlyCms.toLocaleString()}/월</span>
          </div>
          <div className="flex justify-between font-semibold text-blue-300">
            <span>1년 총 매출 (설치+CMS)</span>
            <span>₩{annualRevenue.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
