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
      '시청·구청·주민센터 민원실에 창구 대기번호, 부서·층별 안내, 시정 공지를 표시합니다. 가까운 거리에서 작은 글자가 또렷하게 보이는 실내 정밀형을 현장에 맞춰 제안합니다.',
    pains: [
      '조직 개편으로 부서 이름이 바뀔 때마다 층별 안내 시트지를 다시 제작해야 함',
      '민원 창구 운영시간과 시정 공지를 여러 게시판에 각각 교체하는 업무',
      '대기 공간의 시청 거리가 짧아 작은 글자 가독성을 판단하기 어려움',
    ],
    solutions: [
      { title: '변경이 쉬운 민원 안내', desc: '창구명과 담당 부서가 바뀌면 화면 내용을 수정합니다. 안내판을 새로 제작할 필요가 없습니다.' },
      { title: '가까이 보는 화면', desc: '민원인의 보는 거리와 글자 크기를 확인해 촘촘한 실내형을 선정합니다. 정확한 화소 간격은 1.86mm 또는 2.5mm입니다.' },
      { title: '담당자 운영 교육', desc: '부서 안내와 공지 화면을 교체하는 방법을 설치 후 담당자에게 안내합니다.' },
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
      '급식표, 행사 안내, 귀가 시간과 강당 행사 화면을 한 곳에서 운영합니다. 가까이 보는 교내 화면과 조금 떨어져 보는 강당 화면, 멀리서 보는 운동장·외벽 화면을 나누어 검토합니다.',
    pains: [
      '급식표와 학사 일정이 바뀔 때 교내 게시물을 일일이 다시 출력해야 함',
      '우천이나 행사 변경으로 귀가 시간이 달라지면 학생과 학부모 안내가 촉박함',
      '강당 행사마다 현수막과 무대 배경을 별도로 준비하는 업무',
    ],
    solutions: [
      { title: '학교 일정 화면 구성', desc: '급식표와 행사 일정, 귀가 시간 안내를 목적별 화면으로 구성합니다.' },
      { title: '강당 행사 활용', desc: '입학식과 졸업식, 설명회에 필요한 제목·순서·안내 화면을 같은 설비에서 운영합니다.' },
      { title: '설치 장소별 화면', desc: '교내는 화소 간격 2.5~3mm의 실내형을 검토합니다. 운동장과 외벽은 멀리서 읽기 쉬운 옥외형(화소 간격 5mm)과 구조 조건을 확인합니다.' },
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
      '현수막 게시대를 옥외 LED 화면으로 전환해 재난 안내, 시정 홍보, 계도 문구를 운영합니다. 차량과 보행자가 보는 거리와 설치 높이에 맞춰 화면의 촘촘함을 정하고 옥외광고물 신고 절차를 지원합니다.',
    pains: [
      '재난이나 긴급 공지가 생겨도 현수막 제작과 게시까지 시간이 걸림',
      '게시 기간이 끝난 현수막을 철거하고 새 현수막을 거는 반복 작업',
      '도로변에서 보는 거리와 설치 높이에 맞는 글자 크기와 화소 간격을 정하기 어려움',
    ],
    solutions: [
      { title: '긴급 문구 교체', desc: '재난 안내와 계도 문구를 화면 콘텐츠로 준비해 필요한 시점에 변경할 수 있습니다.' },
      { title: '멀리서 읽기 쉬운 화면', desc: '차량과 보행자의 보는 거리, 화면 크기를 기준으로 화소 간격 5mm·8mm·10mm 가운데 알맞은 옥외 규격을 정합니다.' },
      { title: '신고 절차 지원', desc: '설치 지역의 옥외광고물 신고 대상과 제출 절차를 확인할 수 있도록 지원합니다.' },
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
      '공기업, 도서관, 체육시설, 보건소의 로비 종합안내와 층별 안내를 구성합니다. 휴관일·프로그램·진료 안내처럼 자주 바뀌는 정보를 담당자가 화면에서 관리할 수 있습니다.',
    pains: [
      '도서관 휴관일과 체육시설 운영시간이 바뀔 때 출입구 안내물을 다시 부착해야 함',
      '보건소 접종 일정과 공기업 방문 안내를 로비 여러 곳에 반복 게시하는 업무',
      '조직 개편 뒤 층별 부서 안내판을 새로 제작해야 하는 비용과 일정',
    ],
    solutions: [
      { title: '로비 종합안내', desc: '운영시간과 행사, 방문 절차를 로비 화면에 보기 쉬운 순서로 배치합니다.' },
      { title: '층별 안내 갱신', desc: '부서명과 시설 위치가 바뀌면 안내 콘텐츠를 수정해 반영합니다.' },
      { title: '시설별 화면 템플릿', desc: '도서관 프로그램, 체육시설 휴관, 보건소 일정 등 반복 공지에 맞는 화면 구성을 준비합니다.' },
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
      '카페·식당의 메뉴판, 헬스장 시간표, 매장 프로모션을 한 화면에서 관리합니다. 관공서 현장과 같은 장비·시공 절차·A/S 기준을 적용합니다.',
    pains: [
      '가격이나 메뉴가 바뀔 때마다 인쇄물을 새로 뽑아야 함',
      '계절·시간대별로 다른 내용을 보여주기 어려움',
      '매장이 여러 곳이면 같은 내용을 각각 교체해야 함',
    ],
    solutions: [
      { title: '즉시 교체', desc: '메뉴와 가격을 화면에서 수정합니다. 인쇄와 부착 작업이 없어집니다.' },
      { title: '시간대 편성', desc: '점심과 저녁, 평일과 주말에 다른 화면을 예약해 둘 수 있습니다.' },
      { title: '동일한 A/S 기준', desc: '공공기관 현장과 같은 모듈 단위 교체 방식으로 대응합니다.' },
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
      '건물 외벽과 도로변 대형 화면입니다. 밝기와 방수 등급, 구조 보강, 옥외광고물 신고까지 함께 확인해 진행합니다.',
    pains: [
      '낮에는 화면이 안 보이고 밤에는 너무 밝다는 민원이 생김',
      '옥외광고물 신고 절차와 허용 규격을 확인하기 어려움',
      '비바람과 온도 변화에 견디는 사양 판단이 어려움',
    ],
    solutions: [
      { title: '주야 밝기 자동 조절', desc: '주변 조도에 맞춰 밝기를 조절해 야간 눈부심 민원을 줄입니다.' },
      { title: '인허가 확인', desc: '설치 위치의 옥외광고물 신고 요건과 허용 규격을 함께 확인합니다.' },
      { title: '구조·방수 검토', desc: '외벽 구조 보강과 방수 등급을 설치 전에 확인해 사양을 정합니다.' },
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
