'use client'

import { Check } from 'lucide-react'

/**
 * 견적 단계 표시.
 *
 * 현재 단계를 색만으로 알리지 않는다 — 완료 단계에는 체크 표시,
 * 현재 단계에는 굵기와 색을 함께 준다(설계계약서 §7).
 * 색각 이상이 있는 담당자도 어디까지 왔는지 알 수 있어야 한다.
 */
export function ProgressBar({
  current,
  total,
  labels,
}: {
  current: number
  total: number
  labels: string[]
}) {
  return (
    <div
      role="progressbar"
      aria-label="견적 요청 진행 단계"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
      aria-valuetext={`전체 ${total}단계 중 ${current + 1}단계: ${labels[current]}`}
    >
      <ol className="m-0 flex list-none items-center gap-2 p-0">
        {labels.map((l, i) => {
          const done = i < current
          const now = i === current
          return (
            <li key={l} className="flex flex-1 flex-col gap-2">
              <span
                aria-hidden="true"
                className={`h-1 w-full rounded-full transition-colors duration-enter ease-entrance ${
                  done ? 'bg-wk-cta' : now ? 'bg-wk-cta' : 'bg-wk-line'
                }`}
              />
              <span
                className={`flex items-center gap-1 text-caption transition-colors duration-state ease-state ${
                  now ? 'font-bold text-wk-cta' : done ? 'font-medium text-wk-ink3' : 'text-wk-ink3'
                }`}
              >
                {done && <Check size={12} strokeWidth={3} aria-hidden="true" />}
                <span className="truncate">{l}</span>
                {done && <span className="sr-only">완료</span>}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
