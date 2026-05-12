# 막혔을 때 처리 규칙 (Escalation Protocol)

---

## 트리거 조건

다음 상황이 발생하면 escalation 프로토콜을 실행한다:

| 상황 | 레벨 | 담당 |
|------|------|------|
| Claude가 2회 시도 후 동일 에러 반복 | L1 | Claude 자체 해결 시도 |
| L1 실패 또는 외부 서비스 장애 | L2 | 사용자에게 보고 + 대안 제시 |
| 데이터 손실 가능성, 보안 이슈 | L3 | 즉시 중단 + 사용자 경보 |
| 비즈니스 규칙 충돌 (마진 기준 변경 등) | L3 | 즉시 중단 + 사용자 결정 요청 |

---

## L1: Claude 자체 해결

순서:
1. 에러 메시지 전체 읽기
2. `agents/context/CURRENT.md`의 과거 해결 사례 확인
3. 다른 접근법 1개 시도
4. 실패 시 L2로 올림

---

## L2: 사용자 보고 포맷

```
[ESCALATION L2]
문제: (에러 메시지 또는 증상 1줄)
시도한 것: (2가지 접근법 요약)
현재 가설: (가장 유력한 원인)
대안 A: (권장, 이유)
대안 B: (차선책, 이유)
필요한 것: (사용자가 해줘야 하는 것 — 대시보드 접근, 키 확인 등)
[/ESCALATION L2]
```

---

## L3: 즉시 중단 포맷

```
[ESCALATION L3 — 긴급]
위험: (데이터 손실 / 보안 / 비즈니스 규칙 충돌)
현재 상태: (무엇이 영향받는가)
즉시 조치: (사용자가 지금 해야 할 것)
Claude 대기: (승인 전까지 코드 변경 중단)
[/ESCALATION L3]
```

---

## 알려진 함정 & 해결책

### Supabase RLS 우회 오류
- 증상: `row-level security policy` 오류
- 원인: anon key로 service_role 전용 작업 시도
- 해결: `serverClient()` (service_role) 사용, `.env`에서 키 확인

### Vercel 빌드 경로 문제
- 증상: 빌드 성공인데 404 또는 assets 경로 이상
- 원인: vercel.json에 `outputDirectory` 또는 `framework` 중복 설정
- 해결: vercel.json에서 두 필드 제거, Root Directory = 비워두기

### Turborepo 필드명 오류
- 증상: `pipeline` 관련 오류
- 원인: Turborepo v2는 `tasks` 사용 (구버전은 `pipeline`)
- 해결: `turbo.json`에서 `"pipeline"` → `"tasks"` 변경

### TypeScript `never` 타입 추론
- 증상: Supabase 쿼리 결과가 `never` 타입
- 원인: `types.gen.ts` 테이블에 `Relationships` 필드 누락
- 해결: 모든 테이블에 `Relationships: []` 추가

### GitHub push protection
- 증상: `GH013: Repository rule violations found`
- 원인: 파일에 Supabase service key 포함
- 해결: 키 제거 후 `git checkout --orphan` → 히스토리 재작성

---

## GPT 막혔을 때

GPT가 결과를 못 내거나 잘못된 정보를 주면:
1. Claude가 직접 처리 (공식 문서는 Claude도 읽을 수 있음)
2. 또는 사용자가 GPT에게 "다시 시도, 이번엔 [추가 컨텍스트]" 전달
3. 반복 실패 시 해당 작업을 Claude 직접 처리로 전환
