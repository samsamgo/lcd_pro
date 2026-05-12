# 에이전트 간 인계 프로토콜

---

## 기본 태그 형식

### Claude → GPT 작업 위임

```
[GPT_TASK]
작업: (동사 + 목적어로 구체적으로)
필요 결과물: (표 / JSON / 요약문 / URL 목록 등 형식 명시)
컨텍스트: (필요한 배경 정보)
마감: (급하면 "즉시", 보통은 생략)
[/GPT_TASK]
```

### GPT → Claude 결과 보고

```
[CLAUDE_RESULT]
작업: (수행한 작업 제목)
결과: (핵심 내용)
근거: (출처 URL 또는 데이터 소스)
다음 제안: (Claude가 이 결과로 해야 할 것, 있으면)
[/CLAUDE_RESULT]
```

---

## 인계 예시

### 시장조사 → 코드 반영

**Claude 발행:**
```
[GPT_TASK]
작업: Toss Payments 구독 결제 API 스펙 확인
필요 결과물: 엔드포인트, 필수 파라미터, 웹훅 이벤트 목록을 표로
컨텍스트: LCD PRO에 월간 CMS 구독 결제(9만원/월) 연동 예정
[/GPT_TASK]
```

**GPT 보고:**
```
[CLAUDE_RESULT]
작업: Toss Payments 구독 결제 API 스펙
결과:
| 항목 | 값 |
|------|---|
| 빌링키 발급 | POST /v1/billing/authorizations/card |
| 결제 실행 | POST /v1/billing/{billingKey} |
| 웹훅 이벤트 | PAYMENT_STATUS_CHANGED, BILLING_PAYMENT_FAILED |
근거: https://docs.tosspayments.com/reference/using-api/billing
다음 제안: billing-key 발급 → 최초 결제 → 스케줄러 자동결제 흐름으로 구현 권장
[/CLAUDE_RESULT]
```

---

## 인계 규칙

1. **태그 없이 작업 요청 금지** — 태그가 있어야 에이전트가 역할을 인식한다
2. **컨텍스트는 최소화** — 상대가 모르는 것만 전달, 프로젝트 전체 설명 불필요
3. **결과물 형식 명시** — "정리해줘"가 아니라 "표로" / "JSON으로" / "3줄 요약으로"
4. **순차 처리** — GPT_TASK 발행 후 결과 오기 전에 다른 GPT_TASK 발행 금지

---

## 세션 인계 (Claude → 다음 Claude)

세션 종료 전 `agents/context/CURRENT.md`에 다음을 기록한다:

```markdown
## 마지막 상태 (YYYY-MM-DD HH:MM)
- 완료: [완료된 작업]
- 진행 중: [중단된 작업, 어디까지 했는지]
- 다음 할 것: [우선순위 순]
- 주의: [다음 Claude가 알아야 할 함정/결정 사항]
```
