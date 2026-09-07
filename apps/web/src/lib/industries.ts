import { IMAGES } from './imageAssets'
import type { Sku } from './pricing'

/**
 * 카드 묶음. 15장을 한 줄로 늘어놓으면 훑기가 어렵다.
 *
 * ⚠️ 각 묶음의 항목 수를 3의 배수로 맞춰 둔다.
 *    카드 그리드가 lg에서 3열이라, 나머지가 생기면 마지막 줄에 빈 칸이 남고
 *    그 빈 칸이 "화면 하나가 통째로 비었다"로 읽힌다(2026-09-07 COO 실물 확인).
 *    `IndustryGrid` 가 첫 카드 span 으로 한 번 더 보정하지만, 데이터 쪽에서
 *    미리 맞춰 두는 편이 안전하다.
 */
export type IndustryGroup = 'public' | 'edu' | 'traffic' | 'living'

export const INDUSTRY_GROUPS: { key: IndustryGroup; label: string }[] = [
  { key: 'public', label: '관공서·공공기관' },
  { key: 'edu', label: '학교·교육시설' },
  { key: 'traffic', label: '도로·교통·주차' },
  { key: 'living', label: '생활·상업' },
]

export interface Industry {
  slug: string
  /** 견적 위저드 prefill 키 (QuoteWizard PREFILL) */
  quoteType: string
  /** 카드 필터 묶음 */
  group: IndustryGroup
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
    group: 'public',
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
    group: 'edu',
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
    group: 'public',
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
    group: 'public',
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
    group: 'living',
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
    group: 'living',
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

  /* ────────────────────────────────────────────────────────────
     2026-09-07 확충 9건.

     🔴 원칙 — 여기 적는 것은 "우리가 어디에 납품했다"가 아니라
        "이런 자리에는 이런 구성이 들어간다"이다.
        기관명·건수·시공일자는 한 줄도 적지 않는다. 실적이 생기면 그때 별도로 싣는다.
        사진도 마찬가지다. 전부 `imageAssets.ts` 에 실재하는 파일만 참조한다.
     ──────────────────────────────────────────────────────────── */

  {
    slug: 'health-center',
    quoteType: 'health-center',
    group: 'public',
    nameKo: '보건소·병원',
    keyword: '보건소·병원 LED 전광판',
    eyebrow: '보건소·의료원·병원',
    title: '접종과 진료 일정을 출입구에서 먼저 알립니다',
    description:
      '출입구 캐노피에 거는 옥외형이 기본입니다. 접종 일정, 진료 시간, 휴진 안내처럼 자주 바뀌고 헛걸음을 만드는 정보를 건물에 들어오기 전에 읽게 하는 자리입니다. 대기실 순번 안내가 함께 필요하면 실내 정밀형을 따로 잡습니다.',
    pains: [
      '접종이나 검진 일정이 바뀔 때마다 출입구 배너를 새로 뽑아 건다',
      '휴진·단축 진료를 모르고 온 방문객이 창구에서 다시 묻는다',
      '출입구는 비를 맞고 햇빛을 정면으로 받아 실내용 화면으로는 낮에 안 보인다',
    ],
    solutions: [
      { title: '출입구 옥외형', desc: '캐노피나 현관 상단은 비를 맞고 낮에 햇빛을 받습니다. 방수 등급과 밝기를 먼저 정하고, 5m 안팎에서 읽히는 글자 크기로 잡습니다.' },
      { title: '자주 바뀌는 안내부터', desc: '접종 일정, 진료 시간, 휴진처럼 헛걸음을 만드는 내용을 미리 화면으로 만들어 두면 그날그날 바꿔 띄우기만 하면 됩니다.' },
      { title: '대기실은 따로 본다', desc: '대기실 순번·창구 안내는 코앞에서 보는 자리라 실내 정밀형(2.5mm 안팎)이 맞습니다. 출입구와 같은 규격으로 묶으면 둘 중 하나가 어긋납니다.' },
    ],
    recommendedSkus: ['OUT-S', 'OUT-M', 'P2.5'],
    priceHint: '출입구 구조와 보는 거리, 실내 병행 여부 확인 후 산출',
    environment: 'outdoor',
    heroImage: IMAGES.industry['health-center'],
    heroImageAlt: '비 내리는 날 한국 보건소 현관 상단에 설치된 예방접종 안내 LED 화면',
    heroImageGenerated: true,
  },
  {
    slug: 'fire-safety',
    quoteType: 'fire-safety',
    group: 'public',
    nameKo: '소방·안전시설',
    keyword: '소방서·안전시설 LED 전광판',
    eyebrow: '소방서·안전센터·안전 계도',
    title: '계절과 상황에 따라 바뀌는 안전 문구를 바로 겁니다',
    description:
      '화재 예방 기간, 산불 조심 기간, 폭염·한파 주의처럼 안전 문구는 시기마다 통째로 바뀝니다. 차고 상단이나 청사 외벽에 옥외형을 걸고, 상황이 생기면 그 자리에서 문구를 갈아 끼웁니다.',
    pains: [
      '캠페인 기간마다 현수막을 새로 제작해 걸고 기간이 끝나면 떼어야 한다',
      '경보가 발령돼도 게시물이 바뀌기까지 시간이 걸린다',
      '차량 출입구 위라 사다리차 없이는 손을 대기 어렵다',
    ],
    solutions: [
      { title: '상황별 문구 사전 등록', desc: '화재 예방, 산불, 폭염, 한파 문구를 미리 만들어 두면 상황이 생겼을 때 고르기만 하면 됩니다.' },
      { title: '차량 동선에 맞춘 크기', desc: '차고 앞은 차가 지나가며 보는 자리입니다. 서서 읽는 자리보다 글자를 키우고 화소 간격을 넓게 갑니다.' },
      { title: '전면 정비 구조', desc: '차량 출입구 위처럼 뒤로 못 들어가는 자리는 앞에서 모듈을 빼는 구조로 갑니다. 나중에 바꾸려면 화면을 통째로 떼야 합니다.' },
    ],
    recommendedSkus: ['OUT-S', 'OUT-M'],
    priceHint: '설치 높이와 차량 동선, 전면 정비 여부 확인 후 산출',
    environment: 'outdoor',
    heroImage: IMAGES.industry['fire-safety'],
    heroImageAlt: '한국 소방 관련 시설 차고 출입구 상단에 설치된 화재 예방 점검 안내 LED 화면',
    heroImageGenerated: true,
  },
  {
    slug: 'meeting-room',
    quoteType: 'meeting-room',
    group: 'public',
    nameKo: '회의실·대회의실',
    keyword: '회의실 LED 스크린',
    eyebrow: '청사 대회의실·상황실',
    title: '표와 작은 글자가 뭉치지 않는 회의용 화면',
    description:
      '업무보고 자료나 도표를 띄우는 자리입니다. 회의 자료는 글자가 작고 표가 많아서 화소가 성기면 첫 줄부터 읽히지 않습니다. 앞자리에서 2m 안팎으로 보기 때문에 실내 정밀형을 씁니다.',
    pains: [
      '프로젝터는 불을 꺼야 보이는데 회의는 자료를 보며 받아 적어야 한다',
      '램프 수명이 다하면 회의 직전에 화면이 어두워진다',
      '표와 작은 숫자가 많은 자료라 뒷자리에서 읽히는지 가늠이 안 된다',
    ],
    solutions: [
      { title: '조명을 켠 채로', desc: 'LED는 자체 발광이라 실내등을 켜 둔 채로 봅니다. 자료를 보며 필기하는 회의에 프로젝터보다 맞습니다.' },
      { title: '앞줄 기준 화소 간격', desc: '가장 가까운 좌석에서 화면까지 거리를 재고 그 거리에 맞춥니다. 회의실은 보통 2.5mm 이하가 나옵니다.' },
      { title: '입력 계통 정리', desc: '노트북·화상회의·문서 카메라 중 무엇을 몇 개 물릴지 먼저 정합니다. 나중에 추가하면 배선을 다시 뜯습니다.' },
    ],
    recommendedSkus: ['P2.5', 'IN-S', 'IN-M'],
    priceHint: '좌석 배치와 앞줄 거리, 입력 계통 확인 후 산출',
    environment: 'indoor',
    heroImage: IMAGES.industry['meeting-room'],
    heroImageAlt: '한국 공공기관 대회의실 정면에 설치된 업무보고 자료 표시용 대형 실내 화면',
    heroImageGenerated: true,
  },

  {
    slug: 'auditorium',
    quoteType: 'auditorium',
    group: 'edu',
    nameKo: '강당·다목적홀',
    keyword: '강당·다목적홀 LED 스크린',
    eyebrow: '학교 강당·시민회관·소극장',
    title: '행사마다 현수막을 새로 뽑지 않는 무대 배경',
    description:
      '무대 뒤 배경을 화면으로 바꾸면 행사 제목과 순서, 영상이 같은 설비에서 나옵니다. 뒷줄까지 거리가 길어 화소 간격은 앞줄이 아니라 화면 크기와 객석 깊이로 정합니다.',
    pains: [
      '입학식·졸업식·발표회마다 무대 현수막을 새로 제작한다',
      '행사 순서가 바뀌면 이미 뽑은 인쇄물을 다시 만들어야 한다',
      '무대 조명이 세서 화면이 씻겨 보이지 않을지 걱정된다',
    ],
    solutions: [
      { title: '행사 서식 재사용', desc: '제목·순서·자막 틀을 만들어 두면 행사마다 문구만 갈아 씁니다. 현수막 제작비가 행사 수만큼 사라집니다.' },
      { title: '객석 깊이 기준', desc: '앞줄과 뒷줄 거리를 함께 재고, 화면 크기와 화소 간격을 그 사이에서 맞춥니다. 강당은 3mm 안팎이 흔합니다.' },
      { title: '무대 조명 고려', desc: '무대 조명이 화면을 정면으로 때리면 대비가 떨어집니다. 조명 각도와 화면 밝기를 설치 전에 함께 봅니다.' },
    ],
    recommendedSkus: ['IN-M', 'IN-S', 'P2.5'],
    priceHint: '무대 폭과 객석 깊이, 조명 조건 확인 후 산출',
    environment: 'indoor',
    heroImage: IMAGES.industry['auditorium'],
    heroImageAlt: '한국 학교 강당 무대 뒤편에 설치된 행사 안내용 대형 실내 LED 스크린',
    heroImageGenerated: true,
  },
  {
    slug: 'daycare',
    quoteType: 'daycare',
    group: 'edu',
    nameKo: '어린이집·유치원',
    keyword: '어린이집·유치원 LED 안내 화면',
    eyebrow: '어린이집·유치원·돌봄시설',
    title: '식단과 알림장을 현관에서 바로 확인하게 합니다',
    description:
      '현관과 복도는 보호자가 아이를 데리러 와서 잠깐 서는 자리입니다. 그날 식단, 알림장 확인, 활동 안내처럼 매일 바뀌는 내용을 인쇄물 대신 화면으로 돌립니다. 눈높이에서 1~2m 거리로 보기 때문에 정밀형이 필요합니다.',
    pains: [
      '식단표와 알림장을 매일 뽑아 붙이고 떼기를 반복한다',
      '하원 시간에 보호자가 몰리면 게시물 앞이 막힌다',
      '아이 손이 닿는 높이라 인쇄물이 자주 뜯긴다',
    ],
    solutions: [
      { title: '매일 바뀌는 것부터', desc: '식단, 알림, 활동 안내를 화면 서식으로 만들어 두면 내용만 갈아 끼웁니다. 매일 뽑아 붙일 일이 없어집니다.' },
      { title: '눈높이 정밀형', desc: '1~2m 앞에서 보는 자리라 화소 간격이 성기면 글자가 뭉칩니다. 2.5mm 이하로 잡습니다.' },
      { title: '아이 동선 고려', desc: '손이 닿는 높이면 모서리 마감과 설치 높이를 함께 봅니다. 화면 자체보다 여기서 문제가 생깁니다.' },
    ],
    recommendedSkus: ['P2.5', 'IN-S'],
    priceHint: '설치 높이와 보는 거리, 화면 크기 확인 후 산출',
    environment: 'indoor',
    heroImage: IMAGES.industry['daycare'],
    heroImageAlt: '한국 어린이집 복도 벽면에 설치된 오늘의 식단과 알림장 안내 화면',
    heroImageGenerated: true,
  },

  {
    slug: 'traffic',
    quoteType: 'traffic',
    group: 'traffic',
    nameKo: '도로·교차로 안내',
    keyword: '도로 전광표지 교통정보 LED 전광판',
    eyebrow: '교차로·진입로·마을 도로',
    title: '재난 문구와 통제 안내를 도로 위에서 즉시 바꿉니다',
    description:
      '교차로나 진입로에 지주를 세워 거는 옥외형입니다. 재난 대피 안내, 통제 구간, 서행 요청처럼 시각을 다투는 문구를 그 자리에서 바꿉니다. 차량이 지나가면서 읽기 때문에 글자 수와 노출 시간을 함께 계산합니다.',
    pains: [
      '통제나 훈련 안내를 세우려면 표지판을 따로 제작해 세워야 한다',
      '차가 지나가는 몇 초 안에 읽히는 글자 수를 가늠하기 어렵다',
      '지주를 세우려면 기초를 다시 파야 하는지, 전기를 어디서 끌지 모르겠다',
    ],
    solutions: [
      { title: '주행 속도 기준 문안', desc: '제한 속도와 화면까지 거리로 읽히는 글자 수를 계산합니다. 한 화면에 넣는 글자를 줄이는 게 크기를 키우는 것보다 효과가 큽니다.' },
      { title: '지주·기초 검토', desc: '기존 지주를 쓸 수 있는지, 기초를 새로 잡아야 하는지에 따라 금액이 크게 갈립니다. 풍하중은 설치 높이와 화면 면적으로 봅니다.' },
      { title: '야간 밝기 자동 조절', desc: '도로변은 밤에 너무 밝다는 민원이 나오는 자리입니다. 주변 밝기에 따라 자동으로 낮춥니다.' },
    ],
    recommendedSkus: ['OUT-M', 'OUT-S', 'OUT-L'],
    priceHint: '지주·기초 조건과 전기 인입, 보는 거리 확인 후 산출',
    environment: 'outdoor',
    heroImage: IMAGES.industry['traffic'],
    heroImageAlt: '한국 교차로 인도 옆에 세워진 지주형 옥외 LED 표지가 재난대피 훈련 안내를 표시하고 있다',
    heroImageGenerated: true,
  },
  {
    slug: 'parking',
    quoteType: 'parking',
    group: 'traffic',
    nameKo: '주차장·주차 유도',
    keyword: '주차장 만차 표시 LED 전광판',
    eyebrow: '공영주차장·청사 주차장',
    title: '남은 자리를 진입 전에 보여 줍니다',
    description:
      '진입로 앞에서 주차 가능 대수를 표시합니다. 만차를 모르고 들어온 차가 안에서 돌면 출입구가 막힙니다. 숫자가 실시간으로 바뀌어야 하므로 주차 관제 설비에서 값을 받아오는 연동을 먼저 확인합니다.',
    pains: [
      '만차인 줄 모르고 들어온 차가 안에서 돌다가 출입구를 막는다',
      '주차 관리원이 진입로에서 손으로 안내해야 한다',
      '기존 주차 관제 장비와 숫자를 주고받을 수 있는지 모르겠다',
    ],
    solutions: [
      { title: '관제 연동 확인이 먼저', desc: '기존 주차 관제 설비가 대수를 내보낼 수 있는지, 어떤 형식인지부터 확인합니다. 연동이 안 되면 화면만 달아도 숫자가 안 바뀝니다.' },
      { title: '진입 판단 거리', desc: '운전자가 들어갈지 말지 정하는 지점에서 읽혀야 의미가 있습니다. 진입로 앞 어디에 다는지가 크기보다 중요합니다.' },
      { title: '차량 높이 회피', desc: '진입로 상단은 차량 높이 제한과 겹칩니다. 설치 높이를 먼저 확인하고 캐비닛 두께를 정합니다.' },
    ],
    recommendedSkus: ['OUT-S', 'OUT-M'],
    priceHint: '관제 설비 연동 방식과 설치 위치 확인 후 산출',
    environment: 'outdoor',
    heroImage: IMAGES.industry['parking'],
    heroImageAlt: '한국 주차장 진입로 기둥에 설치된 주차 가능 대수 표시 LED 화면',
    heroImageGenerated: true,
  },
  {
    slug: 'transit',
    quoteType: 'transit',
    group: 'traffic',
    nameKo: '터미널·정류장',
    keyword: '터미널·정류장 안내 LED 전광판',
    eyebrow: '버스터미널·정류장·환승장',
    title: '막차와 배차를 승강장에서 바로 읽게 합니다',
    description:
      '승강장은 지붕 아래여도 바람과 습기가 그대로 들어옵니다. 준옥외 기준으로 방수·방진을 잡고, 시간과 노선처럼 계속 바뀌는 값을 표시합니다. 승객이 서서 5m 안팎에서 보는 자리입니다.',
    pains: [
      '배차나 막차 시간이 바뀌면 인쇄된 시간표를 다시 붙여야 한다',
      '지붕이 있어도 비바람과 습기가 들이쳐 실내용 장비가 버티지 못한다',
      '야간에는 화면이 너무 밝고 낮에는 반사돼 읽기 어렵다',
    ],
    solutions: [
      { title: '준옥외 기준', desc: '지붕 아래라도 습기와 먼지가 들어옵니다. 실내형이 아니라 옥외 기준으로 방수·방진 등급을 잡습니다.' },
      { title: '변하는 값 표시', desc: '막차 시각, 배차 간격, 노선 변경처럼 자주 바뀌는 값 위주로 화면을 구성합니다.' },
      { title: '시간대 밝기', desc: '낮에는 반사를 이기는 밝기가 필요하고 밤에는 낮춰야 합니다. 자동 조절을 기본으로 넣습니다.' },
    ],
    recommendedSkus: ['OUT-S', 'OUT-M'],
    priceHint: '승강장 구조와 보는 거리, 전기·통신 인입 확인 후 산출',
    environment: 'outdoor',
    heroImage: IMAGES.industry['transit'],
    heroImageAlt: '해질 무렵 한국 버스터미널 승강장에 설치된 막차 출발 시각 안내 LED 화면',
    heroImageGenerated: true,
  },

  {
    slug: 'apartment',
    quoteType: 'apartment',
    group: 'living',
    nameKo: '아파트·공동주택',
    keyword: '아파트 공동주택 LED 안내 게시판',
    eyebrow: '단지 입구·보행로·커뮤니티',
    title: '단지 공지와 보행 안전 문구를 입주민 동선에 겁니다',
    description:
      '단지 입구나 보행로에 세로형 지주를 세웁니다. 관리비 고지, 공사 안내, 보행 안전 문구처럼 게시판에 붙이던 내용을 화면으로 돌립니다. 입주민이 걸어서 지나가는 자리라 세로형이 잘 맞습니다.',
    pains: [
      '공지를 붙여도 엘리베이터 게시판까지 가야 읽는다',
      '공사나 단수 안내가 급하게 생기면 붙이러 동마다 돌아야 한다',
      '단지 미관 때문에 큰 가로형 간판을 세우기 어렵다',
    ],
    solutions: [
      { title: '보행 동선 세로형', desc: '걸어서 지나가는 자리는 세로형이 시야에 잘 걸립니다. 폭을 줄여 미관 부담도 낮춥니다.' },
      { title: '급한 공지 즉시 반영', desc: '단수·정전·공사 안내를 관리사무소에서 바로 바꿔 띄웁니다. 동마다 붙이러 다닐 일이 없어집니다.' },
      { title: '야간 밝기 제한', desc: '주거지라 밤에 밝으면 바로 민원이 됩니다. 시간대별 밝기 상한을 설정에 넣어 둡니다.' },
    ],
    recommendedSkus: ['OUT-S', 'OUT-M'],
    priceHint: '지주 위치와 전기 인입, 야간 밝기 조건 확인 후 산출',
    environment: 'outdoor',
    heroImage: IMAGES.industry['apartment'],
    heroImageAlt: '한국 아파트 단지 보행로에 세워진 세로형 LED 지주가 보행 안전 문구를 표시하고 있다',
    heroImageGenerated: true,
  },
]

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug)
}
