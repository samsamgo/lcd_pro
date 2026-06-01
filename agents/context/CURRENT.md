# LCD PRO — 현재 프로젝트 상태

> Claude가 새 세션 시작 시 이 파일을 먼저 읽는다.
> 세션 종료 전 반드시 업데이트하고 커밋한다.

---

## 마지막 업데이트: 2026-05-14

---

## 프로젝트 기본 정보

```
위치: C:\Users\dmast\Desktop\pro\lcd_pro
GitHub: https://github.com/samsamgo/lcd_pro
Supabase: https://ktctppxsjtezzgzzywbz.supabase.co
Vercel: 배포 완료 (CI/CD: GitHub Actions → Vercel)
```

---

## 완료된 것 ✅

### 인프라
- [x] Next.js 14 + Turborepo 모노레포 (pnpm workspaces)
  - `apps/web` (localhost:3000) — 고객용 랜딩 + 견적 마법사
  - `apps/admin` (localhost:3001) — 관리자 대시보드
  - `packages/db` — Supabase 클라이언트 & 타입
  - `packages/ui`, `packages/config`
- [x] GitHub Actions → Vercel CI/CD 자동 배포
- [x] `turbo.json` v2 형식 (tasks 필드)

### DB (Supabase)
- [x] `supabase/migrations/001_initial_schema.sql` — 11개 테이블, RLS, 시드 데이터
- [x] `supabase/migrations/002_storage_setup.sql` — quote-photos 버킷 (private, 20MB)
- [x] TypeScript 타입 스텁 (`packages/db/src/types.gen.ts`)
  - 주의: `Relationships: []` 비어 있어 `.select('a, customers (*)')` join 결과가 SelectQueryError로 추론됨 → 페이지에서 `as any` 캐스팅 후 클라이언트 컴포넌트에 명시 타입 부여

### 앱/기능 (web)
- [x] 랜딩 페이지 9개 섹션
- [x] 4단계 견적 마법사
- [x] 견적 API (`/api/quotes` POST) — 고객 upsert + 견적 저장 + 사진 업로드
- [x] 카카오 BizTalk + 알리고 SMS 이중 알림
- [x] sitemap, robots.txt, 개인정보처리방침

### 앱/기능 (admin) — MVP2 진행분 (2026-05-13)
- [x] 대시보드 (통계 카드 + 최근 견적 5건)
- [x] 견적 관리 (`/quotes`) — 목록 + 상세 + 상태 변경 + 마진 30% 차단
- [x] **견적 상세 사진 미리보기** — service_role로 quote-photos signed URL(1h) 발급 → 썸네일 그리드 + 라이트박스(좌우/Esc 키, 원본 다운로드)
- [x] **파트너(인스톨러) 관리** (`/installers`) — 목록/필터/모달 추가·수정/삭제, 진행 프로젝트 카운트, 진행 중 프로젝트 있으면 삭제 409 차단
- [x] **설치 프로젝트 관리** (`/projects`) — 인라인 일정/인스톨러/상태 편집, 월별 캘린더 뷰, 지연 일정 자동 강조
- [x] **견적 contracted → 프로젝트 자동 생성** — `/api/quotes/[id]` PATCH에서 멱등 insert (quote_id unique), AS 예비비 = estimate_max × 5%
- [x] **API 화이트리스트** — `/api/projects/[id]`, `/api/installers/*` 허용 키만 수용

### 결제 인프라 (Toss) — 2026-05-13
- [x] `supabase/migrations/003_billing_history.sql` — payment_key UNIQUE 멱등 보장, RLS 차단(service_role only), raw_payload 보존
- [x] `supabase/migrations/004_subscriptions_toss_customer_key.sql` — `subscriptions.toss_customer_key` 컬럼 추가 (정기결제 시 billingKey와 페어로 필수)
- [x] `apps/web/src/lib/toss.ts` — issueBillingKey / executePayment / cancelPayment + 키 prefix로 환경 자동 분기
- [x] `apps/web/src/app/api/billing/webhook/route.ts` — PAYMENT_STATUS_CHANGED 수신, 옵셔널 서명 검증(HMAC-SHA256), payment_key UPSERT 멱등, subscription 상태 자동 동기화
- [x] **카드 등록 UI** (`/subscribe/[projectId]`) — Toss v2 SDK(`https://js.tosspayments.com/v2/standard`) script 로드, requestBillingAuth 호출 → success/fail 라우트 처리. 첫 결제까지 자동 수행
- [x] **정기결제 Cron** (`/api/cron/billing`) — Vercel Cron 매일 00:00 UTC, `next_billing_at <= now` 청구, 실패 3회 누적 시 paused, billing_history에 결과 누적
- [x] `vercel.json` crons 설정 + `CRON_SECRET` Bearer 인증
- [x] orderId 컨벤션: `sub_<subscriptionId>_<yyyymm>` — 첫 결제와 cron 모두 동일

> 운영 전 체크:
> - 라이브 정기결제는 Toss MID 별도 계약 승인 필요
> - 환경변수: `TOSS_SECRET_KEY`, `NEXT_PUBLIC_TOSS_CLIENT_KEY`, `CRON_SECRET`, (옵셔널) `TOSS_WEBHOOK_SECRET`
> - 003/004 마이그레이션 SQL Editor 실행 필수

### 에이전트 시스템
- [x] `agents/README.md`, `prompts/*`, `protocol/*`, `context/CURRENT.md`

---

## 블로커 🚨

### Supabase SQL 미실행 (최우선)
- **할 것**: `supabase/setup_all.sql` 내용을 SQL Editor에서 실행
- **URL**: https://supabase.com/dashboard/project/ktctppxsjtezzgzzywbz/sql/new
- **확인**: `node scripts/run-migration.mjs` 실행 시 테이블 목록 출력되면 성공
- DB 미실행 상태에서도 admin UI는 빌드되고 동작은 됨 (런타임에 빈 결과 반환)

### GPT 결과 도착 ✓
- `[CLAUDE_RESULT id=T-TOSS-001]` — `agents/context/gpt_results/2026-05-13.md` 에 보존, Toss 인프라(클라이언트+웹훅) 반영 완료
- `[CLAUDE_RESULT id=T-KAKAO-001]` — 동일 파일에 보존, 코드 변경 없음 (운영 문서)

---

## 다음 개발 우선순위 (MVP 2 잔여 + MVP 3 입구)

1. **알림톡 템플릿 등록** — 운영 절차(코드 변경 없음): `agents/context/gpt_results/2026-05-13.md` 참조
2. **types.gen.ts 재생성** — billing_history + subscriptions.toss_customer_key 반영, Relationships 채워 `as any` 제거
3. **고객 관리 페이지** (`/customers`)
4. **결제 이력 화면** — admin에서 subscription별 billing_history 조회 (실패 retry 카운트 표시)
5. **디바이스 모니터링** (`/devices`) — MVP3 영역
6. **구독 해지 UI** — `/api/billing/cancel` + 고객/관리자 양쪽 진입점

---

## 알려진 함정 & 결정 사항

| 항목 | 결정 |
|------|------|
| Supabase types.gen.ts join 타입 | `Relationships: []` 때문에 join select 결과가 SelectQueryError. 서버 컴포넌트에서 `as any`로 클라이언트에 넘기고 클라이언트에서 명시 타입 사용 |
| `.update(Record<string, unknown>)` 타입 에러 | `Database['public']['Tables']['X']['Update']` 명시. 빈 객체에서 시작해 키 채우는 패턴 유지 |
| Supabase client in apps/web | `apps/web/src/lib/supabase.ts`에서 직접 생성 (workspace 타입 해석 우회) |
| service_role key | 클라이언트 노출 금지, API route에서만 `adminDb` 사용. signed URL도 서버에서 발급 후 전달 |
| 마진 최소값 | `MIN_MARGIN_PCT = 30` 하드코딩 |
| 계약금 | 50% 정책 — 견적 확정 시 자동 계산 |
| AS 예비비 | 최종 견적 × 5% (projects.as_reserve_krw에 자동 채움, 정산 시 정밀화) |
| 알림 실패 | `Promise.allSettled` — 알림 실패가 견적 저장을 막지 않음 |
| installation_schedules 별도 테이블 | **만들지 않음**. projects.scheduled_date로 충분. 다중 방문 필요해지면 그때 추가 |
| 견적 → 프로젝트 자동 생성 | `quote_id unique` 활용해 멱등. 이미 있으면 무시 |
| 파트너 삭제 | 진행 중 프로젝트 있으면 409. 비활성 전환만 가능 (정산 이력 보존) |

---

## 로컬 실행

```bash
pnpm --filter @lcd-pro/web dev    # localhost:3000
pnpm --filter @lcd-pro/admin dev  # localhost:3001
pnpm build                        # 전체 빌드 (CI 동일)
```

---

## 마지막 상태 (2026-05-13)

- **완료**: 견적 사진 미리보기, 파트너 CRUD, 프로젝트 일정 관리, contracted → project 자동 생성, **Toss 풀스택(클라이언트+UI+success/fail 처리+웹훅+Cron+멱등 DB)**
- **진행 중**: 없음
- **다음 할 것**: 알림톡 템플릿 등록(운영) → types.gen.ts 재생성 → 고객 관리 페이지 → 결제 이력 화면
- **주의**: 
  - types.gen.ts Relationships 비어 있어서 join 타입 추론 깨짐 — `as any` 패턴 일관성 유지
  - billing_history + toss_customer_key 아직 types.gen.ts에 없음 (`as any` 캐스팅 중) — supabase gen types 재생성 필요
  - 환경변수 추가 필요: `TOSS_SECRET_KEY`, `NEXT_PUBLIC_TOSS_CLIENT_KEY`, `CRON_SECRET`, (옵셔널)`TOSS_WEBHOOK_SECRET`
  - Toss v2 SDK는 script tag로 로드 (npm 의존성 없음). `requestBillingAuth` 정확한 시그니처는 운영 환경에서 검증 필요

---

## 마지막 상태 (2026-05-14)

- **신규 완료 (COO 사이클 자동 진행)**:
  - `apps/web/src/lib/pricing.ts` — 견적 산출 모듈 (04-finance 의사코드 구현, MIN_MARGIN_PCT=30 가드, AS 5%)
  - `apps/admin/src/app/devices/` — MVP3 진입 v0 (online/offline 표시, 빈 상태에서도 안전)
  - `apps/admin/src/app/settings/` — env 상태 + 비즈니스 규칙 표시
  - `apps/admin/src/app/billing/` — billing_history 뷰어 (실패 누적 카운트, raw payload 모달)
  - `apps/web/src/app/api/billing/cancel/route.ts` — 구독 해지 API (소유권 검증, status=canceled, next_billing_at=null)
  - `apps/web/src/app/account/subscription/[id]/cancel/` — 고객측 해지 UI (7일 환불 안내 + 사유 선택)
  - `apps/admin/src/components/Sidebar.tsx` — `/billing` 링크 추가
- **상위 사이클**: `../00-COO/ceo-reports/CEO-REPORT-20260514-002.md` 참조 (10개 부서 첫 보고 완료, CEO 결재 7건 대기)
- **다음 할 것**:
  - Supabase `setup_all.sql` 운영 DB 실행 (CEO/매니저 SQL Editor)
  - 알림톡 BizTalk 템플릿 등록 (운영, 외부)
  - 005_devices.sql 마이그레이션 신규 작성 (devices·heartbeat·firmware_version)
  - types.gen.ts 재생성 (Supabase 실행 후)
- **주의**:
  - 새로 추가된 라우트는 Supabase 운영 미적용 상태에서도 빈 상태 표시로 안전 (devices·billing은 try/catch)
  - settings 페이지에서 import 경로가 monorepo 상대경로 (`../../../../web/src/lib/pricing`) — 빌드 시 검증 필요. 문제 시 `packages/config` 또는 `packages/db`로 이동
  - cancel API는 customer_id 검증을 옵셔널로 처리 — 향후 인증 도입 시 강제화 필요
  - billing 페이지의 `failureCounts`는 fetch 범위(최근 300건) 내 카운트 — 운영 데이터 누적 시 정확한 누적 카운트는 별도 view·rpc로
