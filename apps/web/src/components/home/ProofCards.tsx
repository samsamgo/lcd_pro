import Link from 'next/link'
import { BadgeCheck, FileCheck2, FlaskConical } from 'lucide-react'

import { Reveal, RiseMask, Stagger } from '@/components/motion'

/**
 * 홈 — 서류로 증명하는 카드 3장. 케이시스 홈의 'KSYS Performance / 숫자로 증명합니다'
 * 자리를 그대로 가져오되, **숫자는 쓰지 않는다.**
 *
 * 🔴 2026-09-09 신설 (재설계 브리프 §2·§4).
 *    케이시스는 여기에 23Years / 1,700+ / 150+ 를 큰 활자로 박는다. 우리는 그 숫자가 없다.
 *    없는 숫자를 지어내면 그 자리가 곧 폐기 사유다. 그래서 **큰 활자 자리를 서류 이름으로
 *    바꿨다** — 연차·건수 대신 '무엇을 등록·인정받았는가' 를 같은 크기로 말한다.
 *    숫자가 생기면(시공 실적이 쌓이면) 이 배열에 항목을 더하는 것이 아니라 그때 다시 설계한다.
 *
 * 🔴 값은 전부 실물 서류다(브리프 §4 표). 번호·발급기관·날짜를 임의로 고치지 마라.
 *      정보통신공사업등록증        대전광역시           제420573호           2026-08-25
 *      방송통신기자재 적합등록     국립전파연구원       R-R-WKTC-LH-200-5P   2026-08-10
 *      연구개발전담부서 인정서       한국산업기술진흥협회 제2026155618호      2026-08-21
 *
 * 🔴 KC 표기 주의 — 적합등록을 받은 것은 **직류전원장치(SMPS, LH-200-5P)** 이지 전광판 본체가
 *    아니다. "전 제품 KC 인증" 처럼 적으면 관공서 제출 서류와 어긋나 부정당업자 제재 사유가 된다.
 *    아래 문구는 등록 대상을 명시한다. 줄이지 마라.
 *
 * 2026-09-09 — 이 컴포넌트가 `components/public/ProofRow.tsx` 를 흡수했다.
 *    ProofRow 의 네 칸("KC 인증 제품만"·"실측부터 A/S까지 직접"·"규격은 현장에서 확정"·
 *    "모듈 단위 교체")은 주장만 있고 근거가 없었고, 그중 셋은 바로 위 WhyWookang 이
 *    사진과 서류를 붙여 같은 말을 한다. 홈에서 같은 말을 두 번 하지 않는다.
 *    ProofRow.tsx 는 되돌릴 수 있게 파일만 남기고 배선을 풀었다(참조 0건 = 번들 제외).
 */
const PROOFS = [
  {
    Icon: FileCheck2,
    keyword: '정보통신공사업 등록',
    body: '전광판 설치는 정보통신공사입니다. 등록업체만 할 수 있고, 우리가 등록업체입니다.',
    meta: '대전광역시 · 2026',
  },
  {
    Icon: BadgeCheck,
    keyword: 'KC 적합등록',
    body: '화면에 전원을 넣는 직류전원장치를 우리 이름으로 적합등록했습니다.',
    meta: '국립전파연구원',
  },
  {
    Icon: FlaskConical,
    keyword: '연구개발전담부서 인정',
    body: '화면 제어와 자가진단 기능을 자체 연구소에서 개발합니다.',
    meta: '한국산업기술진흥협회 · 2026',
  },
]

export function ProofCards() {
  return (
    <section aria-labelledby="proof-h" className="wk-sec bg-wk-bgFaint">
      <div className="wk-wrap">
        <p className="wk-eyebrow">서류로 증명합니다</p>
        <h2 id="proof-h" className="wk-h2 text-wk-ink">
          <RiseMask>말이 아니라 등록번호로 답합니다</RiseMask>
        </h2>

        <Stagger
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3"
          y={16}
          gap={0.08}
        >
          {PROOFS.map(({ Icon, keyword, body, meta }) => (
            <article
              key={keyword}
              className="flex h-full flex-col rounded-surface border border-wk-line bg-white p-7 lg:p-9"
            >
              <Icon
                aria-hidden="true"
                size={32}
                strokeWidth={1.6}
                className="text-wk-cta"
              />
              {/* 케이시스의 '큰 숫자' 자리. 숫자가 없으므로 짧은 키워드를 같은 크기로 앉힌다. */}
              <p className="mt-6 text-h2 font-bold leading-[1.15] tracking-[-0.02em] text-wk-ink">
                {keyword}
              </p>
              <p className="mt-4 text-label leading-relaxed text-wk-ink3">{body}</p>
              <p className="wk-metric mt-auto pt-6 text-caption text-wk-ink3">{meta}</p>
            </article>
          ))}
        </Stagger>

        <Reveal y={10} delay={0.1}>
          <p className="mt-8 text-label text-wk-ink3">
            공장등록증명서 · 중소기업확인서 · 창업기업확인서 등 나머지 서류도{' '}
            <Link
              href="/about/certification"
              className="font-semibold text-wk-cta underline-offset-4 hover:underline"
            >
              원본 스캔으로 공개
            </Link>
            하고 있습니다.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
