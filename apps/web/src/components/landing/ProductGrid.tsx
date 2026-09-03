'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Building2, Sun, ArrowUpRight } from 'lucide-react'
import { SKU_PRICE_FROM, type Sku } from '@/lib/pricing'
import { PRODUCTS, type ProductInfo } from '@/lib/products'
import { ProductDetailModal } from './ProductDetailModal'
import { Reveal } from '@/components/motion'

/**
 * 제품 카드 격자.
 *
 * 카드에 모델명을 앞세우지 않는다(안티패턴 13). 담당자가 아는 것은
 *"민원실 창구", "정문", "도로변" 이지 `OUT-M`이 아니다.
 * 그래서 이름은 설치 장소, 규격은 그 아래 근거로 둔다.
 *
 * 격자 이미지에는 반드시 정확한 sizes 를 준다. 생략하면 브라우저가 100vw로
 * 가정해 3열 카드에 화면 폭짜리 이미지를 받는다.
 */
const GRID_SIZES = '(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw'

export function ProductGrid({ skus, columns = 3 }: { skus?: Sku[]; columns?: 2 | 3 }) {
  const [active, setActive] = useState<ProductInfo | null>(null)
  const items = skus
    ? skus.map((s) => PRODUCTS.find((p) => p.sku === s)).filter((p): p is ProductInfo => !!p)
    : PRODUCTS

  return (
    <>
      <div className={`grid gap-5 sm:grid-cols-2 ${columns === 3 ? 'lg:grid-cols-3' : ''}`}>
        {items.map((p, n) => (
          <Reveal key={p.sku} className="h-full" y={16} delay={Math.min(n, 4) * 0.07}>
          <button
            type="button"
            onClick={() => setActive(p)}
            aria-label={`${p.name} 규격 자세히 보기`}
            className="wk-card group !p-0 h-full w-full overflow-hidden text-left shadow-wk-2 ring-1 ring-wk-line"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-wk-bg">
              <Image
                src={p.img}
                alt={p.imgAlt}
                fill
                sizes={GRID_SIZES}
                className="object-cover"
              />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1 text-caption font-semibold text-wk-ink2 shadow-wk-1">
                {p.env === 'indoor' ? (
                  <Building2 size={13} aria-hidden="true" className="text-wk-blue" />
                ) : (
                  <Sun size={13} aria-hidden="true" className="text-wk-warn" />
                )}
                {p.env === 'indoor' ? '실내' : '옥외'}
              </span>
            </div>

            <div className="p-5 sm:p-6">
              <h3 className="text-h3 font-semibold text-wk-ink">{p.name}</h3>
              <p className="mt-1.5 text-label text-wk-ink3">{p.tag}</p>

              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-wk-line pt-4">
                <div>
                  <dt className="text-caption text-wk-ink3">화소 간격</dt>
                  <dd className="wk-metric mt-0.5 font-semibold text-wk-ink">
                    {p.pitch.slice(1)}
                    <small> mm</small>
                  </dd>
                </div>
                <div>
                  <dt className="text-caption text-wk-ink3">밝기</dt>
                  <dd className="wk-metric mt-0.5 font-semibold text-wk-ink">
                    {p.brightness.replace(' nit', '')}
                    <small> nit</small>
                  </dd>
                </div>
                <div>
                  <dt className="text-caption text-wk-ink3">권장 시청 거리</dt>
                  <dd className="wk-metric mt-0.5 font-semibold text-wk-ink">
                    {p.viewingDistance}
                  </dd>
                </div>
                <div>
                  <dt className="text-caption text-wk-ink3">설치비 기준</dt>
                  <dd className="wk-metric mt-0.5 font-semibold text-wk-ink">
                    {SKU_PRICE_FROM[p.sku]}
                  </dd>
                </div>
              </dl>

              <span className="mt-5 inline-flex items-center gap-1 text-label font-semibold text-wk-cta">
                규격 자세히 보기
                <ArrowUpRight size={15} aria-hidden="true" />
              </span>
            </div>
          </button>
          </Reveal>
        ))}
      </div>

      <ProductDetailModal product={active} onClose={() => setActive(null)} />
    </>
  )
}
