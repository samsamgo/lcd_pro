/**
 * TL;DR / 핵심 요약 표준 박스
 *
 * AEO 목적: 페이지·블로그 글 최상단에 사실 진술형 요약을 배치 →
 * LLM이 단일 문단을 인용·발췌하기 용이.
 */
import React from 'react'

interface Props {
  /** 한 문장 정의 — "X는 ~이다" */
  definition?: string
  /** 3~5개 핵심 포인트 (불릿) */
  points: string[]
}

export function TLDR({ definition, points }: Props) {
  return (
    <aside
      aria-label="핵심 요약"
      className="my-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6"
    >
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">
        핵심 요약 · TL;DR
      </p>
      {definition && (
        <p className="mb-3 text-base font-semibold leading-relaxed text-zinc-900">
          {definition}
        </p>
      )}
      <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700">
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </aside>
  )
}
