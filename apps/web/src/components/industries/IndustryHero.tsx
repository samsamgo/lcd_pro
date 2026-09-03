'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { EASE } from '@/components/motion'

export function IndustryHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  generated = false,
  quoteHref,
  quoteCta,
  crumbs,
}: {
  eyebrow: string
  title: string
  description: string
  image: string
  imageAlt: string
  generated?: boolean
  quoteHref: string
  quoteCta: string
  crumbs: { name: string; href?: string }[]
}) {
  return (
    <section className="relative flex min-h-[78svh] items-center overflow-hidden bg-black px-6 pt-28 pb-16">
      <div className="absolute inset-0" aria-hidden="true">
        <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <motion.nav
          aria-label="위치"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          className="mb-6 flex items-center gap-1.5 text-xs text-wk-ink4"
        >
          {crumbs.map((c, i) => (
            <span key={c.name} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={12} className="text-wk-ink3" />}
              {c.href ? <Link href={c.href} className="hover:text-white">{c.name}</Link> : <span className="font-medium text-wk-ink4">{c.name}</span>}
            </span>
          ))}
        </motion.nav>

        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.1, ease: EASE.entrance }}
          className="max-w-3xl text-[clamp(2.1rem,5.2vw,4rem)] font-extrabold leading-[1.05] tracking-tight text-white"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: EASE.entrance }}
          className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-wk-ink4"
        >
          {description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-9"
        >
          <Link
            href={quoteHref}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-wk-ink transition-all hover:bg-wk-bg active:scale-95"
          >
            {quoteCta}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
