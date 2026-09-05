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
          <div className="relative -mx-6 -mt-1 aspect-[16/9] overflow-hidden bg-wk-night">
            <Image
              src={product.img}
              alt={product.imgAlt}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover"
            />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-wk-night/70 px-2.5 py-1 text-xs text-cyan-300 backdrop-blur">
              {product.env === 'indoor' ? <Building2 size={12} /> : <Sun size={12} className="text-amber-300" />}
              {product.env === 'indoor' ? '건물 안에 설치' : '건물 밖에 설치'}
            </span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-wk-ink2">{product.summary}</p>

          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { k: '화소 간격', v: `${product.pitch.slice(1)}mm (${product.pitch})` },
              { k: '화면 밝기', v: product.brightness },
              { k: '보기 좋은 거리', v: product.viewingDistance },
              { k: '설치 환경', v: product.env === 'indoor' ? '실내' : '옥외' },
            ].map((s) => (
              <div key={s.k} className="rounded-xl bg-wk-bgFaint p-3">
                <dt className="text-xs text-wk-ink3">{s.k}</dt>
                <dd className="mt-0.5 font-semibold text-wk-ink">{s.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold text-wk-ink2">주요 특징</p>
              <ul className="space-y-1.5">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-wk-ink2">
                    <Check size={15} className="mt-0.5 shrink-0 text-wk-cta" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-wk-ink2">추천 공간</p>
              <div className="flex flex-wrap gap-2">
                {product.bestFor.map((b) => (
                  <span key={b} className="rounded-full bg-wk-blueWeak px-3 py-1 text-xs font-medium text-wk-ctaActive">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl bg-wk-night px-5 py-4 text-white">
            <div>
              <p className="text-caption text-wk-ink3">설치비 기준</p>
              <p className="text-lg font-bold text-cyan-400">{SKU_PRICE_FROM[product.sku]}</p>
            </div>
            <span className="text-xs text-wk-ink3">VAT 별도 · 범위 견적</span>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/quote?type=${product.env === 'indoor' ? 'cafe' : 'outdoor'}`}
              onClick={onClose}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-wk-cta px-5 py-3 text-sm font-bold text-white transition-all hover:bg-wk-blue active:scale-95"
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
              className="rounded-xl border border-wk-line2 px-5 py-3 text-sm font-semibold text-wk-ink2 transition-all hover:bg-wk-bg"
            >
              빠른 상담
            </button>
          </div>

          <p className="mt-3 text-xs text-wk-ink3">* {PRICE_DISCLAIMER}</p>
        </div>
      )}
    </Modal>
  )
}
