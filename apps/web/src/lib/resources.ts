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
 * 지금은 비어 있다. **비어 있는 채로 두는 것이 맞다.**
 * 없는 파일을 목록에만 올려두면 담당자가 눌렀을 때 404 를 받는다.
 * 그 한 번이 견적 요청을 날린다. 파일이 실제로 들어온 뒤에 줄을 추가한다.
 */
export const RESOURCES: Resource[] = []

export function resourcesByCategory(c: ResourceCategory): Resource[] {
  return RESOURCES.filter((r) => r.category === c)
}
