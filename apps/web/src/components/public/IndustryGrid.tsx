'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { INDUSTRIES, INDUSTRY_GROUPS, getIndustry, type IndustryGroup } from '@/lib/industries'
import Link from 'next/link'

import { EASE } from '@/components/motion'

/**
 * 시공사례 카드 그리드.
 *
 * 담당자는 설명을 읽고 찾는 게 아니라 자기 현장을 눈으로 찾는다.
 * 카드에는 사진과 이름, 판단에 바로 쓰이는 정보(실내/옥외, 대표 용도)만 둔다.
 * 카드를 누르면 상세 페이지(`/industries/<slug>`)로 간다.
 *
 * 🔴 2026-09-08 모달 제거. 카드는 전부 상세 페이지로 가는데 옛 `?type=<slug>` 로
 *   들어오면 모달이 따로 떠서 같은 내용이 두 경로로 갈렸다. 옛 주소로 들어오면
 *   상세 페이지로 바꿔 보낸다(북마크·외부 링크가 죽지 않게).
 *
 * 🔴 2026-09-07 흰 여백 수정.
 *   전에는 "첫 카드는 무조건 2칸"이었다. 카드가 6장이면 lg(3열)에서
 *   셀이 7개가 되어 마지막 줄에 빈 칸 2개가 남았고, 그 아래 섹션 상하 여백
 *   128px+128px 이 붙어 화면 하나가 통째로 빈 것처럼 보였다(COO 실물 확인).
 *   이제 첫 카드 span 을 개수에서 역산해 마지막 줄을 항상 채운다.
 *   `spanFor` 는 카드가 몇 장이든, 어떤 필터를 눌러도 성립한다.
 */

/** lg(3열)에서 마지막 줄이 비지 않도록 첫 카드가 차지할 칸 수 */
export function spanFor(count: number, cols: number): number {
  /**
   * 🔴 2026-09-07 QC 실측 — 카드가 1장인 조합에서 구멍이 남았다.
   * `생활·상업 + 실내` = 1장. 전에는 여기서 1 을 반환해 카드가 lg 3열 중 1칸(32%)만
   * 채우고 오른쪽 2칸이 통째로 비었다(sm 2열에서는 49%). 위 주석이 약속한
   * "카드가 몇 장이든 마지막 줄을 채운다"가 이 경우에만 성립하지 않았다.
   * 1장이면 그 한 장이 줄 전체를 차지해야 한다.
   */
  if (count <= 1) return cols
  // (count - 1 + s) % cols === 0 을 만족하는 최소 s (1..cols)
  const s = (((1 - count) % cols) + cols) % cols
  return s === 0 ? cols : s
}

/**
 * span 클래스는 반드시 문자열 리터럴로 적는다.
 * `lg:col-span-${n}` 처럼 조립하면 Tailwind 스캐너가 못 찾아 클래스가 사라진다.
 */
function spanClass(smSpan: number, lgSpan: number): string {
  const sm = smSpan === 2 ? 'sm:col-span-2 sm:aspect-[16/7]' : ''
  const lg =
    lgSpan === 3
      ? 'lg:col-span-3 lg:aspect-[16/5]'
      : lgSpan === 2
        ? 'lg:col-span-2 lg:aspect-[11/4]'
        : 'lg:col-span-1 lg:aspect-[4/3]'
  return `${sm} ${lg}`
}

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

const chipClass = (on: boolean) =>
  `h-10 rounded-full px-4 text-label font-semibold transition-colors duration-state ease-state ${
    on ? 'bg-wk-ink text-white' : 'bg-white text-wk-ink3 hover:bg-wk-line'
  }`

function Grid() {
  const [group, setGroup] = useState<GroupFilter>('all')
  const [env, setEnv] = useState<EnvFilter>('all')
  const params = useSearchParams()
  const router = useRouter()
  const reduce = useReducedMotion()

  useEffect(() => {
    const t = params.get('type')
    if (t && getIndustry(t)) router.replace(`/industries/${t}`)
  }, [params, router])

  const list = useMemo(
    () =>
      INDUSTRIES.filter(
        (i) => (group === 'all' || i.group === group) && (env === 'all' || i.environment === env),
      ),
    [group, env],
  )

  const lgSpan = spanFor(list.length, 3)
  const smSpan = spanFor(list.length, 2)

  return (
    <>
      {/* 두 축으로 좁힌다 — 어떤 시설인가 / 실내인가 옥외인가 */}
      <div className="mb-7 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-caption font-semibold text-wk-ink3">시설</span>
          {GROUP_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setGroup(f.key)}
              aria-pressed={group === f.key}
              className={chipClass(group === f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-caption font-semibold text-wk-ink3">환경</span>
          {ENV_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setEnv(f.key)}
              aria-pressed={env === f.key}
              className={chipClass(env === f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 두 축을 겹치면 결과가 0인 조합이 생긴다(예: 학교·교육시설 + 옥외).
          그때 빈 격자만 남기면 또 흰 여백이 된다. */}
      {list.length === 0 && (
        <div className="rounded-card border border-wk-line bg-white p-8 text-center">
          <p className="text-body font-semibold text-wk-ink">이 조합에 해당하는 자리가 없습니다</p>
          <p className="wk-cap mt-2">
            필터를 <b>전체</b>로 돌리시거나, 찾으시는 현장을 알려 주시면 비슷한 자리의 구성을 정리해
            보내드립니다.
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {list.map((i, n) => {
          const wide = n === 0 && (lgSpan > 1 || smSpan > 1)
          return (
            <motion.div
              key={i.slug}
              layout="position"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: reduce ? 0.2 : 0.6, delay: Math.min(n, 4) * 0.07, ease: EASE.entrance }}
              className={`aspect-[4/3] ${wide ? spanClass(smSpan, lgSpan) : ''}`}
            >
              <Link
                href={`/industries/${i.slug}`}
                className="group relative block h-full w-full overflow-hidden rounded-card-m bg-wk-ink p-0 text-left ring-1 ring-black/5 transition-shadow duration-state ease-state hover:shadow-wk-3 sm:rounded-card"
              >
              <div className="absolute inset-0">
                <Image
                  src={i.heroImage}
                  alt={i.heroImageAlt ?? `${i.nameKo} 현장의 LED 안내 화면`}
                  fill
                  sizes={
                    wide && lgSpan > 1
                      ? '(max-width: 1024px) 100vw, 760px'
                      : '(max-width: 640px) 100vw, 380px'
                  }
                  className="object-cover transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-105"
                />
                <div className="wk-scrim-card absolute inset-0" />

                <span className="absolute right-4 top-4 rounded-md bg-black/45 px-2 py-1 text-caption font-semibold text-white backdrop-blur">
                  {i.environment === 'indoor' ? '실내' : '옥외'}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-caption font-medium text-white/80">{i.eyebrow}</p>
                  <b
                    className={`mt-1 block font-bold tracking-[-0.025em] text-white ${
                      wide && lgSpan > 1 ? 'text-h3' : 'text-body-lg'
                    }`}
                  >
                    {i.nameKo}
                  </b>

                  <span className="mt-3 flex items-center gap-1.5 text-label font-semibold text-white">
                    자세히 보기
                    <span className="transition-transform duration-state ease-state motion-safe:group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </>
  )
}

export function IndustryGrid() {
  return (
    <Suspense fallback={<div className="min-h-[400px]" />}>
      <Grid />
    </Suspense>
  )
}
