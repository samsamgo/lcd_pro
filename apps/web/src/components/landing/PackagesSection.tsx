import Link from 'next/link'
import { Check } from 'lucide-react'

const PACKAGES = [
  {
    tier: 'basic',
    name: '베이직',
    tagline: '하드웨어 + 설치만',
    monthlyNote: null,
    features: [
      'LED 패널 + 컨트롤러 + 전원',
      '프레임 + 설치 노무',
      '초기 설정 지원',
    ],
    missing: ['CMS 원격 관리', '콘텐츠 설정', '보증 기간', '정기 점검'],
    recommended: false,
    cta: '베이직으로 시작',
  },
  {
    tier: 'standard',
    name: '스탠다드',
    tagline: '가장 많이 선택하는 플랜',
    monthlyNote: 'CMS 월 구독 별도',
    features: [
      'LED 패널 + 컨트롤러 + 전원',
      '프레임 + 설치 노무',
      '콘텐츠 초기 설정',
      '원격 CMS 관리',
      '1년 하드웨어 보증',
      '원격 모니터링',
    ],
    missing: ['예비 부품 제공', '월별 현장 점검', '긴급 AS 우선 처리'],
    recommended: true,
    cta: '스탠다드 견적 받기',
  },
  {
    tier: 'premium',
    name: '프리미엄',
    tagline: '무중단 운영이 필요한 매장',
    monthlyNote: 'CMS + 점검 구독 포함',
    features: [
      '스탠다드 전체 포함',
      '예비 부품 제공',
      '월 1회 현장 점검',
      '긴급 AS 우선 처리 (24h)',
      '2년 하드웨어 보증',
      '콘텐츠 제작 지원 (월 2회)',
    ],
    missing: [],
    recommended: false,
    cta: '프리미엄 견적 받기',
  },
]

export function PackagesSection() {
  return (
    <section id="packages" className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            패키지
          </p>
          <h2 className="text-4xl font-bold sm:text-5xl">
            목적에 맞게 선택하세요
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.tier}
              className={`relative flex flex-col rounded-2xl p-6 ${
                pkg.recommended
                  ? 'border border-blue-500/50 bg-blue-600/5 glow'
                  : 'glass'
              }`}
            >
              {pkg.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                    추천
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                <p className="mt-1 text-sm text-zinc-500">{pkg.tagline}</p>
                {pkg.monthlyNote && (
                  <p className="mt-2 text-xs text-blue-400">{pkg.monthlyNote}</p>
                )}
              </div>

              <ul className="mb-6 flex-1 space-y-2.5">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <Check size={15} className="mt-0.5 shrink-0 text-blue-400" />
                    {f}
                  </li>
                ))}
                {pkg.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-600 line-through">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-zinc-700" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/quote"
                className={`block rounded-xl py-3 text-center text-sm font-semibold transition-all active:scale-95 ${
                  pkg.recommended
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                }`}
              >
                {pkg.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* 렌탈 카드 */}
        <div className="mt-5 glass rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-white">렌탈 플랜</h3>
            <p className="mt-1 text-sm text-zinc-500">
              이벤트·팝업·전시용 임시 설치. 설치 + 철거 포함. 기간 협의.
            </p>
          </div>
          <Link
            href="/quote?type=rental"
            className="shrink-0 rounded-xl border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-all"
          >
            렌탈 문의
          </Link>
        </div>
      </div>
    </section>
  )
}
