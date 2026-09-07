import Image from 'next/image'
import { ChevronDown } from 'lucide-react'

import { Reveal } from '@/components/motion'
import { SERVICE_STEPS, TOTAL_DURATION } from '@/lib/serviceProcess'

/**
 * 6공정 — 요약표(먼저) + 상세 아코디언(뒤).
 *
 * 2026-09-07 ProcessScroller.tsx 를 대체했다. 왜 갈아엎었나 —
 *
 * ① 스크롤 비용. 공정 하나가 뷰포트 하나를 먹어서 범위 하나 확인하는 데 6화면을 넘겼다.
 *    이 페이지 독자는 과업 범위를 결재 문서로 옮겨 적는 담당자다. 그 사람에게 필요한 건
 *    연출이 아니라 **공정 × 소요기간 × 담당을 한 화면에서 비교하는 표**다.
 *    표를 먼저 주고, 서사와 사진은 아코디언으로 내렸다.
 *
 * ② 좌측 스티키 레일이 데스크톱에서 폭 1/3 을 쓰면서 목록 6줄만 담아 거의 비어 있었다.
 *    표로 바꾸면서 그 레일 자체가 없어졌다. 빈 칸을 무엇으로 채울지 고민할 일이 사라진다.
 *
 * StickyScene 을 안 쓰는 이유는 전과 같다 — 스크롤 진행도로 내용을 갈아끼우면
 * 6개 상세가 DOM 에 한 번에 없어서 검색·복사·키보드 탐색이 망가진다.
 * 아코디언은 네이티브 <details> 라 JS 없이 열리고, 브라우저 페이지 내 검색이
 * 닫힌 패널도 펼쳐서 찾아준다.
 *
 * 🔴 2026-09-07 CEO 지시("드리는 서류도 빼")로 '발주처에 드리는 산출물' 열을 없앴다.
 *    표는 공정 / 소요 기간 / 담당 3열이다. 문서 목록 열을 다시 만들지 말 것.
 *    데이터 쪽(lib/serviceProcess.ts)의 outputs 필드도 함께 삭제됐다.
 *
 * ⚠️ 소요 기간은 표준 공정안이다. 확정 일정이 아니라고 화면에도 적는다.
 * 데이터는 lib/serviceProcess.ts 하나만 읽는다(히어로 칩·JSON-LD 와 같은 배열).
 */
export function ProcessOverview() {
  return (
    <section id="process" className="wk-sec bg-white">
      <div className="wk-wrap">
        <Reveal y={16}>
          <p className="wk-eyebrow">공급 범위</p>
          <h2 className="wk-h2 text-wk-ink">여섯 공정</h2>
          <p className="wk-lead mt-5">
            어느 공정을 누가 맡고 며칠 걸리는지 한 표에 넣었습니다. 중간에 업체가 바뀌지 않습니다.
          </p>
        </Reveal>

        {/* ── 요약표 ─────────────────────────────────────────
            모바일에서 4열을 가로로 밀면 360px 에서 페이지가 흔들린다.
            그래서 td 를 block 으로 떨어뜨리고 셀 안에 라벨을 붙인다.
            내용을 두 번 적지 않으므로 스크린리더에도 중복이 없다. */}
        <Reveal y={18} delay={0.06}>
          <table className="mt-12 w-full border-collapse text-left lg:mt-14">
            <caption className="sr-only">공정별 소요 기간과 담당</caption>
            <thead className="hidden md:table-header-group">
              <tr className="border-b-2 border-wk-ink">
                <th scope="col" className="w-[38%] py-3 pr-4 text-label font-semibold text-wk-ink">
                  공정
                </th>
                <th scope="col" className="w-[30%] py-3 pr-4 text-label font-semibold text-wk-ink">
                  소요 기간
                </th>
                <th scope="col" className="py-3 text-label font-semibold text-wk-ink">
                  담당
                </th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group">
              {SERVICE_STEPS.map((s) => (
                <tr
                  key={s.id}
                  className="block border-b border-wk-line py-5 md:table-row md:py-0"
                >
                  <th
                    scope="row"
                    className="block pb-3 text-left align-top md:table-cell md:py-5 md:pr-4"
                  >
                    <a
                      href={`#${s.id}`}
                      className="flex items-baseline gap-2.5 text-body-lg font-bold text-wk-ink transition-colors duration-state ease-state hover:text-wk-cta"
                    >
                      <span className="wk-metric text-label font-semibold text-wk-cta">
                        {s.no}
                      </span>
                      {s.title}
                    </a>
                  </th>

                  <td className="block py-1 align-top md:table-cell md:py-5 md:pr-4">
                    <span className="wk-cap mr-2 inline-block w-[5.5rem] md:hidden">
                      소요 기간
                    </span>
                    <span className="wk-metric text-label font-medium text-wk-ink2">
                      {s.duration}
                    </span>
                  </td>

                  <td className="block py-1 align-top md:table-cell md:py-5">
                    <span className="wk-cap mr-2 inline-block w-[5.5rem] md:hidden">담당</span>
                    <span className="text-label text-wk-ink2">{s.owner}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        <Reveal y={12}>
          <p className="wk-cap mt-6 max-w-[42rem] border-l-2 border-wk-line2 pl-3.5">
            표준 공정안 기준 전체 {TOTAL_DURATION}입니다. 확정 일정은 현장 실측 후
            견적서에 적습니다. 구조·전기 수치는 구조기술사와 전기 검토를 거쳐 확정되며,
            그 전 값은 초안으로 표기합니다.
          </p>
        </Reveal>

        {/* ── 상세 ──────────────────────────────────────────── */}
        <Reveal y={16}>
          <h3 className="wk-h3 mt-20 text-wk-ink">공정마다 실제로 하는 일</h3>
          <p className="wk-body mt-3">
            항목을 누르면 그 공정에서 저희가 무엇을 하는지 펼쳐집니다.
          </p>
        </Reveal>

        <div className="mt-8 border-t border-wk-line">
          {SERVICE_STEPS.map((s, i) => (
            <details
              key={s.id}
              id={s.id}
              open={i === 0}
              className="group scroll-mt-24 border-b border-wk-line"
            >
              <summary className="flex cursor-pointer list-none items-center gap-3 py-5 text-wk-ink transition-colors duration-state ease-state hover:text-wk-cta [&::-webkit-details-marker]:hidden">
                <span className="wk-metric text-label font-semibold text-wk-cta">{s.no}</span>
                <span className="text-body-lg font-bold">{s.title}</span>
                <ChevronDown
                  size={20}
                  aria-hidden="true"
                  className="ml-auto shrink-0 text-wk-ink3 transition-transform duration-state ease-state group-open:rotate-180"
                />
              </summary>

              <div className="grid gap-6 pb-9 md:grid-cols-12 md:gap-8">
                {s.image ? (
                  <div className="md:col-span-5">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-card-m bg-wk-bg">
                      <Image
                        src={s.image}
                        alt={s.alt ?? ''}
                        fill
                        sizes="(min-width: 768px) 38vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ) : null}

                <div className={s.image ? 'md:col-span-7' : 'md:col-span-9'}>
                  <p className="wk-body">{s.body}</p>

                  <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    <div>
                      <dt className="wk-cap">소요 기간</dt>
                      <dd className="wk-metric mt-1 text-label font-semibold text-wk-ink">
                        {s.duration}
                      </dd>
                    </div>
                    <div>
                      <dt className="wk-cap">담당</dt>
                      <dd className="mt-1 text-label font-semibold text-wk-ink">{s.owner}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
