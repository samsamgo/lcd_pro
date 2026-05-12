import { EyeOff, Eye, Phone, Smartphone, Wrench, Wifi } from 'lucide-react'

const COMPARISONS = [
  {
    icon: EyeOff,
    them: '가격 비공개\n"전화해야 알 수 있어요"',
    icon2: Eye,
    us: '범위 견적 즉시 공개\n₩200만 ~ ₩3,000만 기준표',
  },
  {
    icon: Phone,
    them: '전화 → 방문 → 1~2주 견적',
    icon2: Smartphone,
    us: '사진 3장 → 30분 내 견적',
  },
  {
    icon: Wrench,
    them: 'AS는 "연락해봐야 앎"\n파트너사가 폐업하면 끝',
    icon2: Wifi,
    us: '원격 모니터링\n24h 긴급 AS 구독 플랜',
  },
]

export function DifferentiatorSection() {
  return (
    <section className="py-20 px-4 bg-[#050505]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            차별화
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">
            기존 업체들이 하지 않는 것들
          </h2>
        </div>

        <div className="space-y-3">
          {COMPARISONS.map((c, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3">
              {/* 경쟁사 */}
              <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                  <c.icon size={14} className="text-zinc-500" />
                </div>
                <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-500">
                  {c.them}
                </p>
              </div>

              {/* vs */}
              <div className="flex items-center justify-center">
                <span className="text-xs font-bold text-zinc-700">VS</span>
              </div>

              {/* LCD PRO */}
              <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-600/5 p-4">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600/20">
                  <c.icon2 size={14} className="text-blue-400" />
                </div>
                <p className="whitespace-pre-line text-sm font-medium leading-relaxed text-zinc-200">
                  {c.us}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 시장 데이터 */}
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6">
          <p className="text-center text-xs text-zinc-600">
            한국 디지털 옥외광고 시장 <strong className="text-zinc-400">1조 6,634억원</strong> (2024, +10.4% YoY) —
            성장하는 시장에서 가장 빠른 견적 플랫폼이 먼저 점유합니다.
          </p>
        </div>
      </div>
    </section>
  )
}
