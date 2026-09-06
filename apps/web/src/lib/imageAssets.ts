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

/** 원본(최대 1600px 급) — 히어로·대형 장면용 */
const W = (name: string) => `/wk/${name}.jpg`
/** 축소본 — 카드·썸네일 격자용. 원본을 격자에 쓰면 첫 로드가 무거워진다 */
const S = (name: string) => `/wk/sm/${name}.jpg`

export const IMAGES = {
  /* ── 홈 ────────────────────────────────────────────── */
  home: {
    /** 히어로 주연 한 장. 자동 슬라이드는 쓰지 않는다(메시지가 스스로 사라진다) */
    hero: W('A1_downtown-tower-bluehour'),
    /** 히어로 마스크 리빌의 두 번째 층 */
    heroReveal: W('A4_curved-media-facade-day'),
    /** 스크롤 문장 섹션 배경 */
    statement: W('J4_pixel-light-wave'),
  },

  /** 홈 다크 시네마틱 장면 — sticky scroll 3막 */
  cinematic: [
    W('J1_pixel-bokeh-hero'),
    W('G1_pixel-macro'),
    W('K26_module-front-workbench'),
  ],

  /** 홈 — 설치 장면 갤러리 (격자라 축소본을 쓴다) */
  homeGallery: [
    S('K03_community-center-cloudy'),
    S('K05_civic-service-earlymorning'),
    S('K13_school-lobby-lunch-notice'),
    S('B8_agricultural-coop'),
    S('K22_public-auditorium-meeting'),
    S('K12_gym-stage-overcast-day'),
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
  company: {
    hero: W('A6_smalltown-mainstreet'),
    chapter1: W('K28_gloved-module-inspection'),
    chapter2: W('H1_facade-install-crew'),
    chapter3: W('I3_monitoring-room-fleet'),
  },

  /* ── 솔루션(공급 범위) 6공정 ───────────────────────── */
  service: [
    W('I1_tablet-diagnostic'),
    W('K29_cabinet-test-pattern'),
    W('K34_roadside-hbeam-crane'),
    W('K35_cabinet-cabling-fluorescent'),
    W('K32_school-gate-frame-install'),
    W('K30_parts-layout-service-bench'),
  ],
  servicesHero: W('A2_rooftop-rain-night'),

  /* ── 제품 ──────────────────────────────────────────── */
  productsHero: W('A5_twin-vertical-plaza'),
  /** 제품 상세 쇼케이스 — 구조·배선·방열·마감 */
  showcase: [
    W('G6_exploded-layers'),
    W('K27_cabinet-back-workshop'),
    W('A8_cabinet-edge-louvre'),
    W('J6_flatlay-editorial'),
  ],
  /** 제품 페이지 환경별 컷 */
  productScenes: [
    S('B2_city-hall-wall'),
    S('C1_corporate-lobby-wall'),
    S('B6_park-info-kiosk'),
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
  faqHero: W('F3_airport-fids'),
  quoteHero: W('F4_parking-availability'),

  /** 남는 장면 — 사례 더보기·블로그 썸네일 등 자유 배치 */
  spare: [
    S('K02_county-hall-granite-morning'),
    S('A3_roadside-pylon-dusk'),
    S('K06_fire-safety-building-flatlight'),
    S('B1_village-community-center'),
    S('B3_bus-stop-arrival'),
    S('B4_elementary-school-gate'),
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
    S('G2_cabinet-studio'),
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
    S('K04_health-center-drizzle'),
    S('K10_highschool-entrance-winter'),
    S('K11_school-auditorium-fluorescent'),
    S('K14_rural-school-gate-misty'),
    S('K15_intersection-electronic-board-cloudy'),
    S('K18_parking-entry-grayday'),
    S('K19_bus-terminal-dusk'),
    S('K20_snow-road-night-warning'),
    S('K23_school-multipurpose-hall-day'),
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
    ...IMAGES.homeGallery,
    ...Object.values(IMAGES.industry),
    IMAGES.industriesHero,
    ...IMAGES.industryScenes,
    ...Object.values(IMAGES.company),
    ...IMAGES.service,
    IMAGES.servicesHero,
    IMAGES.productsHero,
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
