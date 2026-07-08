import type { Sku } from './pricing'

export interface ProductInfo {
  sku: Sku
  name: string
  tag: string
  env: 'indoor' | 'outdoor'
  pitch: string
  brightness: string
  img: string
  highlights: string[]
  /** 권장 시청 거리 */
  viewingDistance: string
  /** 상세 모달용 한 줄 설명 */
  summary: string
  /** 추천 업종/공간 */
  bestFor: string[]
}

/** 제품 라인업 단일 소스 — ProductSection, 제품 상세 모달, Product JSON-LD 공용 */
export const PRODUCTS: ProductInfo[] = [
  {
    sku: 'IN-S',
    name: '실내 소형 메뉴판',
    tag: '카페·레스토랑 추천',
    env: 'indoor',
    pitch: 'P3',
    brightness: '800 nit',
    img: '/curated/svc-indoor-p3.jpg',
    highlights: ['메뉴 실시간 수정', '고해상도 선명', '저전력'],
    viewingDistance: '3m~',
    summary: '카운터·메뉴 위에 딱 맞는 소형 실내 디스플레이. 메뉴·가격을 화면에서 바로 교체합니다.',
    bestFor: ['카페', '베이커리', '분식·소형 식당'],
  },
  {
    sku: 'IN-M',
    name: '실내 중형 홍보 전광판',
    tag: '병원·학원·헬스장 추천',
    env: 'indoor',
    pitch: 'P3',
    brightness: '1000 nit',
    img: '/curated/gal-restaurant-menu.jpg',
    highlights: ['공지·광고 통합', '영상 재생', '스케줄 관리'],
    viewingDistance: '4m~',
    summary: '대기 공간·벽면 홍보에 적합한 중형 실내 전광판. 공지와 영상 콘텐츠를 한 화면으로.',
    bestFor: ['병원·의원', '학원', '헬스장·필라테스'],
  },
  {
    sku: 'OUT-S',
    name: '옥외 소형 입구 전광판',
    tag: '매장 입구·주차장 추천',
    env: 'outdoor',
    pitch: 'P4',
    brightness: '5000 nit',
    img: '/curated/svc-outdoor-p5.jpg',
    highlights: ['직사광선 가시성', '방수 IP65', '원격 관리'],
    viewingDistance: '5m~',
    summary: '햇빛 아래서도 선명한 고밝기 옥외 소형 전광판. 입구·주차장 안내와 홍보에.',
    bestFor: ['매장 입구', '주차장', '소형 상가'],
  },
  {
    sku: 'OUT-M',
    name: '옥외 중형 광고 전광판',
    tag: '로드사이드·프랜차이즈 추천',
    env: 'outdoor',
    pitch: 'P5',
    brightness: '6000 nit',
    img: '/curated/gal-roadside-billboard.jpg',
    highlights: ['고밝기 광고', '원거리 가시성 30m+', '내구성'],
    viewingDistance: '30m~',
    summary: '도로변·프랜차이즈 매장을 위한 중형 옥외 광고 전광판. 원거리 가시성과 내구성 확보.',
    bestFor: ['로드사이드 매장', '프랜차이즈', '중형 상가'],
  },
  {
    sku: 'OUT-L',
    name: '옥외 대형 빌딩 전광판',
    tag: '건물 외벽·대형 매장 추천',
    env: 'outdoor',
    pitch: 'P6',
    brightness: '7000 nit',
    img: '/curated/gal-metro-videowall.jpg',
    highlights: ['빌딩 파사드', '원거리 50m+', '유지보수 계약'],
    viewingDistance: '50m~',
    summary: '건물 외벽·대형 매장을 위한 대형 옥외 전광판. 파사드 규모 시공과 유지보수 계약까지.',
    bestFor: ['빌딩 외벽', '대형 상업시설', '옥외 광고'],
  },
  {
    sku: 'P2.5',
    name: '고해상도 실내 프리미엄',
    tag: '쇼룸·VIP 공간 추천',
    env: 'indoor',
    pitch: 'P2.5',
    brightness: '1200 nit',
    img: '/curated/svc-indoor-p25.jpg',
    highlights: ['4K급 선명도', '근거리 최적화', '프리미엄 소재'],
    viewingDistance: '2m~',
    summary: '가까이서 봐도 픽셀이 보이지 않는 고해상도 실내 프리미엄 모델. 쇼룸·VIP 공간에.',
    bestFor: ['쇼룸', 'VIP 라운지', '회의실·바'],
  },
]
