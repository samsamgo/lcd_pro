import { FileText, Hammer, ShieldCheck, Wrench } from 'lucide-react'

import { Stagger } from '@/components/motion'

/**
 * 신뢰 스트립 — 히어로 바로 다음.
 *
 * ⚠️ 우강테크는 아직 첫 수주 전이다. 실적 숫자·고객 로고· "만족도 99%" 를 쓰지 않는다.
 *    (설계계약서 §0-7, 벤치마크 §6 안티패턴 7·15)
 *    여기에는 지금 이 순간 문서로 확인되는 사실만 넣는다.
 *
 * 🔴 2026-09-07 CEO 지시("드리는 서류도 빼")로 '검토 자료' 카드에서
 *    "규격서, 설치 도면을 드립니다" 를 뺐다. 주지 않을 문서를 약속하지 않는다.
 *    같은 자리를 실제로 하는 일(현장에서 규격 확정)로 바꿨다.
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
    desc: '전원장치 두 종은 등록을 마쳤고, 전광판 본체는 진행 중입니다.',
    foot: '전원공급장치 적합등록 TA-2607130 · TA-2607131',
  },
  {
    icon: FileText,
    label: '규격 확정',
    title: '규격은 현장에서 확정합니다',
    desc: '바닥에서 몇 미터인지, 무엇에 붙일지, 전기를 어디서 끌어오는지를 보고 정합니다.',
    foot: '사진만 보고 규격을 정하지 않습니다',
  },
  {
    icon: Wrench,
    label: '유지보수',
    title: '모듈 단위 A/S',
    desc: '화면을 통째로 뜯지 않습니다. 문제 있는 모듈만 갈아 끼웁니다.',
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
            <div key={p.title} className="wk-hov-cell flex h-full flex-col bg-white p-6 lg:p-7">
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

        {/* 2026-09-07 CEO: "드리는 서류도 빼. 그런 거 안 줘."
            원래 "근거 서류가 필요하시면 고객센터로 요청해 주세요" 였다. 두 가지가 틀렸다 —
            ①주지 않을 서류를 준다고 약속했고 ②그 요청을 A/S 창구(/support)로 보냈다.
            등록번호는 발급 기관에서 직접 조회되므로 서류를 건네지 않아도 확인은 된다. */}
        <p className="wk-cap mt-4">
          위 내용은 발급 기관에서 직접 조회되는 사실만 적었습니다.
        </p>
      </div>
    </section>
  )
}
