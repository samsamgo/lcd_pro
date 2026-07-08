import type { Sku } from './pricing'

export interface Industry {
  slug: string
  /** 견적 위저드 prefill 키 (QuoteWizard PREFILL) */
  quoteType: string
  nameKo: string
  /** 메타 타이틀용 키워드 */
  keyword: string
  eyebrow: string
  title: string
  description: string
  /** 이 업종이 겪는 문제 */
  pains: string[]
  /** 우강테크가 주는 해결 */
  solutions: { title: string; desc: string }[]
  /** 추천 제품 SKU */
  recommendedSkus: Sku[]
  /** 예상 가격대(표시용, pricing 라벨 기반) */
  priceHint: string
  environment: 'indoor' | 'outdoor'
  /** 다크 히어로 배경 이미지 */
  heroImage: string
}

export const INDUSTRIES: Industry[] = [
  {
    slug: 'cafe',
    quoteType: 'cafe',
    nameKo: '카페',
    keyword: '카페 LED 전광판·메뉴판',
    eyebrow: '카페·베이커리',
    title: '카페 LED 전광판, 메뉴 교체가 자유로운 매장으로',
    description:
      '카페·베이커리를 위한 실내 LED 메뉴판·사이니지. 시즌 메뉴·가격 변경을 인쇄 없이 화면에서 즉시 반영하고, 사진 3장으로 예상 범위 견적을 바로 확인하세요.',
    pains: [
      '메뉴·가격 바뀔 때마다 현수막·인쇄물 재제작 비용',
      '계절·이벤트 메뉴를 빠르게 알리기 어려움',
      '작은 매장에 어울리는 크기·해상도 선택이 막막함',
    ],
    solutions: [
      { title: '즉시 메뉴 교체', desc: '화면에서 메뉴·가격·이벤트를 바로 수정. 추가 인쇄비가 들지 않습니다.' },
      { title: '고해상도 실내 화질', desc: '가까이서 봐도 선명한 P2.5~P3 실내 모델로 메뉴 가독성을 확보합니다.' },
      { title: '설치 후 교육', desc: '콘텐츠 교체 방법을 1:1로 알려드려 사장님이 직접 운영할 수 있습니다.' },
    ],
    recommendedSkus: ['IN-S', 'P2.5', 'IN-M'],
    priceHint: '₩200만 ~ ₩350만 (설치비 기준·VAT 별도)',
    environment: 'indoor',
    heroImage: '/curated/gal-restaurant-menu.jpg',
  },
  {
    slug: 'restaurant',
    quoteType: 'restaurant',
    nameKo: '식당·외식',
    keyword: '식당 LED 전광판·메뉴판',
    eyebrow: '식당·외식',
    title: '식당 LED 메뉴판·홍보 전광판, 표준 시공으로 한 번에',
    description:
      '식당·외식 매장을 위한 LED 메뉴판·홍보 사이니지. 메뉴 사진·영상까지 한 화면에서 운영하고, 표준 시공 1~3일로 빠르게 오픈하세요.',
    pains: [
      '메뉴가 많아 인쇄 메뉴판 교체가 번거로움',
      '점심·저녁, 요일별 프로모션을 알리기 어려움',
      '주방·홀 인력이 바빠 콘텐츠 관리가 부담',
    ],
    solutions: [
      { title: '메뉴·영상 통합', desc: '메뉴, 프로모션, 대기번호까지 한 화면으로 통합 운영합니다.' },
      { title: '시간대 스케줄', desc: '점심·저녁 메뉴를 시간대별로 자동 전환할 수 있습니다.' },
      { title: '빠른 표준 시공', desc: '표준 모델 기준 1~3일 시공으로 영업 공백을 최소화합니다.' },
    ],
    recommendedSkus: ['IN-M', 'IN-S', 'OUT-S'],
    priceHint: '₩350만 ~ ₩560만 (설치비 기준·VAT 별도)',
    environment: 'indoor',
    heroImage: '/curated/cap-restaurant.jpg',
  },
  {
    slug: 'gym',
    quoteType: 'gym',
    nameKo: '헬스장·피트니스',
    keyword: '헬스장 LED 전광판',
    eyebrow: '헬스장·피트니스',
    title: '헬스장 LED 전광판, 공지·수업·홍보를 한 화면으로',
    description:
      '헬스장·필라테스·PT 스튜디오를 위한 실내 LED 사이니지. 수업 시간표·공지·이벤트를 한 화면으로 통합하고, 회원 안내를 인쇄물 없이 실시간으로 운영하세요.',
    pains: [
      '수업 시간표·공지가 자주 바뀌어 인쇄물 관리가 번거로움',
      '이벤트·프로모션 홍보를 눈에 띄게 하기 어려움',
      '넓은 공간에서도 잘 보이는 밝기·크기 선택이 어려움',
    ],
    solutions: [
      { title: '시간표·공지 통합', desc: '수업 시간표와 공지를 한 화면에서 실시간으로 갱신합니다.' },
      { title: '넓은 공간 가시성', desc: '중형 실내 모델로 넓은 운동 공간 어디서나 잘 보이게 시공합니다.' },
      { title: '이벤트 즉시 반영', desc: '등록 프로모션·챌린지를 화면에서 바로 홍보합니다.' },
    ],
    recommendedSkus: ['IN-M', 'IN-S'],
    priceHint: '₩350만 ~ ₩470만 (설치비 기준·VAT 별도)',
    environment: 'indoor',
    heroImage: '/curated/svc-indoor-p25.jpg',
  },
  {
    slug: 'franchise',
    quoteType: 'franchise',
    nameKo: '프랜차이즈·다점포',
    keyword: '프랜차이즈 LED 전광판',
    eyebrow: '프랜차이즈·다점포',
    title: '프랜차이즈 LED 사이니지, 여러 매장을 표준화된 방식으로',
    description:
      '프랜차이즈·다점포 운영을 위한 표준화 LED 사이니지. 매장마다 동일한 사양·품질로 시공하고, 수량에 따른 단가 조정과 일괄 운영을 지원합니다.',
    pains: [
      '매장마다 사이니지 사양·품질이 제각각',
      '본사 브랜딩을 여러 매장에 일관되게 적용하기 어려움',
      '다점포 견적·시공·AS를 따로 관리해야 하는 부담',
    ],
    solutions: [
      { title: '표준화 사양', desc: '전 매장을 동일한 표준 모델·시공 방식으로 통일합니다.' },
      { title: '수량 단가 조정', desc: '다점포 수량에 따라 단가를 조정하고 일괄 견적을 제공합니다.' },
      { title: '일괄 운영·AS', desc: '여러 매장의 시공·점검·AS를 표준 프로세스로 관리합니다.' },
    ],
    recommendedSkus: ['IN-M', 'OUT-S', 'OUT-M'],
    priceHint: '수량 협의 (다점포 단가 조정)',
    environment: 'indoor',
    heroImage: '/curated/gal-beauty-storefront.jpg',
  },
  {
    slug: 'outdoor-ad',
    quoteType: 'outdoor',
    nameKo: '옥외 광고',
    keyword: '옥외 LED 전광판·광고',
    eyebrow: '옥외·로드사이드',
    title: '옥외 LED 광고 전광판, 인허가부터 시공·AS까지',
    description:
      '로드사이드·건물 외벽을 위한 고밝기 옥외 LED 전광판. 직사광선에도 선명한 시공과 옥외 광고물 신고 절차, 방수·구조 시공까지 한 번에 처리합니다.',
    pains: [
      '직사광선에 화면이 잘 안 보일까 걱정',
      '옥외 광고물 신고·인허가 절차가 복잡함',
      '비·눈·바람에 견디는 방수·구조 시공이 불안',
    ],
    solutions: [
      { title: '고밝기 옥외 시공', desc: '5,000~7,000nit 고밝기 모델로 직사광선에도 선명하게 시공합니다.' },
      { title: '인허가 대행', desc: '옥외 광고물 신고 절차를 함께 처리해 드립니다.' },
      { title: '방수·구조 시공', desc: 'IP65 방수·방진과 구조 보강을 현장 실측 후 시공합니다.' },
    ],
    recommendedSkus: ['OUT-S', 'OUT-M', 'OUT-L'],
    priceHint: '₩470만 ~ ₩1,050만+ (설치비 기준·VAT 별도)',
    environment: 'outdoor',
    heroImage: '/curated/svc-outdoor-p5.jpg',
  },
]

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug)
}
