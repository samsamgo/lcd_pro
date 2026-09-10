import { INDUSTRIES, getIndustry, type Industry } from '@/lib/industries'

/**
 * 시공사례 = **사진 한 장이 사례 한 건.**
 *
 * 🔴 2026-09-10 CEO "사진을 다 하나의 카테고리로 넣으면 어떻게 시공사례인데. 시공사례는 각각 다 따로 나와야."
 *    전에는 업종(자리) 15개가 카드였고 사진은 그 안의 갤러리였다. 이제 갤러리의 사진 하나하나가
 *    목록의 카드가 된다. 업종 데이터(`INDUSTRIES`)는 그대로 두고 여기서 평탄화만 한다 —
 *    구축정보·견적 연결·상세 페이지는 여전히 업종이 가진다.
 *
 * 같은 사진이 두 업종 갤러리에 있으면(예: 숲·벚꽃 로비 = 공공기관 + 보건소) 목록엔 한 번만 나온다.
 * 대표(hero, index 0) 인 자리를 우선한다 — 그 업종의 얼굴이 목록에서 사라지지 않게.
 */
export interface CaseItem {
  /** `<업종 slug>.<사진 번호>` — 주소 `?case=` 에 쓴다 */
  id: string
  slug: string
  index: number
  src: string
  alt: string
  title: string
  industry: Industry
}

function build(): CaseItem[] {
  const seen = new Set<string>()
  const out: CaseItem[] = []
  const push = (i: Industry, n: number) => {
    const g = i.gallery[n]
    if (!g || seen.has(g.src)) return
    seen.add(g.src)
    out.push({ id: `${i.slug}.${n}`, slug: i.slug, index: n, src: g.src, alt: g.alt, title: g.title ?? i.nameKo, industry: i })
  }
  // 1차: 각 업종의 대표 사진. 2차: 나머지. 목록 순서는 업종 순서를 따른다.
  for (const i of INDUSTRIES) push(i, 0)
  for (const i of INDUSTRIES) for (let n = 1; n < i.gallery.length; n++) push(i, n)
  return out
}

export const CASES: CaseItem[] = build()

/** `?case=` 값 → 사례. 옛 주소(`?case=<업종 slug>`, `?type=<slug>`)는 그 업종의 대표 사진으로 */
export function getCase(id: string | null | undefined): CaseItem | undefined {
  if (!id) return undefined
  const hit = CASES.find((c) => c.id === id)
  if (hit) return hit
  const ind = getIndustry(id)
  return ind ? CASES.find((c) => c.slug === ind.slug) : undefined
}

export function siblingCases(id: string, list: CaseItem[] = CASES): { prev: CaseItem; next: CaseItem } | null {
  const k = list.findIndex((c) => c.id === id)
  if (k < 0 || list.length < 2) return null
  return { prev: list[(k - 1 + list.length) % list.length], next: list[(k + 1) % list.length] }
}
