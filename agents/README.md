# LCD PRO — AI Agent 운영 시스템

## 구조
```
agents/
├── README.md          ← 이 파일 (전체 개요)
├── prompts/
│   ├── claude.md      ← Claude 시스템 프롬프트
│   ├── gpt.md         ← GPT Agent 시스템 프롬프트
│   └── orchestrator.md← 사용자(오케스트레이터) 운영 가이드
├── protocol/
│   ├── handoff.md     ← 에이전트 간 인계 포맷
│   ├── task_types.md  ← 어떤 작업을 누구에게
│   └── escalation.md  ← 막혔을 때 처리 규칙
└── context/
    └── CURRENT.md     ← 현재 프로젝트 상태 (매 세션 업데이트)
```

## 핵심 원칙
1. **Claude = 두뇌** — 설계·로직·디버깅. 판단이 필요한 모든 것.
2. **GPT = 손발** — 검색·크롤링·외부 API 호출·반복 작업.
3. **사용자 = 방향** — 아이디어 제공, 최종 승인, 실행 트리거.
4. **프로토콜 = 계약** — 태그 형식을 지키면 모델이 바뀌어도 연속성 유지.

---

## Claude의 개선 제안

현재 시스템이 작동하는 것을 확인했다. 다음 단계에서 고려할 것들:

### 즉시 적용 가능한 것

**1. CURRENT.md를 git commit hook에 연결**
세션 종료 시 Claude가 업데이트를 잊을 수 있다. `pre-push` hook에서
CURRENT.md가 오늘 날짜로 업데이트됐는지 체크하면 강제된다.

**2. [GPT_TASK] 태그에 ID 추가**
```
[GPT_TASK id=T001]
...
[/GPT_TASK]
```
여러 태스크가 동시에 돌 때 `[CLAUDE_RESULT id=T001]`로 매칭하면
어떤 작업의 결과인지 추적 가능.

**3. task_types.md를 코드로 강제**
현재는 문서만 있고 Claude가 판단으로 따른다.
`agents/protocol/task_types.ts` 같은 파일로 타입 정의하면
미래에 자동화 파이프라인 연결 시 사용 가능.

### 중기 개선 (MVP 2 이후)

**4. CURRENT.md를 Notion에 미러링**
Claude가 커밋 시 Notion API로 동기화하면 모바일에서도 상태 확인 가능.
GPT에게 `[GPT_TASK]`로 Notion API 스펙 확인 후 Claude가 구현.

**5. GPT 작업 결과 아카이브**
`agents/context/gpt_results/YYYY-MM-DD.md`에 모든 [CLAUDE_RESULT] 저장.
같은 조사를 두 번 시키는 것을 방지.

**6. 에러 패턴 누적**
escalation.md의 "알려진 함정" 섹션을 실제 발생한 에러로 계속 업데이트.
지금은 이번 세션에서 겪은 것만 있는데, 쌓일수록 디버깅 속도가 빨라진다.

### 구조적 한계 (인식하고 있어야 함)

- **컨텍스트 단절**: Sonnet은 대화가 길어지면 앞 내용을 잃는다.
  CURRENT.md를 자주 업데이트하는 것이 유일한 방어책.
- **GPT 결과 검증 없음**: GPT가 잘못된 문서를 요약해도 Claude가 그대로 믿을 수 있다.
  중요한 외부 스펙은 Claude가 직접 공식 URL 확인하는 것을 권장.
- **비용 추적 없음**: 어떤 작업이 얼마의 토큰을 썼는지 기록이 없다.
  Opus가 없을 때 Sonnet 작업 분할 기준을 경험으로 쌓아야 한다.
