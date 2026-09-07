import { Zap, Building2, FileCheck, Wrench } from 'lucide-react'

import { Reveal, RiseMask, Stagger } from '@/components/motion'

/**
 * 설치 자리와 무관하게 걸리는 것.
 *
 * 왜 만들었나 — 사례 카드는 "무엇을 띄우나"만 말한다.
 * 그런데 실제로 일정이 밀리는 지점은 시설과 상관없이 늘 같은 넷이다.
 * 전기 용량, 붙일 자리, 신고 대상 여부, 정비 접근.
 * 이건 계약 전에 알면 준비되고, 계약 후에 알면 공사가 멈춘다.
 *
 * ⚠️ 여기 적는 것은 "우리가 해준다"가 아니라 "미리 보셔야 한다"다.
 *    아직 없는 서류나 자격을 약속하지 않는다.
 */

const CHECKS = [
  {
    icon: Zap,
    title: '전기 용량',
    body: '기존 회로가 화면 소비전력을 감당하는지 봅니다. 모자라면 증설 공사가 별도로 붙고, 이게 일정을 가장 많이 밀어냅니다.',
  },
  {
    icon: Building2,
    title: '붙일 자리',
    body: '기존 벽이나 기둥을 쓸 수 있는지, 지주를 새로 세워야 하는지에 따라 금액이 크게 갈립니다. 옥외 대형은 구조 검토가 따로 필요할 수 있습니다.',
  },
  {
    icon: FileCheck,
    title: '신고 대상 여부',
    body: '옥외 설치는 지자체 옥외광고물 신고 대상일 수 있습니다. 지역과 규격에 따라 다르니 실측 단계에서 함께 확인합니다.',
  },
  {
    icon: Wrench,
    title: '정비 접근',
    body: '화면 뒤로 사람이 들어갈 수 있는지에 따라 앞에서 정비하는 구조로 갈지가 정해집니다. 나중에 바꾸려면 화면을 다시 떼야 합니다.',
  },
]

export function IndustryChecks() {
  return (
    <section aria-labelledby="ind-checks-h" className="wk-sec bg-wk-bgFaint">
      <div className="wk-wrap">
        <Reveal y={10}>
          <p className="wk-eyebrow">시설과 무관하게</p>
        </Reveal>
        <RiseMask delay={0.06}>
          <h2 id="ind-checks-h" className="wk-h2 text-wk-ink">
            네 가지에서 일정이 갈립니다
          </h2>
        </RiseMask>
        <Reveal y={14} delay={0.16}>
          <p className="wk-lead mt-5">
            어느 기관이든 막히는 지점은 비슷합니다. 계약 전에 보면 준비할 수 있고,
            계약 후에 알면 공사가 멈춥니다.
          </p>
        </Reveal>

        <Stagger
          className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-wk-line bg-wk-line sm:grid-cols-2 lg:grid-cols-4"
          y={12}
          gap={0.06}
        >
          {CHECKS.map((c) => {
            const Icon = c.icon
            return (
              <div key={c.title} className="wk-hov-cell bg-white p-6">
                <Icon size={22} strokeWidth={1.8} className="text-wk-blue" aria-hidden="true" />
                <p className="mt-4 text-body-lg font-semibold text-wk-ink">{c.title}</p>
                <p className="wk-cap mt-2 leading-relaxed !text-wk-ink3">{c.body}</p>
              </div>
            )
          })}
        </Stagger>
      </div>
    </section>
  )
}
