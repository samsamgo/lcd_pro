import { PRICE_DISCLAIMER, SKU_PRICE_FROM_KRW } from '@/lib/pricing'
import { PRODUCTS } from '@/lib/products'
import { ProductGrid } from './ProductGrid'
import { JsonLd } from '@/components/seo/JsonLd'
import { productListLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/seo/site'

export function ProductSection({ hideHeader = false }: { hideHeader?: boolean }) {
  return (
    <section id="products" className="surface-dark scroll-mt-20 py-24 px-4">
      <JsonLd
        id="ld-products"
        data={productListLd(
          PRODUCTS.map((p) => ({
            name: p.name,
            description: p.summary,
            sku: p.sku,
            image: absoluteUrl(p.img),
            category: p.env === 'indoor' ? '실내 LED 사이니지' : '옥외 LED 사이니지',
            priceFrom: SKU_PRICE_FROM_KRW[p.sku],
            url: absoluteUrl('/products'),
          })),
        )}
      />
      <div className="mx-auto max-w-6xl">
        {!hideHeader && (
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              설치 장소별 안내
            </p>
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              어디에 설치하고 얼마나 멀리서 보시나요?
            </h2>
            <p className="mt-4 text-zinc-400">
              실내·실외와 주로 보는 거리를 기준으로 알맞은 화면을 찾을 수 있습니다.
              <br className="hidden sm:block" />
              정확한 화소 간격과 밝기, 예상 가격은 카드를 눌러 확인하세요.
            </p>
          </div>
        )}

        <ProductGrid />

        <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-white/10 bg-white/[0.03] p-5 text-xs leading-relaxed text-zinc-400">
          <p className="mb-2 font-semibold text-zinc-200">가격에 포함 / 별도 항목</p>
          <p className="mb-1">
            <span className="text-cyan-300">포함</span> — LED 패널·컨트롤러·전원·프레임·표준 설치 노무
          </p>
          <p className="mb-3">
            <span className="text-amber-300">별도(현장 조건에 따라)</span> — 전기 증설·구조 보강·옥외 광고물 인허가·고소작업·야간 시공·VAT
          </p>
          <p className="text-zinc-500">* {PRICE_DISCLAIMER}</p>
        </div>
      </div>
    </section>
  )
}
