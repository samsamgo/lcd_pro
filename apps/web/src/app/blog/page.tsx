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
            {/* 균일 스크림 — 이미지가 밝은 구간이어도 텍스트 대비 항상 보장 */}
            <div className="absolute inset-0 bg-zinc-950/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
          </div>
          <div className="relative mx-auto max-w-5xl px-4 py-24 sm:py-32">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              {SITE.nameKo} 블로그
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white drop-shadow-sm sm:text-5xl">
              LED 사이니지 견적·시공·운영 가이드
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-200">
              {SITE.nameKo}({SITE.nameEn})가 소상공인을 위해 정리하는 실용 가이드.
              견적·시공·NovaStar 운영·업종별 활용·유지보수까지 — 광고 톤이 아닌
              사실·수치·사례 중심.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-10 text-center text-sm text-zinc-600">
              아직 발행된 글이 없습니다. 첫 글이 곧 공개됩니다.
            </div>
          ) : (
            <>
              {/* 대표 글 — 가로형 풀폭 (글이 1개여도 자연스럽게) */}
              <Link
                href={`/blog/${posts[0].slug}`}
                className="group mb-10 grid overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:led-frame md:grid-cols-2"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900 md:aspect-auto md:min-h-[300px]">
                  <Image
                    src={posts[0].coverImage ?? posts[0].ogImage ?? '/curated/hero-blog.jpg'}
                    alt={posts[0].title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover img-zoom"
                  />
                </div>
                <div className="flex flex-col justify-center p-8">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">
                    대표 글 · {posts[0].category}
                  </p>
                  <h2 className="mb-3 text-2xl font-bold leading-snug text-zinc-900">
                    {posts[0].title}
                  </h2>
                  <p className="line-clamp-3 text-sm leading-relaxed text-zinc-600">
                    {posts[0].description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {posts[0].tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] text-zinc-500"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-zinc-500">
                    <time dateTime={posts[0].publishedAt}>
                      {posts[0].publishedAt.slice(0, 10)}
                    </time>
                    {' · '}
                    {posts[0].author}
                  </p>
                </div>
              </Link>

              {/* 나머지 글 — 그리드 */}
              {posts.length > 1 && (
                <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.slice(1).map((p) => (
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
                            sizes="(max-width: 768px) 100vw, 33vw"
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
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
