# LCD PRO — 현재 프로젝트 상태

> Claude가 새 세션 시작 시 이 파일을 먼저 읽는다.
> 세션 종료 전 반드시 업데이트하고 커밋한다.

---

## 마지막 업데이트: 2026-05-12

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
- [x] `vercel.json` 최소화 (buildCommand + installCommand만)

### DB (Supabase)
- [x] `supabase/migrations/001_initial_schema.sql` — 11개 테이블, RLS, 시드 데이터
- [x] `supabase/migrations/002_storage_setup.sql` — quote-photos 버킷 (private, 20MB)
- [x] `supabase/setup_all.sql` — 위 두 파일 합본 (SQL Editor용)
- [x] TypeScript 타입 스텁 (`packages/db/src/types.gen.ts`)
  - 주의: `Relationships: []` 필드 필수 (없으면 `never` 타입 추론됨)

### 앱/기능
- [x] 랜딩 페이지 9개 섹션
- [x] 4단계 견적 마법사 (QuoteWizard + 3개 Step 컴포넌트)
- [x] 견적 API (`/api/quotes` POST) — 고객 upsert + 견적 저장 + 사진 업로드
- [x] 관리자 견적 목록/상태 관리
- [x] SKU 추천 로직 + 마진 계산기 (30% 미달 차단)
- [x] 카카오 BizTalk + 알리고 SMS 이중 알림
- [x] sitemap, robots.txt, 개인정보처리방침

### 에이전트 시스템
- [x] `agents/README.md` — 시스템 개요
- [x] `agents/prompts/claude.md` — Claude 역할 정의
- [x] `agents/prompts/gpt.md` — GPT Agent 역할 정의
- [x] `agents/prompts/orchestrator.md` — 사용자 운영 가이드
- [x] `agents/protocol/handoff.md` — 에이전트 간 인계 포맷
- [x] `agents/protocol/task_types.md` — 작업 라우팅 테이블
- [x] `agents/protocol/escalation.md` — 막혔을 때 처리 규칙

---

## 블로커 🚨

### Supabase SQL 미실행 (최우선)
- **할 것**: `supabase/setup_all.sql` 내용을 SQL Editor에서 실행
- **URL**: https://supabase.com/dashboard/project/ktctppxsjtezzgzzywbz/sql/new
- **확인**: `node scripts/run-migration.mjs` 실행 시 테이블 목록 출력되면 성공
- **참고**: 42501 에러 원인이었던 `alter table storage.objects` 줄은 이미 제거됨

---

## 다음 개발 우선순위 (MVP 2)

1. **Admin 견적 상세 — 사진 미리보기** (Supabase Storage signed URL)
   - `apps/admin/src/app/quotes/[id]/QuoteDetailClient.tsx` 수정
   - `/api/admin/photos/[path]` route 추가 (service_role signed URL 발급)

2. **파트너(인스톨러) 관리 페이지**
   - `partners` 테이블 이미 스키마에 있음
   - `apps/admin/src/app/partners/` 페이지 생성

3. **프로젝트 설치 일정 관리**
   - `installation_schedules` 테이블 추가 마이그레이션 필요

4. **Toss Payments 구독 결제 연동**
   - 빌링키 발급 → 월간 자동 결제 (CMS 9만원/월)

5. **CMS 디바이스 모니터링** (MVP 3)

---

## 알려진 함정 & 결정 사항

| 항목 | 결정 |
|------|------|
| Supabase client in apps/web | packages/db 거치지 않고 `apps/web/src/lib/supabase.ts`에서 직접 생성 (workspace 타입 해석 문제 우회) |
| service_role key | 절대 클라이언트 노출 금지, API route에서만 `serverClient()` 사용 |
| 마진 최소값 | `MIN_MARGIN_PCT = 30` — 하드코딩, 설정값으로 옮기지 않음 |
| 계약금 | 50% 정책 — 견적 확정 시 자동 계산 |
| 알림 실패 | `Promise.allSettled` — 알림 실패가 견적 저장을 막지 않음 |

---

## 로컬 실행

```bash
pnpm --filter @lcd-pro/web dev    # localhost:3000
pnpm --filter @lcd-pro/admin dev  # localhost:3001
pnpm build                        # 전체 빌드 (CI 동일)
```
