# 기능 플래그 & 복원 로드맵 (MVP 다운그레이드)

이 웹앱은 **외부 서비스 0으로도 완벽 동작하는 마케팅 + 견적 사이트**로 다운그레이드되어 있다.
고급 기능은 **삭제하지 않고** 기능 플래그(default OFF) 뒤에 잠가 두었다. 플래그만 켜고 env를 채우면 복원된다.

- 플래그 정의: [`src/lib/features.ts`](src/lib/features.ts)
- env 문서: [`.env.example`](.env.example)
- 기본값(아무 env 없음) = MVP 모드. `pnpm --filter web typecheck` + `pnpm --filter web build` 가 env 0으로 통과.

## MVP 모드에서 동작하는 것 (외부 의존 없음)

- 페이지: `/` (랜딩), `/about`, `/services`, `/blog`, `/blog/[slug]`, `/faq`, `/privacy`
- **견적 폼 → 즉석 화면 견적**: `/quote` 제출 시 순수 로컬 견적엔진(`src/lib/standardBlock.ts`의 `estimateProject`)만 실행 → 결과를 화면에 표시. DB·알림 없이 완전 동작 (`quoteId: null`).
- SEO/메타: sitemap, robots, llms.txt, opengraph-image, JSON-LD

## 기능 플래그 표

| 기능 | 무엇을 함 | 켜는 env | 관련 파일 | OFF일 때 동작 |
|---|---|---|---|---|
| **quotePersistence** | 견적 폼 제출분을 Supabase에 저장 (고객 upsert, quote insert, 현장사진 Storage 업로드) | `NEXT_PUBLIC_FEAT_QUOTE_PERSISTENCE=on` + Supabase env | `src/lib/features.ts`, `src/app/api/quotes/route.ts`, `src/lib/supabase.ts` | 견적 계산만 하고 결과 반환, DB 미저장 (`quoteId:null`) |
| **notifications** | 신규 견적 시 카카오 알림톡 / 알리고 SMS / Slack 알림 발송 | `FEAT_NOTIFICATIONS=on` + 알림 env (quotePersistence도 on이어야 의미 있음) | `src/lib/features.ts`, `src/app/api/quotes/route.ts`, `src/lib/notify.ts` | 알림 호출 자체를 건너뜀 (env 없으면 원래도 no-op) |
| **billing** | 구독·정기결제(Toss): 구독 시작/취소 페이지, billing API, 매일 청구 Cron | `NEXT_PUBLIC_FEAT_BILLING=on` + Supabase + Toss env | `src/lib/features.ts`, `src/app/subscribe/**`, `src/app/account/subscription/**`, `src/app/api/billing/**`, `src/app/api/cron/billing/route.ts`, `src/lib/toss.ts` | 구독/계정 페이지는 `/`로 redirect, billing/cron API는 `404` |

## 복원 절차

### 1) 견적 DB 저장 (quotePersistence)
1. Supabase 프로젝트 준비 (스키마는 `@lcd-pro/db` 패키지 기준).
2. `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY` 설정.
3. `NEXT_PUBLIC_FEAT_QUOTE_PERSISTENCE=on`.
4. 재배포 → `/api/quotes`가 고객·견적·사진을 저장하고 `quoteId`를 반환.

> 참고: `src/app/api/quotes/route.ts`는 OFF일 때 `if (!features.quotePersistence) return { quoteId:null, estimate }`로 조기 반환하고, ON일 때만 `serverClient()`를 호출한다. `src/lib/supabase.ts`는 lazy factory라 env 없이 임포트해도 throw하지 않는다.

### 2) 알림 (notifications)
1. quotePersistence 먼저 ON (알림은 저장된 quoteId를 사용).
2. `.env.local`에 알림 env(아래 중 가능한 채널): `ADMIN_SLACK_WEBHOOK`, `ADMIN_PHONE`, `ALIGO_API_KEY`/`ALIGO_USER_ID`/`ALIGO_SENDER_NUMBER`, (선택) `KAKAO_BIZTALK_API_KEY`/`KAKAO_BIZTALK_SENDER_KEY`.
3. `FEAT_NOTIFICATIONS=on`.

### 3) 구독·결제 (billing)
1. Supabase + Toss 준비.
2. `.env.local`에 `NEXT_PUBLIC_TOSS_CLIENT_KEY`, `TOSS_SECRET_KEY`, `TOSS_WEBHOOK_SECRET`, `CRON_SECRET` 및 Supabase env.
3. `NEXT_PUBLIC_FEAT_BILLING=on`.
4. 네비/푸터에 구독 링크를 다시 노출하려면 `src/components/NavBar.tsx` / `Footer.tsx`에 링크 추가 (현재 MVP에서는 노출 안 함).
5. Vercel Cron(`/api/cron/billing`) 스케줄 등록.

## 새 기능 잠그는 법 (확장 여지)

새로 외부 의존이 생기는 기능을 추가할 때:
1. `src/lib/features.ts`에 플래그 한 줄 추가 (default OFF).
2. 외부 호출을 `if (features.새플래그) { ... }` 안에서만 수행.
3. `.env.example`과 본 표에 한 줄씩 추가.

## 참고: 테마 / 이미지 / 외부명칭

- **테마**: 라이트(흰색) 테마. 토큰은 `src/app/globals.css`(CSS 변수 + `.glass`/`.input-base`/`.glow`)에서 관리.
- **이미지**: 전부 `public/curated/` 로컬 스톡 사진. AI 생성 이미지 미사용. 외부 원격 이미지 URL 없음.
- **외부 명칭**: 공개 UI에 제3자(예: TRL) 명칭·로고·제휴 암시 없음. 스펙/수치 등 내용만 일반 표현으로 표기.
