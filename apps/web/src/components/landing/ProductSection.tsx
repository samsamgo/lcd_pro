import Image from 'next/image'
import { Building2, Sun } from 'lucide-react'
import { SKU_PRICE_FROM, PRICE_DISCLAIMER } from '@/lib/pricing'

const PRODUCTS = [
  {
    sku: 'IN-S' as const,
    name: '실내 소형 메뉴판',
    tag: '카페·레스토랑 추천',
    env: 'indoor' as const,
    pitch: 'P3',
    brightness: '800 nit',
    img: '/curated/svc-indoor-p3.jpg',
    highlights: ['메뉴 실시간 수정', '고해상도 선명', '저전력'],
  },
  {
    sku: 'IN-M' as const,
    name: '실내 중형 홍보 전광판',
    tag: '병원·학원·헬스장 추천',
    env: 'indoor' as const,
    pitch: 'P3',
    brightness: '1000 nit',
    img: '/curated/gal-restaurant-menu.jpg',
    highlights: ['공지·광고 통합', '영상 재생', '스케줄 관리'],
  },
  {
    sku: 'OUT-S' as const,
    name: '옥외 소형 입구 전광판',
    tag: '매장 입구·주차장 추천',
    env: 'outdoor' as const,
    pitch: 'P4',
    brightness: '5000 nit',
    img: '/curated/svc-outdoor-p5.jpg',
    highlights: ['직사광선 가시성', '방수 IP65', '원격 관리'],
  },
  {
    sku: 'OUT-M' as const,
    name: '옥외 중형 광고 전광판',
    tag: '로드사이드·프랜차이즈 추천',
    env: 'outdoor' as const,
    pitch: 'P5',
    brightness: '6000 nit',
    img: '/curated/gal-roadside-billboard.jpg',
    highlights: ['고밝기 광고', '원거리 가시성 30m+', '내구성'],
  },
  {
    sku: 'OUT-L' as const,
    name: '옥외 대형 빌딩 전광판',
    tag: '건물 외벽·대형 매장 추천',
    env: 'outdoor' as const,
    pitch: 'P6',
    brightness: '7000 nit',
    img: '/curated/gal-metro-videowall.jpg',
    highlights: ['빌딩 파사드', '원거리 50m+', '유지보수 계약'],
  },
  {
    sku: 'P2.5' as const,
    name: '고해상도 실내 프리미엄',
    tag: '쇼룸·VIP 공간 추천',
    env: 'indoor' as const,
    pitch: 'P2.5',
    brightness: '1200 nit',
    img: '/curated/svc-indoor-p25.jpg',
    highlights: ['4K급 선명도', '근거리 최적화', '프리미엄 소재'],
  },
]

export function ProductSection() {
  return (
    <section id="products" className="surface-dark scroll-mt-20 py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
            제품 라인업
          </p>
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            표준화된 6가지 SKU
          </h2>
          <p className="mt-4 text-zinc-400">
            복잡한 스펙 없이 — 공간과 목적에 맞는 제품을 바로 추천합니다.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <div
              key={p.sku}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all hover:-translate-y-0.5 hover:border-cyan-400/40 hover:led-glow"
            >
              {/* 제품 실사 */}
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
              </div>

              <div className="p-6">
                <h3 className="mb-1 font-bold text-white">{p.name}</h3>
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
                    <span className="text-zinc-500">원격 관리</span>
                    <p className="font-medium text-zinc-300">준비중</p>
                  </div>
                </div>

                <ul className="space-y-1">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-xs text-zinc-400">
                      <span className="h-1 w-1 rounded-full bg-cyan-400" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">
          * {PRICE_DISCLAIMER}
        </p>
      </div>
    </section>
  )
}
