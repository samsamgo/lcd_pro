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
    /* 3 · 2026-09-08 A1_downtown-tower-bluehour 는 여기서 빠져 `category.facade` 로 갔다.
       미디어파사드 카테고리에 A7(부감 야경, 배경 건물이 일본풍)이 걸려 있었고 그 A7 이
       /industries/outdoor-ad 히어로와도 겹쳤다. 사이트에서 유일하게 국내 도심 파사드로 읽히는
       컷이 A1 이라 그쪽에 더 필요하다. 히어로는 3장(야간 청사 → 주간 시공 → 화소 근접). */
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
    /**
     * 2026-09-09 CEO "3번(픽셀 근접)이 가장 먼저, 더 멋있는 이미지 추가".
     * spare 에서 확대 검사 통과분 3장을 히어로로 올렸다(같은 파일을 두 자리에 두지 않으려고 spare 에서 뺐다).
     *  · C2 호텔 로비 곡면 월 — 인물·문자·국적 단서 0
     *  · J2 폭풍 하늘 아래 지주형 — 화면 문자 0, 배경 원경만
     *  · D5 자동차 전시장 벽면 월 — 번호판 없음, 문자 0
     */
    heroCurved: S('C2_hotel-curved-wall'),
    heroStormy: S('J2_lowangle-stormy'),
    heroShowroom: S('D5_car-showroom-wall'),
    /**
     * 2026-09-09 CEO "메인 켰을 때 전광판 사진이 너무 적고, 전광판이 다 잘려 잘 안 보인다".
     * 슬라이드를 6 → 10 장으로 늘리면서 spare 에서 4장을 올렸다.
     * 🔴 **한 장씩 원본을 열어 보고** 골랐다(파일명으로 고르지 말 것 — §「이미지 배정은 렌더로 확인」).
     * 선정 기준은 하나 — **전광판이 프레임에서 크고 또렷하게 보이는가.**
     *  · C1 기업 로비 대형 월 — 화면이 프레임의 절반. 문자·인물·상호·국적 단서 0
     *  · C3 강당 무대 대형 월 — 화면이 프레임의 55%. 인물 0, 문자 0
     *  · K14 안개 낀 시골 학교 정문 '등교 시간 안내' — 국내 실사, 한국어 문구가 뜬 가로형
     *    (처음에 고른 K20 '결빙주의 서행' 은 같은 시각 `lib/industries.ts` 의
     *     roadIceWarning 으로 배정돼 있었다. 한 사진은 한 자리 — 히어로를 K14 로 돌렸다)
     *  · B2 청사 외벽 가로형 — 국내 관공서 실사(화면은 와이어프레임 플레이스홀더라
     *    캡션 없는 배경 층으로만 쓴다. 화면 내용을 근거로 무엇을 주장하지 않는다)
     *
     * 🔴 같은 검사에서 **탈락시킨 컷**은 spare 에 그대로 두었다. 다시 올리지 마라 —
     *  · E3_gym-scoreboard  화면에 HOME / GUEST / PERIOD, 벽에 EXIT (§13 영문 목록)
     *  · F1_highway-vms     미국 도로 — 목주 배전주·미국식 황색 마름모 표지
     *  · A3_roadside-pylon-dusk 미국식 목주 배전주·배럴 변압기(A8 을 뺀 것과 같은 사유)
     *  · K10_highschool-entrance-winter 국내 실사는 맞지만 전광판이 프레임의 24% 로 작다
     *    (이번 지시는 "더 크게 보이게" 다. 작은 컷은 이 자리에 맞지 않는다)
     *  · gen-44 크레인 취부 세로컷 — 화면이 소등 상태고 2:3 세로라 와이드 히어로에서 잘린다
     */
    heroLobby: W('C1_corporate-lobby-wall'),
    heroStage: W('C3_conference-hall-stage'),
    heroSchoolGate: W('K14_rural-school-gate-misty'),
    heroCityHall: W('B2_city-hall-wall'),
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
    /** 3 · gen-55 는 2026-09-08 quoteHero 로 갔다(SceneSlider 는 배선 해제 상태). 자리는 gen-53 지주형 유도사인으로 메운다 */
    G('gen-53'),
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
    // 2026-09-08 gen-26 은 category.outdoor 로 갔다. 이 갤러리는 배선 해제 상태(ScreenGallery)라 gen-23 으로 메운다
    G('gen-23'),
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
    /** 2026-09-08 K28 은 /about/certification 머리(pageHeaders.certification)로 갔다. CompanyChapters 는 배선 해제 상태 */
    chapter1: G('gen-12'),
    /** 국내 관공서 로비, 안전콘·비계 두고 캐비닛 취부 중 */
    chapter2: G('gen-8'),
    /** 흡착판으로 전면에서 모듈을 빼내는 국내 기술자 */
    chapter3: G('gen-9'),
    /**
     * 회사소개 여는 장(`AboutOpening`) — 스크롤로 열리는 창 안의 사진.
     *
     * 🔴 2026-09-09 키 이름을 `statement` → `opening` 으로 바꿨다. 사진은 그대로다.
     *    `CompanyStatement`(배선 해제 상태)가 쓰던 자리를 새 여는 장이 이어받았다.
     *
     * 후보 4장을 **원본을 열어 한 장씩 보고** 골랐다(파일명으로 고르지 말 것) —
     *  · F5_ferry-terminal  탈락. 화면에 영문 'NEXT SAILINGS / Island One', 주간
     *  · H6_handover-dusk   탈락. 미국식 목주 배전주·해외 작업자
     *  · I4_rooftop-laptop  보류. 석양 옥상 LED 후면. 결격은 없지만 도심 야경이 아니다
     *  · K25_local-theater  탈락. 실내 강당이고 흰 화면이 커서 흰 헤드라인과 싸운다
     * → 채택 = A2_rooftop-rain-night. 케이시스 오프닝(부감 야경 교차로)과 성격이 같다 —
     *   비 온 야간 도심, 옥상 대형 LED, 국내 간판·차량·전주. 얼굴 0 · 판독되는 영문 0.
     *
     * 🔴 **캡션 없는 배경 층으로만 쓴다.** 우리 시공 사진이 아니다. 실적 주장 금지.
     */
    // 2026-09-09 CEO "회사소개 배경 구리다, 더 멋있는 전광판 사진" — A2(비 오는 야간, 작은 옥상 화면·전주)
    //   → A1(블루아워 유리 타워 곡면 대형 LED 월, 광궤적). 이 리포에서 가장 강한 컷이다.
    opening: W('A1_downtown-tower-bluehour'),
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
  /* gen-31 은 2026-09-08 category.sports 로 갔다 (IndustryScenes 는 배선 해제 상태) */
  industryShowing: [G('gen-17'), G('gen-2'), G('gen-32'), G('gen-47')],
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
    /* 2026-09-08 K27 은 규격 비교표 머리(pageHeaders.specs)로 갔다. StructureShowcase 는 배선 해제 상태 */
    W('G3_cabinet-back-wiring'),
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
  /** 2026-09-08 F4(영문 'parking availability' 화면, §13 영문 목록) → gen-55 가을 청사 광장 세로형 사인(문자 없음) */
  quoteHero: G('gen-55'),

  /**
   * 제품 카테고리 6종 대표 사진 — 🔴 2026-09-08 **실제 이미지를 열어 보고** 배정했다.
   * 그 전에는 파일명만 보고 골라 '미디어파사드' 에 호텔 로비 실내 사진이,
   * '교통·주차 안내' 에 미국 도로 광고판이, '전자현수막' 에 정문 차단기가 붙어 있었다.
   * 사진을 바꿀 때는 **반드시 열어서 확인**하고, 카테고리 이름과 화면 내용이 맞는지 본다.
   */
  category: {
    /** 민원실 창구 위 가로형 — 화면에 '민원 안내' */
    indoor: G('gen-22'),
    /** 청사 앞 2주식 옥외 전광판 — '행정 안내 / 민원 서류 발급 시간'.
     *  2026-09-08 gen-10 에서 교체 — gen-10 은 모델 '건물 외벽 대형 화면'(OUT-L) 카드 사진이라
     *  /products/outdoor 한 페이지에서 머리와 모델 카드에 같은 사진이 두 번 떴다. */
    outdoor: G('gen-26'),
    /** 도로변 지주형 — '재난 안전 안내 / 시정 소식을 알려드립니다'. 현수막 게시대를 대체하는 형태 */
    banner: G('gen-5'),
    /** 블루아워 국내 도심 빌딩 외벽 대형 화면 — 미디어파사드 그 자체.
     *  2026-09-08 A7 에서 교체 — A7 은 /industries/outdoor-ad 히어로와 중복이었고 배경이 일본풍. */
    facade: W('A2_rooftop-rain-night'), // A1 은 company.opening 으로 (2026-09-09)
    /** 운동장 트러스 위 대형 화면 '체육 행사 안내 / 행사 시작 14:00' (gen-31 — 원본을 열어 확인).
     *  2026-09-08 E3 에서 교체 — E3 는 미국 체육관(EXIT 사인·HOME/GUEST 영문). §13 영문 목록 위반.
     *  ⚠️ 처음에 gen-32 로 적었다가 렌더 확인에서 어린이집 사진이 떠서 잡았다. 파일명·기억으로 배정하지 말 것. */
    sports: G('gen-31'),
    /** 시설 정문 차단기 옆 — '출입 안내 / 방문 차량은 정차해 주세요' */
    traffic: G('gen-29'),
  } as Record<string, string>,

  /** 하위 페이지 공통 배너(PageHeader) — 전용 사진이 없는 페이지 4곳. spare 에서 확대 검사 통과분만 골랐다.
   *  캡션 없는 배경 층이라 실적 주장이 아니다. */
  pageHeaders: {
    /** 2026-09-08 C4(미국 관제실, 영문 대시보드) → K28 '점검중' 모듈 검사 컷. 인증 = 검사다 */
    certification: W('K28_gloved-module-inspection'),
    downloads: W('C6_office-reception'),
    /** 2026-09-08 D5(해외 자동차 쇼룸, 화면 그라데이션) → K27 캐비닛 후면 '주차장 이용 안내' 실물 컷 */
    specs: W('K27_cabinet-back-workshop'),
  } as Record<string, string>,


  /* 🔴 2026-09-08 — 자동 배정 4묶음(industryDetail·productDetail·homeCases·homeCategoryCards)을 철회했다.
     파일명만 보고 자리에 꽂았더니 **사진과 제목이 어긋났다** — '관공서·민원실' 카드에 강당 무대 사진이,
     '공공기관·시설관리' 카드에 사무실에서 영상 편집하는 사람 사진이 붙었다.
     사진은 그 자리를 알아보게 하는 것이 첫 일이다. 주제가 맞지 않으면 유일성은 의미가 없다.
     → 큐레이션된 매칭 사진(`industry[slug]` · `products.img` · 카테고리 heroImage)으로 되돌렸다.
     같은 자리를 가리키는 카드와 상세가 같은 사진을 쓰는 것은 중복이 아니라 **동일 대상 표시**다.
     유일성 규칙은 **서로 다른 자리끼리** 겹치지 않게 하는 것으로 유지한다. */

  /** 남는 장면 — 사례 더보기·블로그 썸네일 등 자유 배치 */
  spare: [
    /** 2026-09-07 /services 취부 방식이 도해 섹션으로 바뀌면서 풀린 컷.
     *  확대 검사는 통과한 자산이라 삭제하지 않고 여기 둔다(위 mountScene 주석 참조). */
    G('gen-44'),
    /* 2026-09-07 — `svc-cabinet` 은 여기서 나가 `productsPitchMacro` 로 배선됐다.
       위 주석이 지시한 자리(/products SpecScale)를 그대로 따랐다. 되돌리려면
       productsPitchMacro 를 먼저 지워야 한다 — 두 자리에 두면 중복검사가 경고한다. */
    S('A8_cabinet-edge-louvre'),
    /* 2026-09-09 B2 · C1 · C3 · K14 는 여기서 나가 home 히어로 슬라이더로 갔다.
       (K20 은 같은 날 `lib/industries.ts` roadIceWarning 으로 갔다)
       되돌리려면 home 쪽을 먼저 지워야 한다 — 두 자리에 두면 아래 중복검사가 경고한다. */
    S('B6_park-info-kiosk'),
    /* A3 = 미국식 목주 배전주·배럴 변압기. 히어로 후보였으나 탈락(§13 ② 배경 판정) */
    S('A3_roadside-pylon-dusk'),
    S('B1_village-community-center'),
    S('B5_senior-center'),
    S('B7_fire-station-emergency'),
    S('D3_restaurant-menu-board'),
    S('D4_shop-window-ticker'),
    S('E1_perimeter-boards'),
    /* E3 = 화면에 HOME / GUEST / PERIOD, 벽에 EXIT. 히어로 후보였으나 탈락(§13 영문 목록) */
    S('E3_gym-scoreboard'),
    S('F4_parking-availability'),
    S('C4_control-room-wall'),
    /* F1 = 미국 도로(목주 배전주·미국식 황색 표지). 히어로 후보였으나 탈락 */
    S('F1_highway-vms'),
    S('F5_ferry-terminal'),
    S('G4_gloved-hands-pcb'),
    S('H2_crane-lift-frame'),
    S('H3_scissor-lift-align'),
    S('H4_indoor-module-mount'),
    S('H5_cabling-behind'),
    S('H6_handover-dusk'),
    S('I2_iot-controller-board'),
    S('I4_rooftop-laptop'),
    S('J3_floating-module-studio'),
    /* K10 = 국내 고교 정문 실사('신입생 환영'). 히어로 후보였으나 전광판이 프레임의 24% 로
       작아 "더 크게 보이게" 라는 이번 지시와 맞지 않아 남겨 뒀다. 카드·썸네일 자리에는 적합 */
    S('K10_highschool-entrance-winter'),
    S('K11_school-auditorium-fluorescent'),
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
    ...Object.values(IMAGES.category),
    ...Object.values(IMAGES.pageHeaders),
    ...Object.values(IMAGES.productCards),
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
