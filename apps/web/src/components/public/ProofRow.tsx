import Link from 'next/link'
import { FileText, Hammer, ShieldCheck, Wrench } from 'lucide-react'

import { Stagger } from '@/components/motion'

/**
 * 신뢰 스트립 — 히어로 바로 다음.
 *
 * ⚠️ 우강테크는 아직 첫 수주 전이다. 실적 숫자·고객 로고· "만족도 99%" 를 쓰지 않는다.
 *    (설계계약서 §0-7, 벤치마크 §6 안티패턴 7·15)
 *    여기에는 지금 이 순간 문서로 확인되는 사실만 넣는다.
 *
 * KC 표기에 대해 — "전 제품 KC 인증" 이라고 단정하지 않는다.
 * 전원공급장치 2건은 적합등록을 마쳤고(TA-2607130 / TA-2607131),
 * 전광판 완제품은 등록 절차 진행 중이다. 관공서 상대의 인증 허위 표기는
 * 부정당업자 제재 사유다. 상태를 그대로 적는 편이 결재 문서에도 안전하다.
 */
const PROOFS = [
  {
    icon: Hammer,
    label: '공급 구조',
    title: '중간에 사람이 바뀌지 않습니다',
    desc: '실측한 사람이 도면을 그리고, 설치한 사람이 A/S까지 맡습니다.',
  },
  {
    icon: ShieldCheck,
    label: '적합성평가',
    title: '어디까지 인증됐는지 그대로 씁니다',
    desc: '전원공급장치 두 종은 우강테크 이름으로 적합등록을 마쳤습니다. 전광판 본체는 아직 진행 중입니다. 납품할 때 그 시점 상태를 서류에 그대로 적습니다.',
    foot: '전원공급장치 적합등록 TA-2607130 · TA-2607131',
  },
  {
    icon: FileText,
    label: '검토 자료',
    title: '도면에 현장을 같이 그립니다',
    desc: '실측하고 나면 확정 견적과 함께 규격서, 설치 도면을 드립니다. 도면에는 붙일 벽이나 기둥, 바닥에서 몇 미터인지, 어떻게 고정하는지까지 들어갑니다.',
    foot: '결재나 시방서에 그대로 붙이실 수 있습니다',
  },
  {
    icon: Wrench,
    label: '유지보수',
    title: '모듈 단위 A/S',
    desc: '화면을 통째로 뜯지 않습니다. 문제 있는 모듈만 빼서 갈아 끼웁니다. 처리 내역은 문서로 드리니 검수나 감사 때 그대로 쓰시면 됩니다.',
  },
]

export function ProofRow() {
  return (
    <section aria-labelledby="proof-h" className="wk-sec-sm bg-white">
      <div className="wk-wrap">
        <h2 id="proof-h" className="sr-only">
          우강테크가 문서로 확인해 드리는 사실
        </h2>

        {/* 로고 도배 대신, 검증 가능한 사실 4개. 깊이는 그림자가 아니라 경계선으로 만든다 */}
        <Stagger
          className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-wk-line bg-wk-line sm:grid-cols-2 lg:grid-cols-4"
          y={12}
          gap={0.06}
        >
          {PROOFS.map((p) => (
            <div key={p.title} className="flex h-full flex-col bg-white p-6 lg:p-7">
              <p.icon size={20} strokeWidth={1.8} className="text-wk-blue" aria-hidden="true" />
              <p className="mt-4 text-caption font-semibold uppercase tracking-[0.14em] text-wk-ink3">
                {p.label}
              </p>
              <p className="mt-1.5 text-body-lg font-semibold text-wk-ink">{p.title}</p>
              <p className="mt-2.5 text-label leading-relaxed text-wk-ink3">{p.desc}</p>
              {p.foot && <p className="wk-cap mt-auto pt-4">{p.foot}</p>}
            </div>
          ))}
        </Stagger>

        <p className="wk-cap mt-4">
          위 내용은 문서로 확인 가능한 사실만 적었습니다. 근거 서류가 필요하시면{' '}
          <Link href="/support" className="font-semibold text-wk-cta underline underline-offset-4">
            고객센터
          </Link>
          로 요청해 주세요.
        </p>
      </div>
    </section>
  )
}
