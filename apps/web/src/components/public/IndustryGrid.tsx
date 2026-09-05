'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { INDUSTRIES, getIndustry, type Industry } from '@/lib/industries'
import { IndustryModal } from './IndustryModal'
import { EASE } from '@/components/motion'

/**
 * 업종 카드 그리드.
 *
 * 담당자는 설명을 읽고 찾는 게 아니라 자기 현장을 눈으로 찾는다.
 * 카드에는 사진과 이름, 판단에 바로 쓰이는 정보(실내/옥외, 대표 용도)만 둔다.
 * 자세한 내용은 눌러서 모달로 본다(페이지 이동 없음).
 *
 * 네비게이션 하위 메뉴는 `?type=<slug>` 로 들어온다. 그 값이 있으면 해당
 * 모달을 열어준다 — 메뉴를 눌렀는데 변화가 없으면 고장으로 읽힌다.
 *
 * 레이아웃: 첫 카드가 2칸을 차지해 시선의 출발점을 만든다.
 * 카드는 순서대로 어긋나게 등장한다.
 */


type Filter = 'all' | 'indoor' | 'outdoor'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'indoor', label: '실내' },
  { key: 'outdoor', label: '옥외' },
]

function Grid() {
  const [active, setActive] = useState<Industry | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const params = useSearchParams()
  const reduce = useReducedMotion()

  useEffect(() => {
    const t = params.get('type')
    if (t) {
      const found = getIndustry(t)
      if (found) setActive(found)
    }
  }, [params])

  const list = useMemo(
    () => (filter === 'all' ? INDUSTRIES : INDUSTRIES.filter((i) => i.environment === filter)),
    [filter],
  )

  return (
    <>
      {/* 실내/옥외 필터 */}
      <div className="mb-7 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`h-10 rounded-full px-4 text-label font-semibold transition-colors duration-state ease-state ${
              filter === f.key
                ? 'bg-wk-ink text-white'
                : 'bg-white text-wk-ink3 hover:bg-wk-line'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {list.map((i, n) => {
          const wide = filter === 'all' && n === 0
          return (
            <motion.button
              key={i.slug}
              layout="position"
              type="button"
              onClick={() => setActive(i)}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: reduce ? 0.2 : 0.6, delay: Math.min(n, 4) * 0.07, ease: EASE.entrance }}
              className={`group relative block w-full overflow-hidden rounded-card-m bg-wk-ink p-0 text-left ring-1 ring-black/5 transition-shadow duration-state ease-state hover:shadow-wk-3 sm:rounded-card ${
                wide ? 'aspect-[16/10] lg:col-span-2 lg:aspect-[11/4]' : 'aspect-[4/3]'
              }`}
            >
              <div className="absolute inset-0">
                <Image
                  src={i.heroImage}
                  alt={i.heroImageAlt ?? `${i.nameKo} 현장의 LED 안내 화면`}
                  fill
                  sizes={wide ? '(max-width: 1024px) 100vw, 760px' : '(max-width: 640px) 100vw, 380px'}
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
                      wide ? 'text-h3' : 'text-body-lg'
                    }`}
                  >
                    {i.nameKo}
                  </b>

                  <span className="mt-3 flex items-center gap-1.5 text-label font-semibold text-white">
                    구성 보기
                    <span className="transition-transform duration-state ease-state motion-safe:group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      <IndustryModal industry={active} onClose={() => setActive(null)} />
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
