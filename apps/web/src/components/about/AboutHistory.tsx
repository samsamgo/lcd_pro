import Link from 'next/link'

import { HISTORY } from '@/lib/credentials'
import { Reveal, RiseMask, Stagger } from '@/components/motion'

/**
 * 연혁 — 세로 타임라인.
 *
 * 🔴 **날짜는 전부 실제 서류에 인쇄된 것이다** (정본 = `lib/credentials.ts` HISTORY).
 *    2026년 6월 설립 이전 이력은 없다. 없는 것을 만들지 마라 — 관공서 담당자가
 *    확인서 원본과 나란히 놓고 본다. 한 줄이라도 안 맞으면 그때부터 전부 의심받는다.
 *
 * 연출 — 항목이 위에서부터 차례로 들어온다(Stagger). 왼쪽 세로선 위의 점이
 * 각 항목의 자리를 잡는다. transform/opacity 만 움직인다(설계계약서 §0-6).
 */
export function AboutHistory() {
  return (
    <section aria-labelledby="history-h" className="wk-sec bg-white">
      <div className="wk-wrap">
        <Reveal y={10}>
          <p className="wk-eyebrow">연혁</p>
        </Reveal>
        <h2 id="history-h" className="wk-h2 text-wk-ink">
          <RiseMask delay={0.06}>2026년, 여기까지 왔습니다</RiseMask>
        </h2>
        <Reveal y={14} delay={0.14}>
          <p className="wk-lead mt-5">
            아래 항목은 모두 발급받은 서류가 있습니다.{' '}
            <Link
              href="/about/certification"
              className="font-semibold text-wk-cta underline-offset-4 hover:underline"
            >
              인증·서류
            </Link>
            에서 원본을 보실 수 있습니다.
          </p>
        </Reveal>

        <div className="relative mt-12 lg:mt-16">
          {/* 세로선 — 점의 중심(왼쪽에서 5px)을 지난다 */}
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-[5px] top-2 w-px bg-wk-line2"
          />
          <Stagger className="relative" y={16} gap={0.06}>
            {HISTORY.map((h) => (
              <div key={`${h.date}-${h.title}`} className="relative pb-8 pl-8 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[7px] h-[11px] w-[11px] rounded-full border-2 border-white bg-wk-cta shadow-[0_0_0_1px_#E5E8EB]"
                />
                <div className="flex flex-col gap-x-8 gap-y-1 sm:flex-row sm:items-baseline">
                  <time className="wk-metric w-[7.5rem] shrink-0 text-label font-bold text-wk-cta">
                    {h.date}
                  </time>
                  <div className="min-w-0">
                    <p className="text-body-lg font-semibold text-wk-ink">{h.title}</p>
                    {h.detail && (
                      <p className="mt-1 text-label text-wk-ink3">{h.detail}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
