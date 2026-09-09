import { IMAGES } from './imageAssets'
import { PRODUCTS, type ProductInfo } from './products'
import type { Sku } from './pricing'
import { FORM_LABEL, modelsByCategory, pitchNumber } from './productModels'

/**
 * 제품 카테고리 — 네비바·홈·/products·카테고리 페이지가 **전부 이 하나**를 본다.
 *
 * 🔴 2026-09-08 CEO 지적 "네비바로 들어갔는데 이상한 곳으로 연동된다 · 왜 다 다르냐".
 *    이제 **메뉴 이름 = 페이지 제목 = 카드 이름**이고, 그 이름은 여기 `name` 하나뿐이다.
 *    다른 파일에서 카테고리 이름을 손으로 적지 마라.
 *
 * 🔴 2026-09-08 CEO 지시 "제품 카테고리를 늘려라" — 3종 → 6종.
 *    국내 사이니지 업체가 쓰는 구분을 따랐다: 실내용 / 실외용 / 전자현수막 / 미디어파사드 /
 *    스포츠 전광판 / 교통·주차 안내. 모델(SKU)은 lib/products.ts 의 6종을 **새 사양을 만들지 않고**
 *    카테고리 아래에 재배치했다 — 같은 모델이 두 카테고리에 속할 수 있다(용도가 다를 뿐 물건은 같다).
 *    ⚠️ 여기 적힌 사양 범위(lead)는 모델 값에서 나온 것만 쓴다. 지어낸 숫자 없음.
 */
export type CategorySlug = 'indoor' | 'outdoor' | 'banner' | 'facade' | 'sports' | 'traffic'

export interface ProductCategory {
  slug: CategorySlug
  /** 메뉴·제목·카드에 그대로 쓰는 이름 */
  name: string
  /** 다크 배너에 크게 얹는 영문 한 단어 (2026-09-09 WS-C) */
  display: string
  /** 한 줄 — 어디에 쓰는 물건인가 */
  lead: string
  /** 화면 크기와 보는 거리로 설명하는 두 줄 (밝기로 설명하지 않는다 — CEO 2026-09-09) */
  sizeLead: string
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
    display: 'INDOOR',
    lead: '민원실·로비·회의실처럼 가까이서 보는 자리.',
    sizeLead:
      '실내는 화면까지의 거리가 1~5m로 짧습니다. 가까울수록 화소 간격을 좁혀야 글자가 뭉치지 않습니다. 벽 폭과 천장 높이가 화면 크기를 먼저 정하고, 그다음 간격을 고릅니다.',
    heroImage: IMAGES.category.indoor,
    heroImageAlt: '민원실 창구 위 가로형 LED 안내 화면에 표시된 민원 안내',
    skus: ['P2.5', 'IN-S', 'IN-M'],
    uses: ['public-office', 'meeting-room', 'institution', 'school'],
  },
  {
    slug: 'outdoor',
    name: '실외용 LED 전광판',
    display: 'OUTDOOR',
    lead: '정문·도로변·건물 외벽처럼 밖에서 보는 자리.',
    sizeLead:
      '실외는 보는 거리가 10~50m로 깁니다. 멀리서 읽을수록 화면을 키우고 화소 간격을 넓힙니다. 글자 높이는 보는 거리의 약 1/200 이 기준입니다 — 30m 밖에서 읽으려면 글자가 최소 15cm 는 되어야 합니다.',
    heroImage: IMAGES.category.outdoor,
    heroImageAlt: '공공 체육시설 외벽에 설치된 대형 옥외 LED 화면',
    skus: ['OUT-S', 'OUT-M', 'OUT-L'],
    uses: ['outdoor-ad', 'institution', 'health-center', 'fire-safety'],
  },
  {
    slug: 'banner',
    name: '전자현수막',
    display: 'BANNER',
    lead: '현수막 게시대를 대신하는 옥외 LED 화면. 인쇄·교체 없이 문구를 바꿉니다.',
    sizeLead:
      '기존 현수막 게시대 규격을 그대로 받는 경우가 많습니다. 게시대 폭과 지주 간격이 화면 크기를 정하고, 차도에서 볼지 인도에서 볼지가 화소 간격을 정합니다.',
    heroImage: IMAGES.category.banner,
    heroImageAlt: '도로변 지주형 전자현수막에 표시된 재난 안전 안내와 시정 소식',
    skus: ['OUT-M', 'OUT-S'],
    uses: ['banner', 'school', 'public-office', 'apartment'],
  },
  {
    slug: 'facade',
    name: '미디어파사드',
    display: 'FACADE',
    lead: '건물 외벽 전체를 화면으로 씁니다. 취부 구조와 야간 광공해 규제를 설계 단계에서 함께 잡습니다.',
    sizeLead:
      '외벽은 보는 거리가 가장 깁니다. 그만큼 화소 간격을 넓게 잡아 면적당 단가를 낮추고, 벽이 견디는 하중과 정비 동선을 화면 크기와 함께 정합니다.',
    heroImage: IMAGES.category.facade,
    heroImageAlt: '야간 도심 건물 외벽 여러 곳에 켜진 대형 LED 화면',
    skus: ['OUT-L', 'OUT-M'],
    uses: ['outdoor-ad', 'institution', 'auditorium'],
  },
  {
    slug: 'sports',
    name: '스포츠 전광판',
    display: 'SPORTS',
    lead: '체육관·경기장. 앞뒤 거리 차가 큰 관람석에서 점수와 영상을 함께 보여줍니다.',
    sizeLead:
      '관람석 맨 앞과 맨 뒤의 거리 차가 큽니다. 가장 먼 좌석에서 점수가 읽히도록 화면 크기를 잡고, 카메라 촬영이 있으면 리프레시가 높은 모델을 씁니다.',
    heroImage: IMAGES.category.sports,
    heroImageAlt: '체육관 벽면의 점수판형 LED 전광판에 표시된 경기 점수와 시간',
    skus: ['IN-M', 'OUT-M', 'OUT-L'],
    uses: ['auditorium', 'school', 'institution'],
  },
  {
    slug: 'traffic',
    name: '교통·주차 안내',
    display: 'TRAFFIC',
    lead: '교차로·진입로·주차장. 차 안에서 읽는 크기로 잡습니다.',
    sizeLead:
      '주행 중에 읽어야 하므로 판단 시간이 2~3초뿐입니다. 접근 거리와 차속으로 필요한 글자 크기가 나오고, 그 글자 크기가 화면 크기를 정합니다.',
    heroImage: IMAGES.category.traffic,
    heroImageAlt: '시설 정문 차단기 옆 LED 안내판에 표시된 출입·차량 안내',
    skus: ['OUT-S', 'OUT-M'],
    uses: ['traffic', 'parking', 'transit', 'apartment'],
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

/** 모델이 속한 첫 카테고리 (빵부스러기·뒤로가기용) */
export function categoryOf(sku: Sku): ProductCategory | undefined {
  return PRODUCT_CATEGORIES.find((c) => c.skus.includes(sku))
}

/** SKU → URL 세그먼트. 'P2.5' → 'p2-5' */
export function skuToSegment(sku: string): string {
  return sku.toLowerCase().replace('.', '-')
}

/**
 * 카테고리 요약 — 4칸.
 *
 * 🔴 2026-09-09 CEO 지시 "밝기로 쓰지 말고 크기로". 밝기 칸을 뺐다.
 *    밝기는 모델 상세의 규격표 안에만 둔다. 여기서는 **간격 · 크기 단위 · 보는 거리 · 구성**
 *    으로 설명한다 — 담당자가 자리를 고를 때 필요한 것은 그 넷이다.
 *    값은 손으로 적지 않고 lib/productModels.ts 의 모델 값에서 계산한다.
 */
export function categorySpecs(c: ProductCategory): { k: string; v: string }[] {
  const models = modelsByCategory(c.slug)
  const ns = models.flatMap((m) => m.pitches.map(pitchNumber)).filter((n) => !Number.isNaN(n))
  const pitch =
    ns.length === 0
      ? '-'
      : Math.min(...ns) === Math.max(...ns)
        ? `P${Math.min(...ns)}`
        : `P${Math.min(...ns)} ~ P${Math.max(...ns)}`
  // 보는 거리 어림값 — 간격 1mm 당 약 1m 부터 글자가 뭉치지 않는다(업계 통용 기준).
  const dist = ns.length === 0 ? '-' : `약 ${Math.min(...ns)}m 부터`
  const forms = Array.from(new Set(models.map((m) => FORM_LABEL[m.form])))
  // 방진·방수 — 모델 규격표에 적힌 IP 등급만 모은다. 없으면 지어내지 않는다.
  const ip = Array.from(
    new Set(
      models.flatMap((m) =>
        m.specRows.flatMap((r) => [...(r.values ?? []), r.single ?? ''].flatMap((v) => v.match(/IP\d{2}/g) ?? [])),
      ),
    ),
  ).sort()
  // 등급이 여러 개면 나열하지 않는다 — 'IP20 / IP40 / IP54 / IP65' 는 읽히지 않는다.
  // 가장 높은 등급 하나만 '~ 까지' 로 쓴다(모델별 정확한 등급은 각 상세 규격표에 있다).
  const ingress =
    ip.length === 0
      ? models.every((m) => m.env === 'indoor')
        ? '실내 전용'
        : '-'
      : ip.length === 1
        ? ip[0]
        : `${ip[ip.length - 1]} 까지`
  return [
    { k: '화소 간격', v: pitch },
    { k: '방진·방수', v: ingress },
    { k: '구성 단위', v: forms.length > 0 ? forms.join(' · ') : '-' },
    { k: '보는 거리(어림)', v: dist },
  ]
}
