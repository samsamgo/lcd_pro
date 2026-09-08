import Image from 'next/image'
import Link from 'next/link'

import { INDUSTRIES } from '@/lib/industries'
import { Reveal, RiseMask, Stagger } from '@/components/motion'

/**
 * 홈 — 시공사례 미리보기.
 *
 * 🔴 2026-09-08 CEO 지시 두 개를 한 섹션으로 받는다.
 *   ① "각 페이지마다 중복되는 거 없게"
 *   ② "모든 페이지 이미지 위주로"
 *
 * 이 자리는 원래 `ScreenGallery`(제품 용도 예시 사진 9장)였다. 사진을 늘어놓기만 하고
 * 어디로도 보내지 않아서, 같은 성격의 갤러리가 /products(ProductScenes)·/industries
 * (IndustryScenes)에 또 있는데도 홈이 그걸 세 번째로 반복하고 있었다.
 *
 * 사진은 그대로 두되 **누르면 그 자리의 시공사례 페이지로 가게** 바꿨다.
 * 홈은 입구이지 종착지가 아니다. 여기서 사진을 다 보여주면 안쪽 페이지를 볼 이유가 없어진다.
 *
 * 6장만 고른다 — 관공서·학교·전자현수막·공공기관·회의실·도로. 우리가 실제로 노리는 자리다.
 * 나머지 9곳은 /industries 에서 필터로 찾는다.
 */
const FEATURED = [
  'public-office',
  'school',
  'banner',
  'institution',
  'meeting-room',
  'traffic',
] as const

export function CaseHighlights() {
  const items = FEATURED.map((slug) => INDUSTRIES.find((i) => i.slug === slug)).filter(
    (i): i is NonNullable<typeof i> => !!i,
  )

  return (
    <section aria-labelledby="cases-h" className="wk-sec bg-white">
      <div className="wk-wrap">
        <Reveal y={10}>
          <p className="wk-eyebrow">시공사례</p>
        </Reveal>
        <RiseMask delay={0.06}>
          <h2 id="cases-h" className="wk-h2 text-wk-ink">
            어디에 놓을지부터 정합니다
          </h2>
        </RiseMask>

        <Stagger className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5" y={12} gap={0.05}>
          {items.map((i) => (
            <Link
              key={i.slug}
              href={`/industries/${i.slug}`}
              className="group relative block aspect-[4/3] overflow-hidden rounded-card-m bg-wk-ink ring-1 ring-black/5 transition-shadow duration-state ease-state hover:shadow-wk-3 sm:rounded-card"
            >
              <Image
                src={i.heroImage}
                alt={i.heroImageAlt ?? `${i.nameKo} 현장의 LED 안내 화면`}
                fill
                sizes="(max-width: 640px) 100vw, 380px"
                className="object-cover transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-105"
              />
              <div className="wk-scrim-card absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="text-caption font-medium text-white/80">{i.eyebrow}</p>
                <b className="mt-1 block text-body-lg font-bold tracking-[-0.025em] text-white">
                  {i.nameKo}
                </b>
              </div>
            </Link>
          ))}
        </Stagger>

        <Reveal y={10} delay={0.1}>
          <div className="mt-8">
            <Link
              href="/industries"
              className="inline-flex items-center gap-1.5 text-label font-semibold text-wk-cta underline-offset-4 hover:underline"
            >
              시공사례 전체 보기
            </Link>
          </div>
        </Reveal>

        <p className="wk-cap mt-6">
          사진은 자리별 설치 형태를 보여주기 위한 예시입니다. 특정 기관의 납품 실적을 표시한 것이 아닙니다.
        </p>
      </div>
    </section>
  )
}
