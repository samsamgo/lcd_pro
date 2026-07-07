# 우강테크 홈페이지 배포 가이드 (wooktech.co.kr)

현재 코드는 **`main` 브랜치 push → GitHub Actions → Vercel 프로덕션 자동 배포** 파이프라인이다
(`.github/workflows/deploy.yml`, secrets: `VERCEL_TOKEN`/`VERCEL_ORG_ID`/`VERCEL_PROJECT_ID`).

작업물은 `feat/web-downgrade-mvp` 브랜치에 커밋되어 있다.

---

## 1) 코드 게시 (자동 배포 트리거)

```bash
cd D:/전광판/pro/lcd_pro
git checkout main
git merge feat/web-downgrade-mvp
git push origin main          # → Actions가 자동으로 Vercel 프로덕션 배포
```

push 후 GitHub → Actions 탭에서 "Deploy to Vercel" 성공 확인.
성공하면 Vercel 프로젝트의 기본 URL(예: `lcd-pro-web.vercel.app`)에서 즉시 라이브.

> ⚠️ 프로덕션 배포는 되돌리기 부담이 있는 외부 게시 작업이라, `main` 머지/push는 사용자가
> 확인 후 실행하는 것을 권장한다. (Claude가 대신 push하길 원하면 지시만 주면 됨.)

## 2) 커스텀 도메인 연결 (Vercel 대시보드 — 사용자만 가능)

1. Vercel → 프로젝트 → **Settings → Domains → Add** → `wooktech.co.kr` 와 `www.wooktech.co.kr` 추가
2. Vercel이 안내하는 DNS 레코드를 **도메인 레지스트라(브레이브에 로그인된 곳)** 에 등록:
   - `wooktech.co.kr` → **A** 레코드 `76.76.21.21` (또는 Vercel이 지정하는 값)
   - `www.wooktech.co.kr` → **CNAME** `cname.vercel-dns.com`
3. DNS 전파(수 분~수 시간) 후 Vercel에서 자동으로 SSL 발급. `https://wooktech.co.kr` 접속 확인.

> 코드의 기본 도메인은 이미 `https://wooktech.co.kr` (site.ts). 별도 env 없이도 sitemap/OG/JSON-LD가 이 도메인을 사용.

## 3) 환경변수 (Vercel → Settings → Environment Variables, Production)

| 변수 | 값 | 용도 | 필수 |
|---|---|---|---|
| `ADMIN_LEAD_WEBHOOK` | Slack 또는 Discord Incoming Webhook URL | **견적 리드를 사장에게 즉시 전달** (Supabase 불필요) | ★강력권장 |
| `NEXT_PUBLIC_SITE_URL` | `https://wooktech.co.kr` | 도메인 override (기본값과 동일하면 생략 가능) | 선택 |

### ADMIN_LEAD_WEBHOOK 만드는 법 (2분, 무료)
- **Discord**: 아무 서버 → 채널 설정 → 연동(Integrations) → 웹후크 → 새 웹후크 → URL 복사
- **Slack**: api.slack.com/apps → Incoming Webhooks 활성화 → Add New Webhook → URL 복사

이 URL을 Vercel env에 넣으면, `/quote` 제출 시 업체명·연락처·지역·예상견적이 해당 채널로 전송된다.
**미설정 시**: 방문자에겐 정상적으로 견적/접수 화면이 뜨지만 리드 알림은 전송되지 않음 → 반드시 설정 권장.

## 4) (선택) 견적 DB 보관 + 사진 저장 활성화
Supabase 프로젝트를 다시 활성화(무료플랜은 미사용 시 일시정지됨)하고 스키마를 배포한 뒤:
- `NEXT_PUBLIC_FEAT_QUOTE_PERSISTENCE=on` 설정 → 견적/고객/사진이 DB에 저장되고 admin 앱에서 조회 가능.
- 스키마 미배포 상태로 켜면 제출이 실패하므로, 스키마 확인 후에만 켤 것. (웹훅 방식은 이것 없이도 동작)

---

## 배포 후 최종 점검 체크
- [ ] `https://wooktech.co.kr` 접속 + SSL 정상
- [ ] 홈/서비스/제품/패키지/FAQ/회사소개/블로그/견적 8개 페이지 이동 정상
- [ ] `/quote` 제출 → 웹훅 채널에 리드 도착 확인
- [ ] 모바일에서 레이아웃·햄버거 메뉴 정상
- [ ] `wooktech.co.kr/sitemap.xml`, `/robots.txt` 정상
- [ ] Google Search Console + 네이버 서치어드바이저에 도메인 등록(선택, SEO)
