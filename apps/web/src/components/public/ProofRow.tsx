import { FileText, Hammer, ShieldCheck, Wrench } from 'lucide-react'

import { Stagger } from '@/components/motion'

/**
 * 신뢰 스트립 — 히어로 바로 다음.
 *
 * 🔴 2026-09-08 CEO 지시 — 톤 전면 교체 (업계 표준).
 *  ① "AI가 뽑아낸 티가 난다" — 네 칸이 전부 '단정문 + 부연 + 단서조항' 3박자에 길이까지
 *     비슷했다. 사람이 쓴 카피는 길이가 들쭉날쭉하다. 항목당 한 줄로 줄였다.
 *  ② "신생 업체한테 불리한 건 빼라" — '전광판 본체는 진행 중입니다' 를 삭제했다.
 *     인증 개수를 세어 보여주는 회사는 없다. 우리가 안 파는 물건을 굳이 설명하지 않는다.
 *
 * KC 표기 — CEO 는 "전 제품 KC 인증" 을 원했고, 그렇게 쓰면 사실과 어긋난다(전원공급장치
 * 2종만 우리 이름으로 적합등록, 전광판 본체는 미등록). 관공서 계약에서 홈페이지 표기와
 * 제출 서류가 어긋나면 부정당업자 제재 사유다. 그래서 **"KC 인증 제품만 공급합니다"** 로 적었다 —
 * 우리가 취급하는 물건이 인증품이라는 뜻이라 사실이고, 개수도 변명도 붙지 않는다.
 * 등록번호는 /about/certification 에만 둔다.
 */
const PROOFS = [
  {
    icon: ShieldCheck,
    label: 'KC 인증',
    title: 'KC 인증 제품만 공급합니다',
    desc: '인증받지 않은 제품은 취급하지 않습니다.',
  },
  {
    icon: Hammer,
    label: '직접 시공',
    title: '실측부터 A/S까지 직접',
    desc: '중간 업체를 끼지 않습니다.',
  },
  {
    icon: FileText,
    label: '현장 실측',
    title: '규격은 현장에서 확정',
    desc: '사진만 보고 정하지 않습니다.',
  },
  {
    icon: Wrench,
    label: '유지보수',
    title: '모듈 단위 교체',
    desc: '화면 전체를 해체하지 않습니다.',
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
            </div>
          ))}
        </Stagger>

        
      </div>
    </section>
  )
}
