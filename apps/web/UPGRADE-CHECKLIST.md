# 우강테크(wooktech.co.kr) 홈페이지 업그레이드 — 마스터 체크리스트

> 표기: `[x]` 통과 · `[~]` 부분(사용자 데이터 필요) · `[ ]` 사용자 액션 필요
> GPT(codex) 콜드리뷰 + Claude(Opus) 병행 수행. 최종 GPT 재심사 점수는 하단.

## A. 이상한 것 / 미완성 제거
- [x] A1. '원격 콘텐츠 관리(준비중)' 배지·문구 전면 제거 → 실제 제공 범위로 재서술
- [x] A2. 제품 카드 '원격 관리: 준비중' 필드 제거 (→ 설치 환경)
- [x] A3. CMS '준비중' 서비스 → '콘텐츠 세팅·운영 지원'(실제 제공)으로 교체
- [x] A4. 가짜 시공사례(실명) → 정직한 '업종별 활용 예시'로 재구성
- [x] A5. 미사용/어긋난 이미지 14장 삭제 (14MB→7.3MB)

## B. 이미지 정상화
- [x] B1. 어긋난 stock(치킨·경찰서·공항판·GM박물관·납땜·오실로스코프) 식별
- [x] B2~B4. 서비스=아이콘 카드로 전환(사진 과다 해소), 제품·활용예시=소상공인 LED 맥락 이미지로 재배정
- [x] B5. Hero/페이지 히어로 일관성 확인
- [x] B6. alt·비율·용량 점검
- [~] (선택) 실제 제품 실물/시공 사진 — 사용자 제공 시 교체 권장

## C. 멀티페이지 구조
- [x] C1. NavBar → 실제 라우트(/services /products /packages /about /faq /blog)
- [x] C2~C6. /services /products /packages /faq 독립 페이지 신설(리다이렉트 제거), /about 유지
- [x] C7. 홈은 요약 랜딩 + 각 페이지 유도
- [x] C8. sitemap·breadcrumb·내부링크 일관성

## D. 디자인 업그레이드
- [x] D1. 헤더 겹침 — 실제 버그 아님(스크롤 캡처 artifact) 확인
- [x] D2~D4. 타이포·여백·아이콘 카드·PageHero·hover 정제
- [x] D5. 반응형(Tailwind sm/lg 그리드 + 모바일 햄버거) — 코드 확인
- [x] D6. 신뢰요소 강화(가격 포함/불포함, AS 보증기간, 프로세스 시간)
- [x] D7. 경쟁사 벤치마크(codex) 반영

## E. 실제 동작
- [x] E1. 견적 폼 4단계 end-to-end 동작 검증(입력→검증→사진3장→제출→결과화면)
- [x] E2. 리드 전달을 DB와 분리(notifyLeadWebhook) — 웹훅 1개로 Supabase 없이 사장이 리드 수신
      → **게시 시 Vercel에 ADMIN_LEAD_WEBHOOK 설정 필요** (DEPLOY.md 참고)
- [x] E3. NavBar·Footer·CTA 링크 목적지 정상(죽은 링크 0)
- [x] E4~E5. 폼 에러처리·성공화면 정상

## F. SEO / 도메인
- [x] F1. wktech.co.kr → wooktech.co.kr 전체 교체
- [x] F2. 이메일 contact@wooktech.co.kr 일관성 + 푸터 노출
- [x] F3. sitemap.xml / robots.txt / OG 이미지 정상(wooktech.co.kr)
- [x] F4. JSON-LD(Organization/LocalBusiness/Service/FAQ/Breadcrumb) 유효
- [x] F5. 페이지별 title/description 고유

## G. 품질 게이트
- [x] G1. `next build` 무오류(20페이지 정적 생성)
- [x] G2. `tsc --noEmit` 통과
- [~] G3. ESLint 미구성 → build+typecheck로 대체
- [x] G4. 주요 페이지 콘솔 에러 없음
- [~] G5. Lighthouse — 배포 후 실측 권장

## H. 배포 (사용자 액션 필요 — DEPLOY.md)
- [x] H1. Vercel 빌드설정·GitHub Actions 파이프라인 확인
- [x] H2. 프로덕션 env 문서화(.env.example, DEPLOY.md)
- [ ] H3. `main` 머지 push → 자동 배포 (프로덕션 게시: 사용자 확인 후)
- [ ] H4. wooktech.co.kr 도메인 연결 + DNS (Vercel 대시보드 + 레지스트라 — 사용자)
- [ ] H5. 라이브 최종 확인

## I. 최종 검수
- [x] I1. GPT(codex) 콜드리뷰 1차 반영 (FAQ확대·가격포함/불포함·안심문구·이메일·용어정리·AS보증)
- [x] I2. Claude 전 페이지 스크린샷 전수 확인
- [~] I3. 게시 전 잔여(사용자 데이터): 실제 사업자등록정보·카카오채널·실제 시공사진
- [x] I4. 이상/미완성 잔재 0
- [ ] I5. 라이브 배포 후 최종 리포트

---
### 게시 전 사용자 3가지 (위조 불가 항목)
1. **사업자등록정보**(상호·대표·사업자번호·주소·통신판매신고) → 푸터 신뢰박스
2. **ADMIN_LEAD_WEBHOOK**(Slack/Discord URL) → 견적 리드 수신 (Vercel env)
3. **wooktech.co.kr DNS 연결**(Vercel Domains + 레지스트라)
(선택) 카카오톡 채널·실제 시공 사진
