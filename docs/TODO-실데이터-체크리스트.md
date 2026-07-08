# 우강테크 홈페이지 — 나중에 추가할 실데이터 체크리스트

홈페이지 코드/UX/SEO 구조는 완성되어 배포됨(wooktech.co.kr). 아래 값들은 **실제 정보라 날조하지 않고 비워둔** 항목이며,
값을 넣는 순간 화면에 자동으로 노출되도록 이미 연결해 두었다. 확보되는 대로 하나씩 채우면 된다.

---

## 1. Vercel 환경변수 (Settings → Environment Variables → Production)

넣으면 자동 반영되는 위치까지 표기. `lib/seo/site.ts`에서 읽음.

| 환경변수 | 예시 값 | 채우면 나타나는 곳 | 우선순위 |
|---|---|---|---|
| `ADMIN_LEAD_WEBHOOK` | Slack/Discord Incoming Webhook URL | **견적·빠른상담 리드가 사장님께 알림 전송** (없으면 폼은 되지만 알림 X) | ★★★ 최우선 |
| `NEXT_PUBLIC_PHONE` | `02-000-0000` / `010-0000-0000` | 헤더·푸터·견적성공·전화 CTA·JSON-LD | ★★★ |
| `NEXT_PUBLIC_KAKAO_CHANNEL` | `http://pf.kakao.com/_xxxxx` | 푸터·견적성공 카톡 상담 버튼·sameAs | ★★★ |
| `NEXT_PUBLIC_NAVER_TALK` | 네이버 톡톡 URL | 푸터 네이버 톡톡 링크·sameAs | ★★ |
| `NEXT_PUBLIC_NAVER_PLACE` | 네이버 플레이스 URL | 푸터 네이버 플레이스 링크·sameAs | ★★ |
| `NEXT_PUBLIC_ADDRESS` | `서울시 ○○구 ○○로 00` | 푸터 사업자 정보·LocalBusiness JSON-LD | ★★ |
| `NEXT_PUBLIC_CEO` | 대표자명 | 푸터 사업자 정보 | ★★ |
| `NEXT_PUBLIC_BIZ_REG_NO` | 사업자등록번호 | 푸터 사업자 정보 | ★★ |
| `NEXT_PUBLIC_HOURS` | `평일 09:00~18:00` | 푸터·개인정보 문의처·LocalBusiness | ★ |
| `NEXT_PUBLIC_NAVER_SITE_VERIFICATION` | 네이버 서치어드바이저 토큰 | `<meta>` 사이트 소유확인 | ★★ |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console 토큰 | `<meta>` 사이트 소유확인 | ★★ |
| `NEXT_PUBLIC_INSTAGRAM` | 인스타 URL | sameAs (선택) | ★ |
| `NEXT_PUBLIC_YOUTUBE` | 유튜브 URL | sameAs (선택) | ★ |

> `ADMIN_LEAD_WEBHOOK` 만드는 법(2분·무료): **Discord** 채널 설정 → 연동 → 웹후크 → URL 복사 / **Slack** api.slack.com/apps → Incoming Webhooks → URL 복사.

---

## 2. 콘텐츠 자산 (확보 후 코드 반영 필요 — 확보되면 요청만 주면 반영)

- [ ] **실제 시공 사진** (업종별 6장 내외) — 현재 예시 이미지를 실제 현장 사진으로 교체, "예시입니다" 문구 제거
- [ ] **고객 후기 / 별점** — SocialProof에 후기 카드 + Review·AggregateRating JSON-LD 추가
- [ ] **before/after 사진** — 라이트박스에 전/후 비교
- [ ] **인증서/보증서 이미지** (KC 등) — 신뢰 섹션에 실제 증빙 노출
- [ ] **시공 영상** (선택) — 사례 영상 모달

## 3. 외부 채널·SEO 등록 (별도 운영 작업)

- [ ] 네이버 서치어드바이저 사이트 등록 → 위 검증 토큰 발급
- [ ] Google Search Console 등록 → 검증 토큰 발급
- [ ] 네이버 플레이스(지도) 업체 등록
- [ ] 카카오채널 / 네이버 톡톡 개설

## 4. 남은 개선 아이디어 (P2, 나중에)

- [ ] 지역별 랜딩(`/locations/seoul` 등)
- [ ] FAQ 검색·카테고리 탭
- [ ] 전기요금/ROI 계산기
- [ ] 견적 결과 PDF 저장·공유

---

*참고: 상세 근거·패턴 분석은 `docs/homepage-benchmark-report.md`.*
