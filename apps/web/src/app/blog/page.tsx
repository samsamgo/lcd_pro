import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/blog'
import { buildMetadata, SITE } from '@/lib/seo/site'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'

export const dynamic = 'force-static'
export const revalidate = 3600

export const metadata: Metadata = buildMetadata({
  title: '블로그 — LED 사이니지 견적·시공·운영 가이드',
  description:
    '우강테크(WK Tech) 블로그. LED 사이니지 견적, 시공 사례, NovaStar 운영, 카페·식당·헬스장 활용 사례, 유지보수까지 — 소상공인을 위한 실용 가이드.',
  path: '/blog',
})

export default async function BlogIndex() {
  const posts = await getAllPosts()
  const ld = breadcrumbLd([
    { name: '홈', url: SITE.url + '/' },
    { name: '블로그', url: SITE.url + '/blog' },
  ])
  return (
    <>
      <NavBar />
      <main className="pt-16">
        <JsonLd id="ld-breadcrumb" data={ld} />

        <section className="surface-dark relative overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <Image
              src="/curated/hero-blog.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-zinc-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
            <div className="absolute right-10 top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
          </div>
          <div className="relative mx-auto max-w-5xl px-4 py-24 sm:py-32">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              {SITE.nameKo} 블로그
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              LED 사이니지 견적·시공·운영 가이드
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-300">
              {SITE.nameKo}({SITE.nameEn})가 소상공인을 위해 정리하는 실용 가이드.
              견적·시공·NovaStar 운영·업종별 활용·유지보수까지 — 광고 톤이 아닌
              사실·수치·사례 중심.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16">
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {posts.length === 0 ? (
              <li className="col-span-full rounded-2xl border border-zinc-200 bg-white/40 p-6 text-sm text-zinc-600">
                아직 발행된 글이 없습니다. 첫 글이 곧 공개됩니다.
              </li>
            ) : (
              posts.map((p) => (
                <li
                  key={p.slug}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:led-frame"
                >
                  <Link href={`/blog/${p.slug}`} className="group block">
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
                      <Image
                        src={p.coverImage ?? p.ogImage ?? '/curated/hero-blog.jpg'}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover img-zoom"
                      />
                    </div>
                    <div className="p-6">
                      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">
                        {p.category}
                      </p>
                      <h2 className="mb-2 text-xl font-semibold leading-snug text-zinc-900">
                        {p.title}
                      </h2>
                      <p className="line-clamp-2 text-sm leading-relaxed text-zinc-600">
                        {p.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.tags.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] text-zinc-500"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-zinc-500">
                        <time dateTime={p.publishedAt}>
                          {p.publishedAt.slice(0, 10)}
                        </time>
                        {' · '}
                        {p.author}
                      </p>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  )
}
