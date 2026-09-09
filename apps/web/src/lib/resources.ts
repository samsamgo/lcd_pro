/**
 * 자료실 — 고객이 내려받는 PDF 목록.
 *
 * 🔴 2026-09-08 CEO 지시로 만든 **틀**이다. "PDF는 내가 줄게, 앞으로 많이 추가해 갈 거니까
 *    그 틀만 만들어도 된다."
 *
 * ── 파일 추가하는 법 (CEO/담당자용) ─────────────────────────────
 *  1. PDF 를 `apps/web/public/docs/` 안에 넣는다. 파일명은 영문·숫자·하이픈만 쓴다
 *     (한글 파일명은 브라우저마다 내려받기 이름이 깨진다).
 *  2. 아래 RESOURCES 배열에 한 줄 추가한다. file 은 `/docs/파일명.pdf`.
 *  3. 끝이다. 목록·필터·개수는 이 배열에서 자동으로 나온다.
 *
 * ⚠️ 여기에 올리는 순간 **누구나 내려받을 수 있는 공개 파일**이 된다.
 *    단가·원가·공급사명·고객 연락처가 든 문서를 올리지 않는다.
 *    우리가 시공하지 않은 현장의 도면·사진이 든 문서도 올리지 않는다.
 */

export type ResourceCategory = 'spec' | 'case' | 'cert' | 'guide'

export const RESOURCE_CATEGORIES: { key: ResourceCategory; label: string }[] = [
  { key: 'spec', label: '제품 규격서' },
  { key: 'case', label: '시공사례집' },
  { key: 'cert', label: '인증·서류' },
  { key: 'guide', label: '운영 안내서' },
]

export interface Resource {
  /** 목록 key. 파일명과 같게 두면 관리가 쉽다 */
  id: string
  title: string
  category: ResourceCategory
  /** public 기준 경로. 예: '/docs/wk-spec-indoor.pdf' */
  file: string
  /** 표시용 파일 크기. 예: '2.4MB' */
  size: string
  /** YYYY-MM-DD */
  updated: string
  /** 한 줄 설명 (없으면 생략) */
  desc?: string
}

/**
 * 🔴 없는 파일을 목록에만 올려두지 마라. 담당자가 눌렀을 때 404 를 받는다.
 *    그 한 번이 견적 요청을 날린다. **파일이 실제로 들어온 뒤에** 줄을 추가한다.
 *
 * 2026-09-09 — 인증·서류 8건을 등록했다. 파일은 `public/docs/wk-cert-*.pdf` 에 실재하고
 * 크기는 실측값이다. 서류의 정본(제목·발급기관·번호)은 `lib/credentials.ts` 이고,
 * 여기 title 은 그 이름을 자료실 표기로 옮긴 것이다 — 한쪽만 고치지 마라.
 */
export const RESOURCES: Resource[] = [
  {
    id: 'wk-cert-kc-smps',
    title: '방송통신기자재등의 적합등록증 (SMPS)',
    category: 'cert',
    file: '/docs/wk-cert-kc-smps.pdf',
    size: '416KB',
    updated: '2026-08-10',
    desc: '국립전파연구원 · R-R-WKTC-LH-200-5P',
  },
  {
    id: 'wk-cert-ict-license',
    title: '정보통신공사업 등록증',
    category: 'cert',
    file: '/docs/wk-cert-ict-license.pdf',
    size: '197KB',
    updated: '2026-08-25',
    desc: '대전광역시 · 제420573호',
  },
  {
    id: 'wk-cert-factory',
    title: '공장등록증명서',
    category: 'cert',
    file: '/docs/wk-cert-factory.pdf',
    size: '129KB',
    updated: '2026-08-19',
    desc: '대전산업단지관리공단 · 전시 및 광고용 조명장치 제조업',
  },
  {
    id: 'wk-cert-rnd-lab',
    title: '연구개발전담부서 인정서',
    category: 'cert',
    file: '/docs/wk-cert-rnd-lab.pdf',
    size: '293KB',
    updated: '2026-08-21',
    desc: '한국산업기술진흥협회 · 제2026155618호',
  },
  {
    id: 'wk-cert-kica-member',
    title: '한국정보통신공사협회 회원증',
    category: 'cert',
    file: '/docs/wk-cert-kica-member.pdf',
    size: '236KB',
    updated: '2026-08-28',
    desc: '등록번호 420573',
  },
  {
    id: 'wk-cert-sw-biz',
    title: '소프트웨어사업자 일반 현황 관리확인서',
    category: 'cert',
    file: '/docs/wk-cert-sw-biz.pdf',
    size: '361KB',
    updated: '2026-08-21',
    desc: '한국인공지능소프트웨어산업협회 · B26-338844-004',
  },
  {
    id: 'wk-cert-sme',
    title: '중소기업 확인서 [소기업(소상공인)]',
    category: 'cert',
    file: '/docs/wk-cert-sme.pdf',
    size: '197KB',
    updated: '2026-07-17',
    desc: '중소벤처기업부 · 유효기간 2027-03-31',
  },
  {
    id: 'wk-cert-startup',
    title: '창업기업 확인서',
    category: 'cert',
    file: '/docs/wk-cert-startup.pdf',
    size: '116KB',
    updated: '2026-08-06',
    desc: '대전·세종지방중소벤처기업청 · 유효기간 2029-08-06',
  },
]

export function resourcesByCategory(c: ResourceCategory): Resource[] {
  return RESOURCES.filter((r) => r.category === c)
}
