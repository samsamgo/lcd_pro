'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Building2, Sun, Plus } from 'lucide-react'
import { SKU_PRICE_FROM, type Sku } from '@/lib/pricing'
import { PRODUCTS, type ProductInfo } from '@/lib/products'
import { ProductDetailModal } from './ProductDetailModal'

export function ProductGrid({ skus }: { skus?: Sku[] }) {
  const [active, setActive] = useState<ProductInfo | null>(null)
  const items = skus
    ? skus.map((s) => PRODUCTS.find((p) => p.sku === s)).filter((p): p is ProductInfo => !!p)
    : PRODUCTS

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <button
            key={p.sku}
            type="button"
            onClick={() => setActive(p)}
            aria-label={`${p.name} 상세 보기`}
            className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left transition-all hover:-translate-y-0.5 hover:border-cyan-400/40 hover:led-glow"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
              <Image
                src={p.img}
                alt={`${p.name} 설치 예시`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover img-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-zinc-950/70 px-2.5 py-1 text-xs font-mono text-cyan-300 backdrop-blur">
                {p.env === 'indoor' ? (
                  <Building2 size={12} className="text-cyan-300" />
                ) : (
                  <Sun size={12} className="text-amber-300" />
                )}
                {p.sku}
              </span>
              <span className="absolute bottom-3 left-3 rounded-md bg-cyan-400/90 px-2 py-0.5 text-xs font-bold text-zinc-950">
                {p.brightness}
              </span>
              <span className="absolute bottom-3 right-3 rounded-full bg-white/10 p-1.5 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                <Plus size={15} />
              </span>
            </div>

            <div className="p-6">
              <div className="mb-1 flex items-center justify-between gap-2">
                <h3 className="font-bold text-white">{p.name}</h3>
              </div>
              <p className="mb-4 text-xs text-cyan-400">{p.tag}</p>

              <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-zinc-400">
                <div>
                  <span className="text-zinc-500">피치</span>
                  <p className="font-medium text-zinc-200">{p.pitch}</p>
                </div>
                <div>
                  <span className="text-zinc-500">밝기</span>
                  <p className="font-medium text-zinc-200">{p.brightness}</p>
                </div>
                <div>
                  <span className="text-zinc-500">설치비 기준</span>
                  <p className="font-semibold text-white">{SKU_PRICE_FROM[p.sku]}</p>
                </div>
                <div>
                  <span className="text-zinc-500">설치 환경</span>
                  <p className="font-medium text-zinc-300">
                    {p.env === 'indoor' ? '실내' : '옥외'}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                상세 스펙 보기 <Plus size={12} />
              </span>
            </div>
          </button>
        ))}
      </div>

      <ProductDetailModal product={active} onClose={() => setActive(null)} />
    </>
  )
}
