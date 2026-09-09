import type { CategorySlug } from './productCategories'

/**
 * 제품 모델(시리즈) 사양 — 공급사 규격서에서 **그대로 옮긴** 값이다.
 *
 * 🔴 규칙 (2026-09-09 WS-C)
 *  1. 이 파일의 숫자는 전부 공급사 유통 카탈로그(2026-04 발행) 규격표에서 읽어 옮긴 것이다.
 *     여기서 계산하거나 지어낸 값은 없다. **읽히지 않거나 명백히 잘못 인쇄된 칸은 빈 문자열**로 둔다.
 *     비어 있는 것이 틀린 값보다 낫다.
 *  2. 공급사 브랜드명·공급사 모델코드는 화면에 내보내지 않는다. 시리즈 이름은 우리 표기(`series`),
 *     표의 열 머리는 **화소 간격**이다. 값만 카탈로그 그대로다.
 *  3. 이 층은 '무엇을 파는가'(모델 사양)를 다룬다. 견적 금액이 걸린 SKU 층(`lib/products.ts`)과
 *     별개다. 그쪽은 견적엔진(standardBlock/bomPricing)이 참조하므로 건드리지 않는다.
 *  4. 카테고리 소개 문구에서 밝기를 앞세우지 않는다(CEO 2026-09-09 "밝기로 쓰지 말고 크기로").
 *     밝기는 아래 규격표 안에만 둔다.
 */

export type ModelEnv = 'indoor' | 'outdoor' | 'rental'
/** 모듈 = 캐비닛에 얹는 단품 / 캐비닛 = 프레임까지 조립된 한 장 */
export type ModelForm = 'module' | 'cabinet'

export interface SpecRow {
  label: string
  /** 피치별 값. `pitches` 와 길이가 같아야 한다. 빈 칸은 '' */
  values?: string[]
  /** 전 피치 공통값 */
  single?: string
}

export interface ProductModel {
  /** 화면에 크게 뜨는 시리즈 이름 (우리 표기) */
  series: string
  /** URL 세그먼트 — /products/models/{slug} */
  slug: string
  /** 대표 설치 환경 */
  env: ModelEnv
  /** 화면에 쓸 환경 표기. 실내·실외 겸용처럼 한 단어로 안 되는 경우만 채운다 */
  envLabel?: string
  form: ModelForm
  /** 한글 이름 — 시리즈 이름 아래 한 줄 */
  name: string
  /** 카드·상세 머리의 한 줄 소개 */
  tagline: string
  images: { src: string; alt: string }[]
  /** 규격표 열 머리 = 화소 간격 */
  pitches: string[]
  specRows: SpecRow[]
  /** 이 모델이 실리는 카테고리 페이지 */
  categories: CategorySlug[]
  /** 특징 — 카탈로그 FEATURES 를 우리말로 옮긴 것 */
  features: string[]
  /** 국내 인증 표기는 실물 서류가 있을 때만 채운다. 지금은 비운다 */
  certifications?: string[]
}

const IMG = '/images/products'

export const PRODUCT_MODELS: ProductModel[] = [
  /* ───────────────────────── 실내 ───────────────────────── */
  {
    series: 'WK-D COB',
    slug: 'cob-fine',
    env: 'indoor',
    form: 'module',
    name: '초고해상도 실내 LED (COB)',
    tagline: '가장 촘촘한 간격이 0.9mm대. 바로 앞에서 봐도 선명한 회의실·상황실용 고해상도 모델입니다.',
    images: [{ src: `${IMG}/cob-fine-1.webp`, alt: '가상화소 COB 모듈의 앞면과 뒷면' }],
    pitches: ['P0.9', 'P1.25', 'P1.538'],
    features: ['가상화소 구현 방식', '전·후면 보호 구조', 'COB 플립칩', '동급 대비 낮은 단가'],
    specRows: [
      { label: '화소 간격', values: ['0.90909mm', '1.25mm', '1.538mm'] },
      { label: '모듈 크기 (W×H)', single: '320mm × 160mm' },
      { label: '모듈 해상도 (가상화소, W×H)', values: ['352×176', '256×128', '208×104'] },
      { label: '모듈 무게', values: ['0.5kg', '0.5kg', '0.27kg'] },
      { label: '밝기', values: ['600nit', '450nit', '450nit'] },
      { label: '시야각 (수평/수직)', single: '160° / 140°' },
      { label: '계조', single: '14bit' },
      { label: '리프레시', single: '4,200Hz' },
      { label: '최대 입력전력', values: ['283W/㎡', '209W/㎡', '310W/㎡'] },
      { label: '구동 방식', single: '정전류 구동' },
      { label: '스캔 방식', values: ['1/44', '1/64', '1/52'] },
    ],
    categories: ['indoor'],
  },
  {
    series: 'WK-COB',
    slug: 'cob',
    env: 'indoor',
    form: 'module',
    name: '고해상도 실내 LED (COB)',
    tagline: '표면이 매끈하게 코팅돼 긁힘과 습기에 강한 실내 고해상도 모델입니다. 로비·복도처럼 사람이 가까이 오는 자리에 맞습니다.',
    images: [{ src: `${IMG}/cob-1.webp`, alt: 'COB 모듈의 표시면과 뒷면 구조' }],
    pitches: ['P1.25', 'P1.53', 'P1.86'],
    features: ['군더더기 없는 표면 구조', '풀 플립칩 COB', '실내 근거리 표시', '상시 재고 구성 운용'],
    specRows: [
      { label: '화소 간격', values: ['1.25mm', '1.53mm', '1.86mm'] },
      { label: '모듈 크기 (W×H)', single: '320mm × 160mm' },
      { label: '모듈 해상도 (W×H)', values: ['256×128', '208×104', '172×86'] },
      { label: '모듈 무게', single: '0.5kg' },
      { label: '밝기', single: '600nit' },
      { label: '시야각 (수평/수직)', single: '160° / 160°' },
      { label: '계조', single: '13bit' },
      { label: '리프레시', single: '3,840Hz' },
      { label: '최대 입력전력', values: ['400W/㎡', '285W/㎡', '280W/㎡'] },
      { label: '구동 방식', single: '정전류 구동' },
      { label: '스캔 방식', values: ['1/64', '1/52', '1/43'] },
    ],
    categories: ['indoor'],
  },
  {
    series: 'WK-CORE I',
    slug: 'core-i',
    env: 'indoor',
    form: 'module',
    name: '실내 표준형 LED',
    tagline: '민원실·로비·회의실에 가장 많이 쓰는 기본 실내 모델입니다. 화소 간격 8가지 중 고릅니다.',
    images: [{ src: `${IMG}/core-i-1.webp`, alt: '실내 표준 모듈의 표시면과 뒷면 기판' }],
    pitches: ['P1.25', 'P1.538', 'P1.86', 'P2', 'P2.5', 'P3', 'P3.076', 'P4'],
    features: ['가벼운 구조', '안정된 동작', '실내 조명 아래에서의 표시 품질', '방열 설계'],
    specRows: [
      { label: 'LED 소자', values: ['SMD1010', 'SMD1212', 'SMD1515', 'SMD1515', 'SMD2121', 'SMD2121', 'SMD2121', 'SMD2121'] },
      { label: '화소 간격', values: ['1.25mm', '1.538mm', '1.86mm', '2mm', '2.5mm', '3mm', '3.076mm', '4mm'] },
      { label: '모듈 해상도 (W×H)', values: ['256×128', '208×104', '172×86', '160×80', '128×64', '64×64', '104×52', '80×40'] },
      { label: '모듈 크기 (W×H)', values: ['320×160', '320×160', '320×160', '320×160', '320×160', '192×192', '320×160', '320×160'] },
      { label: '모듈 무게 (kg)', values: ['0.48±0.02', '0.49±0.02', '0.43±0.02', '0.45±0.02', '0.38±0.02', '0.23±0.02', '0.35±0.02', '0.46±0.02'] },
      { label: '점 단위 밝기 보정', single: '지원' },
      { label: '화이트밸런스 밝기', single: '500nit' },
      { label: '색온도', single: '6,500K ~ 25,000K 조정' },
      { label: '시야각 (수평/수직)', single: '160° / 140°' },
      { label: '명암비', single: '5,000 : 1' },
      { label: '최대 소비전력 (W/㎡)', values: ['586', '488', '300', '270', '315', '543', '488', '488'] },
      { label: '평균 소비전력 (W/㎡)', values: ['176', '163', '90', '90', '105', '180', '163', '163'] },
      { label: '입력 전압', single: 'AC90~132V / AC186~264V, 47~63Hz' },
      { label: '주파수', single: '60Hz' },
      { label: '리프레시', single: '4,200Hz' },
      { label: '영상 지원', single: '2K HD · 4K UHD' },
      { label: '수명', single: '100,000시간' },
      { label: '동작 온도 / 습도', single: '-20℃ ~ +45℃ / 10% ~ 50%RH' },
      { label: '보관 온도 / 습도', single: '-20℃ ~ +50℃ / 10% ~ 60%RH' },
    ],
    categories: ['indoor'],
  },
  {
    series: 'WK-PRIME',
    slug: 'prime',
    env: 'indoor',
    form: 'module',
    envLabel: '실내 · 실외',
    name: '방송·촬영용 고주사율 LED',
    tagline: '카메라로 찍어도 화면이 떨리거나 줄이 생기지 않는 모델입니다. 방송 스튜디오·행사 무대·중계가 있는 경기장용, 실내·실외 모두 가능합니다.',
    images: [{ src: `${IMG}/prime-1.webp`, alt: '고주사 모듈의 표시면과 뒷면 기판' }],
    // 2026-09-09 전수 대조: 열 머리 P1.53 은 아래 '화소 간격' 행의 1.538mm 와 어긋났다.
    // 카탈로그 규격표의 실제 값(1.538mm)에 맞춰 P1.538 로 고친다(다른 시리즈 표기와도 일치).
    pitches: ['P1.25', 'P1.538', 'P1.86', 'P2', 'P2.5', 'P2.5 실외', 'P3.076 실외', 'P4 실외', 'P5 실외'],
    features: ['가벼운 구조', '안정된 동작', '높은 밝기와 리프레시', '방열 설계'],
    specRows: [
      { label: '설치 환경', values: ['실내', '실내', '실내', '실내', '실내', '실외', '실외', '실외', '실외'] },
      { label: 'LED 소자', values: ['SMD1010', 'SMD1212', 'SMD1515', 'SMD1515', 'SMD2121', 'SMD1415', 'SMD1415', 'SMD1921', 'SMD1921'] },
      { label: '화소 간격', values: ['1.25mm', '1.538mm', '1.86mm', '2mm', '2.5mm', '2.5mm', '3.076mm', '4mm', '5mm'] },
      { label: '모듈 해상도 (W×H)', values: ['256×128', '208×104', '172×86', '160×80', '128×64', '128×64', '104×52', '80×40', '64×32'] },
      { label: '모듈 크기 (W×H)', single: '320 × 160' },
      { label: '모듈 무게 (kg)', values: ['0.48±0.02', '0.49±0.02', '0.38±0.02', '0.45±0.02', '0.38±0.02', '0.46±0.02', '0.43±0.02', '0.49±0.02', '0.48±0.02'] },
      { label: '점 단위 밝기 보정', single: '지원' },
      { label: '화이트밸런스 밝기 (nit)', values: ['600~800', '600~800', '600~800', '600~800', '600~800', '5,500', '6,000', '6,000', '6,000'] },
      { label: '색온도', values: ['6,500K~25,000K 조정', '6,500K~25,000K 조정', '6,500K~25,000K 조정', '6,500K~25,000K 조정', '6,500K~25,000K 조정', '2,000K~9,300K', '2,000K~9,300K', '2,000K~9,300K', '2,000K~9,300K'] },
      { label: '시야각 (수평/수직)', values: ['160°/140°', '160°/140°', '160°/140°', '160°/140°', '160°/140°', '140°/140°', '140°/140°', '140°/140°', '140°/140°'] },
      { label: '명암비', single: '5,000 : 1' },
      { label: '최대 소비전력 (W/㎡)', values: ['534', '530', '396', '370', '430', '747', '750', '750', '747'] },
      { label: '평균 소비전력 (W/㎡)', values: ['178', '176', '132', '124', '143', '249', '250', '250', '249'] },
      { label: '입력 전압', single: 'AC90~132V / AC186~264V, 47~63Hz' },
      { label: '주파수', single: '60Hz' },
      { label: '리프레시', single: '7,600Hz' },
      { label: '영상 지원', single: '2K HD · 4K UHD' },
      { label: '수명', single: '100,000시간' },
      { label: '동작 온도 / 습도', values: ['-20℃~+45℃ / 10~50%RH', '-20℃~+45℃ / 10~50%RH', '-20℃~+45℃ / 10~50%RH', '-20℃~+45℃ / 10~50%RH', '-20℃~+45℃ / 10~50%RH', '-20℃~+50℃ / 10~80%RH', '-20℃~+50℃ / 10~80%RH', '-20℃~+50℃ / 10~80%RH', '-20℃~+50℃ / 10~80%RH'] },
      { label: '보관 온도 / 습도', values: ['-20℃~+50℃ / 10~60%RH', '-20℃~+50℃ / 10~60%RH', '-20℃~+50℃ / 10~60%RH', '-20℃~+50℃ / 10~60%RH', '-20℃~+50℃ / 10~60%RH', '-20℃~+55℃ / 10~85%RH', '-20℃~+55℃ / 10~85%RH', '-20℃~+55℃ / 10~85%RH', '-20℃~+55℃ / 10~85%RH'] },
    ],
    categories: ['indoor', 'outdoor', 'facade', 'sports'],
  },
  {
    series: 'WK-FLEX',
    slug: 'curve-f',
    env: 'indoor',
    form: 'module',
    name: '곡면형 LED (휘어지는 모듈)',
    tagline: '기둥·아치·곡면 벽처럼 평평하지 않은 자리에 붙이는 휘어지는 모델입니다.',
    images: [{ src: `${IMG}/curve-f-1.webp`, alt: 'S자로 휘어진 연성 LED 모듈' }],
    pitches: ['P1.25', 'P1.538', 'P1.86', 'P2', 'P2.5', 'P3.076'],
    features: ['자유로운 형상 구성', '작고 가벼움', '고무 바닥 구조', '설치가 간단함'],
    specRows: [
      { label: 'LED 소자', values: ['SMD1010', 'SMD1212', 'SMD1515', 'SMD1515', 'SMD1515', 'SMD2121'] },
      { label: '화소 간격', values: ['1.25mm', '1.538mm', '1.86mm', '2mm', '2.5mm', '3.076mm'] },
      { label: '모듈 해상도 (W×H)', values: ['256×128', '208×104', '172×86', '160×80', '128×64', '104×52'] },
      { label: '모듈 크기 (W×H)', single: '320mm × 160mm' },
      { label: '모듈 무게 (kg)', values: ['0.283±0.01', '0.283±0.01', '0.298±0.01', '0.27±0.01', '0.25±0.01', '0.35±0.01'] },
      { label: '점 단위 밝기 보정', single: '지원' },
      { label: '화이트밸런스 밝기 (nit)', values: ['500', '500', '450~500', '450~500', '450~500', '500'] },
      { label: '색온도', single: '6,500K ~ 25,000K 조정' },
      { label: '시야각 (수평/수직)', single: '140° / 140°' },
      { label: '명암비', single: '3,000 : 1' },
      { label: '최대 소비전력 (W/㎡)', values: ['415', '488', '391', '293', '328', '430'] },
      { label: '평균 소비전력 (W/㎡)', values: ['125', '162', '117', '89', '98', '129'] },
      { label: '입력 전압', single: 'AC90~132V / AC186~264V, 47~63Hz' },
      { label: '프레임 변환 주파수', single: '60Hz' },
      { label: '리프레시', single: '4,200Hz 이상' },
      { label: '수명', single: '100,000시간' },
      { label: '동작 온도 / 습도', single: '-20℃ ~ +45℃ / 10% ~ 50%RH' },
      { label: '보관 온도 / 습도', single: '-20℃ ~ +50℃ / 10% ~ 60%RH' },
    ],
    categories: ['indoor', 'facade'],
  },
  {
    series: 'WK-MINI',
    slug: 'slim-m',
    env: 'indoor',
    form: 'cabinet',
    name: '초슬림 실내 LED',
    tagline: '두께 29.8mm. 벽에 액자처럼 얇게 붙여야 하는 실내 자리에 맞는 모델입니다.',
    images: [{ src: `${IMG}/slim-m-1.webp`, alt: '초박형 실내 LED 캐비닛의 앞면과 뒷면' }],
    pitches: ['P0.9', 'P1.2', 'P1.5', 'P1.8'],
    features: ['일체형 3-in-1 구성', '설치 정밀도', '가장 얇은 패널 두께 29.8mm', '전면 유지보수'],
    specRows: [
      { label: '패널 해상도 (dots)', values: ['640×360', '480×270', '384×216', '320×360'] },
      { label: '패널 크기 (mm)', values: ['600×337.5×29.8', '600×337.5×39.75', '600×337.5×39.75', '600×675×39.75'] },
      { label: '유지보수', single: '전면 전체' },
      { label: '재질', single: '다이캐스팅 알루미늄' },
      // 카탈로그의 P1.8 값(79kg/big panel)은 다른 칸(4kg 대)과 두 자릿수 어긋난다.
      // 오기로 보여 그대로 싣지 않고 비운다 — 공급사 확인 후 채운다.
      { label: '패널 무게 (장당)', values: ['4.3kg', '4kg', '4kg', ''] },
      { label: '밝기 (nit)', values: ['600', '600', '600', '500'] },
      { label: '리프레시', single: '3,840Hz' },
      { label: '처리 심도', single: '13bit' },
      { label: '시야각', values: ['수평 170° / 수직 160°', '160°', '160°', '160°'] },
      { label: '최대 입력 전력 (장당)', values: ['60W', '70W', '70W', '130W'] },
    ],
    categories: ['indoor'],
  },
  {
    series: 'WK-FX',
    slug: 'front-x',
    env: 'indoor',
    form: 'cabinet',
    name: '전면 정비형 실내 LED',
    tagline: '고장 시 앞에서 모듈을 빼서 고치는 모델입니다. 벽에 밀착 시공해 뒤 공간이 없는 자리에 맞습니다.',
    images: [{ src: `${IMG}/front-x-1.webp`, alt: '전면 유지보수 실내 LED 캐비닛의 뒷면 구조와 표시면' }],
    pitches: ['P1.25', 'P1.538', 'P1.839', 'P1.86', 'P2', 'P2.5', 'P3.07', 'P4'],
    features: ['자체 설계 캐비닛', '높은 밝기·명암비·리프레시', '구성 자유도', '기존 시스템과의 호환'],
    specRows: [
      { label: '화소 구성', values: ['SMD1010', 'SMD1212', 'SMD1515', 'SMD1515', 'SMD1515', 'SMD2121', 'SMD2121', 'SMD2121'] },
      { label: '모듈 해상도 (W×H)', values: ['256×128', '208×104', '174×87', '172×86', '160×80', '128×64', '104×52', '80×40'] },
      { label: '캐비닛 크기 (W×H×D)', single: '640×480×60 / 640×640×62 (mm)' },
      // P1.86 칸의 카탈로그 표기(344×228)는 640×480 캐비닛에서 성립하지 않는다
      // (480 ÷ 1.86 = 258). 세로 값이 오기로 보여 비워 둔다 — 공급사 확인 후 채운다.
      { label: '캐비닛 해상도 (W×H)', values: ['512×384', '416×312', '348×261', '', '320×240', '256×192', '208×156', '160×120'] },
      // 카탈로그 표기(78)는 640×480 캐비닛 무게로 성립하지 않는다(오기 추정). 비워 둔다.
      { label: '캐비닛 무게 (장당)', single: '' },
      { label: '시야각 (수평/수직)', single: '160° / 140°' },
      { label: '색온도', single: '2,000K ~ 9,300K 조정' },
      { label: '리프레시', single: '4,200Hz 이상' },
      { label: '밝기', single: '600nit' },
      { label: '명암비', single: '5,000 : 1' },
      { label: 'AC 입력 전력 최대/평균 (W/㎡)', values: ['488 / 146', '488 / 146', '488 / 146', '387 / 129', '488 / 146', '488 / 146', '488 / 146', '488 / 146'] },
      { label: '방진·방수 등급 (전면)', single: 'IP30' },
    ],
    categories: ['indoor', 'sports'],
  },
  {
    series: 'WK-BASE',
    slug: 'base-c',
    env: 'indoor',
    form: 'cabinet',
    name: '실내 보급형 LED',
    tagline: '가격 부담을 줄인 실내 기본 모델입니다. 앞뒤 어느 쪽에서도 정비할 수 있습니다.',
    images: [{ src: `${IMG}/base-c-1.webp`, alt: '실내 보급형 LED 캐비닛의 뒷면 구조와 표시면' }],
    pitches: ['P1.86', 'P2', 'P2.5'],
    features: ['전용 시스템 카드', '가격 대비 성능', '운송 방식 선택 가능', '높은 강성과 평탄도'],
    specRows: [
      { label: '화소 간격', values: ['1.86mm', '2mm', '2.5mm'] },
      { label: '캐비닛 크기', single: '320 × 480 (mm)' },
      { label: '모듈 크기', single: '320 × 160 (mm)' },
      { label: '캐비닛 무게 (장당)', single: '2.2kg' },
      { label: '화이트밸런스 밝기', single: '450nit 이상' },
      { label: '표준 색온도', single: '8,000K ~ 24,000K 조정' },
      { label: '시야각 (수평/수직)', single: '140° / 140°' },
      { label: '리프레시', single: '4,200Hz 이상' },
      { label: '유지보수', single: '전면 · 후면' },
      { label: '방진·방수 등급 (전면/후면)', single: 'IP30' },
      { label: '최대 소비전력 (W/㎡)', values: ['371', '332', '312'] },
      { label: '평균 소비전력 (W/㎡)', values: ['124', '111', '104'] },
    ],
    categories: ['indoor'],
  },

  /* ───────────────────────── 실외 ───────────────────────── */
  {
    series: 'WK-CORE O',
    slug: 'core-o',
    env: 'outdoor',
    form: 'module',
    name: '실외 표준형 LED',
    tagline: '정문·도로변·전자현수막 게시대에 가장 많이 쓰는 기본 실외 모델입니다. 햇빛 아래에서도 잘 보입니다.',
    images: [{ src: `${IMG}/core-o-1.webp`, alt: '실외 표준 모듈의 표시면과 뒷면 기판' }],
    pitches: ['P2.5', 'P3.076', 'P4', 'P5', 'P6', 'P8', 'P10'],
    features: ['가벼운 구조', '안정된 동작', '실외 표시 품질', '방열 설계', '고휘도 사양 선택 가능(5,500~6,000nit)'],
    specRows: [
      { label: 'LED 소자', values: ['SMD1415', 'SMD1415', 'SMD1921', 'SMD1921', 'SMD1921', 'SMD2727', 'SMD3535'] },
      { label: '화소 간격', values: ['2.5mm', '3.076mm', '4mm', '5mm', '6mm', '8mm', '10mm'] },
      { label: '모듈 해상도 (W×H)', values: ['128×64', '104×52', '80×40', '64×32', '32×32', '40×20', '32×16'] },
      { label: '모듈 크기 (W×H)', values: ['320×160', '320×160', '320×160', '320×160', '192×192', '320×160', '320×160'] },
      { label: '모듈 무게 (kg)', values: ['0.46±0.02', '0.43±0.02', '0.49±0.02', '0.48±0.02', '0.35±0.02', '0.48±0.02', '0.47±0.02'] },
      { label: '점 단위 밝기 보정', single: '지원' },
      { label: '화이트밸런스 밝기 (nit)', values: ['4,500 이상', '5,000 이상', '5,000 이상', '5,000 이상', '4,500 이상', '4,000~4,500', '4,000~4,500'] },
      { label: '색온도', single: '6,500K ~ 9,500K 조정' },
      { label: '시야각 (수평/수직)', single: '140° / 140°' },
      { label: '명암비', single: '5,000 : 1' },
      { label: '최대 소비전력 (W/㎡)', values: ['879', '879', '879', '879', '895', '879', '645'] },
      { label: '평균 소비전력 (W/㎡)', values: ['293', '293', '293', '293', '268', '293', '215'] },
      { label: '입력 전압', single: 'AC90~132V / AC186~264V, 47~63Hz' },
      { label: '주파수', single: '60Hz' },
      { label: '리프레시', single: '4,200Hz' },
      { label: '영상 지원', single: '2K HD · 4K UHD' },
      { label: '수명', single: '100,000시간' },
      { label: '동작 온도 / 습도', single: '-20℃ ~ +50℃ / 10% ~ 80%RH' },
      { label: '보관 온도 / 습도', single: '-20℃ ~ +55℃ / 10% ~ 85%RH' },
    ],
    categories: ['outdoor', 'banner', 'facade', 'sports', 'traffic'],
  },
  {
    series: 'WK-SHIELD',
    slug: 'shield-o',
    env: 'outdoor',
    form: 'cabinet',
    name: '실외 방수형 LED (IP65)',
    tagline: '비·눈을 직접 맞는 건물 외벽·옥외 구조물용 방수 모델입니다. 960×960mm 캐비닛을 이어 붙여 대형 화면을 만듭니다.',
    images: [{ src: `${IMG}/shield-o-1.webp`, alt: '실외 IP65 LED 캐비닛의 뒷면 구조와 표시면' }],
    pitches: ['P2.5', 'P3.076', 'P4', 'P5', 'P6.67', 'P8', 'P10'],
    features: ['표준 호환 캐비닛', '더 얇고 가벼운 구조', 'IP65 방수 구조', '높은 밝기와 명암비'],
    specRows: [
      { label: '화소 구성', values: ['SMD1415', 'SMD1415', 'SMD1921', 'SMD1921', 'SMD2727', 'SMD2727', 'SMD3535'] },
      { label: '모듈 해상도 (W×H)', values: ['128×64', '104×52', '80×40', '64×32', '48×24', '40×20', '32×16'] },
      { label: '캐비닛 크기 (W×H×D)', single: '960 × 960 × 103.05 (mm)' },
      { label: '캐비닛 무게 (장당)', single: '26.5kg' },
      // P2.5·P3.076 칸의 카탈로그 표기(256×256 / 208×208)는 960mm 캐비닛에서 성립하지 않는다
      // (960 ÷ 2.5 = 384, 960 ÷ 3.076 = 312). 오기로 보여 비워 둔다 — 공급사 확인 후 채운다.
      // 나머지 칸은 960÷피치와 정확히 맞는다(4→240, 5→192, 6.667→144, 8→120, 10→96).
      { label: '캐비닛 해상도 (W×H)', values: ['', '', '240×240', '192×192', '144×144', '120×120', '96×96'] },
      { label: 'AC 입력 전력 최대/평균 (W/㎡)', values: ['637 / 191', '696 / 209', '675 / 203', '712 / 214', '710 / 213', '847 / 254', '756 / 227'] },
      { label: '리프레시', single: '4,200Hz' },
      { label: '화이트밸런스 밝기 (cd/㎡)', values: ['5,000~5,500', '5,500~6,000', '5,500~6,000', '5,500~6,000', '5,500~6,000', '5,500~6,000', '5,500~6,000'] },
      { label: '명암비', single: '5,000 : 1' },
      { label: '시야각 (수평/수직)', single: '160° / 140°' },
      { label: '방진·방수 등급 (전면/후면)', single: 'IP65 / IP54' },
    ],
    categories: ['outdoor', 'banner', 'facade', 'sports', 'traffic'],
  },

  /* ───────────────────────── 렌탈 · 행사 ───────────────────────── */
  {
    series: 'WK-STAGE M',
    slug: 'stage-r',
    env: 'rental',
    form: 'module',
    envLabel: '렌탈 (실내 · 실외)',
    name: '행사·렌탈용 LED 모듈',
    tagline: '공연·행사장에서 설치했다 철거하는 임시 화면용 모델입니다. 실내·실외 모두 가능합니다.',
    images: [{ src: `${IMG}/stage-r-1.webp`, alt: '렌탈용 250mm 정사각 LED 모듈의 뒷면과 표시면' }],
    pitches: ['P2.6 실내', 'P2.9 실내', 'P3.91 실내', 'P3.91 실외', 'P4.81 실외'],
    features: ['250mm × 250mm 정사각', '안정된 동작', '단순한 외형', '500×500 / 500×1000 렌탈 캐비닛에 적용'],
    specRows: [
      { label: '설치 환경', values: ['실내', '실내', '실내', '실외', '실외'] },
      { label: 'LED 소자', values: ['SMD1515', 'SMD2121', 'SMD2121', 'SMD1921', 'SMD1921'] },
      { label: '화소 간격', values: ['2.604mm', '2.9mm', '3.91mm', '3.91mm', '4.816mm'] },
      { label: '모듈 해상도 (W×H)', values: ['96×96', '84×84', '64×64', '64×64', '52×52'] },
      { label: '모듈 크기 (W×H×D)', single: '250mm × 250mm × 15.6mm' },
      { label: '모듈 무게 (kg)', single: '0.49±0.02' },
      { label: '화이트밸런스 밝기 (nit)', values: ['600', '600', '600', '3,500', '3,500'] },
      { label: '색온도', single: '6,500K (1,000K ~ 9,500K 조정)' },
      { label: '시야각 (수평/수직)', values: ['140°/140°', '140°/140°', '140°/140°', '140°/120°', '140°/120°'] },
      { label: '명암비', single: '5,000 : 1' },
      { label: '모듈 최대 소비전력', values: ['24W 이하', '30W 이하', '25W 이하', '31.5W 이하', '27W 이하'] },
      { label: '최대 소비전력 (W/㎡)', values: ['342', '480', '500', '630', '540'] },
      { label: '평균 소비전력 (W/㎡)', values: ['103', '144', '150', '189', '162'] },
      { label: '입력 전압', single: 'AC90~132V / AC186~264V, 47~63Hz' },
      { label: '주파수', single: '60Hz' },
      { label: '리프레시', single: '3,840Hz' },
      { label: '영상 지원', single: '2K HD · 4K UHD' },
      { label: '수명', single: '100,000시간' },
      { label: '동작 온도 / 습도', values: ['-20℃~+45℃ / 10~50%RH', '-20℃~+45℃ / 10~50%RH', '-20℃~+45℃ / 10~50%RH', '-20℃~+50℃ / 10~80%RH', '-20℃~+50℃ / 10~80%RH'] },
      { label: '보관 온도 / 습도', values: ['-20℃~+50℃ / 10~60%RH', '-20℃~+50℃ / 10~60%RH', '-20℃~+50℃ / 10~60%RH', '-20℃~+55℃ / 10~85%RH', '-20℃~+55℃ / 10~85%RH'] },
    ],
    categories: ['outdoor', 'sports'],
  },
  {
    series: 'WK-STAGE C',
    slug: 'stage-c',
    env: 'rental',
    form: 'cabinet',
    envLabel: '렌탈 (실내 · 실외)',
    name: '행사·렌탈용 LED 캐비닛',
    tagline: '손잡이와 잠금장치가 있어 빠르게 조립·철거하는 행사용 모델입니다. 곡면으로도 이어 붙습니다.',
    images: [{ src: `${IMG}/stage-c-1.webp`, alt: '렌탈용 LED 캐비닛의 표시면과 잠금장치가 보이는 뒷면' }],
    pitches: ['P2.6 실내', 'P3.9 실외'],
    features: ['가벼움', '곡면 잠금 구조', '다중 연결', '방열 설계'],
    specRows: [
      { label: '설치 환경', values: ['실내', '실외'] },
      { label: 'LED 타입', values: ['SMD1515', 'SMD1921'] },
      { label: '화소 밀도 (dots/㎡)', values: ['147,456', '65,536'] },
      { label: '패널당 화소', values: ['192×192 / 384', '128×128 / 256'] },
      { label: '모듈 크기 (W×H, mm)', single: '250 × 250' },
      { label: '패널 크기 (W×H×D, mm)', single: '500×500 / 1000 × 81' },
      { label: '무게 (kg)', single: '7.5 / 13.5' },
      { label: '방진·방수 (전면/후면)', values: ['IP40 / IP20', 'IP65'] },
      { label: '처리 심도', single: '14bit' },
      { label: '리프레시', single: '7,680Hz' },
      { label: '밝기 (nit)', values: ['700', '4,000~4,500'] },
      { label: '명암비', values: ['5,000 : 1', '4,000 : 1'] },
      { label: '입력 전력 최대/일반 (W)', single: '650 / 220' },
      { label: '시야각 (수평/수직)', single: '150° / 150°' },
    ],
    categories: ['outdoor', 'sports'],
  },
]

/** slug → 모델 */
export function getModel(slug: string): ProductModel | undefined {
  return PRODUCT_MODELS.find((m) => m.slug === slug)
}

/** 카테고리에 실리는 모델 (표시 순서 = 배열 순서) */
export function modelsByCategory(slug: CategorySlug): ProductModel[] {
  return PRODUCT_MODELS.filter((m) => m.categories.includes(slug))
}

/** 설치 환경 기준 모델 */
export function modelsByEnv(env: ModelEnv): ProductModel[] {
  return PRODUCT_MODELS.filter((m) => m.env === env)
}

/**
 * /products 의 필터 — 세 알약뿐이다 (CEO 2026-09-09 "필터로 실내용/실외용만 구분").
 *
 * 판정 규칙 (지어낸 분류가 아니라 각 모델이 이미 들고 있는 값으로만 가린다)
 *  · 렌탈(`env === 'rental'`)은 실내·실외 **양쪽**에 들어간다. 규격표에 실내 피치와 실외 피치가
 *    같이 적혀 있는 물건이라 어느 한쪽으로 밀어 넣을 수 없다.
 *  · 그 외는 `categories` 에 'indoor'/'outdoor' 가 있는지로 본다. `env` 만 보면 WK-PRIME
 *    (실내·실외 겸용, env='indoor')이 실외 목록에서 빠진다.
 */
export type EnvFilter = 'all' | 'indoor' | 'outdoor'

export const ENV_FILTER_LABEL: Record<EnvFilter, string> = {
  all: '전체',
  indoor: '실내용',
  outdoor: '실외용',
}

export function matchesEnvFilter(model: ProductModel, filter: EnvFilter): boolean {
  if (filter === 'all') return true
  if (model.env === 'rental') return true
  return model.categories.includes(filter)
}

export function modelsByFilter(filter: EnvFilter): ProductModel[] {
  return PRODUCT_MODELS.filter((m) => matchesEnvFilter(m, filter))
}

/** 'P1.25' → 1.25 */
export function pitchNumber(label: string): number {
  const m = label.match(/([\d.]+)/)
  return m ? Number(m[1]) : NaN
}

/** 모델의 화소 간격 범위 — 'P0.9 ~ P1.538' */
export function pitchRange(model: ProductModel): string {
  const ns = model.pitches.map(pitchNumber).filter((n) => !Number.isNaN(n))
  if (ns.length === 0) return '-'
  const min = Math.min(...ns)
  const max = Math.max(...ns)
  return min === max ? `P${min}` : `P${min} ~ P${max}`
}

/**
 * 모델 묶음의 화소 간격 범위 — 카테고리 요약용.
 * 밝기가 아니라 **간격**이 기준이다(간격이 화면 크기와 보는 거리를 정한다).
 */
export function pitchRangeOf(models: ProductModel[]): string {
  const ns = models.flatMap((m) => m.pitches.map(pitchNumber)).filter((n) => !Number.isNaN(n))
  if (ns.length === 0) return '-'
  const min = Math.min(...ns)
  const max = Math.max(...ns)
  return min === max ? `P${min}` : `P${min} ~ P${max}`
}

/**
 * 화소 간격으로 가늠하는 최소 시청거리.
 * 업계에서 쓰는 어림값 — 간격 1mm 당 약 1m 부터 글자가 뭉치지 않고 읽힌다.
 * 확정값이 아니라 **자리 고르는 기준**으로만 쓴다.
 */
export function viewingHint(model: ProductModel): string {
  const ns = model.pitches.map(pitchNumber).filter((n) => !Number.isNaN(n))
  if (ns.length === 0) return ''
  const min = Math.min(...ns)
  const max = Math.max(...ns)
  return min === max ? `약 ${min}m 부터` : `약 ${min} ~ ${max}m 부터`
}

/** 규격표 한 행에서 i번째 열의 값 */
export function cellValue(row: SpecRow, i: number): string {
  if (row.single !== undefined) return row.single
  return row.values?.[i] ?? ''
}

/** 모듈/캐비닛 한글 표기 */
export const FORM_LABEL: Record<ModelForm, string> = {
  module: '모듈',
  cabinet: '캐비닛',
}

export const ENV_LABEL: Record<ModelEnv, string> = {
  indoor: '실내',
  outdoor: '실외',
  rental: '렌탈 · 행사',
}

/** 화면에 쓰는 설치 환경 표기 — 겸용 모델은 `envLabel` 이 이긴다 */
export function envText(model: ProductModel): string {
  return model.envLabel ?? ENV_LABEL[model.env]
}

/** 규격표에서 라벨로 행을 찾아 첫 값을 꺼낸다. 없으면 '' */
function firstValue(model: ProductModel, match: (label: string) => boolean): string {
  const row = model.specRows.find((r) => match(r.label))
  if (!row) return ''
  if (row.single !== undefined) return row.single
  return row.values?.find((v) => v !== '') ?? ''
}

/** 한 장의 크기 — 캐비닛이면 캐비닛 치수, 모듈이면 모듈 치수 */
export function sizeUnit(model: ProductModel): string {
  const label = model.form === 'cabinet' ? '캐비닛 크기' : '모듈 크기'
  const v = firstValue(model, (l) => l.startsWith(label)) || firstValue(model, (l) => l.includes('패널 크기'))
  return v
}

/** 규격표에 적힌 IP 등급만 모은다. 없으면 '' — 지어내지 않는다 */
export function ipOf(model: ProductModel): string {
  const found = model.specRows.flatMap((r) =>
    [...(r.values ?? []), r.single ?? ''].flatMap((v) => v.match(/IP\d{2}/g) ?? []),
  )
  return Array.from(new Set(found)).join(' / ')
}
