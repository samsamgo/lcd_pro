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

/* ══════════════════════════════════════════════════════════════════════
   설치사례 갤러리 사진

   🔴 왜 여기에 경로가 있나 —
      원칙은 `imageAssets.ts` 레지스트리 한 곳에서만 배정하는 것이다(§0-3).
      아래 파일들은 그 레지스트리에 **아직 한 자리도 배정되지 않은 미사용 컷**이고,
      2026-09-09 재설계 분업에서 `imageAssets.ts` 는 다른 작업자 소유라 손대지 않았다.
      그래서 배정을 이 파일에 두되, 레지스트리와 **겹치지 않는 것**을 조건으로 골랐다.
      (imageAssets 의 중복 검사 배열과 교집합 0 — 검사에 걸리지 않는다)
      → 분업이 끝나면 이 표는 `imageAssets.ts` 로 옮긴다.

   🔴 고르는 방법 — 파일명으로 고르지 않는다. 2026-09-09 에 15장을 **한 장씩 열어**
      화면 문구가 한국어인지, 배경이 국내인지, 주제가 그 자리와 맞는지 보고 배정했다.
      A~J 시리즈 예비컷(B1·B5·B7 등)은 열어 보니 화면 문구가 영문이라 전부 뺐다.

   🔴 2026-09-09 CEO 지시 — "시공사례 사진 클릭해 보면 대표 사진 외에 이상한 사진이
      한두 개씩 들어가 있다. 이런 거 넣을 바에는 그냥 빼는 게 좋다."
      → 갤러리에 남기는 것은 **대표 사진 1장 + 같은 자리의 실제 설치 장면 0~2장**뿐이다.
      뺀 것: 부품·공정 근접컷(캐비닛 내부 전원부·후면 커넥터·모서리 마감·잠금 구조·
      흡착 모듈 탈착·픽셀 매크로·검사 라인·도면 협의·콘텐츠 편집 화면),
      그리고 대표 사진과 자리 성격이 다른 컷(전자현수막 항목의 강변 광장 대형 화면,
      도서관 출입구 항목의 야간 사옥 로비·아트리움 세로컷, 옥외광고 항목의 젖은 보도 세로컷).
      **되살리지 마라.** 파일 자체는 `public/` 에 그대로 있고 이 표에서만 뺐다.

   🔴 이 사진들은 **우리 시공 사진이 아니다.** 기관명·연도·건수를 붙이지 않는다.
      "이런 자리에는 이런 구성이 들어간다"를 보여주는 장면 사진으로만 쓴다.
   ══════════════════════════════════════════════════════════════════════ */
const G = (n: string) => `/cases/gen/${n}.jpg`
/** `imageAssets.spare` 의 축소본(720px)을 원본(1536px)으로 되돌린다 — 모달 큰 사진용 */
const K = (n: string) => `/wk/${n}.jpg`

/** 한 장이 두 자리에 배정되지 않았는지 개발 중에 확인한다 */
const GALLERY = {
  /** 고등학교 정문 캐노피 청색 전광판 '신입생 환영', 겨울 */
  schoolWinterGate: K('K10_highschool-entrance-winter'),
  /** 안개 낀 시골 학교 정문 가로형 '등교 시간 안내' */
  schoolRuralGate: K('K14_rural-school-gate-misty'),
  /** 학교 강당 무대 현수막형 화면 '학부모 공개수업' + 접이식 의자 객석 */
  auditoriumSchoolStage: K('K11_school-auditorium-fluorescent'),
  /** 소극장 무대 대형 화면 '문화 강좌 발표회', 붉은 객석 */
  auditoriumTheater: K('K25_local-theater-rehearsal-light'),
  /** 야간 지방도 지주형 전광표지 '결빙주의 서행', 노면 결빙 */
  roadIceWarning: K('K20_snow-road-night-warning'),
  /** 저녁 지방 도심 도로변 지주형(단독 기둥) 옥외 화면 */
  roadsidePylonDusk: G('gen-54'),

  /** 공동주택 커뮤니티 라운지 벽면 '생활 안내 / 공용시설 이용 시간 09:00~21:00' */
  apartmentLounge: G('gen-30'),
  /** 대회의실 벽면 프레임에 캐비닛을 절반쯤 채워 넣은 시공 중 장면 */
  meetingRoomInstall: G('gen-43'),
} as const

if (process.env.NODE_ENV !== 'production') {
  const seen = new Set<string>()
  const dup = Object.values(GALLERY).filter((p) => (seen.has(p) ? true : (seen.add(p), false)))
  // eslint-disable-next-line no-console
  if (dup.length) console.warn('[industries] 갤러리 사진이 두 자리에 배정됐다:', dup)
}

/* ══════════════════════════════════════════════════════════════════════
   구축정보 — 케이시스 설치사례 상세의 "구축정보" 표에 해당한다.

   🔴 표에 넣지 않는 것: 수요처(기관명) · 구축 연도 · 구축 수량.
      우리에게 그 실적이 없다. 없는 행은 값을 비우는 게 아니라 **행 자체를 두지 않는다**.

   🔴 화면 크기·해상도는 실적 수치가 아니라 **계산값**이다.
      표준 캐비닛 640 × 480 mm 를 cols × rows 로 배열했을 때의 값이고,
      해상도는 (변 길이 ÷ 화소 간격) 을 반올림한 것이다. 화면에는 "예시 규격" 으로 적는다.
      계산식은 `buildSpecRows()` 한 곳에만 있다 — 데이터에는 피치와 캐비닛 배열만 둔다.
   ══════════════════════════════════════════════════════════════════════ */
/** 표준 캐비닛 치수(mm). 견적엔진의 표준블록과 같은 값이다 */
export const CABINET_MM = { w: 640, h: 480 } as const

export interface BuildInfo {
  /** 권장 화소 간격(mm) */
  pitchMm: number
  /** 표준 캐비닛 배열 — 가로 장 수 × 세로 장 수 */
  cols: number
  rows: number
}

export interface BuildSpecRow {
  label: string
  value: string
  /** 계산으로 얻은 값(실적 아님) */
  derived?: boolean
}

const nf = (n: number) => n.toLocaleString('ko-KR')

/** 구축정보 표의 행. 실적으로 읽힐 행(수요처·연도·수량)은 만들지 않는다. */
export function buildSpecRows(i: Industry): BuildSpecRow[] {
  const { pitchMm, cols, rows } = i.buildInfo
  const w = cols * CABINET_MM.w
  const h = rows * CABINET_MM.h
  return [
    { label: '설치 환경', value: i.environment === 'indoor' ? '실내' : '옥외' },
    { label: '설치 자리', value: i.eyebrow },
    { label: '권장 화소 간격', value: `P${pitchMm} (${pitchMm}mm)` },
    { label: '캐비닛 구성', value: `${CABINET_MM.w} × ${CABINET_MM.h}mm · ${cols} × ${rows}장` },
    { label: '화면 크기 예시', value: `${nf(w)} × ${nf(h)}mm`, derived: true },
    {
      label: '해상도 예시',
      value: `${nf(Math.round(w / pitchMm))} × ${nf(Math.round(h / pitchMm))}px`,
      derived: true,
    },
  ]
}

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
  /**
   * 설치사례 갤러리. [0] 은 항상 `heroImage` 와 같다(모달을 열면 카드에서 본 사진이 그대로 커진다).
   * 🔴 뒤에 붙이는 것은 **같은 자리의 실제 설치 장면 0~2장뿐**이다(2026-09-09 CEO 지시).
   *    부품·공정 근접컷이나 자리 성격이 다른 컷은 붙이지 않는다 — 넣을 바에는 대표 1장으로 둔다.
   * 사진마다 alt 를 같이 둔다 — alt 가 없으면 썸네일 여럿이 똑같이 읽힌다.
   */
  /** 2026-09-10 CEO "시공사례는 각각 따로 나와야" — 사진 한 장 = 사례 한 건. title 은 카드·모달 제목(짧게) */
  gallery: { src: string; alt: string; title?: string }[]
  /** 구축정보 표의 입력값. 화면 크기·해상도는 여기서 계산한다(`buildSpecRows`) */
  buildInfo: BuildInfo
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
      '공지가 바뀌면 게시판을 하나하나 돌아야 한다',
      '대기 공간은 가까이서 보는데 작은 글자가 읽힐지 가늠이 안 된다',
      '벽에 전원이 없다',
    ],
    solutions: [
      { title: '변경이 쉬운 민원 안내', desc: '창구명이나 담당 부서가 바뀌면 화면에서 글자만 고치면 됩니다. 시트지를 새로 뽑고 붙이러 다닐 일이 없어집니다.' },
      { title: '가까이 보는 화면', desc: '민원인이 어디쯤에서 화면을 보는지부터 재고, 그 거리에 맞는 글자 크기를 잡습니다. 보통 화소 간격 1.86mm나 2.5mm가 나옵니다.' },
      { title: '담당자 운영 교육', desc: '설치가 끝나면 담당자분께 화면 바꾸는 법을 현장에서 알려드립니다. 인사이동이 잦은 자리면 인계받을 분까지 같이 앉히시는 편이 낫습니다.' },
    ],
    recommendedSkus: ['P2.5', 'IN-S', 'IN-M'],
    priceHint: '보는 거리와 화면 크기가 잡히면 금액이 나옵니다',
    environment: 'indoor',
    heroImage: IMAGES.industry['public-office'],
    heroImageAlt: '한국 관공서 민원실 로비 벽면에 설치된 민원 안내 대형 실내 LED 화면',
    heroImageGenerated: true,
    gallery: [
      { src: IMAGES.industry['public-office'], alt: '한국 공공 민원실 대기 공간 벽면의 대기 순번 안내 화면', title: '민원실 민원 안내 화면' },
      { src: IMAGES.industryGallery.civilOfficeGuide, alt: '민원실 종합 안내 화면', title: '민원실 종합 안내 화면' },
    ],
    buildInfo: { pitchMm: 2.5, cols: 4, rows: 2 },
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
      '비가 와서 귀가 시간이 당겨지면 알릴 시간이 없다',
      '행사 때마다 무대 현수막을 따로 뽑는다',
    ],
    solutions: [
      { title: '학교 일정 화면 구성', desc: '급식표, 행사 일정, 귀가 시간을 각각 화면으로 만들어 두면 그날그날 띄우기만 하면 됩니다.' },
      { title: '강당 행사 활용', desc: '입학식이나 졸업식, 설명회 때 쓰는 제목과 순서 화면도 같은 설비에서 나옵니다. 행사마다 현수막을 따로 뽑지 않아도 됩니다.' },
      { title: '설치 장소별 화면', desc: '교내는 가까이서 보니까 화소 간격 2.5~3mm 실내형이 맞습니다. 운동장이나 외벽은 멀리서 보는 데다 비를 맞으니 옥외형(5mm)으로 가고, 벽이 무게를 견디는지도 같이 봅니다.' },
    ],
    recommendedSkus: ['IN-M', 'P2.5', 'OUT-S'],
    priceHint: '교내인지 운동장인지에서 크게 갈립니다. 위치부터 알려주십시오',
    environment: 'indoor',
    heroImage: IMAGES.industry['school'],
    heroImageAlt: '한국 학교 정문 옆 담장에 설치된 풀컬러 LED 전광판에 오늘의 급식과 체육행사 안내가 표시된 모습',
    heroImageGenerated: true,
    gallery: [
      { src: IMAGES.industry['school'], alt: '밝은 낮 한국 학교 정문 위에 설치된 등굣길 안전 안내 전자현수막', title: '학교 정문 급식·행사 안내 전광판' },
      { src: IMAGES.industryGallery.stageCampus, alt: '강당 무대 뒤 대형 화면에 캠퍼스 조감도가 펼쳐진 장면', title: '강당 무대 캠퍼스 조감 화면' },
      { src: GALLERY.schoolWinterGate, alt: '겨울 학교 본관 현관 상단 가로형 전광판에 신입생 환영 문구', title: '고등학교 정문 신입생 환영 전광판' },
      { src: GALLERY.schoolRuralGate, alt: '안개 낀 시골 학교 정문 위 가로형 전광판에 등교 시간 안내', title: '학교 정문 등교 시간 안내 전광판' },
    ],
    buildInfo: { pitchMm: 3, cols: 5, rows: 2 },
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
      '긴급 공지가 생겨도 현수막을 뽑아 걸 때까지 시간이 걸린다',
      '기간 끝난 현수막 떼고 새로 거는 일이 계속 반복된다. 게시대 관리 인력이 여기에 붙는다',
    ],
    solutions: [
      { title: '긴급 문구 교체', desc: '재난 안내나 계도 문구를 미리 만들어 두시면 필요할 때 바로 띄웁니다. 급할 때 문안부터 짜는 일이 없어집니다.' },
      { title: '멀리서 읽기 쉬운 화면', desc: '차가 지나가면서 보는지 사람이 서서 보는지에 따라 필요한 화소 간격이 달라집니다. 옥외는 보통 5mm, 8mm, 10mm 중에서 정하는데, 멀리서 볼수록 넓게 가도 됩니다.' },
      { title: '신고 절차 지원', desc: '설치하는 지역이 옥외광고물 신고 대상인지 먼저 확인하고, 서류 준비와 접수를 같이 진행합니다.' },
    ],
    recommendedSkus: ['OUT-S', 'OUT-M', 'OUT-L'],
    priceHint: '화면값만으로는 안 됩니다. 구조물과 전기, 신고까지 넣어야 금액이 됩니다',
    environment: 'outdoor',
    heroImage: IMAGES.industryGallery.entranceWelcomeBanner,
    heroImageAlt: '건물 현관 위 전자현수막에 환영 문구가 표시된 장면',
    heroImageGenerated: true,
    gallery: [
      { src: IMAGES.industryGallery.entranceWelcomeBanner, alt: '건물 현관 위 전자현수막에 환영 문구가 표시된 장면', title: '현관 상단 환영 전자현수막' },
      { src: IMAGES.industry['banner'], alt: '비 오는 저녁 건물 현관 상단 전자현수막에 안전 안내가 표시된 장면', title: '청사 현관 안전 안내 전자현수막' },
      { src: IMAGES.industryGallery.buildingNightBanner, alt: '비 내리는 밤 건물 외벽 전자현수막에 폭우 대비 안전수칙이 표시된 장면', title: '야간 외벽 안전수칙 전자현수막' },
    ],
    buildInfo: { pitchMm: 5, cols: 8, rows: 3 },
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
      '같은 안내를 로비 여기저기 똑같이 붙인다',
      '조직 개편이 있으면 층별 안내판을 새로 만드는 비용과 시간이 또 든다',
    ],
    solutions: [
      { title: '로비 종합안내', desc: '들어오는 사람이 제일 먼저 궁금해하는 순서대로 배치합니다. 보통 운영시간, 그다음 행사, 그다음 방문 절차입니다.' },
      { title: '층별 안내 갱신', desc: '부서명이나 시설 위치가 바뀌면 화면 내용만 고치면 끝납니다.' },
      { title: '시설별 화면 템플릿', desc: '매번 비슷하게 나가는 공지는 틀을 만들어 두면 날짜만 바꿔서 씁니다.' },
    ],
    recommendedSkus: ['IN-S', 'P2.5', 'IN-M'],
    priceHint: '설치 위치와 안내 화면 구성을 협의한 뒤 산출',
    environment: 'indoor',
    heroImage: IMAGES.industryGallery.lobbyNebula,
    heroImageAlt: '로비 벽면 대형 화면에 성운 영상이 펼쳐진 장면',
    heroImageGenerated: true,
    gallery: [
      { src: IMAGES.industryGallery.lobbyNebula, alt: '로비 벽면 대형 화면에 성운 영상이 펼쳐진 장면', title: '로비 성운 미디어월' },
      { src: IMAGES.industry['institution'], alt: '한국 공공 도서관 출입구 앞에 세워진 휴관일 안내 LED 게시판', title: '도서관 이용 안내 키오스크' },
      { src: IMAGES.industryGallery.lobbyForest, alt: '밝은 로비 벽면 대형 화면에 울창한 숲 영상이 펼쳐진 장면', title: '로비 숲 영상 벽면' },
      { src: IMAGES.industryGallery.lobbyForestBlossom, alt: '로비의 두 벽면 화면에 숲과 벚꽃 영상이 이어진 장면', title: '로비 숲·벚꽃 두 벽면' },
    ],
    buildInfo: { pitchMm: 2.5, cols: 4, rows: 3 },
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
      '카페·식당 메뉴판, 헬스장 시간표, 매장 프로모션을 한 화면에서 관리합니다. 쓰는 장비도, 시공 절차도, 고장 났을 때 오는 사람도 다른 현장과 같습니다.',
    pains: [
      '가격이나 메뉴가 바뀔 때마다 인쇄물을 새로 뽑아야 한다',
      '점심과 저녁에 다른 걸 걸고 싶은데 번거롭다',
      '매장이 여러 곳이면 같은 내용을 매장마다 따로 간다',
    ],
    solutions: [
      { title: '즉시 교체', desc: '메뉴와 가격은 화면에서 바로 고칩니다. 인쇄하고 붙이는 일이 통째로 없어집니다.' },
      { title: '시간대 편성', desc: '점심과 저녁, 평일과 주말에 다른 화면이 뜨도록 미리 걸어 둘 수 있습니다.' },
      { title: '같은 A/S 기준', desc: '고장 나면 모듈만 갈아 끼웁니다. 영업시간에 화면을 통째로 내릴 일은 거의 없습니다.' },
    ],
    recommendedSkus: ['IN-S', 'IN-M', 'P2.5'],
    priceHint: '화면 크기와 설치 조건 확인 후 산출',
    environment: 'indoor',
    heroImage: IMAGES.industry['retail'],
    heroImageAlt: '한국 전통시장 아케이드 천장에 매달아 설치한 LED 전광판',
    gallery: [
      { src: IMAGES.industry['retail'], alt: '음식점 카운터 위에 설치된 디지털 메뉴 화면', title: '카페 매장 간판 전광판' },
    ],
    buildInfo: { pitchMm: 3, cols: 4, rows: 2 },
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
    priceHint: '외벽을 보강해야 하는지에서 금액이 갈립니다',
    environment: 'outdoor',
    heroImage: IMAGES.industry['outdoor-ad'],
    heroImageAlt: '한국 건물 외벽에 설치된 3면 구성 대형 옥외 LED 전광판',
    gallery: [
      { src: IMAGES.industry['outdoor-ad'], alt: '도로변에서 멀리 보이는 대형 옥외 LED 광고 화면', title: '상가 옥상 옥외 광고 전광판' },
    ],
    buildInfo: { pitchMm: 6, cols: 12, rows: 6 },
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
      '휴진을 모르고 온 방문객이 창구에서 다시 묻는다. 헛걸음한 쪽도 받는 쪽도 손해다',
    ],
    solutions: [
      { title: '출입구 옥외형', desc: '캐노피나 현관 상단은 비를 맞고 낮에 햇빛을 받습니다. 방수 등급과 밝기를 먼저 정하고, 5m 안팎에서 읽히는 글자 크기로 잡습니다.' },
      { title: '자주 바뀌는 안내부터', desc: '접종 일정, 진료 시간, 휴진처럼 헛걸음을 만드는 내용을 미리 화면으로 만들어 두면 그날그날 바꿔 띄우기만 하면 됩니다.' },
      { title: '대기실은 따로 본다', desc: '대기실 순번·창구 안내는 코앞에서 보는 자리라 실내 정밀형(2.5mm 안팎)이 맞습니다. 출입구와 같은 규격으로 묶으면 둘 중 하나가 어긋납니다.' },
    ],
    recommendedSkus: ['OUT-S', 'OUT-M', 'P2.5'],
    priceHint: '출입구 구조를 보고, 실내도 함께 놓을지 물어봅니다',
    environment: 'outdoor',
    heroImage: IMAGES.industry['health-center'],
    heroImageAlt: '비 내리는 날 한국 보건소 현관 상단에 설치된 예방접종 안내 LED 화면',
    heroImageGenerated: true,
    gallery: [
      { src: IMAGES.industry['health-center'], alt: '비 내리는 날 한국 보건소 현관 상단에 설치된 예방접종 안내 LED 화면', title: '보건소 현관 예방접종 안내' },
      { src: IMAGES.industryGallery.lobbyForestBlossom, alt: '안내 공간의 두 벽면 화면에 숲과 벚꽃 영상이 이어진 장면', title: '로비 숲·벚꽃 두 벽면' },
    ],
    buildInfo: { pitchMm: 4, cols: 5, rows: 2 },
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
      '경보가 나도 게시물이 바뀌기까지 시간이 걸린다',
      '차량 출입구 위라 사다리차 없이는 손을 못 댄다',
    ],
    solutions: [
      { title: '상황별 문구 사전 등록', desc: '화재 예방, 산불, 폭염, 한파 문구를 미리 만들어 두면 상황이 생겼을 때 고르기만 하면 됩니다.' },
      { title: '차량 동선에 맞춘 크기', desc: '차고 앞은 차가 지나가며 보는 자리입니다. 서서 읽는 자리보다 글자를 키우고 화소 간격을 넓게 갑니다.' },
      { title: '전면 정비 구조', desc: '차량 출입구 위처럼 뒤로 못 들어가는 자리는 앞에서 모듈을 빼는 구조로 갑니다. 나중에 바꾸려면 화면을 통째로 떼야 합니다.' },
    ],
    recommendedSkus: ['OUT-S', 'OUT-M'],
    priceHint: '설치 높이와 전면 정비 여부 확인 후 산출',
    environment: 'outdoor',
    heroImage: IMAGES.industry['fire-safety'],
    heroImageAlt: '한국 소방 관련 시설 차고 출입구 상단에 설치된 화재 예방 점검 안내 LED 화면',
    heroImageGenerated: true,
    gallery: [
      { src: IMAGES.industry['fire-safety'], alt: '한국 소방 관련 시설 차고 출입구 상단에 설치된 화재 예방 점검 안내 LED 화면', title: '소방시설 차고 화재예방 안내' },
      { src: IMAGES.industryGallery.buildingNightBanner, alt: '비 내리는 밤 건물 외벽 전자현수막에 폭우 대비 안전수칙이 표시된 장면', title: '야간 외벽 안전수칙 전자현수막' },
    ],
    buildInfo: { pitchMm: 5, cols: 6, rows: 2 },
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
      '램프가 수명에 가까워지면 회의 직전에 화면이 어두워진다',
      '표와 작은 숫자가 많아 뒷자리에서 읽히는지 가늠이 안 된다',
      '노트북을 물릴 때마다 해상도가 틀어진다',
    ],
    solutions: [
      { title: '조명을 켠 채로', desc: 'LED는 자체 발광이라 실내등을 켜 둔 채로 봅니다. 자료를 보며 필기하는 회의에 프로젝터보다 맞습니다.' },
      { title: '앞줄 기준 화소 간격', desc: '가장 가까운 좌석에서 화면까지 거리를 재고 그 거리에 맞춥니다. 회의실은 보통 2.5mm 이하가 나옵니다.' },
      { title: '입력 계통 정리', desc: '노트북·화상회의·문서 카메라 중 무엇을 몇 개 물릴지 먼저 정합니다. 나중에 추가하면 배선을 다시 뜯습니다.' },
    ],
    recommendedSkus: ['P2.5', 'IN-S', 'IN-M'],
    priceHint: '앞줄 거리와 입력 계통을 확인하면 잡힙니다',
    environment: 'indoor',
    heroImage: IMAGES.industry['meeting-room'],
    heroImageAlt: '라운지 벽면 대형 화면에 세계 연결 지도가 표시된 장면',
    heroImageGenerated: true,
    gallery: [
      { src: IMAGES.industry['meeting-room'], alt: '라운지 벽면 대형 화면에 세계 연결 지도가 표시된 장면', title: '라운지 세계지도 미디어월' },
      { src: IMAGES.industryGallery.stageGalaxy, alt: '무대와 연단 뒤 대형 화면에 은하 영상이 펼쳐진 장면', title: '무대 은하 영상 화면' },
      { src: IMAGES.industryGallery.lobbyNebula, alt: '회의 공간 벽면 대형 화면에 성운 영상이 펼쳐진 장면', title: '로비 성운 미디어월' },
      { src: GALLERY.meetingRoomInstall, alt: '회의실 벽면 프레임에 캐비닛을 절반쯤 채워 넣은 시공 중 장면', title: '회의실 캐비닛 설치 장면' },
    ],
    buildInfo: { pitchMm: 2.5, cols: 6, rows: 3 },
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
    priceHint: '무대 폭과 객석 깊이부터 잽니다',
    environment: 'indoor',
    heroImage: IMAGES.industry['auditorium'],
    heroImageAlt: '무대와 연단 뒤 대형 화면에 은하 영상이 펼쳐진 장면',
    heroImageGenerated: true,
    gallery: [
      { src: IMAGES.industry['auditorium'], alt: '무대와 연단 뒤 대형 화면에 은하 영상이 펼쳐진 장면', title: '무대 은하 영상 화면' },
      { src: IMAGES.industryGallery.stageCampus, alt: '강당 무대 뒤 대형 화면에 캠퍼스 조감도가 펼쳐진 장면', title: '강당 무대 캠퍼스 조감 화면' },
      { src: GALLERY.auditoriumSchoolStage, alt: '학교 강당 무대 앞 가로형 화면에 학부모 공개수업 안내', title: '학교 강당 학부모 공개수업 안내' },
      { src: GALLERY.auditoriumTheater, alt: '소극장 무대 대형 화면에 문화 강좌 발표회 제목', title: '소극장 무대 발표회 화면' },
    ],
    buildInfo: { pitchMm: 3, cols: 8, rows: 4 },
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
      '하원 시간에 보호자가 몰리면 게시물 앞이 막히고, 아이 손이 닿는 높이라 인쇄물도 자주 뜯긴다',
    ],
    solutions: [
      { title: '매일 바뀌는 것부터', desc: '식단, 알림, 활동 안내를 화면 서식으로 만들어 두면 내용만 갈아 끼웁니다. 매일 뽑아 붙일 일이 없어집니다.' },
      { title: '눈높이 정밀형', desc: '1~2m 앞에서 보는 자리라 화소 간격이 성기면 글자가 뭉칩니다. 2.5mm 이하로 잡습니다.' },
      { title: '아이 동선 고려', desc: '손이 닿는 높이면 모서리 마감과 설치 높이를 함께 봅니다. 화면 자체보다 여기서 문제가 생깁니다.' },
    ],
    recommendedSkus: ['P2.5', 'IN-S'],
    priceHint: '설치 높이와 화면 크기 확인 후 산출',
    environment: 'indoor',
    heroImage: IMAGES.industry['daycare'],
    heroImageAlt: '한국 어린이집 복도 벽면에 설치된 오늘의 식단과 알림장 안내 화면',
    heroImageGenerated: true,
    gallery: [
      { src: IMAGES.industry['daycare'], alt: '한국 어린이집 복도 벽면에 설치된 오늘의 식단과 알림장 안내 화면', title: '어린이집 복도 식단·알림 화면' },
    ],
    buildInfo: { pitchMm: 2.5, cols: 3, rows: 2 },
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
      '차가 지나가는 몇 초 안에 몇 글자가 읽히는지 모르겠다',
      '기초를 다시 파야 하는지, 전기는 어디서 끌지 판단이 안 선다',
    ],
    solutions: [
      { title: '주행 속도 기준 문안', desc: '제한 속도와 화면까지 거리로 읽히는 글자 수를 계산합니다. 한 화면에 넣는 글자를 줄이는 게 크기를 키우는 것보다 효과가 큽니다.' },
      { title: '지주·기초 검토', desc: '기존 지주를 쓸 수 있는지, 기초를 새로 잡아야 하는지에 따라 금액이 크게 갈립니다. 풍하중은 설치 높이와 화면 면적으로 봅니다.' },
      { title: '야간 밝기 자동 조절', desc: '도로변은 밤에 너무 밝다는 민원이 나오는 자리입니다. 주변 밝기에 따라 자동으로 낮춥니다.' },
    ],
    recommendedSkus: ['OUT-M', 'OUT-S', 'OUT-L'],
    priceHint: '기존 지주를 쓸 수 있느냐에서 금액이 크게 갈립니다',
    environment: 'outdoor',
    heroImage: IMAGES.industry['traffic'],
    heroImageAlt: '한국 교차로 인도 옆에 세워진 지주형 옥외 LED 표지가 재난대피 훈련 안내를 표시하고 있다',
    heroImageGenerated: true,
    gallery: [
      { src: IMAGES.industry['traffic'], alt: '한국 교차로 인도 옆에 세워진 지주형 옥외 LED 표지가 재난대피 훈련 안내를 표시하고 있다', title: '교차로 재난 안전 안내 전광판' },
      { src: GALLERY.roadIceWarning, alt: '야간 지방도 갓길 지주형 전광표지에 결빙주의 서행 문구', title: '고속도로 결빙 경고 전광판' },
      { src: GALLERY.roadsidePylonDusk, alt: '저녁 도심 도로변에 세워진 단독 기둥형 옥외 화면', title: '도로변 지주형 전광판' },
    ],
    buildInfo: { pitchMm: 5, cols: 6, rows: 2 },
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
    priceHint: '관제 설비와 연동이 되는지부터 봅니다. 여기서 막히면 화면 얘기가 무의미합니다',
    environment: 'outdoor',
    heroImage: IMAGES.industry['parking'],
    heroImageAlt: '한국 주차장 진입로 기둥에 설치된 주차 가능 대수 표시 LED 화면',
    heroImageGenerated: true,
    gallery: [
      { src: IMAGES.industry['parking'], alt: '한국 주차장 진입로 기둥에 설치된 주차 가능 대수 표시 LED 화면', title: '주차장 진입로 주차 가능 대수 표시' },
    ],
    buildInfo: { pitchMm: 4, cols: 3, rows: 1 },
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
    ],
    solutions: [
      { title: '준옥외 기준', desc: '지붕 아래라도 습기와 먼지가 들어옵니다. 실내형이 아니라 옥외 기준으로 방수·방진 등급을 잡습니다.' },
      { title: '변하는 값 표시', desc: '막차 시각, 배차 간격, 노선 변경처럼 자주 바뀌는 값 위주로 화면을 구성합니다.' },
      { title: '시간대 밝기', desc: '낮에는 반사를 이기는 밝기가 필요하고 밤에는 낮춰야 합니다. 자동 조절을 기본으로 넣습니다.' },
    ],
    recommendedSkus: ['OUT-S', 'OUT-M'],
    priceHint: '승강장 구조와 전기·통신 인입을 먼저 봅니다',
    environment: 'outdoor',
    heroImage: IMAGES.industry['transit'],
    heroImageAlt: '해질 무렵 한국 버스터미널 승강장에 설치된 막차 출발 시각 안내 LED 화면',
    heroImageGenerated: true,
    gallery: [
      { src: IMAGES.industry['transit'], alt: '해질 무렵 한국 버스터미널 승강장에 설치된 막차 출발 시각 안내 LED 화면', title: '버스터미널 승강장 출발시간 안내' },
    ],
    buildInfo: { pitchMm: 4, cols: 4, rows: 2 },
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
      '밤에 밝으면 바로 민원이 들어온다',
    ],
    solutions: [
      { title: '보행 동선 세로형', desc: '걸어서 지나가는 자리는 세로형이 시야에 잘 걸립니다. 폭을 줄여 미관 부담도 낮춥니다.' },
      { title: '급한 공지 즉시 반영', desc: '단수·정전·공사 안내를 관리사무소에서 바로 바꿔 띄웁니다. 동마다 붙이러 다닐 일이 없어집니다.' },
      { title: '야간 밝기 제한', desc: '주거지라 밤에 밝으면 바로 민원이 됩니다. 시간대별 밝기 상한을 설정에 넣어 둡니다.' },
    ],
    recommendedSkus: ['OUT-S', 'OUT-M'],
    priceHint: '지주 자리와 전기 인입 확인 후 산출',
    environment: 'outdoor',
    heroImage: IMAGES.industry['apartment'],
    heroImageAlt: '한국 아파트 단지 보행로에 세워진 세로형 LED 지주가 보행 안전 문구를 표시하고 있다',
    heroImageGenerated: true,
    gallery: [
      { src: IMAGES.industry['apartment'], alt: '한국 아파트 단지 보행로에 세워진 세로형 LED 지주가 보행 안전 문구를 표시하고 있다', title: '아파트 단지 보행 안전 안내 전광판' },
      { src: GALLERY.apartmentLounge, alt: '공동주택 커뮤니티 라운지 벽면 화면에 생활 안내와 공용시설 이용 시간', title: '아파트 커뮤니티 라운지 안내 화면' },
    ],
    buildInfo: { pitchMm: 5, cols: 2, rows: 5 },
  },
]

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug)
}

/**
 * 이전/다음 자리. 케이시스 상세의 아래쪽 이전·다음 버튼과 같은 동작이다.
 * 목록 순서를 그대로 쓰되 양 끝에서 감아 돈다 — 끝에서 버튼이 죽으면
 * 사진을 훑던 사람이 그 자리에서 멈춘다.
 */
export function siblingIndustries(slug: string): { prev: Industry; next: Industry } | null {
  const n = INDUSTRIES.findIndex((i) => i.slug === slug)
  if (n < 0 || INDUSTRIES.length < 2) return null
  return {
    prev: INDUSTRIES[(n - 1 + INDUSTRIES.length) % INDUSTRIES.length],
    next: INDUSTRIES[(n + 1) % INDUSTRIES.length],
  }
}
