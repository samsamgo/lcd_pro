import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { absoluteUrl, buildMetadata, SITE } from '@/lib/seo/site'
import {
  blogPostingLd,
  breadcrumbLd,
  faqPageLd,
} from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { AboutBox } from '@/components/seo/AboutBox'
import { TLDR } from '@/components/seo/TLDR'
import { MarkdownBody } from '@/components/blog/MarkdownBody'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'

export const dynamic = 'force-static'
export const revalidate = 3600

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt ?? post.publishedAt,
    authors: [post.author],
    tags: post.tags,
  })
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const url = absoluteUrl(`/blog/${post.slug}`)
  const breadcrumb = breadcrumbLd([
    { name: '홈', url: SITE.url + '/' },
    { name: '블로그', url: SITE.url + '/blog' },
    { name: post.title, url },
  ])
  const posting = blogPostingLd({
    title: post.title,
    description: post.description,
    url,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: post.author,
    tags: post.tags,
  })
  const faqLd = post.faq && post.faq.length > 0 ? faqPageLd(post.faq) : null

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-3xl px-4 py-24">
      <JsonLd id="ld-breadcrumb" data={breadcrumb} />
      <JsonLd id="ld-blogposting" data={posting} />
      {faqLd && <JsonLd id="ld-faq" data={faqLd} />}

      <nav aria-label="breadcrumb" className="mb-6 text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-700">홈</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-zinc-700">블로그</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-600">{post.category}</span>
      </nav>

      <article>
        {post.coverImage && (
          <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-900 led-frame">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent" />
          </div>
        )}
        <header className="mb-8 border-b border-zinc-200 pb-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-600">
            {post.category}
          </p>
          <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-zinc-900 md:text-4xl">
            {post.title}
          </h1>
          <p className="text-base leading-relaxed text-zinc-600">
            {post.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-500">
            <time dateTime={post.publishedAt}>
              {post.publishedAt.slice(0, 10)} 발행
            </time>
            <span>·</span>
            <span>{post.author}</span>
          </div>
        </header>

        {(post.definition || (post.tldr && post.tldr.length > 0)) && (
          <TLDR
            definition={post.definition}
            points={post.tldr ?? []}
          />
        )}

        <MarkdownBody source={post.body} />

        {post.faq && post.faq.length > 0 && (
          <section
            aria-labelledby="faq-heading"
            className="mt-16 border-t border-zinc-200 pt-10"
          >
            <h2
              id="faq-heading"
              className="mb-6 text-2xl font-bold tracking-tight text-zinc-900"
            >
              자주 묻는 질문
            </h2>
            <div className="space-y-3">
              {post.faq.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-zinc-200 bg-white/40 p-5 open:border-blue-500/40"
                >
                  <summary className="cursor-pointer list-none text-base font-semibold text-zinc-900">
                    {item.question}
                  </summary>
                  <div className="mt-3 text-sm leading-relaxed text-zinc-700">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12">
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-95 glow"
          >
            사진 3장으로 견적 받기 →
          </Link>
        </div>

        <AboutBox />

        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-500"
            >
              #{t}
            </span>
          ))}
        </div>
      </article>
      </main>
      <Footer />
    </>
  )
}
