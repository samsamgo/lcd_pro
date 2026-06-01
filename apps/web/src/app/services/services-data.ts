export type ServiceCard = {
  id: string
  title: string
  summary: string
  bullets: string[]
  image: string
}

// Curated images: see shared/assets/curated-images-20260531.md
// All sources downloaded to /public/curated/. Wikimedia rate-limited 11 files;
// those use receive sensible reuse from the 21 downloaded.
const IMG = (file: string) => `/curated/${file}`

export const SERVICES: ServiceCard[] = [
  {
    id: 'indoor-p3',
    title: '실내 LED 시공 (P3)',
    summary: '카페·식당·헬스장·로비용 표준 실내 전광판.',
    bullets: ['F-IN-P3 표준 캐비닛', '256×256 모듈 단위 교체', 'A-2x1 ~ A-10x5 레이아웃'],
    image: IMG('svc-indoor-p3.jpg'),
  },
  {
    id: 'indoor-p25',
    title: '실내 LED 시공 (P2.5)',
    summary: '근거리·고선명 실내 환경에 최적화.',
    bullets: ['F-IN-P2.5 표준 캐비닛', '192×192 모듈', '병원·학원·전시 적합'],
    image: IMG('svc-indoor-p25.png'),
  },
  {
    id: 'outdoor-p5',
    title: '실외 LED 시공 (P5)',
    summary: '옥외 안전전광판·간판·미디어보드 표준 시공.',
    bullets: ['F-OUT-P5 표준 캐비닛', '단독기초 + 구조물 시공', '방수·접지·EMC 통과 설계'],
    image: IMG('svc-outdoor-p5.jpg'),
  },
  {
    id: 'novastar-controller',
    title: 'NovaStar 컨트롤러 표준',
    summary: '글로벌 표준 NovaStar Taurus 시리즈 + VNNOX 클라우드.',
    bullets: ['TB30 / TB50 / TB60 3-tier', 'rcfgx 표준 프리셋', 'ViPlex / VNNOX / NovaLCT 운영'],
    image: IMG('svc-controller.jpg'),
  },
  {
    id: 'cms-operation',
    title: 'CMS 콘텐츠 운영',
    summary: '콘텐츠 업로드 · 일정 · 플레이리스트를 원격으로.',
    bullets: ['이미지·동영상 업로드', '시간·요일·디바이스 그룹 스케줄링', '고객 포털에서 직접 운영'],
    image: IMG('svc-cms.png'),
  },
  {
    id: 'remote-monitoring',
    title: '원격 모니터링·관제',
    summary: '디바이스 상태·통신·콘텐츠 송출을 24시간 관제.',
    bullets: ['NovaStar VNNOX API 연동', '장애 자동 알림', 'AS 응답 SLA 단축'],
    image: IMG('svc-monitoring.jpg'),
  },
  {
    id: 'as-maintenance',
    title: 'AS · 유지보수',
    summary: '표준 캐비닛 = 모듈 단위 신속 교체. 국내 재고 우선 대응.',
    bullets: ['1년 AS 보증', '국내 재고 SpareParts 즉시 교체', '제조원 RMA는 별도 트랙 (수개월 단위 명시)'],
    image: IMG('svc-as.jpg'),
  },
  {
    id: 'consulting-design',
    title: '시공 컨설팅 · 설계',
    summary: '부지·전원·통신 환경에 맞는 설계 컨설팅.',
    bullets: ['현장 실사 + 도면 작성', '구조·전기·통신 통합 설계', '인허가·간판 규정 대응'],
    image: IMG('svc-consulting.jpg'),
  },
  {
    id: 'public-procurement',
    title: '조달청 · 공공조달 납품 지원',
    summary: '공공조달 자격·서류 패키지로 입찰 진입 지원.',
    bullets: ['ISO · EMC · KC 인증 자산', '공장등록 기반 직접생산확인', '입찰서류 패키지화'],
    image: IMG('svc-procurement.jpg'),
  },
  {
    id: 'certification',
    title: 'KC · EMC 인증 대응',
    summary: 'P4·P8·P1.56·P5 KC 적합등록필증 보유 + EMC 표준성적서 자산.',
    bullets: ['Margin 3 dB 설계 표준', 'EMC 차폐·접지 SOP', '신규 모델 인증 트랙'],
    image: IMG('svc-certification.jpg'),
  },
  {
    id: 'replacement',
    title: '기존 간판 LED 교체',
    summary: '구형 사인보드를 표준 LED 모듈로 교체.',
    bullets: ['철거 + 잔재 처리', '구조 재활용 가능성 평가', '교체 후 CMS 즉시 가동'],
    image: IMG('svc-replacement.jpg'),
  },
  {
    id: 'standard-cabinet',
    title: '표준화 캐비닛 (F-IN / F-OUT)',
    summary: '3 family × layout matrix × ZONE으로 견적·시공 속도 보장.',
    bullets: ['F-IN-P3 / F-IN-P2.5 / F-OUT-P5', 'A-2x1 ~ A-10x5 레이아웃 매트릭스', 'ZONE 단위 확장'],
    image: IMG('svc-cabinet.jpg'),
  },
]

export const TRUST_MARKS = [
  { label: 'NovaStar 글로벌 표준', detail: 'Taurus 시리즈 + VNNOX 클라우드 + rcfgx 프리셋' },
  { label: '표준화 자재', detail: '3 family × layout matrix × ZONE으로 빠른 견적·빠른 AS' },
  { label: '인증 자산', detail: 'KC 적합등록필증 4 모델 (P4·P8·P1.56·P5) + ISO45001 + EMC 표준성적서' },
  { label: '실측 휘도·전력', detail: '옥외 P5 6000 cd/m² · 실내 P5 683 cd/m² · 실내 P2.97 GOB 623 cd/m² 등 환경별 실측치' },
]

export type CaseCard = {
  title: string
  location: string
  spec: string
  detail: string
  image: string
}

export const FIELD_CASES: CaseCard[] = [
  {
    title: '옥외 P5 SMD 안전전광판',
    location: '경기 남양주',
    spec: 'W4,480 × H2,560 mm · P5 SMD · 11.47 m²',
    detail: 'UNIT CASE 4개 + 단독기초·구조물. 옥외 환경 P5 6,000 cd/m² 실측치 적용.',
    image: IMG('svc-outdoor-p5.jpg'),
  },
  {
    title: '실내 P2.97 GOB 아케이드',
    location: '경기 양평 물맑은시장 아케이드',
    spec: '14.00 m² · P2.97 GOB · 320×160 모듈',
    detail: '아케이드 천장 부착 · 브라켓 양면 시공 · 623 cd/m² 실측. 전통시장 공공 환경 대응.',
    image: IMG('cap-market-arcade.jpg'),
  },
  {
    title: '실내 P5 SMD 식당',
    location: '서울 구로 아담치킨',
    spec: 'F-OUT-P5 SMD 실내 보정 · 683 cd/m² 실측',
    detail: '소상공인 외식업 · 메뉴·이벤트 즉시 송출. CNP 모듈 + DH7508 Receiver.',
    image: IMG('svc-indoor-p3.jpg'),
  },
  {
    title: 'EMC 인증 트랙 — P4·P8',
    location: '서울 고덕 이케아 납품 대비',
    spec: 'KS C9832/9835 · Margin 3 dB 설계 · GCL 챔버',
    detail: 'P4mm·P8mm KC 적합등록필증 보유. 신규 모델은 동일 트랙으로 인증 진행.',
    image: IMG('svc-certification.jpg'),
  },
]

export type CapabilityArea = {
  env: string
  detail: string
  image: string
}

export const CAPABILITY_AREAS: CapabilityArea[] = [
  {
    env: '대형 옥외 안전전광판',
    detail: '건설현장·공공시설 옥외 P5 안전전광판 시공 가능. W4m 이상 대형 + 단독기초·구조물·EMC 통과 설계.',
    image: IMG('svc-outdoor-p5.jpg'),
  },
  {
    env: '전통시장·아케이드 실내',
    detail: '전통시장·공공 아케이드 실내 P2.97 GOB 시공 가능. 623 cd/m² 실측 휘도 + 브라켓 벽부착 설계.',
    image: IMG('cap-market-arcade.jpg'),
  },
  {
    env: '고급 매장·전시·고해상도',
    detail: '카지노·전시·고급 호텔 등 실내 P1.86 Flexible 시공 가능. 560+ cd/m² 실내 광량.',
    image: IMG('svc-indoor-p25.png'),
  },
  {
    env: '외식업·소상공인 실내',
    detail: '카페·식당·바 실내 P5 SMD 시공 가능. 680 cd/m² 실내 보정 + 메뉴 변경·이벤트 즉시 송출.',
    image: IMG('svc-indoor-p3.jpg'),
  },
  {
    env: '병원·미용·헬스장',
    detail: '의료·미용·체육 시설 실내 LED + AS 사이클 SOP 보유. 안내·시간표·대기실 송출.',
    image: IMG('svc-as.jpg'),
  },
  {
    env: '교육·종교·공공',
    detail: '학교·교회·도서관·시장 등 공공 환경 옥외 P2.5·P5 시공 가능. 조달·KC·EMC 자산 활용.',
    image: IMG('cap-school-public.jpg'),
  },
]
