import Image from 'next/image'

import { Reveal, RiseMask } from '@/components/motion'
import { SERVICE_STEPS, TOTAL_DURATION } from '@/lib/serviceProcess'

/**
 * 설치 과정 — 여섯 공정. **한 덩어리.**
 *
 * 🔴 2026-09-08 CEO 지시 "설치 과정하고 공정마다 실제로 하는 일 하나로 합쳐라".
 *    전에는 같은 6공정을 두 번 보여줬다 — 위에 요약표(공정·기간·담당), 아래에 아코디언
 *    "공정마다 실제로 하는 일"(같은 6개 + 설명 + 사진). 표를 읽고 내려오면 같은 제목이 또 나왔다.
 *    이제 공정 하나당 **행 하나**다. 왼쪽에 번호·이름·기간·담당, 오른쪽에 하는 일과 현장 사진.
 *    접지 않는다 — 여섯 개뿐이라 펼쳐 두는 편이 읽기 쉽고, 눌러야 보이면 아무도 안 누른다.
 *
 * 데이터는 `lib/serviceProcess.ts` 하나(요약표·상세·JSON-LD 가 같은 배열을 읽는다).
 */
export function ProcessOverview() {
  return (
    <section className="wk-sec bg-white">
      <div className="wk-wrap">
        <Reveal y={10}>
          <p className="wk-eyebrow">설치 과정</p>
        </Reveal>
        <RiseMask delay={0.06}>
          <h2 className="wk-h2 text-wk-ink">여섯 공정</h2>
        </RiseMask>
        <Reveal y={14} delay={0.16}>
          <p className="wk-lead mt-5">
            누가 며칠 동안 무엇을 하는지 공정마다 적었습니다. 중간에 업체가 바뀌지 않습니다.
          </p>
        </Reveal>

        <ol className="mt-12 border-t-2 border-wk-ink lg:mt-14">
          {SERVICE_STEPS.map((s, i) => (
            <li key={s.id} id={s.id} className="scroll-mt-24 border-b border-wk-line">
              <Reveal y={16} delay={Math.min(i, 3) * 0.05}>
                <div className="grid gap-6 py-8 lg:grid-cols-[5fr_7fr] lg:gap-12 lg:py-10">
                  {/* 왼쪽 — 번호·이름·기간·담당 */}
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="wk-metric text-label font-bold text-wk-cta">{s.no}</span>
                      <h3 className="text-h3 font-bold leading-tight tracking-[-0.015em] text-wk-ink">
                        {s.title}
                      </h3>
                    </div>
                    <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
                      <div>
                        <dt className="text-caption text-wk-ink3">소요 기간</dt>
                        <dd className="wk-metric mt-0.5 text-label font-semibold text-wk-ink">
                          {s.duration}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-caption text-wk-ink3">담당</dt>
                        <dd className="mt-0.5 text-label font-semibold text-wk-ink">{s.owner}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* 오른쪽 — 하는 일 + 현장 사진 */}
                  <div className="grid gap-5 sm:grid-cols-[1.2fr_1fr] sm:items-start">
                    <p className="text-body leading-relaxed text-wk-ink2">{s.body}</p>
                    {s.image && (
                      <div className="relative aspect-[4/3] overflow-hidden rounded-card-m bg-wk-bg">
                        <Image
                          src={s.image}
                          alt={s.alt ?? ''}
                          fill
                          sizes="(max-width: 640px) 100vw, 280px"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <p className="wk-cap mt-6">
          표준 공정안 기준 총 {TOTAL_DURATION}. 확정 일정은 현장 실측 후 견적서에 적습니다.
        </p>
      </div>
    </section>
  )
}
