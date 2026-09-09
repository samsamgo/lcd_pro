import Image from 'next/image'
import Link from 'next/link'

import { Reveal } from '@/components/motion'
import { getCategory } from '@/lib/productCategories'
import { modelsByCategory } from '@/lib/productModels'

/**
 * /products 입구 — **실내 · 실외 두 장의 큰 다크 타일.**
 *
 * 제품을 고르는 첫 갈림길은 언제나 "안이냐 밖이냐" 하나다. 그 다음이 용도(현수막·파사드·
 * 스포츠·교통)다. 그래서 이 두 장을 화면 절반씩 크게 두고, 여섯 카테고리는 그 아래 작게 둔다.
 * 문구는 밝기가 아니라 **보는 거리와 화면 크기**로 쓴다(CEO 2026-09-09).
 */
const TILES: { slug: 'indoor' | 'outdoor'; sub: string }[] = [
  { slug: 'indoor', sub: '1 ~ 5m 앞에서 보는 화면' },
  { slug: 'outdoor', sub: '10 ~ 50m 밖에서 보는 화면' },
]

export function ProductEntryTiles() {
  return (
    <section className="wk-sec bg-wk-night" aria-labelledby="entry-h">
      <div className="wk-wrap">
        <p className="wk-eyebrow !text-wk-blue">제품</p>
        <h2 id="entry-h" className="wk-h2 text-white">
          안에 놓습니까, 밖에 놓습니까
        </h2>
        <p className="mt-3 max-w-[44em] text-body text-wk-nightMuted">
          같은 LED 화면이라도 실내와 실외는 다른 물건입니다. 보는 거리가 다르고, 그래서 화면 크기와 화소 간격이 다릅니다.
          먼저 이 둘 중 하나를 고르시면 그 아래 시리즈가 정리돼 있습니다.
        </p>

        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:gap-6">
          {TILES.map(({ slug, sub }, i) => {
            const c = getCategory(slug)
            if (!c) return null
            const count = modelsByCategory(slug).length
            return (
              <Reveal key={slug} delay={i * 0.08}>
                <Link
                  href={`/products/${slug}`}
                  className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-card bg-wk-night2 ring-1 ring-white/10 sm:aspect-[16/10]"
                >
                  <Image
                    src={c.heroImage}
                    alt={c.heroImageAlt}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, 560px"
                    className="object-cover opacity-60 transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-wk-night via-wk-night/55 to-transparent" />
                  <span className="relative z-10 w-full p-6 md:p-8">
                    <span className="wk-metric block text-h2 font-extrabold uppercase leading-none tracking-[0.02em] text-white">
                      {c.display}
                    </span>
                    <span className="mt-2 block text-body-lg font-bold text-white">{c.name}</span>
                    <span className="mt-1 block text-label text-white/75">{sub}</span>
                    <span className="mt-4 flex items-center gap-2 text-label font-semibold text-white">
                      시리즈 {count}종 보기
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-state ease-state motion-safe:group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
