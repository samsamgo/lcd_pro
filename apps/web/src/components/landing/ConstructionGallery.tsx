import Image from 'next/image'
import Link from 'next/link'

type GalleryItem = {
  id: string
  title: string
  meta: string
  image: string
}

// Curated images downloaded to /public/curated/. Reuse mapping for Wikimedia rate-limited slots.
const IMG = (file: string) => `/curated/${file}`

const GALLERY: GalleryItem[] = [
  {
    id: 'outdoor-safety-p5',
    title: '옥외 안전전광판',
    meta: 'P5 SMD · 6000 cd/m² · 단독기초',
    image: IMG('gal-safety-site.jpg'),
  },
  {
    id: 'indoor-market-arcade',
    title: '실내 전통시장 아케이드',
    meta: 'P2.97 GOB · 623 cd/m² · 브라켓',
    image: IMG('gal-indoor-market.jpg'),
  },
  {
    id: 'outdoor-parking-large',
    title: '옥외 주차장 미디어보드',
    meta: 'P5 SMD · 옥외 직사광 대응',
    image: IMG('gal-roadside-billboard.jpg'),
  },
  {
    id: 'indoor-flexible-premium',
    title: '실내 고해상도 Flexible',
    meta: 'P1.86 Flexible · 560+ cd/m²',
    image: IMG('gal-led-panel-interactive.png'),
  },
  {
    id: 'indoor-restaurant-p5',
    title: '실내 외식업·소상공인',
    meta: 'P5 SMD · 실내 보정 휘도',
    image: IMG('gal-restaurant-menu.jpg'),
  },
  {
    id: 'indoor-retail-large',
    title: '대형 매장·프랜차이즈 실내',
    meta: '실내 LED + SMPS 인증 자산',
    image: IMG('gal-retail-lobby.jpg'),
  },
  {
    id: 'clinic-aesthetic',
    title: '의료·미용·헬스장',
    meta: '실내 LED + AS 사이클 SOP',
    image: IMG('gal-beauty-storefront.jpg'),
  },
  {
    id: 'kc-certification',
    title: 'KC 적합등록 LED 패널',
    meta: 'P4·P8·P1.56·P5 인증 자산 + EMC',
    image: IMG('svc-certification.jpg'),
  },
  {
    id: 'outdoor-public-p25',
    title: '교육·공공기관 옥외',
    meta: 'P2.5 / P5 · 조달 자격 대응',
    image: IMG('gal-school-sign.jpg'),
  },
  {
    id: 'church-religious',
    title: '교회·종교시설',
    meta: '실내 P2.5 250×250 · 안정 송출',
    image: IMG('gal-church-blueprint.png'),
  },
  {
    id: 'traditional-market',
    title: '전통시장·재래시장',
    meta: '실외 P5 · 시장 활성화 미디어',
    image: IMG('cap-market-arcade.jpg'),
  },
  {
    id: 'cabinet-modular',
    title: '표준화 캐비닛 (F-OUT-P5)',
    meta: '256×256 모듈 × layout matrix',
    image: IMG('svc-cabinet.jpg'),
  },
]

export function ConstructionGallery() {
  return (
    <section className="relative border-t border-zinc-200 bg-zinc-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">
              시공 가능 영역
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              실내·옥외·공공·소상공인 —<br className="sm:hidden" /> 어떤 환경이든 시공할 수 있습니다
            </h2>
            <p className="mt-3 max-w-2xl text-zinc-600">
              옥외 안전전광판부터 실내 카페·식당, 전통시장, 의료·미용, 교육·공공시설까지.
              표준화된 자재와 시공 SOP, 그리고 환경별 실측 데이터로 빠르게 가동합니다.
            </p>
          </div>
          <Link
            href="/services"
            className="rounded-lg border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            전체 서비스 보기 →
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {GALLERY.map((g) => (
            <li
              key={g.id}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
                <Image
                  src={g.image}
                  alt={g.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <div className="text-xs font-semibold text-white">{g.title}</div>
                  <div className="mt-0.5 text-[11px] text-zinc-700">{g.meta}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
