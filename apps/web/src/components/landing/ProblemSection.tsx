import { AlertTriangle } from 'lucide-react'

const PROBLEMS = [
  {
    title: '견적이 느리고 불투명',
    desc: '업체마다 다른 가격, 전화해야만 받을 수 있는 견적. 비교도 어렵고 기다리기도 힘들다.',
  },
  {
    title: '설치 후 관리가 막막',
    desc: '콘텐츠 수정하려면 업체에 연락해야 하고, AS는 언제 올지도 모른다.',
  },
  {
    title: '기술 용어가 너무 어려움',
    desc: 'P3? P4? 피치? 니트? 컨트롤러? 고객이 이해해야 할 이유가 없다.',
  },
  {
    title: '유지보수가 불안정',
    desc: '설치 업체가 폐업하면 끝. 정기 점검 개념 자체가 없는 시장.',
  },
]

export function ProblemSection() {
  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            문제 인식
          </p>
          <h2 className="text-4xl font-bold sm:text-5xl">
            왜 LED 전광판 설치가
            <br />
            <span className="text-zinc-500">이렇게 복잡했을까?</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="glass rounded-2xl p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                  <AlertTriangle size={16} className="text-red-400" />
                </div>
                <h3 className="font-semibold text-white">{p.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-zinc-500">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-8 text-center">
          <p className="text-xl font-semibold text-white">
            LCD PRO는 이 모든 문제를{' '}
            <span className="text-gradient">하나의 플랫폼</span>으로 해결합니다.
          </p>
        </div>
      </div>
    </section>
  )
}
