import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Crumb {
  name: string
  href?: string
}

/**
 * 라이트 히어로 공용 부품 — 헤더(h-16=64px) 아래 여백은 여기서 소유한다.
 * 다크 히어로가 필요한 페이지는 이 부품을 쓰지 않는다.
 */
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
    <section className="relative overflow-hidden border-b border-wk-line bg-gradient-to-b from-wk-blueWeak/60 to-white pb-14 pt-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-wk-blue/10 blur-[120px]" />
      </div>
      <div className="wk-wrap relative">
        <nav aria-label="위치" className="mb-5 flex items-center gap-1.5 wk-cap">
          {crumbs.map((c, i) => (
            <span key={c.name} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={12} className="text-wk-ink3" aria-hidden="true" />}
              {c.href ? (
                <Link href={c.href} className="rounded transition-colors duration-150 hover:text-wk-ink2">
                  {c.name}
                </Link>
              ) : (
                <span className="font-medium text-wk-ink3">{c.name}</span>
              )}
            </span>
          ))}
        </nav>
        <p className="wk-eyebrow">{eyebrow}</p>
        <h1 className="wk-h1 text-wk-ink">{title}</h1>
        {description && <p className="wk-lead mt-4">{description}</p>}
      </div>
    </section>
  )
}
