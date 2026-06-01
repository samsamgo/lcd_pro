export type DetailBlock = {
  heading: string
  items: string[]
}

export type ServiceCard = {
  id: string
  title: string
  summary: string
  bullets: string[]
  image: string
  details: DetailBlock[]
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
    bullets: ['F-IN-P3 표준 캐비닛', '320×160 모듈 단위 교체', 'A-2x1 ~ A-10x5 레이아웃'],
    image: IMG('svc-indoor-p3.jpg'),
    details: [
      {
        heading: '표준 사양',
        items: [
          'family: F-IN-P3',
          '캐비닛 그리드: 7×3 모듈 (2,240 × 480 mm)',
          '모듈 단위: 320×160 mm · 107×53 px',
          '컨트롤러 디폴트: TB50 (capacity 1.3 Mpx)',
        ],
      },
      {
        heading: '실측 데이터',
        items: ['실내 휘도 가정 ~600 cd/m²', '소비전력 ~22 W/모듈', 'F-IN-P3 family에 P2.97 GOB sub-pitch 후보 등록'],
      },
      {
        heading: '적용 환경',
        items: ['카페·식당 메뉴판', '헬스장·로비 안내', '학원·중소형 매장'],
      },
    ],
  },
  {
    id: 'indoor-p25',
    title: '실내 LED 시공 (P2.5)',
    summary: '근거리·고선명 실내 환경에 최적화.',
    bullets: ['F-IN-P2.5 표준 캐비닛', '320×160 · 128×64 px 모듈', '병원·학원·전시 적합'],
    image: IMG('svc-indoor-p25.jpg'),
    details: [
      {
        heading: '표준 사양',
        items: [
          'family: F-IN-P2.5',
          '캐비닛 그리드: 7×3 모듈 (2,240 × 480 mm)',
          '모듈 단위: 320×160 mm · 128×64 px',
          '컨트롤러 디폴트: TB50, 대형은 TB60',
        ],
      },
      {
        heading: '실증 케이스',
        items: ['세븐럭카지노 P1.86 Flexible (실내 가까운 화질 요구 사례)', '향후 P2.5 SMD 신규 영업 라인'],
      },
      {
        heading: '적용 환경',
        items: ['회의실·바·VIP룸', '전시·갤러리', '병원 안내·로비'],
      },
    ],
  },
  {
    id: 'outdoor-p5',
    title: '실외 LED 시공 (P5)',
    summary: '옥외 안전전광판·간판·미디어보드 표준 시공.',
    bullets: ['F-OUT-P5 표준 캐비닛', '단독기초 + 구조물 시공', '방수·접지·EMC 통과 설계'],
    image: IMG('svc-outdoor-p5.jpg'),
    details: [
      {
        heading: '표준 사양',
        items: [
          'family: F-OUT-P5',
          '캐비닛 그리드: 7×4 모듈 (2,240 × 640 mm)',
          '모듈 단위: 320×160 mm · 64×32 px',
          '컨트롤러 디폴트: TB50',
          '방수·접지·구조 보강 표준 SOP',
        ],
      },
      {
        heading: '실측 데이터',
        items: [
          '옥외 휘도 6,000 cd/m² (P5 SMD 동승 2025-08-20 입고)',
          '소비전력 30 W/모듈',
          'Driver IC 16269',
          '부자재 m² 단가 568,963원 (TRL 남양주 ✓)',
        ],
      },
      {
        heading: '실증 케이스',
        items: ['남양주 W4,480 × H2,560 안전전광판 (11.47 m²)', '양평 물맑은시장 주차장 P5 SMD'],
      },
    ],
  },
  {
    id: 'novastar-controller',
    title: 'NovaStar 컨트롤러 표준',
    summary: '글로벌 표준 NovaStar Taurus 시리즈 + VNNOX 클라우드.',
    bullets: ['TB30 / TB50 / TB60 3-tier', 'rcfgx 표준 프리셋', 'ViPlex / VNNOX / NovaLCT 운영'],
    image: IMG('svc-controller.jpg'),
    details: [
      {
        heading: '컨트롤러 3-tier',
        items: [
          'TB30 — 보급형 · capacity ~0.65 Mpx · 소형 점포',
          'TB50 — 표준형 · capacity ~1.3 Mpx · 견적엔진 디폴트',
          'TB60 — 프리미엄 · capacity ~2.3 Mpx · 대형',
        ],
      },
      {
        heading: '인계 자산 (TRL)',
        items: [
          'Processor: H2 ×3, H5 ×1, LVP515 ×2',
          'Controller: MCTRL600 ×1, MCTRL300 ×4, MSD300 ×2',
          'Receiver Card: MRV210 ×97, MRV336 ×9, MRV412 ×2 외 다수',
        ],
      },
      {
        heading: 'rcfgx 프리셋 (현장 검증)',
        items: [
          'PRESET-001 F-OUT-P5 / 192×256 (남양주 3×8)',
          'PRESET-002 F-OUT-P5 / 256×256 (남양주 4×8 혼용)',
          'PRESET-003 F-IN-P2.976 / 양평 아케이드',
        ],
      },
    ],
  },
  {
    id: 'cms-operation',
    title: 'CMS 콘텐츠 운영',
    summary: '콘텐츠 업로드 · 일정 · 플레이리스트를 원격으로.',
    bullets: ['이미지·동영상 업로드', '시간·요일·디바이스 그룹 스케줄링', '고객 포털에서 직접 운영'],
    image: IMG('svc-cms.jpg'),
    details: [
      {
        heading: '기능',
        items: [
          '콘텐츠 라이브러리 (이미지·동영상·플레이리스트)',
          '디바이스 그룹 단위 스케줄링',
          '드래그앤드롭 업로드 · 자동 미리보기',
        ],
      },
      {
        heading: '인프라',
        items: [
          'Supabase Storage + RLS (고객 격리)',
          'NovaStar VNNOX REST API 연동',
          '단계별 출시: MVP3-α 폴링 → β 스케줄 → γ MQTT',
        ],
      },
    ],
  },
  {
    id: 'remote-monitoring',
    title: '원격 모니터링·관제',
    summary: '디바이스 상태·통신·콘텐츠 송출을 24시간 관제.',
    bullets: ['NovaStar VNNOX API 연동', '장애 자동 알림', 'AS 응답 SLA 단축'],
    image: IMG('svc-monitoring.jpg'),
    details: [
      {
        heading: '관제 항목',
        items: ['디바이스 온/오프라인', '현재 송출 콘텐츠', '오류 코드', '오프라인 5분 이상 → 자동 알림'],
      },
      {
        heading: '알림 채널',
        items: ['이메일', '카카오톡 (예정)', '운영자 대시보드 실시간 보드'],
      },
    ],
  },
  {
    id: 'as-maintenance',
    title: 'AS · 유지보수',
    summary: '표준 캐비닛 = 모듈 단위 신속 교체. 국내 재고 우선 대응.',
    bullets: ['1년 AS 보증', '국내 재고 SpareParts 즉시 교체', '제조원 RMA는 별도 트랙 (수개월 단위 명시)'],
    image: IMG('svc-as.jpg'),
    details: [
      {
        heading: '2-tier SLA',
        items: [
          '1차 대응 — 국내 재고로 즉시 교체 (모듈 단위)',
          '2차 — 제조원 RMA (다롄 4개월 케이스 보유, 별도 트랙 명시)',
          'SpareParts 재고: DC 케이블 437개, HDMI/DP 다수, SMPS 132개',
        ],
      },
      {
        heading: '실 통계 (2024~2025)',
        items: [
          '2024-07-19 일괄 4건 발송 → 2024-11-19 입고 (약 4개월)',
          '2024-10-25 11개 발송 입고 미확인 케이스 보유',
          '국내 재고 우선 대응으로 AS 응답 약속 분리',
        ],
      },
    ],
  },
  {
    id: 'consulting-design',
    title: '시공 컨설팅 · 설계',
    summary: '부지·전원·통신 환경에 맞는 설계 컨설팅.',
    bullets: ['현장 실사 + 도면 작성', '구조·전기·통신 통합 설계', '인허가·간판 규정 대응'],
    image: IMG('svc-consulting.jpg'),
    details: [
      {
        heading: '컨설팅 단계',
        items: ['1. 사진·위치·환경 1차 검토 (사진 3장 / 30분 1차 견적)', '2. 현장 실사 + 도면', '3. 구조·전기·통신·인허가 통합 설계'],
      },
      {
        heading: '대응 인허가',
        items: ['옥외광고물법 (면적 5m² 이상)', '전기설비 안전', 'KC·EMC (신규 모델 시)'],
      },
    ],
  },
  {
    id: 'public-procurement',
    title: '조달청 · 공공조달 납품 지원',
    summary: '공공조달 자격·서류 패키지로 입찰 진입 지원.',
    bullets: ['ISO · EMC · KC 인증 자산', '공장등록 기반 직접생산확인', '입찰서류 패키지화'],
    image: IMG('svc-procurement.jpg'),
    details: [
      {
        heading: '보유 자산',
        items: [
          'ISO45001 안전보건경영시스템',
          '통합인증 + 공장등록',
          'KC 적합등록필증 4 모델 (P4·P8·P1.56·P5)',
          'EMC 표준성적서 51 파일',
        ],
      },
      {
        heading: '활용 시나리오',
        items: ['공공기관 옥외 안전전광판 입찰', '학교·도서관·시장 등 공공시설', 'LG·대형사 협력사 자격'],
      },
    ],
  },
  {
    id: 'certification',
    title: 'KC · EMC 인증 대응',
    summary: 'P4·P8·P1.56·P5 KC 적합등록필증 보유 + EMC 표준성적서 자산.',
    bullets: ['Margin 3 dB 설계 표준', 'EMC 차폐·접지 SOP', '신규 모델 인증 트랙'],
    image: IMG('svc-certification.jpg'),
    details: [
      {
        heading: '인증 보유',
        items: [
          'TRL-P4mm (R-R-trL-TRL-P4mm, 2024-08-29)',
          'TRL-P8mm (R-R-trL-TRL-P8mm, 2024-08-21)',
          'TRL-P1.56mm (등록증 보유, OCR 추출 진행 중)',
          'TRL-P5mm (등록증 보유, OCR 추출 진행 중)',
        ],
      },
      {
        heading: '설계 표준 (EMC)',
        items: [
          'Margin 3 dB 이상',
          '코어 필터 + 라인 블랭킹 + 시프팅 시계 + PSU 위치',
          '시험기관: GCL (지씨엘) · KS C9832/9835',
          '실증: P4mm 1차 부적합 → 4단계 개선 후 통과 케이스 보유',
        ],
      },
    ],
  },
  {
    id: 'replacement',
    title: '기존 간판 LED 교체',
    summary: '구형 사인보드를 표준 LED 모듈로 교체.',
    bullets: ['철거 + 잔재 처리', '구조 재활용 가능성 평가', '교체 후 CMS 즉시 가동'],
    image: IMG('svc-replacement.jpg'),
    details: [
      {
        heading: '교체 절차',
        items: ['1. 현장 실사 — 구조·전원·통신 재활용 가능성', '2. 철거 + 잔재 처리', '3. 표준 캐비닛 시공', '4. CMS 연결·콘텐츠 이관'],
      },
      {
        heading: '주의 사항',
        items: ['구조물 안전 점검 필수', '옥외 신고 변경 필요 (5m² 이상)', '기존 콘텐츠 포맷 변환'],
      },
    ],
  },
  {
    id: 'standard-cabinet',
    title: '표준화 캐비닛 (F-IN / F-OUT)',
    summary: '3 family × layout matrix × ZONE으로 견적·시공 속도 보장.',
    bullets: ['F-IN-P3 / F-IN-P2.5 / F-OUT-P5', 'A-2x1 ~ A-10x5 레이아웃 매트릭스', 'ZONE 단위 확장'],
    image: IMG('svc-cabinet.jpg'),
    details: [
      {
        heading: '3 family',
        items: [
          'F-IN-P3 — 실내 표준 (H480)',
          'F-IN-P2.5 — 실내 고선명 (H480)',
          'F-OUT-P5 — 옥외 표준 (H640)',
        ],
      },
      {
        heading: 'Layout Matrix',
        items: ['A-2x1 ~ A-10x5 표준 layout', 'ZONE-A × N 으로 대형 확장', '캐비닛 W=2,240 mm 고정'],
      },
      {
        heading: '효과',
        items: ['견적 자동 산출 (사진 3장 → 30분 1차)', 'AS = 모듈 단위 교체', '시공 SOP 표준화로 일수 예측 가능'],
      },
    ],
  },
]

export const TRUST_MARKS = [
  { label: 'NovaStar 글로벌 표준', detail: 'Taurus 시리즈 + VNNOX 클라우드 + rcfgx 프리셋' },
  { label: '표준화 자재', detail: '3 family × layout matrix × ZONE으로 빠른 견적·빠른 AS' },
  { label: '인증 자산', detail: 'KC 적합등록필증 4 모델 (P4·P8·P1.56·P5) + ISO45001 + EMC 표준성적서' },
  { label: '실측 휘도·전력', detail: '옥외 P5 6000 cd/m² · 실내 P5 683 cd/m² · 실내 P2.97 GOB 623 cd/m² 등 환경별 실측치' },
]

export type CaseCard = {
  id: string
  title: string
  location: string
  spec: string
  detail: string
  image: string
  details: DetailBlock[]
}

export const FIELD_CASES: CaseCard[] = [
  {
    id: 'case-namyangju',
    title: '옥외 P5 SMD 안전전광판',
    location: '경기 남양주',
    spec: 'W4,480 × H2,560 mm · P5 SMD · 11.47 m²',
    detail: 'UNIT CASE 4개 + 단독기초·구조물. 옥외 환경 P5 6,000 cd/m² 실측치 적용.',
    image: IMG('svc-outdoor-p5.jpg'),
    details: [
      {
        heading: '디스플레이 사양',
        items: ['LED Display Size: 4,480 × 2,560 mm (도면 기준)', '면적 11.47 m²', 'P5 SMD 320×160 모듈 × 224개'],
      },
      {
        heading: '구성',
        items: [
          'UNIT CASE 2,228 × 1,280 × 120 × 4 EA',
          '설치 브라켓류 4 종',
          'NovaStar 프로세서 LVP515 ×1',
          '광컨버터 LAN to 광 / HDMI to 광 각 1 Set',
        ],
      },
      {
        heading: '실측 값',
        items: ['옥외 휘도 6,000 cd/m²', '냉각팬 16 EA + 배송비', '부자재 m² 단가 568,963원 ✓'],
      },
      {
        heading: '컨트롤러 매핑 (rcfgx)',
        items: ['PRESET-001 192×256 (3×8) + PRESET-002 256×256 (4×8) 혼용', 'TB50 권장'],
      },
    ],
  },
  {
    id: 'case-yangpyeong-arcade',
    title: '실내 P2.97 GOB 아케이드',
    location: '경기 양평 물맑은시장 아케이드',
    spec: '14.00 m² · P2.97 GOB · 320×160 모듈',
    detail: '아케이드 천장 부착 · 브라켓 양면 시공 · 623 cd/m² 실측. 전통시장 공공 환경 대응.',
    image: IMG('cap-market-arcade.jpg'),
    details: [
      {
        heading: '디스플레이 사양',
        items: ['면적 14.00 m² (양면 합산)', 'P2.97 GOB 250×250 모듈', '진박 공급 (2025-07-30 입고)'],
      },
      {
        heading: '실측 값',
        items: ['실내 휘도 623 cd/m²', '소비전력 22.5 W/모듈', 'Driver IC 3153S', 'Receiver: MRV412'],
      },
      {
        heading: '시공 일정',
        items: ['구조물·전광판 설치: 5일 (2025-08-25 ~ 08-29)', '전기·통신: 3일 (2025-08-27 ~ 08-29)', '시험·검수: 1일 (2025-08-30)'],
      },
      {
        heading: '부자재',
        items: ['200W 파워 브라켓 28개 · 196,000원', '리시빙 카드 브라켓 28개 · 196,000원', '브라켓 m² 단가 28,000원 ✓'],
      },
    ],
  },
  {
    id: 'case-adamchicken',
    title: '실내 P5 SMD 식당',
    location: '서울 구로 아담치킨',
    spec: 'F-OUT-P5 SMD 실내 보정 · 683 cd/m² 실측',
    detail: '소상공인 외식업 · 메뉴·이벤트 즉시 송출. CNP 모듈 + DH7508 Receiver.',
    image: IMG('svc-indoor-p3.jpg'),
    details: [
      {
        heading: '디스플레이 사양',
        items: [
          'CNP 공급 P5(2121)-3264-16S-M5 SMD',
          '320×160 모듈 · P5 · 16S Duty',
          '2026-04-06 입고',
        ],
      },
      {
        heading: '실측 값',
        items: ['실내 휘도 683 cd/m² (옥외 6,000 대비 보정 적용 검증값)', '소비전력 21.5 W/모듈', 'Driver IC FM6124EJA014164'],
      },
      {
        heading: '특이 사항',
        items: ['Receiver: DH7508 (NovaStar 외 — 표준 외 풀, 호환성 평가 큐)', '소상공인 외식업 메뉴 변경·이벤트 송출 시나리오'],
      },
    ],
  },
  {
    id: 'case-godeok-emc',
    title: 'EMC 인증 트랙 — P4·P8',
    location: '서울 고덕 이케아 납품 대비',
    spec: 'KS C9832/9835 · Margin 3 dB 설계 · GCL 챔버',
    detail: 'P4mm·P8mm KC 적합등록필증 보유. 신규 모델은 동일 트랙으로 인증 진행.',
    image: IMG('svc-certification.jpg'),
    details: [
      {
        heading: '인증 결과',
        items: [
          'TRL-P4mm: R-R-trL-TRL-P4mm · 2024-08-29',
          'TRL-P8mm: R-R-trL-TRL-P8mm · 2024-08-21',
          '제조원: DALIAN YANGGUANG TECHNOLOGY (중국)',
        ],
      },
      {
        heading: '시험 비용 (참고)',
        items: ['TRL-P4mm 전자파 시험비 1,500,000원', 'TRL-P8mm 전자파 시험비 1,500,000원', '접수비·면허세 각 100,000원'],
      },
      {
        heading: '설계 표준 (실증)',
        items: ['Margin 3 dB 이상', '코어 필터 + 라인 블랭킹', '시프팅 시계 + PSU 위치', 'P4mm 1차 -1.0 dB → 4단계 개선 후 통과 케이스'],
      },
    ],
  },
]

export type CapabilityArea = {
  id: string
  env: string
  detail: string
  image: string
  details: DetailBlock[]
}

export const CAPABILITY_AREAS: CapabilityArea[] = [
  {
    id: 'cap-outdoor-safety',
    env: '대형 옥외 안전전광판',
    detail: '건설현장·공공시설 옥외 P5 안전전광판 시공 가능. W4m 이상 대형 + 단독기초·구조물·EMC 통과 설계.',
    image: IMG('svc-outdoor-p5.jpg'),
    details: [
      { heading: '표준 family', items: ['F-OUT-P5 (H640 캐비닛)'] },
      { heading: '실측', items: ['옥외 휘도 6,000 cd/m²', '부자재 m² 568,963원 ✓ (남양주)'] },
      { heading: '인허가', items: ['옥외광고물 신고 (5m² 이상)', '전기설비 안전', 'EMC 통과 설계'] },
    ],
  },
  {
    id: 'cap-market-arcade',
    env: '전통시장·아케이드 실내',
    detail: '전통시장·공공 아케이드 실내 P2.97 GOB 시공 가능. 623 cd/m² 실측 휘도 + 브라켓 벽부착 설계.',
    image: IMG('cap-market-arcade.jpg'),
    details: [
      { heading: '실증', items: ['양평 물맑은시장 아케이드 14 m² (2025-08 시공)'] },
      { heading: '특이', items: ['양면 브라켓 시공', '아케이드 천장 부착 SOP', '브라켓 m² 28,000원 ✓'] },
    ],
  },
  {
    id: 'cap-premium-exhibit',
    env: '고급 매장·전시·고해상도',
    detail: '카지노·전시·고급 호텔 등 실내 P1.86 Flexible 시공 가능. 560+ cd/m² 실내 광량.',
    image: IMG('svc-indoor-p25.jpg'),
    details: [
      { heading: '실증', items: ['세븐럭카지노 P1.86 Flexible (2025-04 입고)'] },
      { heading: '실측', items: ['휘도 564 cd/m²', '소비전력 17.5 W/모듈', 'Driver IC DP3365S', 'Receiver MRV412'] },
    ],
  },
  {
    id: 'cap-restaurant',
    env: '외식업·소상공인 실내',
    detail: '카페·식당·바 실내 P5 SMD 시공 가능. 680 cd/m² 실내 보정 + 메뉴 변경·이벤트 즉시 송출.',
    image: IMG('svc-indoor-p3.jpg'),
    details: [
      { heading: '실증', items: ['구로 아담치킨 (2026-04 입고)'] },
      { heading: '실측', items: ['실내 휘도 683 cd/m²', '소비전력 21.5 W/모듈'] },
      { heading: '시나리오', items: ['메뉴판 즉시 갱신', '이벤트·시간별 콘텐츠 송출'] },
    ],
  },
  {
    id: 'cap-clinic',
    env: '병원·미용·헬스장',
    detail: '의료·미용·체육 시설 실내 LED + AS 사이클 SOP 보유. 안내·시간표·대기실 송출.',
    image: IMG('svc-as.jpg'),
    details: [
      { heading: '시나리오', items: ['진료·예약 안내', '대기실 콘텐츠', '시간표·이벤트'] },
      { heading: 'AS', items: ['1년 AS 보증', '국내 재고 즉시 교체', '모듈 단위 교체 SOP'] },
    ],
  },
  {
    id: 'cap-school-public',
    env: '교육·종교·공공',
    detail: '학교·교회·도서관·시장 등 공공 환경 옥외 P2.5·P5 시공 가능. 조달·KC·EMC 자산 활용.',
    image: IMG('cap-school-public.jpg'),
    details: [
      { heading: '실증 (TRL 인계 케이스)', items: ['남부대학교 (P2.5 320×160)', '대구평현교회 (P2.5 250×250)'] },
      { heading: '활용 자산', items: ['KC 4 모델 + EMC 51 파일', 'ISO45001 + 공장등록 + 통합인증', '공공조달 입찰 패키지'] },
    ],
  },
]
