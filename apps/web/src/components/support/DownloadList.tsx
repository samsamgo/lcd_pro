'use client'

import { useMemo, useState } from 'react'

import {
  RESOURCE_CATEGORIES,
  type Resource,
  type ResourceCategory,
} from '@/lib/resources'

/**
 * 자료실 — **게시판 형식.**
 *
 * 🔴 2026-09-09 CEO 지시 "자료실은 페이지만 게시판 형식으로 만들어 놓아라. 우리가 올릴 거다."
 *    번호 · 분류 · 제목 · 등록일 · 파일 다섯 칸의 표. 자료가 없으면 표 안에 "등록된 자료가 없습니다"
 *    한 줄만 둔다 — 빈 카드나 안내문으로 대신하지 않는다. 자료는 `lib/resources.ts` 에 한 줄씩 추가한다.
 *    분류 칩은 해당 분류에 자료가 하나라도 있을 때만 그린다.
 */
export function DownloadList({ resources }: { resources: Resource[] }) {
  const [cat, setCat] = useState<ResourceCategory | 'all'>('all')

  const available = useMemo(
    () => RESOURCE_CATEGORIES.filter((c) => resources.some((r) => r.category === c.key)),
    [resources],
  )
  const list = cat === 'all' ? resources : resources.filter((r) => r.category === cat)
  const label = (k: ResourceCategory) => RESOURCE_CATEGORIES.find((c) => c.key === k)?.label ?? k

  return (
    <>
      {available.length > 1 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setCat('all')} className={chip(cat === 'all')}>
            전체
          </button>
          {available.map((c) => (
            <button key={c.key} type="button" onClick={() => setCat(c.key)} className={chip(cat === c.key)}>
              {c.label}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-x-auto rounded-card border border-wk-line bg-white">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-wk-line bg-wk-bgFaint text-label text-wk-ink3">
              <th scope="col" className="w-16 px-5 py-3.5 text-center font-semibold">번호</th>
              <th scope="col" className="w-32 px-5 py-3.5 font-semibold">분류</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">제목</th>
              <th scope="col" className="w-32 px-5 py-3.5 font-semibold">등록일</th>
              <th scope="col" className="w-28 px-5 py-3.5 text-center font-semibold">파일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wk-line">
            {list.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-14 text-center text-body text-wk-ink3">
                  등록된 자료가 없습니다.
                </td>
              </tr>
            ) : (
              list.map((r, i) => (
                <tr key={r.id} className="transition-colors duration-150 hover:bg-wk-bgFaint">
                  <td className="px-5 py-4 text-center text-label text-wk-ink3">{list.length - i}</td>
                  <td className="px-5 py-4 text-label text-wk-ink2">{label(r.category)}</td>
                  <td className="px-5 py-4">
                    <a href={r.file} target="_blank" rel="noopener noreferrer" className="text-body font-semibold text-wk-ink hover:underline">
                      {r.title}
                    </a>
                    {r.desc && <span className="mt-0.5 block text-caption text-wk-ink3">{r.desc}</span>}
                  </td>
                  <td className="px-5 py-4 text-label text-wk-ink3">{r.updated}</td>
                  <td className="px-5 py-4 text-center">
                    <a href={r.file} target="_blank" rel="noopener noreferrer" className="text-label font-semibold text-wk-cta hover:underline">
                      PDF · {r.size}
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
