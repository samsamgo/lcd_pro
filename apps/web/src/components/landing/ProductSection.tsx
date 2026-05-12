import { Building2, Sun } from 'lucide-react'

const PRODUCTS = [
  {
    sku: 'IN-S',
    name: '실내 소형 메뉴판',
    tag: '카페·레스토랑 추천',
    env: 'indoor' as const,
    pitch: 'P3',
    brightness: '800 nit',
    priceFrom: '200만원~',
    cms: '월 29,000원',
    highlights: ['메뉴 실시간 수정', '고해상도 선명', '저전력'],
  },
  {
    sku: 'IN-M',
    name: '실내 중형 홍보 전광판',
    tag: '병원·학원·헬스장 추천',
    env: 'indoor' as const,
    pitch: 'P3',
    brightness: '1000 nit',
    priceFrom: '350만원~',
    cms: '월 49,000원',
    highlights: ['공지·광고 통합', '영상 재생', '스케줄 관리'],
  },
  {
    sku: 'OUT-S',
    name: '옥외 소형 입구 전광판',
    tag: '매장 입구·주차장 추천',
    env: 'outdoor' as const,
    pitch: 'P4',
    brightness: '5000 nit',
    priceFrom: '300만원~',
    cms: '월 49,000원',
    highlights: ['직사광선 가시성', '방수 IP65', '원격 관리'],
  },
  {
    sku: 'OUT-M',
    name: '옥외 중형 광고 전광판',
    tag: '로드사이드·프랜차이즈 추천',
    env: 'outdoor' as const,
    pitch: 'P5',
    brightness: '6000 nit',
    priceFrom: '560만원~',
    cms: '월 79,000원',
    highlights: ['고밝기 광고', '원거리 가시성 30m+', '내구성'],
  },
  {
    sku: 'OUT-L',
    name: '옥외 대형 빌딩 전광판',
    tag: '건물 외벽·대형 매장 추천',
    env: 'outdoor' as const,
    pitch: 'P6',
    brightness: '7000 nit',
    priceFrom: '1,050만원~',
    cms: '월 99,000원',
    highlights: ['빌딩 파사드', '원거리 50m+', '유지보수 계약'],
  },
  {
    sku: 'P2.5',
    name: '고해상도 실내 프리미엄',
    tag: '쇼룸·VIP 공간 추천',
    env: 'indoor' as const,
    pitch: 'P2.5',
    brightness: '1200 nit',
    priceFrom: '500만원~',
    cms: '월 69,000원',
    highlights: ['4K급 선명도', '근거리 최적화', '프리미엄 소재'],
  },
]

export function ProductSection() {
  return (
    <section id="products" className="py-24 px-4 bg-[#050505]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            제품 라인업
          </p>
          <h2 className="text-4xl font-bold sm:text-5xl">
            표준화된 6가지 SKU
          </h2>
          <p className="mt-4 text-zinc-500">
            복잡한 스펙 없이 — 공간과 목적에 맞는 제품을 바로 추천합니다.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <div
              key={p.sku}
              className="glass group rounded-2xl p-6 transition-all hover:border-blue-500/30 hover:bg-white/[0.05]"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10">
                  {p.env === 'indoor' ? (
                    <Building2 size={20} className="text-blue-400" />
                  ) : (
                    <Sun size={20} className="text-orange-400" />
                  )}
                </div>
                <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs font-mono text-zinc-400">
                  {p.sku}
                </span>
              </div>

              <h3 className="mb-1 font-bold text-white">{p.name}</h3>
              <p className="mb-4 text-xs text-blue-400">{p.tag}</p>

              <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-zinc-500">
                <div>
                  <span className="text-zinc-600">피치</span>
                  <p className="font-medium text-zinc-300">{p.pitch}</p>
                </div>
                <div>
                  <span className="text-zinc-600">밝기</span>
                  <p className="font-medium text-zinc-300">{p.brightness}</p>
                </div>
                <div>
                  <span className="text-zinc-600">설치비 기준</span>
                  <p className="font-semibold text-white">{p.priceFrom}</p>
                </div>
                <div>
                  <span className="text-zinc-600">CMS 구독</span>
                  <p className="font-medium text-blue-300">{p.cms}</p>
                </div>
              </div>

              <ul className="space-y-1">
                {p.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="h-1 w-1 rounded-full bg-blue-400" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          * 표시 금액은 기준가이며, 최종 금액은 현장 실사 후 확정됩니다.
        </p>
      </div>
    </section>
  )
}
