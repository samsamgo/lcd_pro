import { IMAGES } from './imageAssets'
import { PRODUCTS, type ProductInfo } from './products'
import type { Sku } from './pricing'

/**
 * 제품 카테고리 3종 — 네비바·홈·/products·카테고리 페이지가 **전부 이 하나**를 본다.
 *
 * 🔴 2026-09-08 CEO 지적 "네비바로 들어갔는데 이상한 곳으로 연동된다 · 왜 다 다르냐".
 *    원인은 제품 이름 체계가 세 가지였던 것 — 네비바(6개 SKU 이름) · 홈(4개 환경 카드) ·
 *    /products(환경별 트랙). 누른 이름과 도착한 페이지 이름이 달랐다.
 *    이제 **메뉴 이름 = 페이지 제목 = 카드 이름**이고, 그 이름은 여기 `name` 하나뿐이다.
 *    다른 파일에서 카테고리 이름을 손으로 적지 마라.
 *
 * 카테고리는 국내 사이니지 업체가 쓰는 구분 그대로다: 실내용 / 실외용 / 전자현수막.
 * 모델(SKU)은 lib/products.ts 의 6종을 카테고리 아래에 배치한다.
 */
export type CategorySlug = 'indoor' | 'outdoor' | 'banner'

export interface ProductCategory {
  slug: CategorySlug
  /** 메뉴·제목·카드에 그대로 쓰는 이름 */
  name: string
  /** 한 줄 — 어디에 쓰는 물건인가 */
  lead: string
  heroImage: string
  heroImageAlt: string
  /** 이 카테고리에 속한 모델. 순서 = 표시 순서 */
  skus: Sku[]
  /** 쓰이는 자리(lib/industries.ts slug). 카테고리 페이지 하단 사진 카드 */
  uses: string[]
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    slug: 'indoor',
    name: '실내용 LED 전광판',
    lead: '민원실·로비·회의실처럼 가까이서 보는 자리에 씁니다. 화소 간격 P2.5 ~ P3.',
    heroImage: IMAGES.productTracks['indoor-near'],
    heroImageAlt: '실내 민원실 벽면에 설치된 LED 안내 화면',
    skus: ['P2.5', 'IN-S', 'IN-M'],
    uses: ['public-office', 'meeting-room', 'institution', 'school'],
  },
  {
    slug: 'outdoor',
    name: '실외용 LED 전광판',
    lead: '정문·도로변·건물 외벽처럼 햇빛 아래에서 보는 자리에 씁니다. 밝기 5,000nit 이상, IP65.',
    heroImage: IMAGES.productTracks['outdoor-far'],
    heroImageAlt: '건물 외벽에 설치된 대형 옥외 LED 전광판',
    skus: ['OUT-S', 'OUT-M', 'OUT-L'],
    uses: ['outdoor-ad', 'traffic', 'parking', 'institution'],
  },
  {
    slug: 'banner',
    name: '전자현수막',
    lead: '현수막 게시대를 대신하는 옥외 LED 화면입니다. 인쇄·교체 없이 문구를 바꿉니다.',
    heroImage: IMAGES.productTracks['outdoor-near'],
    heroImageAlt: '도로변 게시대에 설치된 전자현수막 LED 화면',
    skus: ['OUT-M', 'OUT-S'],
    uses: ['banner', 'school', 'public-office', 'apartment'],
  },
]

export function getCategory(slug: string): ProductCategory | undefined {
  return PRODUCT_CATEGORIES.find((c) => c.slug === slug)
}

export function categoryProducts(c: ProductCategory): ProductInfo[] {
  return c.skus
    .map((s) => PRODUCTS.find((p) => p.sku === s))
    .filter((p): p is ProductInfo => !!p)
}

/** 모델이 속한 첫 카테고리 (빵부스러기용) */
export function categoryOf(sku: Sku): ProductCategory | undefined {
  return PRODUCT_CATEGORIES.find((c) => c.skus.includes(sku))
}

/** SKU → URL 세그먼트. 'P2.5' → 'p2-5' */
export function skuToSegment(sku: string): string {
  return sku.toLowerCase().replace('.', '-')
}

/** 카테고리 규격 요약 — 손으로 적지 않고 모델 값에서 계산한다 */
export function categorySpecs(c: ProductCategory): { k: string; v: string }[] {
  const items = categoryProducts(c)
  const pitches = items.map((p) => Number(p.pitch.replace('P', ''))).filter((n) => !Number.isNaN(n))
  const nits = items.map((p) => Number(p.brightness.replace(/[^\d]/g, ''))).filter((n) => n > 0)
  const range = (arr: number[], unit: string) =>
    arr.length === 0
      ? '-'
      : Math.min(...arr) === Math.max(...arr)
        ? `${Math.min(...arr).toLocaleString()}${unit}`
        : `${Math.min(...arr).toLocaleString()} ~ ${Math.max(...arr).toLocaleString()}${unit}`
  return [
    { k: '화소 간격', v: range(pitches, 'mm') },
    { k: '밝기', v: range(nits, ' nit') },
    { k: '방진·방수', v: items[0]?.ingress.split(' (')[0] ?? '-' },
    { k: '권장 시청거리', v: items[0]?.viewingDistance ?? '-' },
  ]
}
