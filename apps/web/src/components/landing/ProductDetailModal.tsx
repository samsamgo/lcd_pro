'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Building2, Sun, Check } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { SKU_PRICE_FROM, PRICE_DISCLAIMER } from '@/lib/pricing'
import type { ProductInfo } from '@/lib/products'
import { useSiteModals } from '@/components/modals/SiteModals'

export function ProductDetailModal({
  product,
  onClose,
}: {
  product: ProductInfo | null
  onClose: () => void
}) {
  const { openConsult } = useSiteModals()

  return (
    <Modal open={product !== null} onClose={onClose} size="lg" title={product?.name}>
      {product && (
        <div>
          <div className="relative -mx-6 -mt-1 aspect-[16/9] overflow-hidden bg-zinc-900">
            <Image
              src={product.img}
              alt={`${product.name} 설치 예시`}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover"
            />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-zinc-950/70 px-2.5 py-1 text-xs text-cyan-300 backdrop-blur">
              {product.env === 'indoor' ? <Building2 size={12} /> : <Sun size={12} className="text-amber-300" />}
              {product.env === 'indoor' ? '건물 안에 설치' : '건물 밖에 설치'}
            </span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-zinc-700">{product.summary}</p>

          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { k: '화소 간격', v: `${product.pitch.slice(1)}mm (${product.pitch})` },
              { k: '화면 밝기', v: product.brightness },
              { k: '보기 좋은 거리', v: product.viewingDistance },
              { k: '설치 환경', v: product.env === 'indoor' ? '실내' : '옥외' },
            ].map((s) => (
              <div key={s.k} className="rounded-xl bg-zinc-50 p-3">
                <dt className="text-xs text-zinc-500">{s.k}</dt>
                <dd className="mt-0.5 font-semibold text-zinc-900">{s.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold text-zinc-800">주요 특징</p>
              <ul className="space-y-1.5">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-zinc-700">
                    <Check size={15} className="mt-0.5 shrink-0 text-blue-600" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-zinc-800">추천 공간</p>
              <div className="flex flex-wrap gap-2">
                {product.bestFor.map((b) => (
                  <span key={b} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl bg-zinc-950 px-5 py-4 text-white">
            <div>
              <p className="text-xs text-zinc-400">설치비 기준</p>
              <p className="text-lg font-bold text-cyan-400">{SKU_PRICE_FROM[product.sku]}</p>
            </div>
            <span className="text-xs text-zinc-500">VAT 별도 · 범위 견적</span>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/quote?type=${product.env === 'indoor' ? 'cafe' : 'outdoor'}`}
              onClick={onClose}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-blue-500 active:scale-95"
            >
              이 모델로 견적받기
              <ArrowRight size={16} />
            </Link>
            <button
              type="button"
              onClick={() => {
                onClose()
                openConsult(`product-${product.sku}`)
              }}
              className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-100"
            >
              빠른 상담
            </button>
          </div>

          <p className="mt-3 text-xs text-zinc-500">* {PRICE_DISCLAIMER}</p>
        </div>
      )}
    </Modal>
  )
}
