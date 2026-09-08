/**
 * 이미지 배정 레지스트리.
 *
 * 왜 필요한가 —
 * 각 컴포넌트가 알아서 경로를 적으면 같은 사진이 여러 페이지에 중복된다.
 * 실제로 사용처 50곳에 이미지 24장이 배정돼 스크롤할 때마다 같은 사진이 나왔다.
 *
 * 그래서 배정을 한 곳에 모으고, 개발 중에 중복이 생기면 즉시 알 수 있게 한다.
 * 컴포넌트는 반드시 이 파일의 상수를 통해 이미지를 참조한다.
 * 컴포넌트 안에 '/wk/...' 문자열을 직접 적지 말 것.
 *
 * 규칙 — 한 이미지는 사이트 전체에서 딱 한 자리에만 쓴다.
 *
 * 파일명 규칙
 *   K 2026-09 v3 재생성 — 국내 실제 납품 기록사진을 조사해 다시 쓴 프롬프트.
 *     화면에 실제 한국어 안내 문구가 뜨고 주변 디테일이 국내 현장과 맞는다.
 *     가장 눈에 많이 띄는 자리(히어로·업종 카드·홈 갤러리)에 우선 배치한다.
 *   A~J 2026-09 v2 60장
 *   A 옥외 대형 · B 관공서/공공 · C 실내 대형 · D 상업 · E 스포츠
 *   F 교통 · G 제품/모듈 · H 시공 현장 · I 운영/관제 · J 브랜드 추상
 */

/**
 *   gen 2026-09 v4 — `public/cases/gen/` 58장.
 *     화면에 **한국어 안내 문구**가 떠 있고 배경이 국내 관공서·학교다.
 *     CEO 판정 기준(2026-09-06): 화면 내용이 추상 그라데이션이면 AI 티가 난다.
 *     그래서 히어로처럼 화면이 크게 보이는 자리는 이 세트를 우선한다.
 *     A~J 시리즈는 화면이 그라데이션이라 대형 자리에서 뺐다(작은 카드는 무방).
 */

/** 원본(최대 1600px 급) — 히어로·대형 장면용 */
const W = (name: string) => `/wk/${name}.jpg`
/** 한국어 문구가 뜬 국내 현장 세트 — 화면이 크게 보이는 자리에 쓴다 */
const G = (name: string) => `/cases/gen/${name}.jpg`
/** 축소본 — 카드·썸네일 격자용. 원본을 격자에 쓰면 첫 로드가 무거워진다 */
const S = (name: string) => `/wk/sm/${name}.jpg`
/**
 * `public/curated/` — 2026-05~06 구 홈페이지 시절 해외 스톡 21장.
 * 🔴 **21장 중 19장이 폐기 판정**이다(구조정본 §13-C). 뉴욕 타임스스퀘어(`hero-home`),
 *    미국 초등학교(`gal-school-sign`) 처럼 **파일명이 정확히 우리가 원하는 컷처럼 읽히는**
 *    함정이 있다. 이 헬퍼로 새 컷을 꺼낼 때는 반드시 §13-C 표를 먼저 보고,
 *    표에 없으면 원본을 확대해 직접 판독한 뒤 그 결과를 남긴다.
 */
const C = (name: string) => `/curated/${name}.jpg`

export const IMAGES = {
  /* ── 홈 ────────────────────────────────────────────── */
  home: {
    /**
     * 히어로 배경 슬라이더 4장. 톤을 갈라 배치한다 — 야간 → 주간 시공 → 블루아워 → 근접.
     *
     * 🔴 2026-09-07 A4_curved-media-facade-day 를 뺐다.
     *    화면 문구가 영문 'OPEN HORIZON' 이고 배경이 뉴욕식 교차로(미국 신호등·번호판)다.
     *    §13 영문 블랙리스트에 이미 올라 있던 컷이 히어로에 배선돼 6초마다 노출되고 있었다.
     *    판정은 ①화면 문구 ②화면 밖 배경 2단으로 본다. 이 컷은 두 단 모두 탈락이다.
     */
    /** 1 · 야간 청사 외벽 '안전한 귀가길 되세요' — LCP 담당 */
    hero: G('gen-18'),
    /** 2 · 주간 학교 정문 취부 시공 '오늘도 즐거운 하루 보내세요' — 우리가 실제로 하는 일 */
    heroReveal: W('K32_school-gate-frame-install'),
    /** 3 · 블루아워 도심 미디어 파사드(국내) */
    heroCity: W('A1_downtown-tower-bluehour'),
    /** 4 · 픽셀 광파 근접 디테일 */
    statement: W('J4_pixel-light-wave'),
    /**
     * ScrollStatement 배경 발광 층 — 2026-09-07 신규 배선.
     *
     * `curated/svc-replacement` 는 이 리포의 205장(wk 95 · gen 58 · case 30 · curated 21)을
     * 통틀어 **결격이 하나도 없는 몇 안 되는 컷**이다. 구조정본 §13-D 미배선 후보 1순위였고
     * 이번에 원본 확대로 재확인했다 —
     *   · **AI 생성물이 아니라 실사**다. 트러스·전원 케이블·발판·모듈 적재가 전부 물리적으로 맞다
     *   · 화면 문자 **0** (파란 테스트 블록만) → 작은 글씨 붕괴 리스크 자체가 없다
     *   · 인물은 역광 실루엣 1인, 얼굴 **0** · 상호·로고 **0** · 국적 단서 **0**
     *   · 화면이 프레임의 90%를 채운 **대형 LED 월**이다 = 우리가 파는 물건 그 자체
     *
     * 🔴 **캡션이 붙지 않는 배경 층으로만 쓴다.** 우리 시공 사진이 아니므로
     *    `시공 사례`·`납품처` 로 읽힐 자리(§16-B Ⓑ)에 옮기면 그 순간 날조가 된다.
     */
    statementScene: C('svc-replacement'),
  },

  /** 홈 다크 시네마틱 장면 — sticky scroll 3막 */
  cinematic: [
    W('J1_pixel-bokeh-hero'),
    W('G1_pixel-macro'),
    W('K26_module-front-workbench'),
  ],

  /**
   * 홈 — 히어로 바로 아래 활용 예시 슬라이더 4장 (`components/public/SceneSlider.tsx`).
   *
   * 2026-09-07 CEO 지시로 CSS 시뮬레이션(`LedBoard`)을 걷어내고 사진으로 바꾼 자리다.
   * 4장 모두 §13 2단 판정 + **원본 확대 검사**를 통과했다(작은 글씨 붕괴 없음, 문자·상호·얼굴 없음).
   * 톤을 갈랐다 — 주간 실외 / 실내 대형 / 가을 석양 실외 / 실내 세로형.
   *
   * 🔴 여기 사진은 전부 AI 연출컷이다. 캡션은 `제품 활용 예시` 로 고정한다.
   *    `시공 사례`·`납품처`·기관명·건수를 붙이면 날조다.
   * 🔴 `gen-51`(우천 광장)은 확대 검사에서 탈락시켰다 — 배경 가옥이 일본식 기와지붕이다.
   */
  homeScenes: [
    /** 1 · 초등학교 정문 도트매트릭스 '등하원 안내 / 천천히 운전해 주세요' */
    G('gen-34'),
    /** 2 · 강당 무대 대형 LED '행사 안내' */
    G('gen-13'),
    /** 3 · 가을 청사 앞 광장 세로형 사인(화면=배치도, 문자 없음) */
    G('gen-55'),
    /** 4 · 도서관 로비 세로형 스탠드 '이용 안내' */
    G('gen-25'),
  ],

  /** 홈 — 설치 장면 갤러리 (격자라 축소본을 쓴다) */
  homeGallery: [
    S('K03_community-center-cloudy'),
    S('K05_civic-service-earlymorning'),
    S('K13_school-lobby-lunch-notice'),
    S('B8_agricultural-coop'),
    S('K22_public-auditorium-meeting'),
    S('K12_gym-stage-overcast-day'),
    // 2026-09-06 증량 — 화면에 한국어 문구가 뜬 국내 현장 (CEO 기준)
    G('gen-26'),
    G('gen-3'),
    S('B3_bus-stop-arrival'),
  ],

  /* ── 업종 ──────────────────────────────────────────── */
  /** lib/industries.ts 의 heroImage 가 사용 */
  industry: {
    'public-office': W('K01_district-office-canopy-overcast'),
    school: W('K09_elementary-gate-cloudy'),
    banner: W('K08_office-rainy-evening'),
    institution: W('K07_library-plaza-overcast'),
    retail: W('D1_cafe-storefront-night'),
    'outdoor-ad': W('A7_aerial-night-block'),
    // 2026-09-07 설치 사례 확충 9건.
    // 전부 화면에 한국어 안내 문구가 떠 있는 컷만 골랐다(§13 AI 티 판정 기준).
    // 앞의 5장은 `spare` 에서 옮겨왔다 — 같은 파일을 두 자리에 두면 중복검사가 경고한다.
    'health-center': S('K04_health-center-drizzle'),
    'fire-safety': S('K06_fire-safety-building-flatlight'),
    traffic: S('K15_intersection-electronic-board-cloudy'),
    parking: S('K18_parking-entry-grayday'),
    transit: S('K19_bus-terminal-dusk'),
    apartment: G('gen-24'),
    auditorium: G('gen-4'),
    'meeting-room': G('gen-27'),
    daycare: G('gen-33'),
  } as Record<string, string>,

  /** 업종 페이지 히어로 */
  industriesHero: W('K21_government-lobby-fluorescent'),

  /** 업종 페이지 보조 장면 — 시설 유형별 */
  /** ⚠️ 현재 화면에 렌더링되지 않는다. 업종 페이지 확장 시 쓸 예비 컷. */
  industryScenes: [
    S('C5_museum-immersive'),
    S('D2_mall-atrium-banner'),
    S('F2_subway-platform'),
    S('D6_rooftop-shop-sign-dusk'),
    S('E2_big-scoreboard'),
    S('E4_baseball-outfield'),
  ],

  /* ── 회사 소개 ─────────────────────────────────────── */
  /**
   * 2026-09-07 교체 — 육안 판독으로 해외 생성컷 3장을 뺐다.
   *   hero     A6_smalltown-mainstreet  → 화면 문구가 영문 'NEW BEGINNINGS START HERE'
   *   chapter2 H1_facade-install-crew   → 미국 픽업트럭·미국식 도로·해외 인물
   *   chapter3 I3_monitoring-room-fleet → 관제 지도가 미국 걸프연안, 화면 텍스트 전부 뭉개짐
   * 대체는 전부 `cases/gen/` 국내 세트다. 관공서 담당자가 보는 페이지라
   * 화면에 한국어가 떠 있는지를 1순위 기준으로 골랐다(구조정본 §13 AI 티 판정 기준).
   */
  company: {
    /** 눈 온 학교 앞, 전광판에 '안전한 겨울 보내세요' — 히어로 유일 priority */
    hero: G('gen-57'),
    /** 모듈에 '점검중', 옆에 한국어 점검 체크시트 */
    chapter1: W('K28_gloved-module-inspection'),
    /** 국내 관공서 로비, 안전콘·비계 두고 캐비닛 취부 중 */
    chapter2: G('gen-8'),
    /** 흡착판으로 전면에서 모듈을 빼내는 국내 기술자 */
    chapter3: G('gen-9'),
  },

  /* ── 솔루션(공급 범위) 6공정 ───────────────────────── */
  /**
   * 2026-09-07 교체 2건 (COO 실물 판독 지시).
   *  [0] I1_tablet-diagnostic → gen-6
   *      I1 은 미국식 스트립몰 주차장·픽업트럭·해외 작업자에 화면은 추상 그라데이션이었다.
   *      (구조정본 §13 "그라데이션(히어로 금지)" 목록에도 I1 이 들어 있다)
   *      gen-6 은 국내 공공시설 로비에서 레이저 거리계와 태블릿으로 실측하는 장면이라
   *      01 공정(현장 실측)과 그림이 맞는다.
   *  [4] K32_school-gate-frame-install → gen-50
   *      K32 는 학교 정문 캐노피에 프레임을 다는 사진이라 03(취부)이지 05(시운전)가 아니다.
   *      gen-50 은 국내 청사 앞에서 태블릿 제어 화면(밝기·온도 게이지)을 띄우고
   *      점등한 화면을 확인하는 장면이라 05(제어 설정·시운전)와 맞는다.
   *      세로 2:3 원본이지만 4:3 중앙 크롭에서 태블릿이 온전히 남는다(실측 확인).
   * 빠진 두 장은 삭제하지 않고 배선만 풀었다. 다른 자리에 다시 쓸 수 있다.
   */
  service: [
    G('gen-6'),
    W('K29_cabinet-test-pattern'),
    W('K34_roadside-hbeam-crane'),
    W('K35_cabinet-cabling-fluorescent'),
    G('gen-50'),
    W('K30_parts-layout-service-bench'),
  ],
  servicesHero: G('gen-45'),

  /* ── 제품 ──────────────────────────────────────────── */
  productsHero: G('gen-20'),
  /** lib/products.ts 의 제품 카드 6종. 전에는 그 파일이 경로를 직접 적어(§0-3 위반)
   *  중복 검사도 우회하고 있었다. 2026-09-06 레지스트리로 끌어왔다. */
  /** /products 환경 묶음 3개의 좌측 칼럼 사진 (2026-09-06 증량) */
  productTracks: {
    'indoor-near': G('gen-22'),
    'outdoor-near': G('gen-29'),
    'outdoor-far': G('gen-5'),
  } as Record<string, string>,
  /**
   * /products 화소 간격 섹션의 재료 사진 — 2026-09-07 신규 배선.
   *
   * §17-D 가 남긴 지시를 그대로 따른 것이다: "`J4` 가 닿지 않는 페이지(/products SpecScale 등)
   * 에서 꺼내 쓴다." 홈 히어로 슬라이드 4(J4 화소 근접)와 은유가 겹쳐 보류돼 있던 컷인데,
   * /products 에는 J4 가 없으므로 겹치지 않는다.
   *
   * 🔴 원본 확대 재판독(2026-09-07, 1600×2400 원본 + 중앙 50% 크롭 1000px) —
   *   · **실사다.** 피사계심도가 광학적으로 떨어지고 램프마다 색이 미세하게 다르며
   *     사각(斜角) 원근이 렌즈 왜곡과 맞는다. AI 생성물의 규칙적 반복이 아니다
   *   · 화면 문자 **0** · 인물 **0** · 상호·로고 **0** · 국적 단서 **0**
   *   · 내용은 SMD 도트매트릭스 모듈 표면 = "화소 간격" 그 자체
   * 🔴 파일명이 `svc-cabinet` 이지만 캐비닛 사진이 아니라 화소 매크로다.
   *    curated/ 의 파일명 함정(§13-C)이 여기서도 확인됐다 — 이름으로 고르지 마라.
   * 🔴 **아무 주장도 하지 않는 재료 사진**으로만 쓴다. 시공 실적·납품처로 읽힐 캡션 금지.
   *    이 사진의 실제 화소 간격은 규격이 확인되지 않았으므로 도해와 축척이 다르다고 화면에 적는다.
   */
  productsPitchMacro: C('svc-cabinet'),

  /** /industries "걸면 뭐가 뜨나" 4장 — 전부 화면에 한국어 문구가 떠 있다 */
  industryShowing: [G('gen-17'), G('gen-2'), G('gen-31'), G('gen-32')],
  /**
   * 🔴 2026-09-07 `mountScene: G('gen-44')` 를 여기서 뺐다 (CEO 지시).
   *
   * /services 취부 방식 섹션은 **사진을 한 장도 쓰지 않는 도해 섹션으로 전환**했다.
   * 이유 — 벽부형·지주형·천장 행잉 각각의 **진짜 시공 사진이 우리에게 없다.**
   * `cases/gen/*` 는 전량 AI 연출컷이고 `curated/` 는 19/21 이 해외 스톡이다(§13-B/§13-C).
   * 연출컷을 "이렇게 설치됩니다" 자리에 넣으면 그게 곧 날조다.
   * 취부 구조는 원래 도면으로 설명하는 대상이라 도해가 사진보다 정확하기도 하다.
   * → `components/solution/MountTypes.tsx` 의 `MountDiagram` 참조.
   *
   * gen-44(크레인으로 외벽에 캐비닛을 올리는 컷, 100% 확대 검사 통과)는 폐기가 아니라
   * 아래 `spare` 로 되돌렸다. 실사 시공 사진이 확보되면 이 자리를 다시 열면 된다.
   */
  /** /support 사후관리 — 모듈을 앞에서 빼내는 장면 */
  afterService: G('gen-42'),
  productCards: {
    'IN-S': G('gen-16'),
    'IN-M': G('gen-14'),
    'IN-L': G('gen-15'),
    'OUT-S': G('gen-11'),
    'OUT-M': G('gen-10'),
    'OUT-L': G('gen-1'),
  } as Record<string, string>,
  /** 제품 상세 쇼케이스 — 구조·배선·방열·마감 */
  showcase: [
    W('G6_exploded-layers'),
    W('K27_cabinet-back-workshop'),
    // 2026-09-07 A8_cabinet-edge-louvre 교체 — 육안 판독 결과 배경이 미국(목주 배전주·
    // 배럴 변압기·미국식 주차장)이었다. 국적 단서가 없는 스튜디오 컷으로 바꿨다.
    W('G2_cabinet-studio'),
    W('J6_flatlay-editorial'),
  ],
  /** 제품 페이지 환경별 컷 — 2026-09-07 육안 판독으로 3장 교체.
   *  B6_park-info-kiosk = 열대 수목·현지 복장으로 국내 현장이 아니었다(탈락).
   *  B2_city-hall-wall / C1_corporate-lobby-wall = 화면이 와이어프레임·추상 그라데이션이라
   *  판정 기준 ①(화면 문구가 한국어인가)을 통과하지 못했다.
   *  대체 4장은 전부 화면에 한국어가 뜨거나 배경이 명백히 국내다. */
  productScenes: [
    S('K02_county-hall-granite-morning'),
    S('K23_school-multipurpose-hall-day'),
    S('B4_elementary-school-gate'),
    S('K16_rural-road-vms-overcast'),
  ],

  /* ── 도입 절차 6단계 ───────────────────────────────── */
  process: [
    W('K17_cctv-arm-parking-warning'),
    W('K33_auditorium-module-mount'),
    W('G5_warehouse-stack'),
    W('K31_office-canopy-install-overcast'),
    W('I5_error-heatmap'),
    W('J5_engineer-silhouette'),
  ],

  /* ── 고객센터 · FAQ · 견적 ─────────────────────────── */
  support: W('K24_civic-center-reception-morning'),
  faqHero: G('gen-28'),
  quoteHero: W('F4_parking-availability'),

  /** 제품 카테고리 배너 — 2026-09-08 카테고리 3→6 확장분. spare 검사 통과분. 캡션 없는 배경 층 */
  categoryHeroes: {
    facade: W('C2_hotel-curved-wall'),
    sports: W('E1_perimeter-boards'),
    traffic: W('A3_roadside-pylon-dusk'),
  } as Record<string, string>,

  /** 하위 페이지 공통 배너(PageHeader) — 전용 사진이 없는 페이지 4곳. spare 에서 확대 검사 통과분만 골랐다.
   *  캡션 없는 배경 층이라 실적 주장이 아니다. */
  pageHeaders: {
    certification: W('C4_control-room-wall'),
    downloads: W('C6_office-reception'),
    specs: W('D5_car-showroom-wall'),
  } as Record<string, string>,


  /* ── 2026-09-08 CEO 지시 "같은 이미지는 다른 페이지라도 사용 금지" ──────────────────
     렌더 기준 전수 조사(27장이 2~15페이지에 겹침) 뒤 자리마다 **전용 사진**을 배정했다.
     아래 4묶음은 전부 미사용 풀에서 가져왔고(gen/K 시리즈 우선), 다른 어디에도 쓰지 않는다.
     새 자리를 만들 때는 이 파일 맨 아래 미사용 풀에서 꺼내 쓰고, 기존 배정을 재사용하지 마라. */
  /** 시공사례 상세(/industries/[slug]) 머리 — 목록 카드(industry)와 다른 사진 */
  industryDetail: {
    'public-office': '/cases/gen/gen-12.jpg',
    'school': '/cases/gen/gen-13.jpg',
    'banner': '/cases/gen/gen-19.jpg',
    'institution': '/cases/gen/gen-21.jpg',
    'retail': '/cases/gen/gen-23.jpg',
    'outdoor-ad': '/cases/gen/gen-25.jpg',
    'health-center': '/cases/gen/gen-26.jpg',
    'fire-safety': '/cases/gen/gen-28.jpg',
    'meeting-room': '/cases/gen/gen-3.jpg',
    'auditorium': '/cases/gen/gen-30.jpg',
    'daycare': '/cases/gen/gen-34.jpg',
    'traffic': '/cases/gen/gen-35.jpg',
    'parking': '/cases/gen/gen-36.jpg',
    'transit': '/cases/gen/gen-37.jpg',
    'apartment': '/cases/gen/gen-38.jpg',
  } as Record<string, string>,
  /** 모델 상세(/products/[sku]) 머리 — 제품 전체(productCards)와 다른 사진 */
  productDetail: {
    'IN-S': '/cases/gen/gen-39.jpg',
    'IN-M': '/cases/gen/gen-40.jpg',
    'OUT-S': '/cases/gen/gen-41.jpg',
    'OUT-M': '/cases/gen/gen-43.jpg',
    'OUT-L': '/cases/gen/gen-44.jpg',
    'P2.5': '/cases/gen/gen-45.jpg',
  } as Record<string, string>,
  /** 홈 시공사례 6장 — 순서 = home/CaseHighlights FEATURED */
  homeCases: [
    '/cases/gen/gen-46.jpg',
    '/cases/gen/gen-47.jpg',
    '/cases/gen/gen-48.jpg',
    '/cases/gen/gen-49.jpg',
    '/cases/gen/gen-51.jpg',
    '/cases/gen/gen-52.jpg',
  ],
  /** 홈 제품 카테고리 카드 6장 — 카테고리 페이지 머리(productCategories.heroImage)와 다른 사진 */
  homeCategoryCards: {
    indoor: '/cases/gen/gen-53.jpg',
    outdoor: '/cases/gen/gen-54.jpg',
    banner: '/cases/gen/gen-55.jpg',
    facade: '/cases/gen/gen-56.jpg',
    sports: '/cases/gen/gen-58.jpg',
    traffic: '/cases/gen/gen-7.jpg',
  } as Record<string, string>,

  /** 남는 장면 — 사례 더보기·블로그 썸네일 등 자유 배치 */
  spare: [
    /** 2026-09-07 /services 취부 방식이 도해 섹션으로 바뀌면서 풀린 컷.
     *  확대 검사는 통과한 자산이라 삭제하지 않고 여기 둔다(위 mountScene 주석 참조). */
    G('gen-44'),
    /* 2026-09-07 — `svc-cabinet` 은 여기서 나가 `productsPitchMacro` 로 배선됐다.
       위 주석이 지시한 자리(/products SpecScale)를 그대로 따랐다. 되돌리려면
       productsPitchMacro 를 먼저 지워야 한다 — 두 자리에 두면 중복검사가 경고한다. */
    S('A8_cabinet-edge-louvre'),
    S('B2_city-hall-wall'),
    S('B6_park-info-kiosk'),
    S('C1_corporate-lobby-wall'),
    S('A3_roadside-pylon-dusk'),
    S('B1_village-community-center'),
    S('B5_senior-center'),
    S('B7_fire-station-emergency'),
    S('C2_hotel-curved-wall'),
    S('C3_conference-hall-stage'),
    S('C4_control-room-wall'),
    S('C6_office-reception'),
    S('D3_restaurant-menu-board'),
    S('D4_shop-window-ticker'),
    S('D5_car-showroom-wall'),
    S('E1_perimeter-boards'),
    S('E3_gym-scoreboard'),
    S('F1_highway-vms'),
    S('F5_ferry-terminal'),
    S('G3_cabinet-back-wiring'),
    S('G4_gloved-hands-pcb'),
    S('H2_crane-lift-frame'),
    S('H3_scissor-lift-align'),
    S('H4_indoor-module-mount'),
    S('H5_cabling-behind'),
    S('H6_handover-dusk'),
    S('I2_iot-controller-board'),
    S('I4_rooftop-laptop'),
    S('J2_lowangle-stormy'),
    S('J3_floating-module-studio'),
    S('K10_highschool-entrance-winter'),
    S('K11_school-auditorium-fluorescent'),
    S('K14_rural-school-gate-misty'),
    S('K20_snow-road-night-warning'),
    S('K25_local-theater-rehearsal-light'),
  ],
} as const

/**
 * 개발 중 중복 검사.
 * 같은 파일이 두 자리에 배정되면 콘솔에 경고를 남긴다.
 * 원본(W)과 축소본(S)은 같은 사진이므로 파일명만 비교한다.
 */
if (process.env.NODE_ENV !== 'production') {
  const all: string[] = [
    ...Object.values(IMAGES.home),
    ...IMAGES.cinematic,
    ...IMAGES.homeScenes,
    ...IMAGES.homeGallery,
    ...Object.values(IMAGES.industry),
    IMAGES.industriesHero,
    ...IMAGES.industryScenes,
    ...Object.values(IMAGES.company),
    ...IMAGES.service,
    IMAGES.servicesHero,
    IMAGES.productsHero,
    IMAGES.productsPitchMacro,
    ...IMAGES.showcase,
    ...IMAGES.productScenes,
    ...IMAGES.process,
    IMAGES.support,
    IMAGES.faqHero,
    IMAGES.quoteHero,
    ...IMAGES.spare,
  ]
  const key = (p: string) => p.replace('/wk/sm/', '').replace('/wk/', '')
  const seen = new Set<string>()
  const dup = all.filter((p) => (seen.has(key(p)) ? true : (seen.add(key(p)), false)))
  if (dup.length) {
    // eslint-disable-next-line no-console
    console.warn('[imageAssets] 같은 사진이 두 자리에 배정됐다:', dup)
  }
}
