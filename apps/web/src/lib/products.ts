import type { Sku } from './pricing'

export interface ProductInfo {
  sku: Sku
  name: string
  tag: string
  env: 'indoor' | 'outdoor'
  pitch: string
  brightness: string
  img: string
  imgAlt: string
  generated?: boolean
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
    name: '민원실 창구 안내판',
    tag: '3m 안팎에서 보는 작은 실내 화면',
    env: 'indoor',
    pitch: 'P3',
    brightness: '800 nit',
    img: '/cases/gen/gen-16.jpg',
    imgAlt: '한국 공공 민원실 대기 공간 벽면의 대기 순번 안내 화면',
    generated: true,
    highlights: ['창구·대기 안내 수정', '작은 글자도 또렷하게 표시', '실내 밝기에 맞춘 화면'],
    viewingDistance: '약 3m 이상',
    summary: '민원실 창구나 접수대 가까이에서 보는 안내판입니다. 대기번호와 창구 안내, 공지 내용을 담당자가 바꿀 수 있습니다.',
    bestFor: ['민원실 창구', '접수대', '소형 로비'],
  },
  {
    sku: 'IN-M',
    name: '로비·대기실 종합 안내판',
    tag: '4m 이상 떨어져 보는 중간 크기 실내 화면',
    env: 'indoor',
    pitch: 'P3',
    brightness: '1000 nit',
    img: '/cases/gen/gen-14.jpg',
    imgAlt: '한국 공공 도서관 로비 벽면의 세로형 이용·운영시간·시설 안내 화면',
    generated: true,
    highlights: ['공지와 일정 한곳에 표시', '안내 영상 재생', '시간대별 화면 예약'],
    viewingDistance: '약 4m 이상',
    summary: '로비와 대기실처럼 조금 떨어져서 보는 안내판입니다. 시설 안내와 일정, 홍보 영상을 한 화면에서 운영합니다.',
    bestFor: ['기관 로비', '학교 복도', '병원 대기실'],
  },
  {
    sku: 'OUT-S',
    name: '정문·주차장 안내판',
    tag: '5m 이상 떨어져 보는 작은 옥외 화면',
    env: 'outdoor',
    pitch: 'P4',
    brightness: '5000 nit',
    img: '/cases/gen/gen-15.jpg',
    imgAlt: '비 오는 저녁 한국 공공시설 진입로의 기둥형 호우 주의 LED 안내 화면',
    generated: true,
    highlights: ['햇빛 아래에서도 읽기 쉬움', '비와 먼지에 견디는 구조', '안내 내용 원격 변경'],
    viewingDistance: '약 5m 이상',
    summary: '건물 밖 정문이나 주차장에서 보는 안내판입니다. 방문 안내와 주차 정보, 긴급 공지를 햇빛 아래에서도 읽기 쉽게 표시합니다.',
    bestFor: ['기관 정문', '주차장', '학교 출입구'],
  },
  {
    sku: 'OUT-M',
    name: '도로변·현수막 게시대 화면',
    tag: '약 30m 거리에서 보는 중간 크기 옥외 화면',
    env: 'outdoor',
    pitch: 'P5',
    brightness: '6000 nit',
    img: '/cases/gen/gen-11.jpg',
    imgAlt: '비 오는 저녁 한국 도로 위 전자현수막에 표시된 호우 안전 안내',
    generated: true,
    highlights: ['낮에도 읽기 쉬운 밝기', '약 30m 거리에서 내용 확인', '옥외 환경에 맞춘 내구성'],
    viewingDistance: '약 30m 이상',
    summary: '도로변이나 전자현수막 게시대처럼 멀리서 보는 안내 화면입니다. 차량과 보행자의 이동 거리, 설치 높이를 확인해 글자 크기를 정합니다.',
    bestFor: ['전자현수막 게시대', '도로변 안내', '공공시설 외부'],
  },
  {
    sku: 'OUT-L',
    name: '건물 외벽 대형 안내판',
    tag: '약 50m 이상 거리에서 보는 큰 옥외 화면',
    env: 'outdoor',
    pitch: 'P6',
    brightness: '7000 nit',
    img: '/cases/gen/gen-10.jpg',
    imgAlt: '한국 공공 체육시설 외벽에 설치된 대형 옥외 LED 안내 화면',
    generated: true,
    highlights: ['넓은 외벽에 맞춘 시공', '약 50m 이상 거리에서 내용 확인', '점검·유지보수 계획 제공'],
    viewingDistance: '약 50m 이상',
    summary: '건물 외벽과 넓은 부지에서 멀리 보는 대형 화면입니다. 구조 안전과 야간 밝기, 유지보수 동선을 현장 조건에 맞춰 검토합니다.',
    bestFor: ['청사 외벽', '체육시설', '넓은 옥외 광장'],
  },
  {
    sku: 'P2.5',
    name: '가까이 보는 정밀 안내판',
    tag: '약 2m 거리에서 글자와 도표를 보는 실내 화면',
    env: 'indoor',
    pitch: 'P2.5',
    brightness: '1200 nit',
    img: '/cases/gen/gen-1.jpg',
    imgAlt: '한국 공공 민원실 창구 상단에서 대기번호와 작은 창구명을 표시하는 정밀 안내 화면',
    generated: true,
    highlights: ['가까운 거리에서도 또렷한 글자', '도표와 세부 이미지 표현', '회의 자료와 안내 영상 재생'],
    viewingDistance: '약 2m 이상',
    summary: '민원실과 회의실처럼 화면을 가까이에서 보는 자리에 맞춘 정밀형입니다. 작은 글자와 도표가 많은 안내 자료에 적합합니다.',
    bestFor: ['민원실', '회의실', '종합상황실'],
  },
]
