'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

import { EASE, useReducedMotion } from '@/components/motion'
import { IndustryModal } from '@/components/public/IndustryModal'
import { CASES, getCase, siblingCases } from '@/lib/cases'
import { INDUSTRY_GROUPS, type IndustryGroup } from '@/lib/industries'

/**
 * 시공사례 목록 — **사진 한 장 = 카드 한 장.**
 *
 * 🔴 2026-09-10 CEO "사진을 다 하나의 카테고리로 넣으면 어떻게 시공사례인데. 각각 다 따로 나와야."
 *    전(09-09)에는 업종 15개가 카드였고 사진은 카드 안 갤러리에 묶여 있었다. 이제 `lib/cases.ts` 가
 *    갤러리를 평탄화한 사례 목록(`CASES`)을 주고, 이 격자는 그 사례를 한 장씩 카드로 깐다.
 *    카드 = 사진 + 사례 제목(큰 글씨) + 설치 자리·화소 간격(작은 줄). 누르면 그 사례 모달.
 *    필터(시설군 / 실내·옥외)는 사례가 속한 업종의 값으로 건다. 좌측 사이드바·모바일 칩 구성은 그대로.
 *
 * 🔴 주소 동기화 — 모달이 열리면 `?case=<업종>.<번호>` 를 붙인다. 옛 `?case=<업종>`·`?type=<업종>` 은
 *    그 업종의 대표 사례로 연다(`getCase` 가 처리).
 *
 * 🔴 **`useSearchParams()` 를 쓰지 않는다.** 이 페이지는 `force-static` 이라 정적 경로에서 빈 값을 돌려준다
 *    (2026-09-09 실측: 공유한 주소로 열면 모달이 안 떴다). 최초 진입은 `window.location.search`, 그 뒤는 `popstate`.
 */

type GroupFilter = 'all' | IndustryGroup
type EnvFilter = 'all' | 'indoor' | 'outdoor'

const GROUP_FILTERS: { key: GroupFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  ...INDUSTRY_GROUPS.map((g) => ({ key: g.key as GroupFilter, label: g.label })),
]

const ENV_FILTERS: { key: EnvFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'indoor', label: '실내' },
  { key: 'outdoor', label: '옥외' },
]

function SideItem({ label, count, on, onClick }: { label: string; count: number; on: boolean; onClick: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={on}
        className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-label transition-colors duration-state ease-state ${
          on ? 'bg-wk-ink font-semibold text-white' : 'text-wk-ink3 hover:bg-white hover:text-wk-ink'
        }`}
      >
        <span className="min-w-0 truncate">{label}</span>
        <span className={`wk-metric shrink-0 text-caption ${on ? 'text-white/70' : 'text-wk-ink4'}`}>{count}</span>
      </button>
    </li>
  )
}

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`h-9 shrink-0 whitespace-nowrap rounded-full px-4 text-label font-semibold transition-colors duration-state ease-state ${
        on ? 'bg-wk-ink text-white' : 'bg-white text-wk-ink3 hover:bg-wk-line'
      }`}
    >
      {label}
    </button>
  )
}

const matches = (c: (typeof CASES)[number], group: GroupFilter, env: EnvFilter) =>
  (group === 'all' || c.industry.group === group) && (env === 'all' || c.industry.environment === env)

function Grid() {
  const [group, setGroup] = useState<GroupFilter>('all')
  const [env, setEnv] = useState<EnvFilter>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const reduce = useReducedMotion()

  const open = openId ? (getCase(openId) ?? null) : null

  useEffect(() => {
    const read = () => {
      const q = new URLSearchParams(window.location.search)
      const raw = q.get('case') ?? q.get('type')
      const hit = getCase(raw)
      if (hit && raw !== hit.id) window.history.replaceState(null, '', `${window.location.pathname}?case=${hit.id}`)
      setOpenId(hit ? hit.id : null)
    }
    read()
    window.addEventListener('popstate', read)
    return () => window.removeEventListener('popstate', read)
  }, [])

  const openCase = useCallback(
    (id: string) => {
      setOpenId(id)
      router.push(`${pathname}?case=${id}`, { scroll: false })
    },
    [pathname, router],
  )
  const closeCase = useCallback(() => {
    setOpenId(null)
    router.push(pathname, { scroll: false })
  }, [pathname, router])

  const list = useMemo(() => CASES.filter((c) => matches(c, group, env)), [group, env])
  const countGroup = (key: GroupFilter) => CASES.filter((c) => matches(c, key, env)).length
  const countEnv = (key: EnvFilter) => CASES.filter((c) => matches(c, group, key)).length
  // 이전·다음은 지금 보이는 목록(필터 적용) 안에서 돈다
  const sib = open ? siblingCases(open.id, list.some((c) => c.id === open.id) ? list : CASES) : null

  return (
    <div className="lg:grid lg:grid-cols-[208px_minmax(0,1fr)] lg:gap-10">
      <div className="mb-6 space-y-2 lg:hidden">
        <div className="flex flex-wrap gap-2 pb-1">
          {GROUP_FILTERS.map((f) => (
            <Chip key={f.key} label={f.label} on={group === f.key} onClick={() => setGroup(f.key)} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pb-1">
          {ENV_FILTERS.map((f) => (
            <Chip key={f.key} label={f.label} on={env === f.key} onClick={() => setEnv(f.key)} />
          ))}
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-28 space-y-6">
          <div>
            <p className="mb-2 px-3 text-caption font-semibold uppercase tracking-[0.14em] text-wk-ink4">시설</p>
            <ul className="m-0 list-none space-y-0.5 p-0">
              {GROUP_FILTERS.map((f) => (
                <SideItem key={f.key} label={f.label} count={countGroup(f.key)} on={group === f.key} onClick={() => setGroup(f.key)} />
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 px-3 text-caption font-semibold uppercase tracking-[0.14em] text-wk-ink4">설치 환경</p>
            <ul className="m-0 list-none space-y-0.5 p-0">
              {ENV_FILTERS.map((f) => (
                <SideItem key={f.key} label={f.label} count={countEnv(f.key)} on={env === f.key} onClick={() => setEnv(f.key)} />
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <div>
        {list.length === 0 && (
          <div className="rounded-card border border-wk-line bg-white p-8 text-center">
            <p className="text-body font-semibold text-wk-ink">이 조합에 해당하는 사례가 없습니다</p>
            <p className="wk-cap mt-2">
              필터를 <b>전체</b>로 돌리시거나, 찾으시는 현장을 알려 주시면 비슷한 자리의 구성을 정리해 보내드립니다.
            </p>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {list.map((c, n) => (
            <motion.div
              key={c.id}
              layout="position"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: reduce ? 0.2 : 0.6, delay: Math.min(n, 4) * 0.06, ease: EASE.entrance }}
            >
              <button
                type="button"
                onClick={() => openCase(c.id)}
                aria-haspopup="dialog"
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-card-m bg-wk-ink text-left ring-1 ring-black/5 transition-shadow duration-state ease-state hover:shadow-wk-3 sm:rounded-card"
              >
                <Image
                  src={c.src}
                  alt={c.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
                  className="object-cover transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-105"
                />
                <span className="wk-scrim-card absolute inset-0" />
                <span className="absolute right-3 top-3 rounded-md bg-black/45 px-2 py-1 text-caption font-semibold text-white backdrop-blur">
                  {c.industry.environment === 'indoor' ? '실내' : '옥외'}
                </span>
                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="block text-body-lg font-bold tracking-[-0.02em] text-white">{c.title}</span>
                  <span className="wk-metric mt-1 block text-caption font-medium text-white/80">
                    {c.industry.nameKo} · P{c.industry.buildInfo.pitchMm}
                  </span>
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <IndustryModal item={open} siblings={sib} onClose={closeCase} onNavigate={openCase} />
    </div>
  )
}

export function IndustryGrid() {
  return (
    <Suspense fallback={<div className="min-h-[400px]" />}>
      <Grid />
    </Suspense>
  )
}
