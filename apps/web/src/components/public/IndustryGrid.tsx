'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

import { EASE, useReducedMotion } from '@/components/motion'
import { IndustryModal } from '@/components/public/IndustryModal'
import { INDUSTRIES, INDUSTRY_GROUPS, getIndustry, type IndustryGroup } from '@/lib/industries'

/**
 * 설치사례 목록 — 케이시스(ksys.co.kr) `placeReference` 형식.
 *
 * 🔴 2026-09-09 CEO 지시 "시공사례는 케이시스처럼 누르면 사진 크게 하고 간단하게 이것저것 나오게."
 *    구성은 케이시스 목록 그대로다:
 *      · 좌측 필터 사이드바 (시설군 / 설치 환경) — 데스크톱에서 스크롤을 따라 붙는다
 *      · 우측 3열 사진 카드 — 사진 위 아래쪽에 흰 큰 제목(자리 이름) + 작은 설치 자리
 *      · 카드를 누르면 페이지 이동이 아니라 **모달**로 큰 사진 + 구축정보가 뜬다
 *    모바일에서는 사이드바 자리가 없으므로 상단 가로 스크롤 칩으로 접는다.
 *
 * 🔴 주소 동기화 — 모달이 열리면 `?case=<slug>` 를 붙인다.
 *    모달인데 주소가 그대로면 ①뒤로가기로 못 닫고 ②링크로 공유가 안 된다.
 *    `router.push` 로 넣고 닫을 때 `router.back()` 이 아니라 명시적으로 지운다
 *    (뒤로가기로 닫는 경로와 X 로 닫는 경로가 히스토리를 다르게 남기면 헷갈린다).
 *
 * 🔴 옛 주소 `?type=<slug>` 는 살려 둔다 — 2026-09-08~09-09 사이에 뿌려진 링크가 있다.
 *    같은 자리를 가리키므로 `?case=` 로 바꿔 준다.
 *
 * 🔴 **`useSearchParams()` 를 쓰지 않는다.** 2026-09-09 실물 확인에서 잡은 사고다.
 *    이 페이지는 `export const dynamic = 'force-static'` 이라, 정적 렌더된 경로에서
 *    `useSearchParams()` 는 **빈 값**을 돌려준다(Next 문서에 명시). 그래서 카드로 눌러
 *    연 모달은 열렸지만, **그 주소를 복사해 새로 열거나 새로고침하면 모달이 안 떴다.**
 *    공유·뒤로가기를 하라고 주소를 붙였는데 정작 공유가 안 되는 상태였다.
 *    → 최초 진입은 `window.location.search` 에서 직접 읽고, 그 뒤 변화는 `popstate` 로 받는다.
 *    (force-static 을 풀어 SSR 로 돌리는 방법도 있지만, 리드가 들어오는 P0 페이지의
 *     정적 캐시를 질의문자열 하나 때문에 버릴 이유가 없다)
 *
 * ⚠️ 카드 span 보정(옛 `spanFor`)은 걷어냈다. 케이시스처럼 **모든 카드가 같은 크기**다.
 *    첫 카드만 크게 만들면 3열 격자가 흔들리고, 마지막 줄 빈 칸 문제도 그 보정에서 왔다.
 *    지금은 15장 = 3열 5줄로 딱 떨어진다. 필터로 줄어도 빈 칸은 격자 끝에만 생기고
 *    카드 크기가 같으니 "화면이 비었다"로 읽히지 않는다.
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

/** 좌측 사이드바의 한 줄 (데스크톱) */
function SideItem({
  label,
  count,
  on,
  onClick,
}: {
  label: string
  count: number
  on: boolean
  onClick: () => void
}) {
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

/** 모바일 상단 가로 스크롤 칩 */
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

function Grid() {
  const [group, setGroup] = useState<GroupFilter>('all')
  const [env, setEnv] = useState<EnvFilter>('all')
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const reduce = useReducedMotion()

  const open = openSlug ? (getIndustry(openSlug) ?? null) : null

  // 최초 진입(공유 링크·새로고침)과 뒤로/앞으로 — 주소에서 직접 읽는다
  useEffect(() => {
    const read = () => {
      const q = new URLSearchParams(window.location.search)
      // 옛 `?type=` 링크는 `?case=` 로 바꿔 준다
      const legacy = q.get('type')
      if (legacy && getIndustry(legacy)) {
        window.history.replaceState(null, '', `${window.location.pathname}?case=${legacy}`)
        setOpenSlug(legacy)
        return
      }
      const slug = q.get('case')
      setOpenSlug(slug && getIndustry(slug) ? slug : null)
    }
    read()
    window.addEventListener('popstate', read)
    return () => window.removeEventListener('popstate', read)
  }, [])

  const openCase = useCallback(
    (slug: string) => {
      setOpenSlug(slug)
      router.push(`${pathname}?case=${slug}`, { scroll: false })
    },
    [pathname, router],
  )
  const closeCase = useCallback(() => {
    setOpenSlug(null)
    router.push(pathname, { scroll: false })
  }, [pathname, router])

  const list = useMemo(
    () =>
      INDUSTRIES.filter(
        (i) => (group === 'all' || i.group === group) && (env === 'all' || i.environment === env),
      ),
    [group, env],
  )

  const countGroup = (key: GroupFilter) =>
    INDUSTRIES.filter((i) => (key === 'all' || i.group === key) && (env === 'all' || i.environment === env)).length
  const countEnv = (key: EnvFilter) =>
    INDUSTRIES.filter((i) => (group === 'all' || i.group === group) && (key === 'all' || i.environment === key)).length

  return (
    <div className="lg:grid lg:grid-cols-[208px_minmax(0,1fr)] lg:gap-10">
      {/* ── 모바일: 가로 스크롤 칩 두 줄 ─────────────────────────── */}
      <div className="mb-6 space-y-2 lg:hidden">
        <div className="flex flex-wrap gap-2 pb-1 md:-mx-5 md:flex-nowrap md:overflow-x-auto md:px-5 md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden" /* 2026-09-09 폰: 가로 스크롤 줄은 오른쪽이 잘려 보인다(스크롤바도 숨김) → 폰에선 줄바꿈 */>
          {GROUP_FILTERS.map((f) => (
            <Chip key={f.key} label={f.label} on={group === f.key} onClick={() => setGroup(f.key)} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pb-1 md:-mx-5 md:flex-nowrap md:overflow-x-auto md:px-5 md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden" /* 2026-09-09 폰: 가로 스크롤 줄은 오른쪽이 잘려 보인다(스크롤바도 숨김) → 폰에선 줄바꿈 */>
          {ENV_FILTERS.map((f) => (
            <Chip key={f.key} label={f.label} on={env === f.key} onClick={() => setEnv(f.key)} />
          ))}
        </div>
      </div>

      {/* ── 데스크톱: 좌측 필터 사이드바 ─────────────────────────── */}
      <aside className="hidden lg:block">
        <div className="sticky top-28 space-y-6">
          <div>
            <p className="mb-2 px-3 text-caption font-semibold uppercase tracking-[0.14em] text-wk-ink4">시설</p>
            <ul className="m-0 list-none space-y-0.5 p-0">
              {GROUP_FILTERS.map((f) => (
                <SideItem
                  key={f.key}
                  label={f.label}
                  count={countGroup(f.key)}
                  on={group === f.key}
                  onClick={() => setGroup(f.key)}
                />
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 px-3 text-caption font-semibold uppercase tracking-[0.14em] text-wk-ink4">설치 환경</p>
            <ul className="m-0 list-none space-y-0.5 p-0">
              {ENV_FILTERS.map((f) => (
                <SideItem
                  key={f.key}
                  label={f.label}
                  count={countEnv(f.key)}
                  on={env === f.key}
                  onClick={() => setEnv(f.key)}
                />
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <div>
        {/* 두 축을 겹치면 결과가 0인 조합이 생긴다(예: 학교·교육시설 + 옥외) */}
        {list.length === 0 && (
          <div className="rounded-card border border-wk-line bg-white p-8 text-center">
            <p className="text-body font-semibold text-wk-ink">이 조합에 해당하는 자리가 없습니다</p>
            <p className="wk-cap mt-2">
              필터를 <b>전체</b>로 돌리시거나, 찾으시는 현장을 알려 주시면 비슷한 자리의 구성을 정리해 보내드립니다.
            </p>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {list.map((i, n) => (
            <motion.div
              key={i.slug}
              layout="position"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: reduce ? 0.2 : 0.6, delay: Math.min(n, 4) * 0.06, ease: EASE.entrance }}
            >
              <button
                type="button"
                onClick={() => openCase(i.slug)}
                aria-haspopup="dialog"
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-card-m bg-wk-ink text-left ring-1 ring-black/5 transition-shadow duration-state ease-state hover:shadow-wk-3 sm:rounded-card"
              >
                <Image
                  src={i.heroImage}
                  alt={i.heroImageAlt ?? `${i.nameKo} 현장의 LED 안내 화면`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
                  className="object-cover transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-105"
                />
                <span className="wk-scrim-card absolute inset-0" />

                <span className="absolute right-3 top-3 rounded-md bg-black/45 px-2 py-1 text-caption font-semibold text-white backdrop-blur">
                  {i.environment === 'indoor' ? '실내' : '옥외'}
                </span>

                {/* 케이시스 카드 = 사진 아래쪽에 흰 큰 제목(기관명) + 작은 제품명.
                    우리는 기관명이 없으니 자리 이름을 큰 제목으로, 권장 규격을 작은 줄로 둔다. */}
                <span className="absolute inset-x-0 bottom-0 p-5">
                  <span className="block text-body-lg font-bold tracking-[-0.02em] text-white">{i.nameKo}</span>
                  <span className="wk-metric mt-1 block text-caption font-medium text-white/80">
                    {i.eyebrow} · P{i.buildInfo.pitchMm}
                  </span>
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <IndustryModal industry={open} onClose={closeCase} onNavigate={openCase} />
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
