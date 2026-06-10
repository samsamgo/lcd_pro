import { Camera, FileText, Truck, Monitor } from 'lucide-react'

const STEPS = [
  {
    icon: Camera,
    step: '01',
    title: '사진 3장 + 정보 입력',
    desc: '매장 전경, 설치 위치, 원하는 크기. 기술 지식 없어도 됩니다.',
    duration: '5분',
  },
  {
    icon: FileText,
    step: '02',
    title: '30분 내 범위 견적 수신',
    desc: '전기·구조·허가 조건에 따른 범위 견적. 카카오 또는 이메일로 발송.',
    duration: '30분',
  },
  {
    icon: Truck,
    step: '03',
    title: '현장 확인 → 최종 계약',
    desc: '파트너 기사가 현장 실사 후 정확한 금액 확정. 50% 계약금 후 자재 발주.',
    duration: '1~3일',
  },
  {
    icon: Monitor,
    step: '04',
    title: '설치 완료 → CMS 구독',
    desc: '스마트폰으로 콘텐츠 업로드·스케줄 관리. 원격 모니터링 + 정기 점검 포함.',
    duration: '월 구독',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
            진행 방식
          </p>
          <h2 className="text-4xl font-bold sm:text-5xl">4단계로 끝납니다</h2>
        </div>

        <div className="relative">
          {/* 연결선 (데스크탑) */}
          <div className="absolute left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] top-8 hidden h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent lg:block" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, step, title, desc, duration }) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20">
                  <Icon size={26} className="text-blue-600" />
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {step}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold text-zinc-900">{title}</h3>
                <p className="mb-3 text-sm leading-relaxed text-zinc-500">{desc}</p>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                  {duration}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
