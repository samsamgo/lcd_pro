import Image from 'next/image'
import { IMAGES } from '@/lib/imageAssets'
import { Reveal, SplitText } from '@/components/motion'
import { SITE } from '@/lib/seo/site'
import { HELD_CREDENTIALS } from './CompanySummary'

/**
 * 회사 소개 첫 화면 — 전면 다크, 사진 한 장 위 선언 한 줄.
 *
 * 2026-09-07 재설계. 이전 카피("LED 사이니지 한 가지만 합니다 / 품목을 늘리지 않고
 * 이것만 합니다")는 작다는 사실을 스스로 앞세우는 방어문이라 폐기했다.
 * 묻지도 않은 규모를 먼저 꺼내면 읽는 사람은 그것만 기억한다.
 *
 * 대신 두 가지만 말한다 — 무엇을 하는가(짓는다), 어디까지 하는가(네 공정).
 * 둘 다 이미 사이트 메타데이터에 적힌 사업 범위 문장이라 새로 지어낸 주장이 아니다.
 *
 * 하단 사실 띠 3칸은 전부 코드·등기에서 나온 값이다.
 *   설립      SITE.founded
 *   화소 간격  lib/standardBlock.ts(P1.86~P5) ∪ lib/products.ts(P2.5~P6)
 *   KC 적합등록 CompanySummary 의 HELD_CREDENTIALS 길이 — 목록이 늘면 숫자도 같이 는다
 * 실적·수상·고객사 같은 미확보 수치는 자리를 만들지 않는다.
 */

/** 취급 화소 간격 — 견적엔진 패밀리와 제품 카드에 실제로 존재하는 범위의 합집합 */
const PITCH_RANGE = 'P1.86 – P6'

export function CompanyHero() {
  const facts = [
    { k: '법인 설립', v: SITE.founded },
    { k: '취급 화소 간격', v: PITCH_RANGE },
    { k: 'KC 적합등록', v: `${HELD_CREDENTIALS.filter((c) => c.no.startsWith('TA-')).length}건` },
  ]

  return (
    <section
      data-wk-dark-hero
      className="relative flex min-h-[86svh] items-end overflow-hidden bg-wk-night lg:min-h-[92svh]"
    >
      <div className="wk-grain absolute inset-0" aria-hidden="true">
        <Image
          src={IMAGES.company.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_50%] lg:object-center"
        />
        {/* 문구가 하단 전폭에 깔리므로 하단 스크림을 쓴다. 전면 검정 오버레이 금지(설계계약서 §3) */}
        <div className="wk-scrim-b absolute inset-0" />
      </div>

      <div className="relative z-10 w-full pb-14 pt-32 md:pb-20 lg:pb-24">
        <div className="wk-wrap">
          <Reveal y={0} duration={0.7}>
            <p className="text-label font-semibold uppercase tracking-widest text-wk-blue">
              회사 소개
            </p>
          </Reveal>

          <SplitText
            as="h1"
            text="관공서와 학교의 화면을 짓습니다"
            className="wk-hero mt-6 text-wk-nightInk"
            delay={0.1}
          />

          <Reveal delay={0.34} y={18}>
            <p className="wk-lead mt-7 !text-wk-nightMuted">
              설계 · 제작 · 시공 · 유지보수. 네 공정을 한 회사가 맡습니다.
            </p>
          </Reveal>

          <Reveal delay={0.46} y={14}>
            <dl className="mt-12 grid gap-5 border-t border-white/15 pt-6 sm:grid-cols-3 sm:gap-8 md:mt-16">
              {facts.map((f) => (
                <div key={f.k}>
                  <dt className="text-caption font-medium uppercase tracking-widest text-wk-nightMuted">
                    {f.k}
                  </dt>
                  <dd className="wk-metric mt-1.5 text-h3 font-semibold text-wk-nightInk">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
