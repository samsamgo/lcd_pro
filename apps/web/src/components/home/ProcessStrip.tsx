import Link from 'next/link'

import { SITE } from '@/lib/seo/site'
import { Reveal, RiseMask, Stagger } from '@/components/motion'

/**
 * 홈 — 도입 절차 4단계. 제품 격자 다음, 푸터 앞.
 *
 * 🔴 2026-09-08 2차 신설. 홈이 제품 격자에서 곧바로 푸터로 떨어져 끝이 없었다.
 *    국내 시공 업체 홈은 예외 없이 "문의 → 실측 → 제작·시공 → A/S" 절차 띠로 닫는다
 *    (벤치마크 2026-09-08 §B-1 "원스톱 프레이밍"). 그리고 이 4단계는 홈의 HowTo JSON-LD 에
 *    이미 실려 있었는데 **화면에는 없었다** — 검색엔진에만 말하고 사람에게는 안 보여준 셈이다.
 *    이 배열이 JSON-LD 와 화면 양쪽의 단일 원본이다(page.tsx 가 같은 배열을 읽는다).
 *
 * ⚠️ 이것은 홈 하단 '문의 칸'(CtaSection)이 아니다 — CEO 가 2026-09-08 홈에서 뺀 것은
 *    큰 활자 + 버튼 두 개짜리 다크 배너였다. 여기는 절차를 설명하는 밝은 띠이고, 버튼 대신
 *    전화번호 한 줄과 '설치 과정 자세히' 링크만 둔다. 같은 요청을 세 번 하지 않는다.
 * ⚠️ 기간·건수 같은 실적 숫자는 넣지 않는다. 상세 공정(6단계·기간)은 /about#process 가 정본이다.
 */
export const HOME_STEPS: { name: string; text: string }[] = [
  { name: '문의·상담', text: '설치 장소와 용도를 알려주시면 개략 견적 범위를 잡아 연락드립니다.' },
  { name: '현장 실측', text: '보는 거리, 전기 인입, 붙일 면의 구조를 직접 재고 확정 견적을 냅니다.' },
  { name: '제작·시공', text: '조립해서 전부 켜 본 뒤 현장에 올립니다. 기관 일정에 맞춰 설치합니다.' },
  { name: '교육·A/S', text: '화면 바꾸는 법을 담당자분께 알려드리고, 고장은 모듈 한 장 단위로 고칩니다.' },
]

export function ProcessStrip() {
  const tel = SITE.phone.replace(/[^+\d]/g, '')
  return (
    <section aria-labelledby="steps-h" className="wk-sec border-t border-wk-line bg-wk-bgFaint">
      <div className="wk-wrap">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal y={10}>
              <p className="wk-eyebrow">진행 순서</p>
            </Reveal>
            <h2 id="steps-h" className="wk-h2 text-wk-ink">
              <RiseMask delay={0.06}>문의부터 A/S까지 네 단계</RiseMask>
            </h2>
          </div>
          <Reveal y={10} delay={0.12}>
            <Link
              href="/about#process"
              className="text-label font-semibold text-wk-cta underline-offset-4 hover:underline"
            >
              공정별 기간·담당 자세히 →
            </Link>
          </Reveal>
        </div>

        <Stagger
          className="mt-10 grid grid-cols-1 border-t-2 border-wk-ink sm:grid-cols-2 lg:grid-cols-4"
          y={12}
          gap={0.06}
        >
          {HOME_STEPS.map((s, i) => (
            <div
              key={s.name}
              className={`flex flex-col py-7 lg:pr-6 ${i > 0 ? 'border-t border-wk-line lg:border-t-0 lg:border-l lg:pl-6' : ''} ${
                i % 2 === 1 ? 'sm:border-l sm:pl-6' : ''
              } ${i >= 2 ? 'sm:border-t' : 'sm:border-t-0'}`}
            >
              <span className="wk-metric text-caption font-semibold text-wk-cta">0{i + 1}</span>
              <p className="mt-2 text-h3 font-bold leading-tight tracking-[-0.01em] text-wk-ink">{s.name}</p>
              <p className="mt-3 text-label leading-relaxed text-wk-ink3">{s.text}</p>
            </div>
          ))}
        </Stagger>

        <Reveal y={10} delay={0.1}>
          <p className="mt-8 border-t border-wk-line pt-5 text-label text-wk-ink3">
            전화로 물어보셔도 됩니다.{' '}
            <a href={`tel:${tel}`} className="wk-metric font-semibold text-wk-ink underline-offset-4 hover:underline">
              {SITE.phone}
            </a>
            <span className="ml-2 text-caption">({SITE.openingHours})</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
