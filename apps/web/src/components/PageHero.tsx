import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { absoluteUrl } from '@/lib/seo/site'

interface Crumb {
  name: string
  href?: string
}

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
}: {
  eyebrow: string
  title: string
  description?: string
  crumbs: Crumb[]
}) {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-blue-50/60 to-white pt-28 pb-14 px-4">
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbLd(
          crumbs.map((c) => ({
            name: c.name,
            ...(c.href ? { url: absoluteUrl(c.href) } : {}),
          })),
        )}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-5xl">
        <nav aria-label="위치" className="mb-5 flex items-center gap-1.5 text-xs text-zinc-500">
          {crumbs.map((c, i) => (
            <span key={c.name} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={12} className="text-zinc-400" />}
              {c.href ? (
                <Link href={c.href} className="rounded hover:text-zinc-800">
                  {c.name}
                </Link>
              ) : (
                <span className="font-medium text-zinc-700">{c.name}</span>
              )}
            </span>
          ))}
        </nav>
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
          {eyebrow}
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
