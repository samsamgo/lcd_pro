import Image from 'next/image'
import { IMAGES } from '@/lib/imageAssets'
import { Reveal, SplitText } from '@/components/motion'
import { SITE } from '@/lib/seo/site'
import { PITCH_RANGE } from '@/lib/companyScope'
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
 *   화소 간격  lib/companyScope.ts 가 견적엔진 ∪ 제품 카탈로그에서 계산
 *   KC 적합등록 CompanySummary 의 HELD_CREDENTIALS 길이 — 목록이 늘면 숫자도 같이 는다
 * 실적·수상·고객사 같은 미확보 수치는 자리를 만들지 않는다.
 *
 * 2026-09-07 (2차) — CEO 지시 "LED 사이니지 그룹처럼".
 * ① 상단에 기관 문서식 표제 줄(회사 소개 / WOOKANG TECH + 가로 괘선)을 붙였다.
 *    큰 회사의 소개 페이지는 첫 줄에서 이미 "문서"의 형식을 갖춘다.
 * ② 사실 띠의 괘선을 wk-wrap 밖으로 빼 화면 폭을 가로지르게 했다.
 *    같은 내용이라도 선이 화면 끝까지 가면 판이 커 보인다. 띠는 화면 바닥에 붙인다.
 * ③ 손으로 박아 두었던 'P1.86 – P6' 문자열을 파생값으로 교체했다.
 *    카탈로그가 늘어도 문자열은 따라오지 않아 언젠가 반드시 틀린 값이 된다.
 */
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

      <div className="relative z-10 w-full pt-28 md:pt-32">
        <div className="wk-wrap">
          <Reveal y={0} duration={0.7}>
            <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-4">
              <p className="text-label font-semibold uppercase tracking-widest text-wk-blue">
                회사 소개
              </p>
              <p className="text-caption font-medium uppercase tracking-widest text-wk-nightMuted">
                {SITE.nameEn}
              </p>
            </div>
          </Reveal>

          <SplitText
            as="h1"
            text="관공서와 학교의 화면을 짓습니다"
            className="wk-hero mt-9 text-wk-nightInk md:mt-12"
            delay={0.1}
          />

          <Reveal delay={0.34} y={18}>
            <p className="wk-lead mt-7 !text-wk-nightMuted">
              설계 · 제작 · 시공 · 유지보수. 네 공정을 한 회사가 맡습니다.
            </p>
          </Reveal>
        </div>

        {/* 사실 띠 — 괘선이 화면 폭을 가로지른다. 안쪽 내용만 wk-wrap 을 따른다 */}
        <Reveal delay={0.46} y={14}>
          <div className="mt-14 border-t border-white/20 md:mt-20">
            <div className="wk-wrap">
              <dl className="grid gap-5 py-7 sm:grid-cols-3 sm:gap-8 md:py-9">
                {facts.map((f) => (
                  <div key={f.k}>
                    <dt className="text-caption font-medium uppercase tracking-widest text-wk-nightMuted">
                      {f.k}
                    </dt>
                    <dd className="wk-metric mt-2 text-h3 font-semibold text-wk-nightInk">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
