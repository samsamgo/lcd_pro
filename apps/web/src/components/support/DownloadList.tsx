'use client'

import { useMemo, useState } from 'react'

import {
  RESOURCE_CATEGORIES,
  type Resource,
  type ResourceCategory,
} from '@/lib/resources'

/**
 * 자료실 목록 + 분류 필터.
 *
 * 🔴 CEO 지시 2026-09-08 — "표나 이런 게 너무 길어지면 사람들이 아예 안 읽는다."
 * 자료는 계속 쌓일 것이므로 처음부터 필터를 달아 둔다. 항목이 적을 때는 필터가
 * 방해만 되므로, **해당 분류에 파일이 하나라도 있을 때만** 그 칩을 렌더한다.
 * 칩이 '전체' 하나뿐이면 필터 줄 자체를 그리지 않는다.
 */
export function DownloadList({ resources }: { resources: Resource[] }) {
  const [cat, setCat] = useState<ResourceCategory | 'all'>('all')

  const available = useMemo(
    () => RESOURCE_CATEGORIES.filter((c) => resources.some((r) => r.category === c.key)),
    [resources],
  )
  const list = cat === 'all' ? resources : resources.filter((r) => r.category === cat)

  return (
    <>
      {available.length > 1 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCat('all')}
            className={chip(cat === 'all')}
          >
            전체
          </button>
          {available.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setCat(c.key)}
              className={chip(cat === c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      <ul className="divide-y divide-wk-line overflow-hidden rounded-card border border-wk-line bg-white">
        {list.map((r) => (
          <li key={r.id}>
            <a
              href={r.file}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-5 px-6 py-5 transition-colors duration-150 hover:bg-wk-bgFaint"
            >
              <span className="min-w-0">
                <span className="block truncate text-body font-semibold text-wk-ink">
                  {r.title}
                </span>
                {r.desc && (
                  <span className="mt-1 block truncate text-label text-wk-ink3">{r.desc}</span>
                )}
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-caption text-wk-ink3">
                  PDF · {r.size}
                </span>
                <span className="block text-caption text-wk-ink3">{r.updated}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}

function chip(active: boolean) {
  return `rounded-full border px-3.5 py-1.5 text-label font-semibold transition-colors duration-150 ${
    active
      ? 'border-wk-ink bg-wk-ink text-white'
      : 'border-wk-line2 bg-white text-wk-ink2 hover:bg-wk-bgFaint'
  }`
}
