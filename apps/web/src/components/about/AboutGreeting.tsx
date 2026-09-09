import Image from 'next/image'

import { IMAGES } from '@/lib/imageAssets'
import { SITE } from '@/lib/seo/site'
import { Reveal, RevealImage, RiseMask } from '@/components/motion'

/**
 * 인사말 — 회사소개의 첫 장.
 *
 * 🔴 2026-09-09 CEO 지시 "회사 소개 페이지부터 다 마음에 안 든다. 처음부터 재설계.
 *    회사 개요를 케이시스·온빛전자처럼 멋있게."
 *    온빛전자 인사말(상단 큰 현장 사진 → '○○ 홈페이지를 방문해 주셔서 감사합니다' →
 *    3문단 → 서명)과 케이시스 CEO 인사말(대표 서명 + 사람 말투)을 섞은 구성이다.
 *
 * 구성 규칙
 *  · 사진은 **캡션이 붙지 않는 장면 층**이다. 우리 시공 실적으로 읽히는 문구를 달지 않는다.
 *    (`IMAGES.company.chapter2` = 국내 관공서 로비 취부 장면. AI 연출컷이다 — 2026-09-09
 *     원본을 열어 확인했고, 그래서 alt 도 '장면' 으로만 적는다.)
 *  · 회사명만 주황(`text-wk-cta`). 나머지는 검정이다. 온빛전자와 같은 처리다.
 *  · 🔴 **대표 사진 자리는 비워 둔다.** 실물 사진이 없다. 얼굴 없는 실루엣·아이콘·이니셜
 *    원형을 대신 넣지 마라 — 없는 사람을 만든 것처럼 보인다. 이름만 적는다.
 *  · 문단에는 실적 수치가 없다. 확인되는 사실(공장·등록·KC)만 말한다.
 */
const PARAGRAPHS = [
  '저희는 대전 대덕구에 공장을 두고 LED 전광판과 전자현수막을 만드는 회사입니다. 화면 크기를 정하는 일부터 캐비닛을 짜고, 현장에 달고, 몇 해 뒤 모듈 한 장을 갈아 끼우는 일까지 한 회사가 끝까지 맡습니다. 중간에 다른 업체로 넘기지 않습니다.',
  '전광판은 사고 나서가 더 깁니다. 그래서 저희는 정보통신공사업 등록업체로 직접 시공하고, 전원장치처럼 안전에 걸리는 부품은 KC 적합등록을 받은 것만 씁니다. 서류로 확인되지 않는 것은 약속하지 않습니다.',
  '아직 큰 회사는 아닙니다. 대신 전화를 받는 사람이 현장을 아는 사람입니다. 화면 한 장을 놓고 고민하고 계시다면 편하게 연락 주십시오. 자리와 조건만 알려주시면 저희가 보고 말씀드리겠습니다.',
]

export function AboutGreeting() {
  return (
    <section aria-labelledby="greeting-h" className="wk-sec bg-white">
      {/* 상단 큰 현장 사진 — 본문 폭보다 넓게 깔아 첫 장의 무게를 만든다 */}
      <RevealImage className="wk-wrap-wide">
        <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-wk-ink md:aspect-[21/9]">
          <Image
            src={IMAGES.company.chapter2}
            alt="공공시설 로비 벽면 프레임에 LED 캐비닛을 한 장씩 붙여 나가는 작업 장면"
            fill
            priority={false}
            sizes="(max-width: 1440px) 100vw, 1440px"
            quality={82}
            className="object-cover"
          />
        </div>
      </RevealImage>

      <div className="wk-wrap mt-12 md:mt-16">
        <Reveal y={10}>
          <p className="wk-eyebrow">인사말</p>
        </Reveal>

        <h2 id="greeting-h" className="wk-h2 max-w-[22ch] text-wk-ink">
          <RiseMask delay={0.06}>
            <span className="text-wk-cta">{SITE.nameKo}</span> 홈페이지를
          </RiseMask>
          <RiseMask delay={0.14}>방문해 주셔서 감사합니다</RiseMask>
        </h2>

        <div className="mt-9 grid gap-x-12 gap-y-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {PARAGRAPHS.map((p, i) => (
              <Reveal key={i} y={16} delay={0.06 * i}>
                <p className="wk-body mt-5 max-w-[40em] first:mt-0 leading-[1.9]">{p}</p>
              </Reveal>
            ))}

            {/* 서명 — 대표 사진 자리는 비워 둔다(실물 없음). 이름과 직함만 */}
            <Reveal y={14} delay={0.24}>
              <p className="mt-10 border-t border-wk-line pt-7 text-body text-wk-ink3">
                {SITE.legalName}{' '}
                <span className="ml-1 text-body-lg font-bold text-wk-ink">
                  대표이사 {SITE.ceoName}
                </span>
              </p>
            </Reveal>
          </div>

          {/* 우측 — 인사말이 근거로 든 사실만 짧게. 숫자가 아니라 자격이다 */}
          <Reveal className="lg:col-span-4" y={18} delay={0.12}>
            <dl className="rounded-card border border-wk-line bg-wk-bgFaint px-6 py-7">
              {[
                ['공장', '대전 대덕구 자체 공장 (공장등록)'],
                ['시공', '정보통신공사업 등록업체'],
                ['부품', 'KC 적합등록 전원장치'],
                ['연구', '연구개발전담부서 인정'],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4 border-b border-wk-line py-3.5 first:pt-0 last:border-b-0 last:pb-0">
                  <dt className="w-12 shrink-0 text-label font-semibold text-wk-cta">{k}</dt>
                  <dd className="text-label leading-relaxed text-wk-ink2">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
