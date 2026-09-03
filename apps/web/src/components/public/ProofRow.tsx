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
    title: '설계부터 A/S까지 한 창구',
    desc: '실측한 사람이 도면을 그리고, 설치한 사람이 A/S를 받습니다. 단계마다 업체가 바뀌어 책임이 흩어지지 않습니다.',
  },
  {
    icon: ShieldCheck,
    label: '적합성평가',
    title: 'KC 적합등록 · 인증 서류 제출',
    desc: '전원공급장치 KC 적합등록을 마쳤습니다. 납품 시 해당 제품의 인증 서류를 견적서와 함께 제출합니다.',
    foot: '적합등록번호 TA-2607130 · TA-2607131',
  },
  {
    icon: FileText,
    label: '검토 자료',
    title: '제품 규격서 · 설치 도면 제공',
    desc: '실측 후 확정 견적과 함께 제품 규격서, 설치 도면(기존 구조물·지상고·취부 상세 포함)을 문서로 드립니다.',
    foot: '결재·시방 첨부용',
  },
  {
    icon: Wrench,
    label: '유지보수',
    title: '모듈 단위 A/S',
    desc: '장애 시 화면 전체를 해체하지 않고 해당 모듈만 교체합니다. 처리 내역은 문서로 제출해 검수·감사 자료로 쓰실 수 있습니다.',
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
