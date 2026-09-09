'use client'

import { useState } from 'react'

import type { Notice } from '@/lib/notices'

/**
 * 공지사항 — **게시판 형식.** 자료실(`components/support/DownloadList`)과 같은 표를 쓴다.
 *
 * 🔴 칸 폭과 `whitespace-nowrap` 은 자료실과 같은 규칙이다. 2026-09-09 에 CEO 가
 *    "번호가 세로로 되어 있어 불편하다"고 지적한 건이 자료실에서 이 규칙으로 잡혔다.
 *    여백을 키워 머리글이 접히게 만들지 마라.
 * 🔴 공지가 없으면 표 안에 "등록된 공지가 없습니다." 한 줄만 둔다 —
 *    빈 카드나 안내문으로 대신하지 않는다. 공지는 `lib/notices.ts` 에 한 줄씩 추가한다.
 */
export function NoticeBoard({ notices }: { notices: Notice[] }) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="overflow-x-auto rounded-card border border-wk-line bg-white">
      <table className="w-full min-w-[560px] text-left">
        <thead>
          <tr className="border-b border-wk-line bg-wk-bgFaint text-label text-wk-ink3">
            <th scope="col" className="w-20 whitespace-nowrap px-4 py-3.5 text-center font-semibold">번호</th>
            <th scope="col" className="whitespace-nowrap px-4 py-3.5 font-semibold">제목</th>
            <th scope="col" className="w-32 whitespace-nowrap px-4 py-3.5 font-semibold">등록일</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-wk-line">
          {notices.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-5 py-14 text-center text-body text-wk-ink3">
                등록된 공지가 없습니다.
              </td>
            </tr>
          ) : (
            notices.map((n, i) => {
              const expanded = open === n.id
              return (
                <tr key={n.id} className="align-top transition-colors duration-150 hover:bg-wk-bgFaint">
                  <td className="whitespace-nowrap px-4 py-4 text-center text-label text-wk-ink3">
                    {notices.length - i}
                  </td>
                  <td className="px-5 py-4">
                    {n.body ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setOpen(expanded ? null : n.id)}
                          aria-expanded={expanded}
                          className="text-left text-body font-semibold text-wk-ink hover:underline"
                        >
                          {n.title}
                        </button>
                        {expanded && (
                          <p className="mt-2 whitespace-pre-line text-label leading-relaxed text-wk-ink2">
                            {n.body}
                          </p>
                        )}
                      </>
                    ) : (
                      <span className="text-body font-semibold text-wk-ink">{n.title}</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-label text-wk-ink3">{n.date}</td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
