/**
 * 보유 서류 정본 — **사이트에서 이 배열 하나만 본다.**
 *
 * 🔴 2026-09-09 신설. 그 전에는 인증 데이터가 `components/public/CompanySummary.tsx` 안에
 *    `HELD_CREDENTIALS` 로 박혀 있었고, 스캔 이미지·PDF 는 `public/` 에만 있고 화면에 나오지
 *    않았다. CEO 지시 "KC 인증서 PDF 있으니 다른 회사처럼 보여줘라" 에 맞춰
 *    **서류 = 스캔 이미지 + PDF + 번호**를 한 곳에 모은다.
 *
 * ── 값의 출처 (2026-09-09 실제 스캔본을 열어 판독) ──────────────────
 *  모든 title·issuer·issued·no 는 `public/images/certs/{key}.jpg` 원본에 인쇄된 글자 그대로다.
 *  🔴 추정해서 채우지 마라. 서류에 없는 칸은 비운다.
 *
 *  🔴 2026-09-09 CEO 가 원본 PDF 9종을 새로 전달 — 스캔 이미지를 전부 그것으로 교체했다.
 *     새로 들어온 것: 사업자등록증 · 직접생산확인증명서(안내전광판, 공공조달용).
 *     KC 적합등록증은 이 묶음에 없어 기존 스캔을 그대로 둔다(실물 보유·홈 신뢰카드에서 참조).
 *     ⚠️ 전달 파일명이 '기업부설연구소.pdf' 지만 문서 제목은 **연구개발전담부서 인정서**다(원본 확인).
 *
 *  ⚠️ 판독으로 바로잡은 것 2건 —
 *   ① `rnd-lab` 은 '기업부설연구소' 가 아니라 **연구개발전담부서 인정서**다.
 *      (인정서 제목·본문 모두 '연구개발전담부서'. 두 제도는 별개이고 요건이 다르다.
 *       관공서 제출 서류에 '기업부설연구소' 로 적으면 허위 기재가 된다.)
 *   ② KC 적합등록 번호는 **R-R-WKTC-LH-200-5P** 다. 구 `HELD_CREDENTIALS` 에 있던
 *      'TA-2607130' · 'TA-2607131' 은 등록증 어디에도 없는 번호였다(접수번호로 추정).
 *      두 번째 모델 LPH300S5U8F 의 등록증은 우리에게 스캔본이 없다 —
 *      **서류가 들어오면 아래에 한 줄 추가한다. 번호를 지어내지 마라.**
 *
 * ── 서류 한 건 추가하는 법 ──────────────────────────────────────
 *  1. 스캔 원본 `public/images/certs/{key}.jpg` (150dpi 급)
 *  2. 썸네일    `public/images/certs/{key}-thumb.jpg` (가로 600px)
 *  (PDF 는 올리지 않는다 — CEO 2026-09-09 "민감한 정보 올리지 마라". 스캔 이미지만 게시)
 *  4. 아래 CREDENTIALS 에 한 줄. `lib/resources.ts` 자료실 등록도 같이 한다.
 */

export type CredentialKey =
  | 'kc-smps'
  | 'ict-license'
  | 'factory'
  | 'rnd-lab'
  | 'kica-member'
  | 'sw-biz'
  | 'sme'
  | 'startup'
  | 'biz-reg'
  | 'direct-production'

export interface Credential {
  key: CredentialKey
  /** 서류에 인쇄된 이름 그대로 */
  title: string
  /** 이 서류가 무엇을 증명하는가 — 한 줄. 담당자가 읽는 말로 */
  subject: string
  /** 발급기관 */
  issuer: string
  /** 발급·등록 연월일 YYYY-MM-DD */
  issued: string
  /** 등록번호·발급번호. 서류에 없으면 생략 */
  no?: string
  /** 유효기간. 만료 개념이 없는 서류는 생략 */
  valid?: string
}

/** 스캔 원본(라이트박스용) */
export const certImage = (k: CredentialKey) => `/images/certs/${k}.jpg`
/** 썸네일(격자용) */
export const certThumb = (k: CredentialKey) => `/images/certs/${k}-thumb.jpg`
/** 내려받기 PDF */

/**
 * 순서 = 화면에 보이는 순서. 관공서 담당자가 먼저 확인하는 것부터 둔다
 * (제품 안전 → 시공 자격 → 제조 실체 → 기술 조직 → 기업 지위).
 */
export const CREDENTIALS: Credential[] = [
  {
    key: 'kc-smps',
    title: '방송통신기자재등의 적합등록증',
    subject: '전광판 전원장치(SMPS) KC 적합등록',
    issuer: '국립전파연구원',
    issued: '2026-08-10',
    // 🔴 등록번호(R-R-WKTC-…)는 CEO 2026-09-09 지시로 사이트 어디에도 노출하지 않는다. 데이터에도 두지 않는다.
    valid: '만료일 없음 · 사양 변경 시 재등록',
  },
  {
    key: 'ict-license',
    title: '정보통신공사업 등록증',
    subject: '전광판 설치 공사를 직접 시공할 수 있는 등록업체입니다',
    issuer: '대전광역시',
    issued: '2026-08-25',
    no: '제420573호',
  },
  {
    key: 'factory',
    title: '공장등록증명서',
    subject: '대전 대덕구 자체 공장 — 전시 및 광고용 조명장치 제조업 (제조시설 81.27㎡)',
    issuer: '대전산업단지관리공단',
    issued: '2026-08-19',
    no: '공장관리번호 302302026296649',
  },
  {
    key: 'rnd-lab',
    title: '연구개발전담부서 인정서',
    subject: '자체 연구개발 조직을 두고 있습니다',
    issuer: '한국산업기술진흥협회',
    issued: '2026-08-21',
    no: '제2026155618호',
  },
  {
    key: 'kica-member',
    title: '한국정보통신공사협회 회원증',
    subject: '정보통신공사업 협회 정회원 (등록번호 420573)',
    issuer: '한국정보통신공사협회',
    issued: '2026-08-28',
    no: '제 충142호',
  },
  {
    key: 'sw-biz',
    title: '소프트웨어사업자 일반 현황 관리확인서',
    subject: '전광판 운영 소프트웨어 — 공공 소프트웨어사업 입찰 참가 가능',
    issuer: '한국인공지능소프트웨어산업협회',
    issued: '2026-08-21',
    no: 'B26-338844-004',
  },
  {
    key: 'sme',
    title: '중소기업 확인서 [소기업(소상공인)]',
    subject: '공공기관 입찰용 — 소기업 확인',
    issuer: '중소벤처기업부',
    issued: '2026-07-17',
    no: '0010-2026-642236',
    valid: '2026-07-15 ~ 2027-03-31',
  },
  {
    key: 'startup',
    title: '창업기업 확인서',
    subject: '창업기업 지원 대상 확인 (창업 기준 충족일 2026-06-01)',
    issuer: '대전·세종지방중소벤처기업청',
    issued: '2026-08-06',
    no: '제202608-28423-0093794호',
    valid: '2026-08-06 ~ 2029-08-06',
  },
  {
    key: 'direct-production',
    title: '직접생산확인증명서',
    subject: '안내전광판을 직접 생산합니다 — 공공조달 직접생산 확인',
    issuer: '한국중소벤처기업유통원',
    issued: '2026-09-07',
    no: '제2026-0619-01338호',
  },
  {
    key: 'biz-reg',
    title: '사업자등록증',
    subject: '주식회사 우강테크 사업자등록',
    issuer: '국세청',
    issued: '2026',
  },
]

export const credentialByKey = (k: CredentialKey) =>
  CREDENTIALS.find((c) => c.key === k)

/* ────────────────────────────────────────────────────────────
   연혁

   🔴 **여기 있는 날짜는 전부 위 서류에 인쇄된 날짜다.** 그 이전 이력은 없다 —
      없는 것을 만들지 마라(첫 수주 전, [[company-vs-reference]]).
      새 서류가 들어오면 CREDENTIALS 와 여기 두 곳에 같이 넣는다.
   ──────────────────────────────────────────────────────────── */

export interface HistoryEntry {
  /** 'YYYY.MM.DD' 또는 'YYYY.MM' — 서류에 적힌 정밀도까지만 */
  date: string
  title: string
  /** 발급기관·번호 등 근거 한 줄 */
  detail?: string
  /** 근거 서류가 있으면 그 key — 인증 페이지로 연결된다 */
  ref?: CredentialKey
}

export const HISTORY: HistoryEntry[] = [
  {
    date: '2026.06.01',
    title: '주식회사 우강테크 설립',
    detail: '대전광역시 대덕구 · 창업기업 기준 충족일',
    ref: 'startup',
  },
  {
    date: '2026.07.17',
    title: '중소기업(소기업) 확인',
    detail: '중소벤처기업부',
    ref: 'sme',
  },
  {
    date: '2026.08.06',
    title: '창업기업 확인',
    detail: '대전·세종지방중소벤처기업청',
    ref: 'startup',
  },
  {
    date: '2026.08.19',
    title: '공장 등록',
    detail: '대전산업단지관리공단 · 전시 및 광고용 조명장치 제조업',
    ref: 'factory',
  },
  {
    date: '2026.08.21',
    title: '연구개발전담부서 인정',
    detail: '한국산업기술진흥협회',
    ref: 'rnd-lab',
  },
  {
    date: '2026.08.21',
    title: '소프트웨어사업자 신고 확인',
    detail: '한국인공지능소프트웨어산업협회',
    ref: 'sw-biz',
  },
  {
    date: '2026.08.25',
    title: '정보통신공사업 등록',
    detail: '대전광역시 · 제420573호',
    ref: 'ict-license',
  },
  {
    date: '2026.08.28',
    title: '한국정보통신공사협회 회원 등록',
    detail: '한국정보통신공사협회',
    ref: 'kica-member',
  },
]

/* ────────────────────────────────────────────────────────────
   구 API 호환 — `components/public/CompanySummary.tsx` 전용.

   ⚠️ CompanySummary 는 현재 화면에 배선돼 있지 않다(참조 0건).
      새 코드는 위 CREDENTIALS 를 쓴다. 이 상수를 늘리지 마라.
   ──────────────────────────────────────────────────────────── */
export const RRA_SEARCH = 'https://www.rra.go.kr/ko/license/S_c_search.do'

export const HELD_CREDENTIALS = CREDENTIALS.map((c) => ({
  title: c.title,
  detail: c.subject,
  no: c.no ?? '',
  issuer: c.issuer,
  valid: c.valid ?? `${c.issued} 발급`,
  verify:
    c.key === 'kc-smps'
      ? { label: '적합성평가 현황에서 조회', href: RRA_SEARCH }
      : undefined,
}))
