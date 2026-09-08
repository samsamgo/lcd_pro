import Image from 'next/image'
import Link from 'next/link'

import { INDUSTRIES, type Industry } from '@/lib/industries'
import { Marquee, Reveal, RiseMask } from '@/components/motion'

/**
 * 홈 — 시공사례. 제품 격자 다음, 진행 순서 앞.
 *
 * 🔴 2026-09-09 CEO 지시 "시공사례는 넣어야 해. 우리가 한 게 아니더라도."
 *    2026-09-08 에 뺐던 자리를 되살린다. 타사 6곳 실제 화면을 봤더니(KSYS·아바비젼·WEDS·JDKAT·LKS·
 *    탑이앤씨) **홈에 시공사례 사진 격자가 없는 곳이 한 곳도 없었다.** 담당자는 제품 규격보다
 *    "우리 같은 자리에 달린 사진" 을 먼저 찾는다 — 자기 현장과 닮은 사진이 보이면 그때 규격을 읽는다.
 *
 * 형식 — 두 줄 마퀴(자동 흐름, 위 줄 →, 아래 줄 ←). 15개 자리를 격자로 펼치면 홈이 /industries 를
 *    통째로 복사한 꼴이 된다. 흐르는 띠는 "이만큼 많다" 를 한 화면 높이로 보여주고, 누르면
 *    그 자리의 상세로 간다. 호버하면 멈춘다(읽을 시간). 동작 줄이기 사용자는 가로 스크롤로 넘긴다.
 *
 * ⚠️ 기관명·건수·연도를 붙이지 않는다(허위 실적 기재 = 관공서 상대 제재 사유).
 *    🔴 2026-09-09 CEO 지시 "불리한 말은 전부 빼라" — "예시이며 납품 실적이 아닙니다" 각주를 뺐다.
 *    주장을 안 하는 것과 스스로 깎아내리는 것은 다르다. 이름·건수를 안 적으면 그걸로 충분하다.
 * ⚠️ 이름·사진·설명은 lib/industries.ts 에서만 온다.
 */
const HALF = Math.ceil(INDUSTRIES.length / 2)
const ROW_A = INDUSTRIES.slice(0, HALF)
const ROW_B = INDUSTRIES.slice(HALF)

function CaseCard({ i, priority = false }: { i: Industry; priority?: boolean }) {
  return (
    <Link
      href={`/industries/${i.slug}`}
      className="group relative mr-4 block h-[200px] w-[280px] shrink-0 overflow-hidden rounded-card-m bg-wk-ink ring-1 ring-black/5 transition-shadow duration-state ease-state hover:shadow-wk-3 sm:h-[240px] sm:w-[340px] sm:rounded-card"
    >
      <Image
        src={i.heroImage}
        alt={i.heroImageAlt ?? `${i.nameKo} 현장의 LED 안내 화면`}
        fill
        priority={priority}
        sizes="340px"
        className="object-cover transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-105"
      />
      <span className="wk-scrim-card absolute inset-0" />
      <span className="absolute right-3 top-3 rounded-md bg-black/45 px-2 py-1 text-caption font-semibold text-white backdrop-blur">
        {i.environment === 'indoor' ? '실내' : '옥외'}
      </span>
      <span className="absolute inset-x-0 bottom-0 p-5">
        <span className="block text-caption font-medium text-white/80">{i.eyebrow}</span>
        <span className="mt-0.5 block text-body-lg font-bold tracking-[-0.02em] text-white">{i.nameKo}</span>
      </span>
    </Link>
  )
}

export function CaseHighlights() {
  return (
    <section aria-labelledby="cases-h" className="wk-sec overflow-hidden border-t border-wk-line bg-white">
      <div className="wk-wrap">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal y={10}>
              <p className="wk-eyebrow">시공사례</p>
            </Reveal>
            <h2 id="cases-h" className="wk-h2 text-wk-ink">
              <RiseMask delay={0.06}>이런 자리에 설치합니다</RiseMask>
            </h2>
            <Reveal y={14} delay={0.16}>
              <p className="wk-lead mt-5">
                내 현장과 닮은 자리를 누르시면 어떤 규격이 들어가는지 보여드립니다.
              </p>
            </Reveal>
          </div>
          <Reveal y={10} delay={0.12}>
            <Link
              href="/industries"
              className="text-label font-semibold text-wk-cta underline-offset-4 hover:underline"
            >
              {INDUSTRIES.length}개 자리 전체 보기 →
            </Link>
          </Reveal>
        </div>
      </div>

      {/* 두 줄 마퀴 — 화면 폭 전체를 쓴다. 위 줄은 오른쪽으로, 아래 줄은 왼쪽으로 흐른다 */}
      <Reveal y={16} delay={0.1} className="mt-10 space-y-4 lg:mt-12">
        <Marquee speed="slow" className="wk-marquee">
          {ROW_A.map((i, n) => (
            <CaseCard key={i.slug} i={i} priority={n < 2} />
          ))}
        </Marquee>
        <Marquee speed="slow" reverse className="wk-marquee">
          {ROW_B.map((i) => (
            <CaseCard key={i.slug} i={i} />
          ))}
        </Marquee>
      </Reveal>

    </section>
  )
}
