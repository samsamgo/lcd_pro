import { IMAGES } from './imageAssets'
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
  heroImageAlt: string
  heroImageGenerated?: boolean
}

export const INDUSTRIES: Industry[] = [
  {
    slug: 'public-office',
    quoteType: 'public-office',
    nameKo: '관공서·민원실',
    keyword: '관공서·민원실 LED 전광판',
    eyebrow: '시청·구청·주민센터',
    title: '창구 안내부터 시정 공지까지 한 화면에서 관리합니다',
    description:
      '창구 대기번호, 부서·층별 안내, 시정 공지를 한 화면에서 돌립니다. 코앞에서 보는 자리라 실내 정밀형을 씁니다. 화소가 성기면 작은 글자가 뭉치기 때문입니다.',
    pains: [
      '조직 개편으로 부서 이름이 바뀔 때마다 층별 안내 시트지를 새로 뽑아야 한다',
      '창구 운영시간이나 공지가 바뀌면 게시판을 하나하나 돌면서 갈아야 한다',
      '대기 공간은 가까이서 보는데 작은 글자가 읽힐지 가늠이 안 된다',
    ],
    solutions: [
      { title: '변경이 쉬운 민원 안내', desc: '창구명이나 담당 부서가 바뀌면 화면에서 글자만 고치면 됩니다. 시트지를 새로 뽑고 붙이러 다닐 일이 없어집니다.' },
      { title: '가까이 보는 화면', desc: '민원인이 어디쯤에서 화면을 보는지부터 재고, 그 거리에 맞는 글자 크기를 잡습니다. 보통 화소 간격 1.86mm나 2.5mm가 나옵니다.' },
      { title: '담당자 운영 교육', desc: '설치가 끝나면 담당자분께 화면 바꾸는 법을 알려드립니다. 인사이동으로 사람이 바뀌어도 되도록 안내서를 같이 드립니다.' },
    ],
    recommendedSkus: ['P2.5', 'IN-S', 'IN-M'],
    priceHint: '화면 크기와 보는 거리, 설치 조건 확인 후 산출',
    environment: 'indoor',
    heroImage: IMAGES.industry['public-office'],
    heroImageAlt: '한국 공공 민원실 대기 공간 벽면의 대기 순번 안내 화면',
    heroImageGenerated: true,
  },
  {
    slug: 'school',
    quoteType: 'school',
    nameKo: '학교·강당',
    keyword: '학교·강당 LED 전광판',
    eyebrow: '초·중·고등학교·강당',
    title: '매일 달라지는 학교 일정을 제때 알리는 화면',
    description:
      '급식표와 행사 안내, 귀가 시간, 강당 행사 화면을 한 곳에서 돌립니다. 규격은 위치별로 나눠서 잡습니다. 복도에서 보는 화면과 강당 뒷줄, 운동장 건너에서 보는 화면은 필요한 조건이 다릅니다.',
    pains: [
      '급식표나 학사 일정이 바뀌면 교내 게시물을 일일이 다시 뽑아야 한다',
      '비가 오거나 행사가 바뀌어 귀가 시간이 달라지면 안내할 시간이 촉박하다',
      '강당 행사 때마다 현수막이랑 무대 배경을 따로 준비해야 한다',
    ],
    solutions: [
      { title: '학교 일정 화면 구성', desc: '급식표, 행사 일정, 귀가 시간을 각각 화면으로 만들어 두면 그날그날 띄우기만 하면 됩니다.' },
      { title: '강당 행사 활용', desc: '입학식이나 졸업식, 설명회 때 쓰는 제목과 순서 화면도 같은 설비에서 나옵니다. 행사마다 현수막을 따로 뽑지 않아도 됩니다.' },
      { title: '설치 장소별 화면', desc: '교내는 가까이서 보니까 화소 간격 2.5~3mm 실내형이 맞습니다. 운동장이나 외벽은 멀리서 보는 데다 비를 맞으니 옥외형(5mm)으로 가고, 벽이 무게를 견디는지도 같이 봅니다.' },
    ],
    recommendedSkus: ['IN-M', 'P2.5', 'OUT-S'],
    priceHint: '실내·실외 위치와 보는 거리, 화면 크기 확인 후 산출',
    environment: 'indoor',
    heroImage: IMAGES.industry['school'],
    heroImageAlt: '밝은 낮 한국 학교 정문 위에 설치된 등굣길 안전 안내 전자현수막',
    heroImageGenerated: true,
  },
  {
    slug: 'banner',
    quoteType: 'banner',
    nameKo: '전자현수막',
    keyword: '지자체 전자현수막 LED 전광판',
    eyebrow: '지자체 게시대 대체',
    title: '재난 안내와 시정 홍보를 즉시 바꾸는 전자현수막',
    description:
      '현수막 게시대 자리에 옥외 LED 화면을 놓으면 재난 안내나 시정 홍보 문구를 그때그때 바꿀 수 있습니다. 차량과 보행자가 얼마나 떨어져서 보는지, 얼마나 높이 다는지에 맞춰 화소 간격을 정합니다. 옥외광고물 신고도 같이 진행합니다.',
    pains: [
      '긴급 공지가 생겨도 현수막 뽑아서 걸 때까지 시간이 걸린다',
      '기간 끝난 현수막 떼고 새로 거는 일이 계속 반복된다',
      '도로변에서 보는 거리에 맞는 글자 크기와 화소 간격을 정하기가 애매하다',
    ],
    solutions: [
      { title: '긴급 문구 교체', desc: '재난 안내나 계도 문구를 미리 만들어 두시면 필요할 때 바로 띄웁니다. 급할 때 문안부터 짜는 일이 없어집니다.' },
      { title: '멀리서 읽기 쉬운 화면', desc: '차가 지나가면서 보는지 사람이 서서 보는지에 따라 필요한 화소 간격이 달라집니다. 옥외는 보통 5mm, 8mm, 10mm 중에서 정하는데, 멀리서 볼수록 넓게 가도 됩니다.' },
      { title: '신고 절차 지원', desc: '설치하는 지역이 옥외광고물 신고 대상인지 먼저 확인하고, 서류 준비와 접수를 같이 진행합니다.' },
    ],
    recommendedSkus: ['OUT-S', 'OUT-M', 'OUT-L'],
    priceHint: '보는 거리와 구조물·전기·신고 조건 확인 후 산출',
    environment: 'outdoor',
    heroImage: IMAGES.industry['banner'],
    heroImageAlt: '비 오는 저녁 한국 도로 위 전자현수막에 표시된 호우 안전 안내',
    heroImageGenerated: true,
  },
  {
    slug: 'institution',
    quoteType: 'institution',
    nameKo: '공공기관·시설관리',
    keyword: '공공기관 로비·층별 안내 LED 전광판',
    eyebrow: '공기업·도서관·체육시설·보건소',
    title: '방문객이 먼저 찾는 로비와 층별 안내 화면',
    description:
      '도서관, 체육시설, 보건소, 공기업 로비의 종합안내와 층별 안내를 구성합니다. 휴관일이나 프로그램, 진료 안내처럼 자주 바뀌는 건 담당자분이 화면에서 직접 고치시면 됩니다.',
    pains: [
      '휴관일이나 운영시간이 바뀌면 출입구 안내물을 다시 붙여야 한다',
      '접종 일정이나 방문 안내를 로비 여기저기 똑같이 붙여야 한다',
      '조직 개편이 있으면 층별 안내판을 새로 만드는 비용과 시간이 또 든다',
    ],
    solutions: [
      { title: '로비 종합안내', desc: '들어오는 사람이 제일 먼저 궁금해하는 순서대로 배치합니다. 보통 운영시간, 그다음 행사, 그다음 방문 절차입니다.' },
      { title: '층별 안내 갱신', desc: '부서명이나 시설 위치가 바뀌면 화면 내용만 고치면 끝납니다.' },
      { title: '시설별 화면 템플릿', desc: '매번 비슷하게 나가는 공지는 틀을 만들어 두면 날짜만 바꿔서 씁니다.' },
    ],
    recommendedSkus: ['IN-S', 'P2.5', 'IN-M'],
    priceHint: '보는 거리와 설치 위치, 안내 화면 구성 협의 후 산출',
    environment: 'indoor',
    heroImage: IMAGES.industry['institution'],
    heroImageAlt: '한국 공공 도서관 로비 벽면의 세로형 이용·운영시간·시설 안내 화면',
    heroImageGenerated: true,
  },
  {
    slug: 'retail',
    quoteType: 'cafe',
    nameKo: '매장·상업공간',
    keyword: '매장 LED 전광판',
    eyebrow: '카페·식당·헬스장·리테일',
    title: '메뉴와 가격을 화면에서 바로 바꿉니다',
    description:
      '카페·식당 메뉴판, 헬스장 시간표, 매장 프로모션을 한 화면에서 관리합니다. 장비와 시공 절차, A/S 기준은 관공서 현장에 나가는 것과 같습니다.',
    pains: [
      '가격이나 메뉴가 바뀔 때마다 인쇄물을 새로 뽑아야 한다',
      '계절이나 시간대마다 다른 내용을 걸기가 번거롭다',
      '매장이 여러 곳이면 같은 내용을 매장마다 따로 갈아야 한다',
    ],
    solutions: [
      { title: '즉시 교체', desc: '메뉴와 가격은 화면에서 바로 고칩니다. 인쇄하고 붙이는 일이 통째로 없어집니다.' },
      { title: '시간대 편성', desc: '점심과 저녁, 평일과 주말에 다른 화면이 뜨도록 미리 걸어 둘 수 있습니다.' },
      { title: '동일한 A/S 기준', desc: '고장 나면 관공서 현장과 똑같이 모듈만 갈아 끼웁니다.' },
    ],
    recommendedSkus: ['IN-S', 'IN-M', 'P2.5'],
    priceHint: '화면 크기와 보는 거리, 설치 조건 확인 후 산출',
    environment: 'indoor',
    heroImage: IMAGES.industry['retail'],
    heroImageAlt: '음식점 카운터 위에 설치된 디지털 메뉴 화면',
  },
  {
    slug: 'outdoor-ad',
    quoteType: 'outdoor',
    nameKo: '옥외 광고',
    keyword: '옥외 LED 전광판',
    eyebrow: '건물 외벽·도로변',
    title: '직사광선 아래에서도 읽히는 밝기로 설치합니다',
    description:
      '건물 외벽이나 도로변에 거는 대형 화면입니다. 밝기와 방수 등급을 먼저 정하고, 벽이 무게를 견디는지와 옥외광고물 신고 대상인지를 함께 확인합니다.',
    pains: [
      '낮에는 화면이 안 보이고, 밤에는 너무 밝다고 민원이 들어온다',
      '옥외광고물 신고를 해야 하는지, 규격은 어디까지 되는지 알기 어렵다',
      '비바람이랑 온도 변화를 어디까지 견뎌야 하는지 판단이 안 선다',
    ],
    solutions: [
      { title: '주야 밝기 자동 조절', desc: '주변이 밝으면 세게, 어두우면 약하게 자동으로 조절합니다. 밤에 너무 밝다는 민원이 이걸로 대부분 잡힙니다.' },
      { title: '인허가 확인', desc: '그 자리가 신고 대상인지, 규격은 어디까지 되는지 먼저 확인하고 서류도 같이 준비합니다.' },
      { title: '구조·방수 검토', desc: '외벽을 보강해야 하는지, 방수는 어디까지 필요한지 설치 전에 정합니다. 나중에 바꾸면 화면을 다시 떼야 합니다.' },
    ],
    recommendedSkus: ['OUT-S', 'OUT-M', 'OUT-L'],
    priceHint: '보는 거리와 화면 크기, 구조 조건 확인 후 산출',
    environment: 'outdoor',
    heroImage: IMAGES.industry['outdoor-ad'],
    heroImageAlt: '도로변에서 멀리 보이는 대형 옥외 LED 광고 화면',
  },
]

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug)
}
