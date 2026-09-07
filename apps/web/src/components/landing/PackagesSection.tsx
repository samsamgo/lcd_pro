import Link from 'next/link'
import { Check } from 'lucide-react'

/**
 * 구성 패키지 3종.
 *
 * 🔴 2026-09-07 CEO 지시 — 날조 문구 제거.
 *    `tagline: '가장 많이 선택하는 플랜'` 이 스탠다드에 붙어 있었다.
 *    **우강테크는 첫 수주 전이다. 아무도 선택한 적이 없다.**
 *    관공서 상대로 이런 표기는 실적 허위기재로 읽히고, 부정당업자 제재 사유다.
 *    같은 이유로 `추천` 배지도 근거가 사라졌다 — 고객 선택 빈도가 아니라
 *    **우리가 어느 구성을 기준선으로 삼는가** 라는 사실 표기(`기준 구성`)로 바꿨다.
 *
 * 🔴 이 자리에 실적·인기·만족도 성격의 문구를 다시 넣지 마라.
 *    "가장 많이", "인기", "베스트", "대부분의 고객이" — 전부 같은 종류다.
 *    대체가 필요하면 **그 구성이 무엇에 맞는 규격인지**(설치 환경·운영 조건)로 쓴다.
 */
const PACKAGES = [
  {
    tier: 'basic',
    name: '베이직',
    tagline: '하드웨어 + 설치만',
    note: null as string | null,
    features: [
      'LED 패널 + 컨트롤러 + 전원',
      '프레임 + 설치 노무',
      '초기 설정 지원',
    ],
    missing: ['콘텐츠 설정', '보증 기간', '정기 점검'],
    recommended: false,
    cta: '베이직으로 시작',
  },
  {
    tier: 'standard',
    name: '스탠다드',
    // 2026-09-07 '가장 많이 선택하는 플랜' → 사실 기반 규격 서술로 교체(위 주석 참조)
    tagline: '상시 운영하는 자리의 기준 구성',
    note: '콘텐츠 교체 방법 1:1 교육 포함',
    features: [
      'LED 패널 + 컨트롤러 + 전원',
      '프레임 + 설치 노무',
      '콘텐츠 초기 설정',
      '1년 하드웨어 보증',
    ],
    missing: ['예비 부품 제공', '정기 현장 점검', '긴급 AS 우선 처리'],
    recommended: true,
    cta: '스탠다드 견적 요청',
  },
  {
    tier: 'premium',
    name: '프리미엄',
    tagline: '중단 없이 운영해야 하는 기관',
    note: '콘텐츠 제작·운영까지 밀착 지원',
    features: [
      '스탠다드 전체 포함',
      '예비 부품 제공',
      '정기 현장 점검',
      '긴급 AS 우선 처리 (24h)',
      '2년 하드웨어 보증',
      '콘텐츠 제작 지원',
    ],
    missing: [],
    recommended: false,
    cta: '프리미엄 견적 요청',
  },
]

export function PackagesSection({ hideHeader = false }: { hideHeader?: boolean }) {
  return (
    <section id="packages" className="wk-sec scroll-mt-20 px-4">
      <div className="mx-auto max-w-5xl">
        {!hideHeader && (
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-wk-cta">
              패키지
            </p>
            <h2 className="text-4xl font-bold sm:text-5xl">
              목적에 맞게 선택하세요
            </h2>
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.tier}
              className={`relative flex flex-col rounded-2xl p-6 ${
                pkg.recommended
                  ? 'border border-wk-cta/50 bg-wk-cta/5 glow'
                  : 'glass'
              }`}
            >
              {pkg.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {/* 2026-09-07 '추천' → '기준 구성'.
                      '추천' 은 근거를 묻게 되는 말이다(누가 추천했나 = 고객인가 우리인가).
                      '기준 구성' 은 우리가 견적의 출발점으로 삼는 구성이라는 사실 서술이라
                      실적이 없어도 참이다. */}
                  <span className="rounded-full bg-wk-cta px-3 py-1 text-xs font-bold text-white">
                    기준 구성
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-wk-ink">{pkg.name}</h3>
                <p className="mt-1 text-sm text-wk-ink3">{pkg.tagline}</p>
                {pkg.note && (
                  <p className="mt-2 text-xs font-medium text-wk-cta">{pkg.note}</p>
                )}
              </div>

              <ul className="mb-6 flex-1 space-y-2.5">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-wk-ink2">
                    <Check size={15} className="mt-0.5 shrink-0 text-wk-cta" />
                    {f}
                  </li>
                ))}
                {pkg.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-wk-ink3 line-through decoration-wk-ink4">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-wk-bg" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/quote"
                className={`block rounded-xl py-3 text-center text-sm font-semibold transition-all active:scale-95 ${
                  pkg.recommended
                    ? 'bg-wk-cta text-white hover:bg-wk-blue'
                    : 'bg-wk-bg text-wk-ink2 hover:bg-wk-bg'
                }`}
              >
                {pkg.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* ── 렌탈(구독) 플랜 — 2026-09-07 CEO 지시로 **화면에서 걷어냈다** ──────────────
            CEO: "저 구독 플랜은 일단 접어두자."

            렌탈은 자금과 재고 조건이 잡혀야 파는 상품이다. 첫 수주 전에 내걸면
            문의가 들어와도 받을 수 없고, 받지 못할 문의를 받는 것이 가장 나쁘다.

            🔴 삭제가 아니라 보류다. 되살릴 때는 아래 블록의 주석을 풀고,
               ①대여 재고 ②철거·회수 동선 ③기간별 단가 세 가지가 정해졌는지 먼저 확인한다.
               `/quote?type=rental` 링크도 같이 되살아나야 한다.
            ⚠️ `lib/standardBlock.ts` 의 `special_shape` 주석에 있는 '렌탈' 은
               견적엔진 내부 값 설명이라 이 보류와 무관하다. 건드리지 말 것.

        <div className="mt-5 glass rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-wk-ink">렌탈 플랜</h3>
            <p className="mt-1 text-sm text-wk-ink3">
              이벤트·팝업·전시용 임시 설치. 설치 + 철거 포함. 기간 협의.
            </p>
          </div>
          <Link
            href="/quote?type=rental"
            className="shrink-0 rounded-xl border border-wk-line2 px-6 py-3 text-sm font-semibold text-wk-ink2 hover:bg-wk-bg transition-all"
          >
            렌탈 문의
          </Link>
        </div>
        ────────────────────────────────────────────────────────────────────────── */}
      </div>
    </section>
  )
}
