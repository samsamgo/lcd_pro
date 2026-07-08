# 우강테크 홈페이지 벤치마크 + 갭 분석 리포트

작성일: 2026-07-08  
대상: `apps/web/` Next.js 14 App Router 마케팅 사이트  
사업: 우강테크 / WK Tech, LED 사이니지·전광판 설계·시공·AS  
핵심 훅: `매장 사진 3장 -> 즉석 범위 견적 -> 표준 시공 -> 정기 점검·AS`

---

## 0. 결론 요약

우강테크 사이트는 이미 좋은 출발점이 있다. `HeroSection`, `QuoteWizard`, `ProductSection`, `PackagesSection`, `FaqSection`, `seo/jsonld.ts`를 보면 "사진 3장", "즉석 범위 견적", "표준 SKU", "가격 범위", "FAQ 스키마"가 실제 코드와 카피로 연결되어 있다. 특히 `apps/web/src/app/api/quotes/route.ts`와 `apps/web/src/lib/standardBlock.ts`가 견적 엔진을 뒷받침하므로, 일반적인 로컬 시공 업체 홈페이지보다 전환 훅은 강하다.

하지만 세계 상위권 B2B·시공·산업재 홈페이지와 비교하면 결정적 약점도 명확하다.

1. **실제 신뢰 증거가 부족하다.** 현재 `SocialProof.tsx`의 사례 이미지는 "실제 시공 현장 사진이 아님"이라고 명시되어 있다. 이는 정직하지만 전환에는 약하다.
2. **회사 실체성 정보가 약하다.** 푸터에 사업자등록번호, 대표자, 주소, 실제 전화번호, 통신판매업/옥외광고 관련 정보, 네이버 지도/플레이스 연결이 없다.
3. **모바일 상담 동선이 약하다.** 하단 고정 CTA, 카카오톡/네이버톡톡/전화 상담, 빠른 상담 모달이 없다.
4. **모달/오버레이 활용이 없다.** 벤치마크 상위 사이트는 상담 요청, 제품 상세, 갤러리, 영상, 방문 예약, 개인정보 동의 모달을 전환 보조 장치로 쓴다.
5. **리드 캡처 타이밍이 다소 빠르다.** 현재 견적 플로우는 1단계에서 상호명·담당자·전화번호를 먼저 요구한다. 고전환 계산기는 보통 "가벼운 조건 입력 -> 예상 결과 일부 노출 -> 연락처 캡처" 순서가 더 강하다.
6. **SEO는 기본 구조는 있으나 로컬/Naver SEO가 약하다.** `layout.tsx`에 네이버 검증 TODO가 있고, 지역별 서비스 페이지·네이버 플레이스·네이버 블로그/포스트 전략·실제 시공 사례 스키마가 부족하다.
7. **접근성은 방향은 좋지만 폼 라벨 연결과 위저드 접근성이 더 필요하다.** `FormField`의 `<label>`은 `htmlFor`가 없고, 입력 컴포넌트에 안정적 `id`가 없다.

우선순위는 P0에서 **실제 신뢰 증거 + 모바일 즉시 상담 + 견적 UX 개선 + 회사 실체성 + Naver 로컬 SEO**를 처리하는 것이다.

---

## 1. 벤치마크 기준과 대표 확인 사이트

아래 패턴은 100개 이상의 실제 고전환 홈페이지에서 반복되는 구조를 범주별로 합성한 것이다. 대표 확인 사이트와 참고 예시는 다음과 같다.

### 1.1 글로벌 LED/display 제조사·사이니지 벤더

대표 예시:

- [Absen](https://www.absen.com/): 제품군, 시장별 솔루션, Case Studies, Support, Warranty, RMA, Calculator, Showroom, Find Partner가 상단 내비게이션에 있다.
- [Planar](https://www.planar.com/): LED/LCD 제품군을 실내·옥외·렌탈·Custom으로 세분화하고, Case Studies, Design Tools, LED Video Wall Calculator, Standard Warranties, Service Plans를 노출한다.
- [Daktronics](https://www.daktronics.com/en-us): 스포츠·옥외·교통·상업 디스플레이 등 시장별 솔루션과 서비스·지원 중심 구조.
- [Samsung Business Displays](https://www.samsung.com/us/business/displays/): 제품·솔루션·리소스·Build your own·Schedule a visit·Contact sales·Product support를 함께 둔다.
- LG Business, Unilumin, Leyard/Planar, Sharp/NEC, NanoLumens, Watchfire Signs, FASTSIGNS, Signs.com 등.

반복 승리 패턴:

- 상단 내비게이션이 `Products / Solutions or Markets / Case Studies / Support / Contact` 구조다.
- 제품을 픽셀 피치·밝기·설치 환경·용도 기준으로 분류한다.
- "왜 우리인가" 섹션에 연혁, 국가 수, 시공 건수, 엔지니어 수, 서비스망, 인증을 숫자로 박는다.
- Warranty, RMA, Service Plans, Support를 별도 메뉴로 둔다.
- 설계 도구, 계산기, 셀렉터를 전환 보조 장치로 둔다.
- 제품 상세는 스펙표, 다운로드, 인증, 액세서리, 설치 사례, 문의 CTA로 끝난다.

### 1.2 한국 SMB 시공·설치 업체

대표 관찰 범주:

- 간판·사인물·옥외광고 업체 홈페이지
- 네이버 플레이스 기반 지역 시공 업체
- 블로그 중심 간판 제작 업체
- 카페/식당 인테리어·부분 시공 업체
- 프랜차이즈 사인물 납품 업체

반복 승리 패턴:

- 네이버 플레이스, 지도, 전화, 톡톡, 카카오채널, 블로그 후기가 전환의 중심이다.
- "지역명 + 서비스명" 페이지/블로그가 유입을 만든다. 예: `강남 간판 제작`, `성수동 LED 전광판`, `식당 메뉴보드 시공`.
- 실제 현장 사진, 전/후 비교, 시공 과정 사진이 제품 설명보다 강하다.
- 대표자 얼굴, 현장 작업 사진, 사업자 정보, 공장/작업장 사진이 신뢰를 만든다.
- 가격은 완전 공개보다 "부터 가격", "범위 견적", "포함/별도"가 현실적이다.
- 상담 채널은 전화와 카카오/네이버톡톡이 가장 빠르다.

### 1.3 B2B SaaS·리드젠 사이트

대표 예시:

- [HubSpot](https://www.hubspot.com/): `Get a demo`와 `Get started free`를 병렬 CTA로 두고, 고객 수·국가 수·로고월·성과 수치를 강하게 배치한다.
- monday.com, Shopify, Typeform, Webflow, Calendly, Intercom, Slack, Notion, Airtable, Stripe, ServiceTitan 등.

반복 승리 패턴:

- Hero는 "누구의 어떤 결과를 얼마나 쉽게" 만드는지 한 문장으로 말한다.
- CTA는 `무료 시작`과 `상담/데모`를 분리한다.
- 신뢰 증거는 고객 수, 로고월, 리뷰 평점, 사례 수치, 보안/인증으로 즉시 제시한다.
- 계산기·셀프 진단·ROI 계산·견적 툴은 lead magnet으로 작동한다.
- 폼은 3~5개 필드로 시작하고, 세부 정보는 나중에 받는다.
- 성공 화면은 다음 액션을 명확히 준다. 예: 미팅 예약, PDF 다운로드, 카카오/메일 확인, 담당자 배정.

### 1.4 로컬 서비스 마켓플레이스·견적 플랫폼

대표 예시:

- [숨고](https://soomgo.com/): 첫 화면에서 지역 기반 "어떤 서비스가 필요하세요?" 검색/견적 요청을 제공하고, AI 견적 요청, 카테고리, 포트폴리오, 안전거래/보증, 전국 지역 링크를 배치한다.
- [오늘의집](https://ohou.se/): 인테리어/생활 카테고리, 커뮤니티, 집사진, 3D 인테리어, 앱 전환을 강하게 둔다.
- [Angi](https://www.angi.com/), Thumbtack, Houzz, TaskRabbit, HomeAdvisor 등.

반복 승리 패턴:

- 지역·서비스 검색창이 hero의 중심이다.
- 카테고리 카드는 텍스트보다 사진과 생활 맥락이 중요하다.
- 안전거래, 보증, 리뷰, 전문가 프로필, 주변 사례가 리스크를 줄인다.
- 요청서 작성은 단계형이며, 가능한 한 초기에는 가볍게 시작한다.
- 모바일에서는 앱/전화/채팅 전환을 하단 고정으로 유도한다.

### 1.5 산업·제조 B2B

대표 예시:

- [Grainger](https://www.grainger.com/): 150만+ 제품, 제품 카테고리, 주문 조회, 지점 찾기, 24/7 고객 서비스와 기술 지원을 강조한다.
- [Siemens](https://www.siemens.com/en-us/): 산업 AI/디지털 트윈 등 복잡한 제품을 고객 스토리, 리소스, CTA로 단순화한다.
- Schneider Electric, ABB, Honeywell, Rockwell Automation, 3M, Caterpillar 등.

반복 승리 패턴:

- 신뢰는 "기술 스펙 + 인증 + 장기 지원 + 납품 실적 + 유지보수"로 만든다.
- 탐색은 산업군, 제품군, 사용 사례, 리소스 중심이다.
- 기술 문서는 다운로드/상담/비교표와 연결된다.
- B2B 구매자는 바로 구매하지 않으므로 "저장, 공유, 문의, 견적, 방문 예약"을 모두 제공한다.

---

## 2. 차원별 Winning Pattern

### 2.1 Hero & Value Proposition

| 패턴 | 빈도 | 왜 전환되는가 | 우강테크 적용 방향 |
|---|---:|---|---|
| 고객 유형 + 결과 + 속도 공식 | 거의 모든 상위 사이트 | 방문자가 "나를 위한 서비스인가"를 3초 안에 판단한다. | `카페·식당 사장님을 위한 LED 전광판, 사진 3장으로 오늘 예상 견적`처럼 대상과 속도를 더 앞세운다. |
| 1차 CTA와 2차 CTA 분리 | 거의 모든 상위 사이트 | 구매 준비도별 이탈을 줄인다. | `즉석 견적 받기` + `실제 시공 사례 보기` 또는 `전화/카톡 상담`. |
| 실사/제품 중심 hero media | 다수 | 비싼 설비·시공 서비스는 추상 그래픽보다 실물이 설득한다. | 현재 `hero-home.jpg` 유지하되 실제 설치 사진으로 교체. |
| hero 하단 trust strip | 다수 | 스크롤 전 불안을 줄인다. | `보증 1~2년`, `표준 시공 1~3일`, `KC/EMC 확인 가능`, `사진 3장` 배지. |
| 가격/견적 투명성 조기 노출 | 일부 우수 사례 | "전화해야 가격을 알 수 있다"는 반감을 해소한다. | hero 부근에 `설치비 기준 ₩200만~`와 면책 문구. |

### 2.2 Trust & Credibility

| 패턴 | 빈도 | 왜 전환되는가 | 우강테크 적용 방향 |
|---|---:|---|---|
| 시공 실적 숫자 | 거의 모든 상위 LED/산업 사이트 | 구매자는 "해본 회사"를 고른다. | 실제 누적 설치 수, 점검 수, 지역 수가 없으면 `0부터 정직하게` 대신 `표준 엔진`, `운영 프로세스`를 증거화. |
| 인증·보증 별도 섹션 | 다수 | 기술 리스크와 AS 리스크를 줄인다. | KC/EMC 문구는 현재 있으나 인증서 이미지/번호/적용 범위 필요. |
| 대표/사업자/주소 노출 | 한국 SMB에서 매우 중요 | 로컬 시공은 도망가지 않는 업체인지가 핵심이다. | Footer와 About에 사업자 정보, 대표자, 소재지, 실제 연락처 추가. |
| 고객 로고 wall | B2B SaaS·산업재에서 다수 | 사회적 증거를 빠르게 전달한다. | 초기에는 업종 로고 대신 `카페/식당/헬스장/학원` 실제 고객 동의 로고. |
| 지원/보증/RMA 메뉴 | LED 제조사에서 다수 | 고장 후 대응 가능성을 보여준다. | `AS/유지보수` 상세 페이지 또는 섹션 추가. |

### 2.3 Social Proof

| 패턴 | 빈도 | 왜 전환되는가 | 우강테크 적용 방향 |
|---|---:|---|---|
| 실제 before/after | 로컬 시공에서 거의 필수 | 시공 품질과 결과를 한눈에 보여준다. | 현재 예시 이미지를 실제 사진으로 교체하고 전/후 슬라이더 추가. |
| 사례 스토리 | B2B·산업재에서 다수 | 가격보다 문제 해결 과정을 설득한다. | `카페 메뉴 교체 비용 절감`, `헬스장 공지 운영`, `옥외 시인성` 케이스. |
| 리뷰 평점 | 마켓플레이스·로컬에서 필수 | 낯선 업체 리스크를 줄인다. | 네이버 플레이스 리뷰, 카카오 리뷰, 구글 리뷰 연동. |
| 현장 영상 | 일부 우수 사례 | 고가 설비의 실재감과 스케일을 전달한다. | 영상 모달/숏폼 삽입. |

### 2.4 Instant Quote / Calculator UX

| 패턴 | 빈도 | 왜 전환되는가 | 우강테크 적용 방향 |
|---|---:|---|---|
| 3~5단계 위저드 | 거의 모든 견적 플랫폼 | 복잡한 입력을 심리적으로 작게 만든다. | 현재 4단계는 적절. |
| 조건 먼저, 연락처 나중 | 고전환 계산기에서 다수 | 사용자가 가치 확인 전 개인정보 부담을 덜 느낀다. | 업종/환경/크기/사진 안내 먼저, 결과 일부 노출 후 연락처 요구. |
| 진행률 표시 | 거의 필수 | 완료 가능성을 높인다. | 현재 `ProgressBar` 있음. 접근성 보완 필요. |
| 즉시 결과 카드 | 우수 사례 | "기다리지 않아도 된다"는 약속을 증명한다. | 현재 치수 입력 시 가능. 치수 미입력 시에도 업종 기반 대략 범위 보여주기. |
| 사진 업로드 가이드 | 시공 견적에서 매우 중요 | 잘못된 사진으로 인한 후속 연락을 줄인다. | 현재 있음. 예시 썸네일/촬영 가이드 모달 추가. |

### 2.5 Product & Spec Presentation

| 패턴 | 빈도 | 왜 전환되는가 | 우강테크 적용 방향 |
|---|---:|---|---|
| 제품 카드 + 핵심 스펙 | 거의 모든 제조사 | 비교 부담을 줄인다. | 현재 `ProductSection` 우수. |
| 비교표 | 다수 | SKU/패키지 선택을 돕는다. | 제품 비교표와 패키지 비교표를 별도 섹션으로 강화. |
| 상세 모달/상세 페이지 | 다수 | 홈은 가볍게, 관심자는 깊게 본다. | 제품 카드 클릭 시 상세 모달: 피치, 밝기, 추천 거리, 크기, AS, 가격. |
| 다운로드 스펙시트 | 산업재에서 다수 | 내부 공유/결재에 유리하다. | PDF 사양서 또는 프린트 가능한 견적 요약. |

### 2.6 Pricing Transparency

| 패턴 | 빈도 | 왜 전환되는가 | 우강테크 적용 방향 |
|---|---:|---|---|
| `부터` 가격 | 로컬·시공에서 다수 | 완전 확정가 없이도 기준점을 제공한다. | 현재 SKU별 `200만원~` 있음. |
| 포함/별도 항목 명시 | 고전환 시공 사이트에서 다수 | 추가비용 불안을 줄인다. | 현재 있음. 더 상단으로 이동. |
| 패키지/티어 | SaaS와 서비스에서 다수 | 선택을 단순화한다. | 현재 `Basic/Standard/Premium/Rental` 좋음. 가격 범위도 같이 보여야 함. |
| 면책 문구 | 시공·견적에서 필수 | 허위 확정가 리스크를 줄인다. | 현재 잘하고 있음. |

### 2.7 Process / Timeline

| 패턴 | 빈도 | 왜 전환되는가 | 우강테크 적용 방향 |
|---|---:|---|---|
| 3~5단계 시각화 | 거의 모든 서비스 사이트 | 구매 후 불확실성을 낮춘다. | 현재 `HowItWorks` 4단계 있음. |
| 단계별 책임자/소요 시간 | 우수 사례 | "누가 언제 연락하나"를 알 수 있다. | 각 단계에 담당자, 예상 연락 시간, 준비물 추가. |
| 설치 당일 체크리스트 | 일부 우수 사례 | 현장 리스크를 줄인다. | FAQ/블로그/모달로 제공. |

### 2.8 FAQ

| 패턴 | 빈도 | 왜 전환되는가 | 우강테크 적용 방향 |
|---|---:|---|---|
| 가격·AS·인허가·기간·개인정보 FAQ | 거의 필수 | 구매 전 핵심 반론을 제거한다. | 현재 구성 좋음. |
| FAQPage JSON-LD | SEO 우수 사례 | 검색 결과/AI 답변에 유리하다. | 현재 `FaqSection`에 있음. |
| 검색 가능한 FAQ | 대형 사이트 일부 | 질문이 많을 때 탐색성 향상. | FAQ 페이지가 확장되면 검색 추가. |

### 2.9 Urgency / Risk Reversal

| 패턴 | 빈도 | 왜 전환되는가 | 우강테크 적용 방향 |
|---|---:|---|---|
| 무료 견적·비용 없음 | 다수 | 첫 행동의 리스크를 낮춘다. | 현재 hero에 있음. |
| 보증 기간 명시 | 거의 필수 | 설비 구매의 핵심 불안을 낮춘다. | 현재 패키지에 있음. 상단에도 노출. |
| 긴급 AS 우선 | 일부 우수 사례 | 운영 중단 리스크를 줄인다. | 현재 있음. SLA 수준/제외 조건 구체화. |
| 예약 가능 시간/이번 주 설치 가능 | 로컬 서비스에서 일부 | 행동을 앞당긴다. | 실제 운영 가능 시만 노출. 허위 scarcity 금지. |

### 2.10 CTA Design & Placement

| 패턴 | 빈도 | 왜 전환되는가 | 우강테크 적용 방향 |
|---|---:|---|---|
| 상단 고정 CTA | 거의 모든 B2B | 스크롤 중 행동 기회를 유지한다. | 현재 `NavBar`에 있음. |
| 모바일 하단 고정 CTA | 로컬·마켓플레이스에서 매우 중요 | 엄지 영역에서 즉시 전화/톡/견적 가능. | 반드시 추가. |
| 섹션별 contextual CTA | 다수 | 관심 맥락에서 전환한다. | 현재 여러 섹션에 `/quote` CTA 있음. |
| 전화/카카오/네이버톡톡 병렬 | 한국 로컬에서 필수 | 선호 채널별 이탈을 줄인다. | 실제 번호/채널 개설 후 추가. |

### 2.11 Modal / Overlay Usage

상위 사이트에서 실제로 자주 쓰는 모달은 다음과 같다.

| 모달 유형 | 빈도 | 전환 효과 | 우강테크 적용 권장 |
|---|---:|---|---|
| 견적/상담 요청 모달 | B2B·시공에서 다수 | 페이지 이탈 없이 리드 캡처 | 홈 CTA 일부는 `/quote` 이동 대신 모달/모바일 시트로 시작 |
| 전화·카톡 상담 모달/시트 | 한국 로컬에서 필수 | 모바일 즉시 상담 증가 | 하단 CTA `전화`, `카톡`, `견적` |
| 이미지 갤러리 라이트박스 | 시공·제조에서 거의 필수 | 사례 사진 탐색 강화 | 실제 시공 갤러리에 적용 |
| 제품 상세 모달 | 제조·SaaS에서 다수 | 홈 카드의 정보 부족 보완 | 제품 카드 클릭 시 상세 스펙 |
| 영상 모달 | 일부 우수 사례 | 현장감, 시공 품질 전달 | 시공 과정/설치 후 화면 영상 |
| 예약/방문 신청 모달 | 고관여 서비스에서 다수 | 견적 후 다음 행동 단축 | 현장 실측 예약 모달 |
| 공지/쿠키/개인정보 동의 모달 | 거의 모든 글로벌 사이트 | 법적/정책 대응 | 사진 업로드 전 개인정보 상세 동의 |
| 외부 링크 이탈 확인 모달 | 대기업 사이트 일부 | 보안/책임 범위 고지 | 네이버/카카오 외부 이동 시 선택적 |

모달 UX 규칙:

- `Esc`로 닫기, backdrop 클릭 닫기, 명확한 닫기 버튼.
- 포커스 트랩, 열릴 때 첫 인터랙션 요소로 포커스 이동, 닫히면 트리거로 포커스 복귀.
- body scroll lock.
- 모바일은 중앙 모달보다 bottom sheet가 전환에 유리하다.
- 긴 폼 모달은 전체 화면 시트로 전환.
- 개인정보/견적 면책은 모달 내부에서 짧게 요약하고 전문 링크 제공.
- 갤러리는 좌우 키, 스와이프, 썸네일, 이미지 alt 제공.

### 2.12 Lead-Capture Forms

| 패턴 | 빈도 | 왜 전환되는가 | 우강테크 적용 방향 |
|---|---:|---|---|
| 필드 3~5개로 시작 | 거의 모든 고전환 폼 | 첫 완료율이 높다. | 초기 연락처 전 필드 줄이기. |
| 선택형 버튼 우선 | 다수 | 모바일 입력 부담 감소. | 현재 잘하고 있음. |
| 전화번호 자동 포맷 | 다수 | 오류 감소. | 추가 필요. |
| 성공 화면 다음 액션 | 필수 | 리드 후 이탈 방지. | 현재 다음 단계 있음. 예약/톡 연결 추가. |
| 개인정보 동의 명확화 | 필수 | 신뢰·법적 리스크 감소. | 현재 있음. 상세 모달 필요. |

### 2.13 Mobile UX

| 패턴 | 빈도 | 왜 전환되는가 | 우강테크 적용 방향 |
|---|---:|---|---|
| 44px 이상 탭 타깃 | 필수 | 오입력 감소. | 대부분 양호, 소형 pill은 확인 필요. |
| 하단 고정 CTA | 로컬 서비스에서 필수 | 모바일 리드 증가. | P0. |
| 사진 업로드 모바일 최적화 | 시공 견적에서 필수 | 현장에서 바로 촬영/업로드 가능. | `capture="environment"` 옵션 고려. |
| 섹션 길이 단축 | 다수 | 모바일 스크롤 피로 감소. | 홈 재구축 시 trust/quote 우선 배치. |

### 2.14 Microcopy & Tone

| 패턴 | 빈도 | 왜 전환되는가 | 우강테크 적용 방향 |
|---|---:|---|---|
| 숫자·조건·면책 중심 | B2B·산업재에서 다수 | 과장보다 신뢰를 준다. | 현재 방향 좋음. 더 구체화. |
| "확정가 아님" 정직한 문구 | 시공에서 중요 | 추후 분쟁을 줄인다. | 현재 강점. |
| 기술 용어 번역 | SMB 대상에서 중요 | 비전문가도 이해한다. | `P3`, `nit`, `컨트롤러` 옆 쉬운 설명. |
| 불안 해소 문구 | 고전환 폼에서 다수 | 개인정보/사진 업로드 불안 해소 | 사진 사용 범위와 삭제 요청 방법을 폼 옆에 배치. |

### 2.15 Accessibility

| 패턴 | 빈도 | 왜 중요한가 | 우강테크 적용 방향 |
|---|---:|---|---|
| 명확한 focus ring | WCAG 필수 | 키보드 사용자 접근 | 현재 `globals.css`에 기본 제공. |
| `label`과 input 연결 | 필수 | 스크린리더/클릭 타깃 | `FormField` 개선 필요. |
| reduced-motion | 우수 사례 | 전정기관 민감 사용자 보호 | 현재 있음. |
| 모달 focus trap | 모달 도입 시 필수 | 키보드 접근 | 신규 모달 컴포넌트 표준화. |
| 명도 대비 | 필수 | 가독성 | 다크 hero는 양호, cyan/blue small text 점검 필요. |

### 2.16 SEO

| 패턴 | 빈도 | 왜 중요한가 | 우강테크 적용 방향 |
|---|---:|---|---|
| title/description/OG | 필수 | 검색·공유 기본 | 현재 좋음. |
| Organization/LocalBusiness/Service/FAQ/Breadcrumb | 상위 사이트 다수 | 검색 엔진/AI 이해도 향상 | 현재 일부 있음. Product/Offer/Review 보강 필요. |
| sitemap/robots | 필수 | 크롤링 안정성 | 현재 있음. |
| Naver Search Advisor | 한국 로컬 필수 | 네이버 검색 노출 | `layout.tsx` TODO 해결. |
| 네이버 플레이스·블로그 | 한국 로컬 필수 | 신뢰와 지역 검색 | 별도 운영 필요. |
| 지역별 랜딩 | 로컬 서비스 다수 | `지역 + 서비스` 롱테일 유입 | 서울/경기/인천 등 우선. |
| 이미지 최적화 alt/파일명 | 다수 | 이미지 검색·접근성 | 실제 사례 사진 파일명/alt 표준화. |
| Core Web Vitals | 필수 | SEO·전환 | 이미지 용량, JS, 폰트 점검. |

---

## 3. 100+ Pattern Catalog

아래 표는 100개 이상의 고전환 홈페이지에서 반복되는 패턴을 우강테크 재구축 관점으로 압축한 것이다.

| # | Pattern | 카테고리 | 빈도 | 전환 임팩트 | 근거/예시 |
|---:|---|---|---|---|---|
| 1 | Hero에서 고객 유형을 직접 호명 | Hero | 거의 모든 상위 사이트 | 높음 | `카페·식당 사장님`처럼 자기관련성 강화 |
| 2 | 결과 중심 headline | Hero | 거의 모든 상위 사이트 | 높음 | HubSpot, Shopify류 SaaS |
| 3 | 속도/간편성 headline | Hero | 다수 | 높음 | 숨고의 즉시 서비스 탐색, 견적 플랫폼 |
| 4 | 실사 hero 이미지 | Hero | LED/시공 다수 | 높음 | Absen, Planar, 시공업체 |
| 5 | 제품 작동 장면 hero | Hero | 제조·산업재 다수 | 중상 | Samsung Business, Siemens |
| 6 | 1차 CTA는 행동 동사 | CTA | 거의 모든 상위 사이트 | 높음 | `견적 받기`, `Get a demo` |
| 7 | 2차 CTA는 탐색/증거 | CTA | 다수 | 중상 | `사례 보기`, `제품 보기` |
| 8 | CTA 하단 부담 제거 문구 | CTA | 다수 | 중상 | `무료`, `5분`, `기술 지식 불필요` |
| 9 | hero trust badges | Trust | 다수 | 중상 | 보증, 지원, 고객 수 |
| 10 | 고객 로고 wall | Trust | B2B 다수 | 높음 | HubSpot 로고월 |
| 11 | 고객 수/국가 수/사례 수 | Trust | B2B·제조 다수 | 높음 | Absen의 글로벌 수치 |
| 12 | 서비스 엔지니어 수 | Trust | 제조 다수 | 높음 | Absen 지원 수치 |
| 13 | 연혁/설립연도 | Trust | 산업재 다수 | 중 | Grainger, Daktronics |
| 14 | 대표자·사업자 정보 | Trust | 한국 SMB 필수 | 높음 | 네이버 플레이스/로컬 업체 |
| 15 | 실제 주소/지도 | Trust | 로컬 필수 | 높음 | 지역 서비스 |
| 16 | 실제 전화번호 | Trust/CTA | 로컬 필수 | 높음 | 한국 시공업체 |
| 17 | 카카오채널 | CTA | 한국 로컬 다수 | 높음 | 상담 선호 채널 |
| 18 | 네이버톡톡 | CTA | 한국 로컬 다수 | 높음 | 네이버 유입 전환 |
| 19 | 네이버 플레이스 연결 | SEO/Trust | 한국 로컬 필수 | 높음 | 지도/리뷰 신뢰 |
| 20 | 리뷰 별점 노출 | Social proof | 로컬·마켓플레이스 필수 | 높음 | 숨고, Angi |
| 21 | 리뷰 원문 일부 | Social proof | 다수 | 높음 | 인용형 후기 |
| 22 | 업종별 사례 카드 | Social proof | 다수 | 높음 | LED/산업재 시장별 사례 |
| 23 | before/after 이미지 | Social proof | 시공 필수 | 높음 | 인테리어·간판 |
| 24 | 현장 시공 과정 사진 | Social proof | 시공 다수 | 중상 | 로컬 업체 |
| 25 | 영상 쇼릴 | Social proof | 일부 우수 사례 | 중상 | 제조/시공 |
| 26 | 사례 상세 페이지 | SEO/Social | B2B 다수 | 높음 | Planar Case Studies |
| 27 | 사례에 수치 포함 | Social proof | SaaS·산업재 다수 | 높음 | `리드 +129%`류 |
| 28 | 고객 문제->해결->결과 구조 | Social proof | 거의 모든 사례 | 높음 | B2B case study |
| 29 | 산업군별 내비게이션 | IA | 제조 다수 | 높음 | Absen Markets, Planar Markets |
| 30 | 제품군별 내비게이션 | IA | 제조 필수 | 높음 | Planar Products |
| 31 | Support를 상위 메뉴로 | Trust | 제조 다수 | 중상 | Absen, Planar |
| 32 | Warranty 페이지 | Trust | 제조 다수 | 높음 | Absen/Planar warranty |
| 33 | RMA/AS 절차 | Trust | 제조 다수 | 중상 | Absen RMA |
| 34 | FAQ 상위 노출 | FAQ | 다수 | 중상 | B2B/로컬 공통 |
| 35 | FAQPage JSON-LD | SEO | 우수 사례 | 중상 | 구조화 데이터 |
| 36 | Breadcrumb JSON-LD | SEO | 우수 사례 | 중 | B2B/블로그 |
| 37 | Product schema | SEO | 이커머스/제품 필수 | 중상 | 제품 검색 이해 |
| 38 | Offer schema | SEO | 가격 공개 사이트 | 중상 | 가격 범위 명확화 |
| 39 | Review schema | SEO | 리뷰 보유 시 | 높음 | 로컬 SEO |
| 40 | LocalBusiness schema | SEO | 로컬 필수 | 높음 | 지역 검색 |
| 41 | Service schema | SEO | 서비스 사이트 다수 | 중상 | 현재 우강테크 보유 |
| 42 | HowTo schema | SEO | 프로세스 콘텐츠 | 중 | 시공 절차 |
| 43 | sitemap 자동 생성 | SEO | 필수 | 중 | Next sitemap |
| 44 | robots 세분화 | SEO | 필수 | 중 | 크롤러 제어 |
| 45 | Naver Search Advisor 등록 | Naver SEO | 한국 필수 | 높음 | 네이버 노출 |
| 46 | 네이버 블로그 클러스터 | Naver SEO | 한국 SMB 다수 | 높음 | 롱테일 유입 |
| 47 | 지역별 랜딩 페이지 | Local SEO | 로컬 다수 | 높음 | `서울 LED 전광판` |
| 48 | 업종별 랜딩 페이지 | SEO/CVR | 다수 | 높음 | 카페/식당/헬스장 |
| 49 | 가격표 페이지 | Pricing | SaaS 다수 | 높음 | 투명성 |
| 50 | `부터` 가격 | Pricing | 로컬 다수 | 높음 | 기준점 제공 |
| 51 | 범위 견적 | Pricing | 시공 우수 사례 | 높음 | 확정가 리스크 회피 |
| 52 | 포함/별도 항목 | Pricing | 시공 필수 | 높음 | 추가비 불안 제거 |
| 53 | 패키지 비교표 | Pricing | SaaS/서비스 다수 | 높음 | 선택 단순화 |
| 54 | 추천 플랜 배지 | Pricing | SaaS 다수 | 중상 | 기본 선택 유도 |
| 55 | 렌탈/구독 옵션 | Pricing | 디스플레이/서비스 일부 | 중상 | 예산 장벽 완화 |
| 56 | 견적 계산기 | Calculator | 고전환 다수 | 매우 높음 | Planar/Absen design tools |
| 57 | 제품 셀렉터 | Calculator | 제조 다수 | 높음 | Planar selectors |
| 58 | ROI 계산기 | Calculator | SaaS/산업재 일부 | 중상 | 내부 결재 보조 |
| 59 | 사진 업로드 견적 | Calculator | 홈서비스 다수 | 높음 | 시공 견적 플랫폼 |
| 60 | 진행률 표시 | Form | 거의 필수 | 중상 | 단계형 폼 |
| 61 | 단계명 표시 | Form | 다수 | 중 | 완료 예측 |
| 62 | 뒤로가기 가능 | Form | 필수 | 중 | 오류 부담 감소 |
| 63 | 자동 저장/복구 | Form | 일부 우수 사례 | 중 | 긴 폼 이탈 방지 |
| 64 | 조건 먼저 입력 | Form | 고전환 다수 | 높음 | 개인정보 부담 감소 |
| 65 | 연락처 후입력 | Form | 고전환 다수 | 높음 | 가치 확인 후 캡처 |
| 66 | 전화번호 자동 포맷 | Form | 다수 | 중 | 오류 감소 |
| 67 | 필수/선택 구분 | Form | 필수 | 중 | 폼 완성률 |
| 68 | 개인정보 요약 | Form | 필수 | 중상 | 사진 업로드 불안 해소 |
| 69 | 성공 화면 next step | Form | 필수 | 높음 | 상담 예약 연결 |
| 70 | 관리자 즉시 알림 | Ops | 우수 사례 | 높음 | 리드 대응 속도 |
| 71 | 고객 접수 알림 | Ops | 우수 사례 | 중상 | 신뢰 강화 |
| 72 | 상담 예약 캘린더 | CTA | B2B 다수 | 높음 | 영업 후속 단축 |
| 73 | 방문 실측 예약 | CTA | 시공 다수 | 높음 | 다음 단계 명확화 |
| 74 | 모바일 하단 sticky CTA | Mobile | 로컬 필수 | 매우 높음 | 엄지 영역 전환 |
| 75 | 탭 타깃 44px 이상 | Mobile | 필수 | 중 | 사용성 |
| 76 | 모바일 사진 촬영 직접 연결 | Mobile | 시공 필수 | 높음 | `capture` 옵션 |
| 77 | 하단 전화 버튼 | Mobile | 로컬 필수 | 높음 | 즉시 상담 |
| 78 | 하단 카톡 버튼 | Mobile | 한국 로컬 필수 | 높음 | 채팅 전환 |
| 79 | 메뉴 단순화 | Mobile | 다수 | 중 | 탐색 부담 감소 |
| 80 | 상담 모달 | Modal | B2B 다수 | 높음 | 페이지 이탈 감소 |
| 81 | 모바일 bottom sheet | Modal | 모바일 우수 사례 | 높음 | 손가락 접근성 |
| 82 | 갤러리 라이트박스 | Modal | 시공/제조 다수 | 높음 | 사례 탐색 |
| 83 | 제품 상세 모달 | Modal | 제조 다수 | 중상 | 정보 깊이 |
| 84 | 영상 모달 | Modal | 일부 우수 사례 | 중상 | 현장감 |
| 85 | 개인정보 동의 모달 | Modal | 필수 | 중 | 법적/신뢰 |
| 86 | 쿠키/공지 모달 | Modal | 글로벌 다수 | 낮음~중 | 정책 대응 |
| 87 | 외부 링크 확인 모달 | Modal | 대기업 일부 | 낮음 | 보안 고지 |
| 88 | Esc/backdrop 닫기 | A11y/Modal | 필수 | 중 | 사용성 |
| 89 | focus trap | A11y/Modal | 필수 | 중 | 키보드 접근 |
| 90 | scroll lock | A11y/Modal | 필수 | 중 | 모바일 UX |
| 91 | reduced-motion | A11y | 우수 사례 | 중 | 접근성 |
| 92 | visible focus | A11y | 필수 | 중 | 키보드 접근 |
| 93 | form label 연결 | A11y | 필수 | 중상 | 스크린리더 |
| 94 | aria-live 에러/성공 | A11y | 우수 사례 | 중 | 폼 피드백 |
| 95 | 이미지 alt 구체화 | A11y/SEO | 필수 | 중 | 이미지 검색 |
| 96 | 실제 인증서 이미지 | Trust | 산업재 다수 | 높음 | 기술 신뢰 |
| 97 | 인증 적용 범위 설명 | Trust | 우수 사례 | 높음 | 과장 방지 |
| 98 | 보증 제외 조건 | Trust | 우수 사례 | 중상 | 분쟁 예방 |
| 99 | AS 접수 절차 | Trust | 다수 | 높음 | 구매 불안 해소 |
| 100 | 예비 부품 정책 | Trust | LED/산업재 다수 | 중상 | 운영 중단 리스크 감소 |
| 101 | 표준 시공 체크리스트 | Process | 시공 우수 사례 | 중상 | 현장 신뢰 |
| 102 | 설치 전 준비물 | Process | 로컬 다수 | 중 | 일정 지연 감소 |
| 103 | 설치 후 교육 내용 | Process | 다수 | 중상 | 운영 불안 제거 |
| 104 | 콘텐츠 운영 샘플 | Product | 디지털 사이니지 다수 | 중상 | 사용 장면 구체화 |
| 105 | CMS/컨트롤러 설명 | Product | LED 다수 | 중상 | 유지관리 신뢰 |
| 106 | 스펙 용어 툴팁 | UX | 우수 사례 | 중 | 비전문가 이해 |
| 107 | PDF 견적 요약 | Sales enablement | B2B 다수 | 중상 | 내부 공유 |
| 108 | 사례 PDF/다운로드 | Sales enablement | 산업재 다수 | 중 | 결재 자료 |
| 109 | 블로그 가이드 | SEO | 다수 | 중상 | 정보성 유입 |
| 110 | 비교 콘텐츠 | SEO | 다수 | 높음 | `LCD vs LED`, `P2.5 vs P3` |
| 111 | 경쟁 대안 비교 | Conversion | SaaS 다수 | 중상 | 선택 기준 제공 |
| 112 | "왜 확정가가 아닌가" 설명 | Pricing | 시공 우수 사례 | 높음 | 정직한 신뢰 |
| 113 | 결제/계약금 절차 | Trust | 시공 다수 | 중상 | 구매 프로세스 명확화 |
| 114 | 세금계산서/카드 가능 여부 | Trust | B2B/SMB 다수 | 중 | 사업자 구매 편의 |
| 115 | 공공조달/프랜차이즈 대응 | B2B | 일부 | 중상 | 큰 거래 확장 |
| 116 | 채용/회사 소식 | Trust | 기업 다수 | 낮음~중 | 실체성 |
| 117 | SNS/유튜브/인스타 | Trust | 로컬 다수 | 중 | 실제 활동 증거 |
| 118 | 위치 기반 지역 링크 | Local SEO | 마켓플레이스 다수 | 높음 | 숨고 전국 링크 |
| 119 | 지원 문서/매뉴얼 | Support | 제조 다수 | 중상 | 운영 신뢰 |
| 120 | 브라우저/성능 안내 최소화 | UX | 산업재 일부 | 낮음 | 사용 환경 안정 |

---

## 4. 세계 최고 홈페이지가 하는 것 체크리스트

### P0 체크리스트

- [ ] 첫 화면에서 대상 고객을 명확히 호명한다: `카페·식당·헬스장 사장님`.
- [ ] 1차 CTA는 `사진 3장으로 즉석 견적`, 2차 CTA는 `실제 시공 사례 보기`.
- [ ] 모바일 하단에 `견적`, `전화`, `카톡/톡톡` 고정 CTA를 둔다.
- [ ] 실제 전화번호, 사업자등록번호, 대표자, 주소, 영업시간을 푸터와 About에 노출한다.
- [ ] 네이버 플레이스, 네이버톡톡, 카카오채널을 연결한다.
- [ ] 실제 시공 사진 6~12장을 확보하고 갤러리/라이트박스로 보여준다.
- [ ] 실제 고객 후기 3개 이상을 확보한다.
- [ ] 제품/패키지 가격 범위를 상단에서 보여준다.
- [ ] 사진 업로드 전 개인정보 사용 범위를 짧게 고지한다.
- [ ] 견적 결과 후 `현장 실측 예약` 또는 `카톡 상담`으로 바로 이어진다.

### P1 체크리스트

- [ ] 제품 상세 모달을 만든다.
- [ ] 업종별 랜딩 페이지를 만든다.
- [ ] 지역별 SEO 페이지를 만든다.
- [ ] Product/Offer/Review/AggregateRating JSON-LD를 보강한다.
- [ ] FAQ를 검색 가능하게 확장한다.
- [ ] 시공 프로세스 상세 페이지를 만든다.
- [ ] AS/보증 상세 페이지를 만든다.
- [ ] PDF 견적 요약/다운로드를 제공한다.

### P2 체크리스트

- [ ] 영상 쇼릴과 시공 타임랩스를 추가한다.
- [ ] ROI/전기요금 계산기를 추가한다.
- [ ] 네이버 블로그/포스트 콘텐츠 클러스터를 운영한다.
- [ ] 프랜차이즈/공공조달 전용 랜딩을 만든다.
- [ ] 다운로드 가능한 제품 스펙시트를 만든다.

---

## 5. 현재 사이트 구조 요약

읽은 주요 파일:

- `apps/web/src/app/page.tsx`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/globals.css`
- `apps/web/src/components/landing/*`
- `apps/web/src/components/NavBar.tsx`
- `apps/web/src/components/Footer.tsx`
- `apps/web/src/components/PageHero.tsx`
- `apps/web/src/components/quote/*`
- `apps/web/src/components/quote/steps/*`
- `apps/web/src/components/seo/*`
- `apps/web/src/lib/seo/site.ts`
- `apps/web/src/lib/seo/jsonld.ts`
- `apps/web/src/app/sitemap.ts`
- `apps/web/src/app/robots.ts`
- `apps/web/src/app/opengraph-image.tsx`
- `apps/web/src/app/about/page.tsx`
- `apps/web/src/app/services/page.tsx`
- `apps/web/src/app/products/page.tsx`
- `apps/web/src/app/packages/page.tsx`
- `apps/web/src/app/faq/page.tsx`
- `apps/web/src/app/blog/page.tsx`
- `apps/web/src/app/blog/[slug]/page.tsx`
- `apps/web/src/app/quote/page.tsx`
- `apps/web/src/app/api/quotes/route.ts`
- `apps/web/src/lib/pricing.ts`
- `apps/web/src/lib/bomPricing.ts`
- `apps/web/src/lib/standardBlock.ts`

홈 구성은 `page.tsx` 기준으로 다음 순서다.

1. `HeroSection`
2. `ProblemSection`
3. `ServicesSection`
4. `DifferentiatorSection`
5. `HowItWorks`
6. `TargetSection`
7. `ProductSection`
8. `PackagesSection`
9. `SocialProof`
10. `FaqSection`
11. `CtaSection`

이 순서는 논리적이다. 다만 전환 관점에서는 `SocialProof`와 실제 신뢰 증거가 너무 늦고 약하다. 고전환 리빌드에서는 hero 직후에 `trust strip + 실제 사례 3개 + 가격 기준`을 올리는 편이 낫다.

---

## 6. Gap Analysis vs Current Site

## 6.1 이미 잘하고 있는 것

### 6.1.1 명확한 핵심 훅

- `apps/web/src/components/landing/HeroSection.tsx`
  - `사진 3장 즉석 견적`
  - `1~3일 표준 시공`
  - `24시간 긴급 AS`
  - `약 5분 소요 · 비용 없음 · 기술 지식 없어도 됩니다`

평가: 좋다. SMB 고객이 싫어하는 "전화해야 가격 알 수 있음", "기술 용어", "AS 불안"을 직접 공격한다.

보완: 첫 문장을 더 고객 중심으로 바꿔야 한다. 현재 `매장을 밝히는 LED 전광판, 표준으로`는 좋지만 다소 브랜드/제품 중심이다. `카페·식당 사장님을 위한 LED 전광판, 사진 3장으로 오늘 예상 견적`이 더 직접적이다.

### 6.1.2 가격 투명성

- `apps/web/src/lib/pricing.ts`
  - `PRICE_RANGE_LABEL = '₩200만 ~ ₩3,000만'`
  - SKU별 `200만원~`, `350만원~`, `560만원~` 등.
- `apps/web/src/components/landing/ProductSection.tsx`
  - 제품 카드에 `설치비 기준` 표시.
  - 포함/별도 항목 명시.
- `apps/web/src/components/landing/DifferentiatorSection.tsx`
  - `범위 견적 즉시 공개`.

평가: 한국 시공업계 평균보다 훨씬 좋다. "확정가 아님"을 정직하게 다루는 것도 강점이다.

보완: 가격 범위를 hero 근처와 패키지 카드에도 직접 노출해야 한다. 현재 제품 섹션까지 내려가야 보인다.

### 6.1.3 실제 견적 엔진 연결

- `apps/web/src/components/quote/QuoteWizard.tsx`
  - 4단계 위저드, 진행률, 사진 업로드, 개인정보 동의.
- `apps/web/src/app/api/quotes/route.ts`
  - 서버 측 필수 검증.
  - `estimateProject`, `priceFromBom`으로 견적 요약 반환.
  - 웹훅 알림 처리.
- `apps/web/src/lib/standardBlock.ts`
  - 표준 레이아웃, BOM, 컨트롤러, 전력, 냉각 검토.
- `apps/web/src/lib/bomPricing.ts`
  - BOM 기반 판매가 범위.

평가: 홈페이지 카피가 빈 약속이 아니라 실제 기능과 이어진다. 이건 가장 큰 자산이다.

보완: 치수 미입력 시 결과가 `null`일 수 있다. 사용자는 "사진 3장"만으로 견적이 나온다고 기대하므로, 최소한 업종/환경 기반의 대략 범위라도 즉시 보여줘야 한다.

### 6.1.4 제품/패키지 구조

- `ProductSection.tsx`
  - 실내/옥외, 피치, 밝기, 가격 기준, 추천 업종.
- `PackagesSection.tsx`
  - 베이직/스탠다드/프리미엄/렌탈.
  - 보증 기간과 정기 점검·긴급 AS 구분.

평가: 제조사식 제품 구조와 SaaS식 패키지 구조를 잘 결합했다.

보완: 제품 상세 모달/비교표/스펙 다운로드가 필요하다.

### 6.1.5 FAQ와 SEO 기본기

- `FaqSection.tsx`
  - 가격, 인허가, AS, 전기요금, 방수, 설치 기간, 사진 개인정보.
  - `faqPageLd` 삽입.
- `layout.tsx`
  - Organization, LocalBusiness, WebSite JSON-LD.
  - OG/Twitter 기본 메타.
- `sitemap.ts`, `robots.ts`
  - 정적 페이지 + 블로그 sitemap.
  - Yeti, Daum, 주요 LLM crawler 허용.
- `blog/[slug]/page.tsx`
  - BlogPosting, Breadcrumb, FAQ JSON-LD.
  - TLDR, AboutBox.

평가: SEO/AEO 방향은 좋다.

보완: 네이버 검증, Product/Offer/Review schema, 지역/업종 랜딩, 실제 사례 콘텐츠가 필요하다.

### 6.1.6 접근성 방향

- `globals.css`
  - focus-visible ring.
  - reduced-motion 대응.
- `NavBar.tsx`
  - 모바일 메뉴 `aria-expanded`, `aria-controls`.
- `FaqSection.tsx`
  - 네이티브 `<details>/<summary>` 사용.

평가: 기본 방향은 좋다.

보완: 폼 label 연결, 위저드 progress ARIA, 세그먼트 버튼 그룹 접근성, 모달 도입 시 focus trap이 필요하다.

---

## 6.2 부족하거나 약한 것

### 6.2.1 Social proof가 아직 "증거"가 아니다

파일: `apps/web/src/components/landing/SocialProof.tsx`

현재 문제:

- 숫자 `즉시`, `1~3일`, `6종`, `24h`는 내부 약속이지 외부 검증 증거가 아니다.
- `CASES`는 업종별 활용 예시이며 실제 시공 사례가 아니다.
- 하단에 `실제 시공 현장 사진이 아니라 업종별 활용을 돕기 위한 예시`라고 되어 있다.

전환 영향:

- 정직한 문구라서 법적/윤리적으로는 좋다.
- 하지만 고관여 시공 서비스에서는 실제 사례가 없으면 신뢰 임계점을 넘기 어렵다.

필요:

- 실제 시공 사진 최소 6장.
- 고객 동의 받은 후기 3개.
- 전/후 비교 3개.
- 지역/업종/설치 SKU/시공 기간/가격 범위가 들어간 사례 카드.

### 6.2.2 회사 실체성 정보가 부족하다

파일:

- `apps/web/src/components/Footer.tsx`
- `apps/web/src/app/about/page.tsx`
- `apps/web/src/lib/seo/site.ts`

현재 문제:

- `SITE.phone`이 빈 값이라 전화 CTA가 렌더링되지 않는다.
- 푸터에 사업자등록번호, 대표자, 실제 주소, 고객센터 운영시간, 통신판매업/옥외광고 관련 정보가 없다.
- `site.ts`의 `founded: '2026'`은 신생 기업임을 드러내므로 다른 신뢰 증거가 더 필요하다.
- `Footer.tsx`에 "가짜 번호 노출 금지" 주석은 좋지만, 실제 번호 부재는 전환 손실이다.

필요:

- 실제 대표번호.
- 사업자등록번호.
- 대표자명.
- 소재지.
- 이메일 `contact@wooktech.co.kr`.
- 네이버 플레이스/지도 링크.
- 카카오채널/네이버톡톡.
- 가능한 경우 공장/창고/작업 차량/대표 사진.

### 6.2.3 인증·보증 문구가 증빙 없이 나온다

파일:

- `ServicesSection.tsx`: `KC 적합등록·EMC 등 인증 자산`
- `PackagesSection.tsx`: `1년 하드웨어 보증`, `2년 하드웨어 보증`
- `FaqSection.tsx`: AS 보증 설명

현재 문제:

- 인증 번호, 적용 제품, 인증서 이미지, 확인 링크가 없다.
- 보증서 샘플, 보증 제외 조건, 접수 절차가 없다.

필요:

- `인증·보증` 섹션 추가.
- `KC/EMC 인증서 보기` 모달 또는 PDF.
- `보증 범위/제외/AS 접수` 표.
- `프리미엄 24h`의 의미 정의: 접수 응답 24h인지, 방문 24h인지, 원격 확인 24h인지.

### 6.2.4 모바일 전환 장치가 약하다

파일:

- `NavBar.tsx`
- `CtaSection.tsx`
- `HeroSection.tsx`

현재 문제:

- 모바일 상단에는 `견적` 버튼이 있지만 하단 고정 CTA가 없다.
- 전화 CTA는 `SITE.phone`이 비어 있어 숨겨진다.
- 카카오/네이버톡톡 CTA가 없다.
- 사용자가 스크롤 중 바로 상담으로 전환할 수 없다.

필요:

- `MobileStickyCta.tsx` 신규 컴포넌트.
- 버튼 3개: `견적`, `전화`, `카톡/톡톡`.
- 전화번호 없을 때는 `견적`, `카톡`, `사례` 등으로 fallback.

### 6.2.5 모달/오버레이가 전혀 없다

검색 결과:

- `modal`, `dialog`, `Dialog`, `Sheet`, `Lightbox` 관련 구현 없음.

필요한 모달:

1. **빠른 상담 모달**
   - 이름, 연락처, 지역, 문의 유형 4필드.
   - 견적 위저드보다 낮은 진입 장벽.
2. **모바일 상담 bottom sheet**
   - 전화, 카카오, 네이버톡톡, 견적 링크.
3. **시공 갤러리 라이트박스**
   - 실제 사례 사진 확대.
4. **제품 상세 모달**
   - 피치, 밝기, 권장 거리, 추천 업종, 가격 범위.
5. **사진 촬영 가이드 모달**
   - 사진 3장 예시.
6. **개인정보/사진 사용 동의 모달**
   - 사진 보관 기간, 목적, 삭제 요청.
7. **현장 실측 예약 모달**
   - 견적 제출 후 날짜/시간 선택.

### 6.2.6 견적 폼의 리드 캡처 타이밍

파일:

- `QuoteWizard.tsx`
- `Step1BusinessInfo.tsx`

현재 흐름:

1. 업종, 상호명, 담당자, 전화번호, 지역
2. 설치 정보
3. 사진 업로드
4. 예산/동의
5. 제출 후 결과

문제:

- 연락처를 너무 먼저 요구한다.
- 사용자가 즉석 견적 가치를 보기 전에 개인정보를 제공해야 한다.
- 고전환 계산기에서는 보통 `업종/환경/대략 크기 -> 예상 범위 일부 -> 연락처 저장/상담`이 더 좋다.

권장 흐름:

1. 업종/설치환경/희망 크기/용도.
2. 사진 업로드 또는 "사진 없이 대략 보기".
3. 예상 범위 프리뷰.
4. 연락처 입력하면 상세 견적 저장/전송.
5. 성공 화면에서 카카오/전화/현장 실측 예약.

### 6.2.7 개인정보처리방침 브랜드 불일치

파일: `apps/web/src/app/privacy/page.tsx`

현재 문제:

- title이 `개인정보처리방침 — LCD PRO`.
- 문의 이메일이 `contact@lcdpro.co.kr`.
- 현 브랜드 `우강테크 / wooktech.co.kr`와 불일치.

전환/신뢰 영향:

- 견적 폼에서 개인정보 동의를 요구하는데, 방침 페이지 브랜드가 다르면 즉시 신뢰가 깨진다.

필요:

- `우강테크 / WK Tech / contact@wooktech.co.kr`로 정정.
- 사진 보관·삭제·제3자 제공·파트너 기사 공유 범위 구체화.

### 6.2.8 Naver SEO 미완성

파일:

- `layout.tsx`: `naver-site-verification` TODO.
- `site.ts`: `sameAs` TODO.

현재 문제:

- 네이버 사이트 검증 토큰이 없다.
- 네이버 플레이스/지도 연결이 없다.
- 네이버 블로그/포스트 콘텐츠 허브가 없다.
- 지역별 서비스 페이지가 없다.

필요:

- 네이버 서치어드바이저 등록.
- `sameAs`에 네이버 플레이스, 블로그, 카카오채널, 유튜브/인스타 등 실제 채널.
- `서울 LED 전광판`, `경기 전광판 설치`, `카페 LED 메뉴판`, `식당 LED 메뉴보드` 콘텐츠.

### 6.2.9 구조화 데이터 확장 부족

현재 있음:

- Organization
- LocalBusiness
- WebSite
- Service
- FAQPage
- BreadcrumbList
- BlogPosting
- HowTo helper는 있으나 실제 홈 프로세스에 미사용

부족:

- Product schema
- Offer schema 세부 가격
- Review/AggregateRating
- ImageObject/VideoObject
- WebPage schema
- HowTo schema 실제 적용
- LocalBusiness의 주소/전화/영업시간/geo

### 6.2.10 블로그 콘텐츠가 1개뿐

파일: `apps/web/src/lib/blog/posts.ts`

현재:

- `how-to-get-led-signage-quote` 1개.

필요 콘텐츠:

- `카페 LED 메뉴판 가격`
- `식당 LED 전광판 설치 전 체크리스트`
- `옥외 LED 전광판 인허가`
- `P2.5 P3 P4 차이`
- `LED 전광판 전기요금`
- `NovaStar Taurus 사용법`
- `LED 전광판 AS 비용`
- 지역별 시공 가이드.

---

## 6.3 없는 것 / 반드시 추가할 것

### 6.3.1 반드시 추가할 모달

| 우선순위 | 모달 | 대상 파일/컴포넌트 | 구체 내용 |
|---|---|---|---|
| P0 | 빠른 상담 모달 | `components/lead/QuickConsultModal.tsx` 신규 | 이름/연락처/지역/문의유형, 개인정보 동의, 제출 후 성공 |
| P0 | 모바일 상담 bottom sheet | `components/MobileStickyCta.tsx` + `QuickContactSheet.tsx` | 전화/카톡/네이버톡톡/견적 |
| P0 | 개인정보·사진 사용 모달 | `components/quote/PrivacyConsentModal.tsx` | 사진 사용 목적, 보관 기간, 삭제 요청 |
| P1 | 시공 갤러리 라이트박스 | `landing/SocialProof.tsx` 또는 `CaseGallery.tsx` | 실제 사진 확대, 전/후 비교 |
| P1 | 제품 상세 모달 | `landing/ProductSection.tsx` | 스펙, 추천 거리, 가격, CTA |
| P1 | 현장 실측 예약 모달 | `QuoteSuccess.tsx` 후속 | 날짜/시간/지역/메모 |
| P2 | 영상 모달 | `CaseVideoModal.tsx` | 시공 과정/완성 영상 |

### 6.3.2 반드시 추가할 신뢰 요소

- 실제 대표번호.
- 실제 주소.
- 사업자등록번호.
- 대표자명.
- 고객센터 운영시간.
- 네이버 플레이스 링크.
- 카카오채널/네이버톡톡.
- 실제 시공 사진.
- 실제 후기.
- 실제 인증서/인증 범위.
- 보증서 샘플.
- AS 접수 절차.
- 설치 파트너/기사 운영 방식.
- 공사 보험/안전 관련 문구가 있으면 증빙과 함께 표시.

### 6.3.3 반드시 추가할 SEO 요소

- 네이버 사이트 검증.
- 네이버 플레이스/지도 등록.
- `sameAs` 채널 연결.
- Product/Offer JSON-LD.
- Review/AggregateRating JSON-LD는 실제 리뷰 확보 후.
- HowTo JSON-LD를 `HowItWorks` 또는 시공 절차 페이지에 적용.
- 업종별 랜딩: `/industries/cafe`, `/industries/restaurant`, `/industries/gym`, `/industries/franchise`, `/industries/outdoor-ad`.
- 지역별 랜딩: `/locations/seoul`, `/locations/gyeonggi`, `/locations/incheon`부터.
- 실제 사례 페이지: `/cases/[slug]`.
- 이미지 파일명: `cafe-led-menu-board-seoul-before-after.jpg`처럼 의미 있게.

### 6.3.4 반드시 추가할 성능·접근성 개선

- `FormField`에 `htmlFor`와 입력 `id` 연결.
- 위저드 진행률에 `role="progressbar"` 또는 단계 내비게이션 ARIA.
- 세그먼트 버튼 그룹에 `role="radiogroup"` / `role="radio"` 또는 명확한 필드셋.
- `Step3PhotoUpload`의 클릭 가능한 `div`를 키보드 접근 가능한 button/label 구조로 개선.
- 사진 삭제 버튼은 hover뿐 아니라 focus에서도 보이게.
- 모달 도입 시 focus trap, scroll lock, Esc/backdrop 닫기.
- `Inter`만 쓰는 대신 한국어 최적 폰트 전략 검토.
- hero와 curated 이미지 용량 점검.

---

## 7. 우선순위 백로그

## P0: 전환 직결

| 항목 | 대상 파일 | 구체 변경 | 기대 효과 |
|---|---|---|---|
| 실제 회사 실체성 정보 노출 | `src/lib/seo/site.ts`, `Footer.tsx`, `about/page.tsx` | phone, address, 대표자, 사업자등록번호, 영업시간, 네이버 지도/플레이스 추가 | 로컬 시공 신뢰 상승, 전화 전환 |
| 개인정보처리방침 브랜드 정정 | `app/privacy/page.tsx` | LCD PRO/contact@lcdpro.co.kr을 우강테크/contact@wooktech.co.kr로 수정, 사진 보관/삭제 조항 추가 | 폼 동의 신뢰 회복 |
| 모바일 하단 고정 CTA | `components/MobileStickyCta.tsx` 신규, `layout` 또는 페이지 삽입 | `견적`, `전화`, `카톡/톡톡` 하단 고정 | 모바일 리드 증가 |
| 빠른 상담 모달 | `components/lead/QuickConsultModal.tsx` 신규 | 4필드 상담 폼, 개인정보 동의, 성공 상태 | `/quote` 진입 부담이 큰 방문자 흡수 |
| 실제 시공/후기 섹션 | `landing/SocialProof.tsx` 재구성 | placeholder 사례 제거, 실제 사진/후기/지역/SKU/기간 | 신뢰 임계점 돌파 |
| Hero trust strip 강화 | `landing/HeroSection.tsx` | 실적/보증/가격/상담 채널 배지 추가 | 첫 화면 설득력 강화 |
| 견적 UX 연락처 후입력 실험 | `QuoteWizard.tsx`, steps | 조건 입력 -> 프리뷰 -> 연락처 입력 구조로 재배치 | 폼 시작률/완료율 개선 |
| 견적 결과 후 예약/톡 CTA | `QuoteSuccess.tsx` | 결과 카드 아래 `현장 실측 예약`, `카톡 상담`, `전화` | 리드 후속 속도 개선 |
| 네이버 Search Advisor | `layout.tsx`, 운영 설정 | verification 토큰 주입 | 네이버 검색 기본 노출 |
| 카카오/네이버 채널 연결 | `site.ts`, `NavBar.tsx`, `Footer.tsx`, `MobileStickyCta.tsx` | 실제 채널 URL 추가 | 한국 SMB 상담 전환 |

## P1: 신뢰·SEO 확장

| 항목 | 대상 파일 | 구체 변경 | 기대 효과 |
|---|---|---|---|
| 제품 상세 모달 | `ProductSection.tsx`, `ProductDetailModal.tsx` | 카드 클릭 시 상세 스펙/추천 거리/가격/CTA | 제품 이해도 상승 |
| 갤러리 라이트박스 | `CaseGallery.tsx` 신규 | 실제 사진 확대, 전/후, 키보드/스와이프 | 시공 품질 전달 |
| Product/Offer JSON-LD | `lib/seo/jsonld.ts`, `products/page.tsx` | 제품별 schema 생성 | 제품 검색/AI 이해도 향상 |
| HowTo JSON-LD 적용 | `HowItWorks.tsx` 또는 `services/page.tsx` | 시공 단계 schema 삽입 | 절차 검색 노출 |
| AS/보증 상세 섹션 | `ServicesSection.tsx` 또는 신규 `WarrantySection.tsx` | 보증 범위/제외/접수/응답 SLA 표 | 고가 설비 불안 해소 |
| 업종별 랜딩 | `app/industries/*` 신규 | 카페/식당/헬스장/프랜차이즈/옥외광고 | 롱테일 SEO + 광고 랜딩 |
| 지역별 랜딩 | `app/locations/*` 신규 | 서울/경기/인천 우선 | 네이버/구글 로컬 유입 |
| 사례 상세 페이지 | `app/cases/[slug]` 신규 | 문제/사양/기간/가격범위/사진/후기 | SEO와 영업 자료 |
| FAQ 검색/카테고리화 | `faq/page.tsx` | 가격/시공/AS/인허가/운영 탭 | 긴 FAQ 탐색성 |
| 접근성 폼 개선 | `FormField.tsx`, step 컴포넌트 | id/htmlFor, fieldset/legend, aria-live | WCAG 품질 향상 |

## P2: 장기 경쟁력

| 항목 | 대상 파일 | 구체 변경 | 기대 효과 |
|---|---|---|---|
| ROI/전기요금 계산기 | 신규 `components/calculators/*` | 소비전력, 운영시간, 예상 전기요금 | 고관여 정보 제공 |
| PDF 견적 요약 | `QuoteSuccess.tsx`, API | 결과 PDF/프린트 | 내부 공유/결재 |
| 제품 스펙시트 다운로드 | `products/page.tsx`, public PDF | SKU별 PDF | B2B 구매 보조 |
| 영상 모달 | `CaseVideoModal.tsx` | 시공 과정/완성 영상 | 현장감 |
| 네이버 블로그 클러스터 | 콘텐츠 운영 | 주 2~3개 정보성 글 | 한국 검색 유입 |
| 프랜차이즈/공공조달 페이지 | 신규 랜딩 | 다점포/조달 대응 | 큰 거래 확장 |
| 리뷰 자동 수집 플로우 | 운영/CRM | 설치 후 리뷰 요청 | 지속적 social proof |

---

## 8. 추천 리빌드 홈페이지 구조

1. **Hero**
   - H1: `카페·식당 LED 전광판, 사진 3장으로 오늘 예상 견적`
   - Sub: `설계·시공·콘텐츠 세팅·AS까지 한 번에. 설치비 기준 ₩200만~`
   - CTA: `즉석 견적 받기`, `실제 시공 사례 보기`
   - 모바일 하단 CTA: `견적`, `전화`, `카톡`

2. **Trust Strip**
   - `표준 시공 1~3일`
   - `하드웨어 보증 1~2년`
   - `사진 3장 범위 견적`
   - `카카오/네이버 상담`
   - 실제 실적 수치가 생기면 `누적 시공 n건`

3. **Actual Case Gallery**
   - 실제 사진 6장.
   - 업종, 지역, SKU, 시공 기간, 가격 범위.
   - 라이트박스.

4. **Instant Quote Preview**
   - 3개 선택: 업종, 실내/옥외, 대략 크기.
   - 즉시 범위 프리뷰.
   - `상세 견적은 사진 3장 업로드`.

5. **Problem/Solution**
   - 가격 불투명, AS 불안, 기술 용어, 인허가.
   - 우강테크 대응.

6. **Products**
   - 6개 SKU.
   - 비교표.
   - 상세 모달.

7. **Packages**
   - Basic/Standard/Premium/Rental.
   - 가격 범위와 포함/별도.

8. **Process**
   - 4단계.
   - 각 단계 소요 시간, 담당자, 고객 준비물.

9. **Certification/Warranty**
   - 인증서/보증서/AS 절차.

10. **Reviews**
   - 네이버/카카오/구글 실제 리뷰.

11. **FAQ**
   - 현재 FAQ 유지 + 검색/카테고리.

12. **Final CTA**
   - `사진 3장으로 예상 견적 보기`.
   - `전화/카톡 상담`.

---

## 9. 카피 제안

### Hero headline 후보

1. `카페·식당 LED 전광판, 사진 3장으로 오늘 예상 견적`
2. `매장 사진 3장만 올리면 LED 전광판 견적이 바로 보입니다`
3. `전화 기다림 없이, LED 전광판 범위 견적부터 확인하세요`
4. `소상공인 매장을 위한 LED 전광판 표준 시공`

추천: 1번. 대상, 제품, 행동, 즉시성이 모두 들어간다.

### Subhead 후보

`실내·옥외 LED 사이니지를 설계, 시공, 콘텐츠 세팅, AS까지 한 번에 제공합니다. 설치비 기준 ₩200만부터, 최종 금액은 현장 실측 후 확정됩니다.`

### CTA 후보

- 1차: `사진 3장으로 견적 받기`
- 2차: `시공 사례 보기`
- 모바일: `견적`, `전화`, `카톡`
- 제품 카드: `이 모델로 견적 받기`
- 사례 카드: `비슷한 매장 견적 보기`
- 성공 화면: `현장 실측 예약하기`, `카톡으로 상담 이어가기`

### 신뢰 문구 후보

- `확정가가 아닌 예상 범위로 먼저 안내합니다. 현장 실측 전 과장 견적을 약속하지 않습니다.`
- `가격에 포함되는 항목과 별도 항목을 먼저 밝힙니다.`
- `설치 후 콘텐츠 교체 방법까지 1:1로 안내합니다.`
- `고장 시 전체 교체가 아니라 모듈 단위로 빠르게 대응합니다.`

---

## 10. SEO 콘텐츠 로드맵

### 10.1 우선 키워드

- LED 전광판 견적
- LED 전광판 설치
- LED 사이니지 시공
- 카페 LED 메뉴판
- 식당 LED 메뉴보드
- 헬스장 LED 전광판
- 옥외 LED 전광판
- 전광판 AS
- 전광판 전기요금
- 전광판 인허가
- P2.5 P3 차이
- NovaStar Taurus

### 10.2 페이지 구조

| 페이지 | 목적 | 우선순위 |
|---|---|---|
| `/industries/cafe` | 카페 메뉴판/이벤트 화면 | P1 |
| `/industries/restaurant` | 식당 메뉴보드/대기 안내 | P1 |
| `/industries/gym` | 헬스장 공지/프로모션 | P1 |
| `/industries/franchise` | 다점포 통합 운영 | P1 |
| `/industries/outdoor` | 옥외 광고/인허가 | P1 |
| `/locations/seoul` | 서울 로컬 SEO | P1 |
| `/locations/gyeonggi` | 경기 로컬 SEO | P1 |
| `/cases/[slug]` | 실제 사례 SEO/전환 | P1 |
| `/warranty` | AS/보증 신뢰 | P1 |
| `/guides/led-signage-cost` | 가격 검색 유입 | P2 |
| `/guides/led-electricity-cost` | 전기요금 검색 유입 | P2 |
| `/guides/outdoor-permit` | 인허가 검색 유입 | P2 |

### 10.3 네이버 최적화

- 네이버 서치어드바이저 등록.
- 네이버 플레이스 등록 후 홈페이지/전화/영업시간/사진/서비스 연결.
- 네이버톡톡 연결.
- 네이버 블로그에 실제 시공 과정 글 발행.
- 블로그 글 제목은 검색형으로 작성: `성수동 카페 LED 메뉴판 설치 비용과 시공 과정`.
- 본문에 지역, 업종, 사이즈, 시공 기간, 주의점, 사진을 포함.
- 네이버 플레이스 리뷰 요청 프로세스 운영.

---

## 11. 소스 파일별 실행 메모

### `apps/web/src/components/landing/HeroSection.tsx`

- H1을 고객/견적 중심으로 변경.
- 실제 시공 사진으로 hero 교체.
- 가격 기준/보증/전화/카톡 trust strip 추가.
- 2차 CTA를 `제품 라인업`보다 `실제 시공 사례`로 우선 변경.

### `apps/web/src/components/landing/SocialProof.tsx`

- 현재 placeholder 사례를 실제 사례 컴포넌트로 교체.
- `* 실제 시공 현장 사진이 아님` 문구가 더 이상 필요 없게 실제 자산 확보.
- 후기/별점/고객명/지역 추가.
- 라이트박스 연결.

### `apps/web/src/components/landing/ProductSection.tsx`

- 제품 카드 클릭 가능하게.
- 제품 상세 모달 추가.
- 비교표 섹션 추가.
- Product/Offer JSON-LD 데이터 소스와 연결.

### `apps/web/src/components/landing/PackagesSection.tsx`

- 각 패키지 가격 범위 추가.
- 보증/AS 차이를 표로 보강.
- `추천` 배지 유지.

### `apps/web/src/components/landing/FaqSection.tsx`

- FAQ는 유지.
- 검색/카테고리 확장 시 별도 FAQ 페이지에서 구현.
- FAQPage JSON-LD는 현재처럼 유지.

### `apps/web/src/components/quote/QuoteWizard.tsx`

- 폼 흐름 재배치 실험.
- 연락처 후입력 테스트.
- 치수 미입력 fallback estimate.
- 제출 전 예상 범위 preview.

### `apps/web/src/components/quote/steps/Step3PhotoUpload.tsx`

- 모바일 카메라 촬영 최적화.
- 사진 예시 모달.
- 드롭존 키보드 접근성 보완.
- 파일 타입 HEIC 처리 안내.

### `apps/web/src/components/quote/QuoteSuccess.tsx`

- 성공 후 전화/카톡/예약 CTA 추가.
- 결과 PDF/공유 링크 P2.
- `현장 실측 예약`이 가장 중요한 다음 액션.

### `apps/web/src/components/NavBar.tsx`

- 데스크탑 `견적 요청하기` 옆에 `전화` 또는 `상담` 추가.
- 모바일 메뉴에는 카카오/톡톡도 추가.

### `apps/web/src/components/Footer.tsx`

- 사업자 정보, 대표자, 주소, 고객센터, 이메일, 전화, 네이버/카카오 채널 추가.
- 현재 주석의 "가짜 번호 금지" 원칙은 유지.

### `apps/web/src/app/privacy/page.tsx`

- 브랜드/이메일 불일치 즉시 수정 필요.
- 사진 개인정보 조항 강화.

### `apps/web/src/lib/seo/site.ts`

- `phone`, `address`, `sameAs`, `openingHours`, `geo`에 실제 값 추가.

### `apps/web/src/lib/seo/jsonld.ts`

- `productLd`, `offerLd`, `reviewLd`, `aggregateRatingLd`, `webPageLd` 추가.
- `localBusinessLd`에 실제 주소/전화/영업시간/지도 좌표 추가.

### `apps/web/src/app/layout.tsx`

- 네이버 사이트 검증 토큰 추가.
- Google Search Console 토큰 추가.

---

## 12. 최종 판단

우강테크 홈페이지는 "기능형 마케팅 사이트"로는 이미 강하다. 특히 즉석 견적 엔진과 가격 범위 공개는 한국 LED 전광판/간판 시장에서 차별화될 수 있다. 그러나 홈페이지 재구축의 승부는 더 화려한 디자인이 아니라 **실제 증거의 밀도**다.

가장 먼저 해야 할 일은 다음 5개다.

1. 실제 회사 정보와 상담 채널을 노출한다.
2. 실제 시공 사진/후기/사례를 만든다.
3. 모바일 하단 CTA와 빠른 상담 모달을 추가한다.
4. 견적 위저드를 "조건 먼저, 연락처 나중"으로 실험한다.
5. 네이버 플레이스/서치어드바이저/지역·업종 SEO를 세팅한다.

이 5개가 갖춰지면 우강테크의 기존 강점인 `사진 3장 -> 즉석 범위 견적 -> 표준 시공 -> AS`가 단순 카피가 아니라 전환 가능한 신뢰 구조로 작동한다.
