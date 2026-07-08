import { Check, X, Minus } from 'lucide-react'

type Cell = { v: 'good' | 'bad' | 'mid'; t: string }
type Row = { label: string; banner: Cell; generic: Cell; wk: Cell }

const ROWS: Row[] = [
  {
    label: '콘텐츠 변경',
    banner: { v: 'bad', t: '매번 재제작·재인쇄' },
    generic: { v: 'mid', t: '업체 방문 요청' },
    wk: { v: 'good', t: '화면에서 즉시 교체' },
  },
  {
    label: '초기 비용',
    banner: { v: 'good', t: '낮음' },
    generic: { v: 'mid', t: '업체별 편차 큼' },
    wk: { v: 'mid', t: '설치비 200만원~ · 범위 견적' },
  },
  {
    label: '누적 비용(1년+)',
    banner: { v: 'bad', t: '교체마다 반복 지출' },
    generic: { v: 'mid', t: '추가 시공비 발생' },
    wk: { v: 'good', t: '추가 인쇄비 없음' },
  },
  {
    label: '가격 투명성',
    banner: { v: 'mid', t: '건별 견적' },
    generic: { v: 'bad', t: '실측 후 추가비 잦음' },
    wk: { v: 'good', t: '예상 범위 + 면책 사전 공개' },
  },
  {
    label: '설치 기간',
    banner: { v: 'good', t: '당일~1일' },
    generic: { v: 'mid', t: '수일~비정형' },
    wk: { v: 'good', t: '표준 모델 1~3일' },
  },
  {
    label: '사후관리(AS)',
    banner: { v: 'bad', t: '해당 없음' },
    generic: { v: 'bad', t: '보증·응답 불명확' },
    wk: { v: 'good', t: '모듈 교체 · 보증 1~2년' },
  },
  {
    label: '야간·원거리 가시성',
    banner: { v: 'bad', t: '조명 필요·저하' },
    generic: { v: 'mid', t: '제품 편차' },
    wk: { v: 'good', t: '고밝기 LED로 확보' },
  },
]

const ICON = {
  good: <Check size={15} className="shrink-0 text-blue-600" />,
  bad: <X size={15} className="shrink-0 text-zinc-400" />,
  mid: <Minus size={15} className="shrink-0 text-amber-500" />,
}

export function ComparisonSection() {
  return (
    <section id="compare" className="scroll-mt-20 bg-zinc-50 py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
            비교
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">현수막·일반 시공과 무엇이 다른가</h2>
          <p className="mt-3 text-zinc-600">
            우강테크는 <strong>표준화</strong>로 가격·기간·AS의 불확실성을 줄입니다.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white text-sm">
            <caption className="sr-only">현수막, 일반 LED 시공, 우강테크 표준 시공 비교표</caption>
            <thead>
              <tr>
                <th scope="col" className="bg-white px-5 py-4 text-left font-semibold text-zinc-500">
                  항목
                </th>
                <th scope="col" className="bg-white px-5 py-4 text-left font-semibold text-zinc-600">
                  현수막·간판
                </th>
                <th scope="col" className="bg-white px-5 py-4 text-left font-semibold text-zinc-600">
                  일반 LED 시공
                </th>
                <th scope="col" className="bg-blue-600/5 px-5 py-4 text-left font-bold text-blue-700">
                  우강테크 표준
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={r.label} className={i % 2 ? 'bg-zinc-50/60' : 'bg-white'}>
                  <th scope="row" className="px-5 py-4 text-left font-semibold text-zinc-800">
                    {r.label}
                  </th>
                  {([r.banner, r.generic] as Cell[]).map((c, j) => (
                    <td key={j} className="px-5 py-4 align-top text-zinc-600">
                      <span className="flex items-start gap-2">
                        {ICON[c.v]}
                        {c.t}
                      </span>
                    </td>
                  ))}
                  <td className="bg-blue-600/[0.04] px-5 py-4 align-top font-medium text-zinc-800">
                    <span className="flex items-start gap-2">
                      {ICON[r.wk.v]}
                      {r.wk.t}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500">
          * 비교는 일반적인 시장 상황을 바탕으로 한 설명이며, 실제 조건·업체에 따라 다를 수 있습니다.
        </p>
      </div>
    </section>
  )
}
