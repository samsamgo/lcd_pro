'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

export interface CinematicSceneProps {
  eyebrow: string
  title: ReactNode
  body: ReactNode
  image: string
  imageAlt: string
  /** 'fullbleed' = 배경 이미지 위 텍스트(BMW) · 'split' = 좌우 분할(Apple) */
  layout?: 'fullbleed' | 'split'
  /** split 일 때 이미지 위치 */
  imageSide?: 'left' | 'right'
  theme?: 'dark' | 'light'
  href?: string
  cta?: string
  /** fullbleed 텍스트 정렬 */
  align?: 'center' | 'left'
  stats?: { value: string; label: string }[]
}

export function CinematicScene({
  eyebrow,
  title,
  body,
  image,
  imageAlt,
  layout = 'split',
  imageSide = 'right',
  theme = 'light',
  href,
  cta,
  align = 'left',
  stats,
}: CinematicSceneProps) {
  const dark = theme === 'dark'

  if (layout === 'fullbleed') {
    return (
      <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-black">
        <div className="absolute inset-0" aria-hidden="true">
          <Image src={image} alt={imageAlt} fill sizes="100vw" className="object-cover" />
          {align === 'center' ? (
            <div className="absolute inset-0 bg-black/60" />
          ) : (
            <>
              {/* 하단 + 좌측 이중 스크림 — 텍스트 대비 확보 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/25" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
            </>
          )}
        </div>
        <div
          className={`relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 pt-32 ${
            align === 'center' ? 'text-center' : 'text-left'
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className={align === 'center' ? 'mx-auto max-w-3xl' : 'max-w-2xl'}
          >
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">{eyebrow}</p>
            <h2 className="text-[clamp(2.25rem,6vw,4.5rem)] font-bold leading-[1.02] tracking-tight text-white">
              {title}
            </h2>
            <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-zinc-300">{body}</p>
            {stats && (
              <div className={`mt-10 flex flex-wrap gap-x-12 gap-y-6 ${align === 'center' ? 'justify-center' : ''}`}>
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-3xl font-extrabold text-white sm:text-4xl">{s.value}</p>
                    <p className="mt-1 text-sm text-zinc-400">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
            {href && cta && (
              <Link
                href={href}
                className="group mt-10 inline-flex items-center gap-1.5 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white hover:text-black"
              >
                {cta}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>
    )
  }

  // split
  return (
    <section className={dark ? 'bg-zinc-950 py-24 sm:py-32' : 'bg-white py-24 sm:py-32'}>
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: imageSide === 'right' ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={imageSide === 'right' ? 'lg:order-1' : 'lg:order-2'}
        >
          <p className={`mb-4 text-sm font-semibold uppercase tracking-[0.2em] ${dark ? 'text-cyan-400' : 'text-blue-600'}`}>
            {eyebrow}
          </p>
          <h2 className={`text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-[1.08] tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
            {title}
          </h2>
          <p className={`mt-6 text-lg font-light leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {body}
          </p>
          {stats && (
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className={`text-3xl font-extrabold ${dark ? 'text-white' : 'text-zinc-900'}`}>{s.value}</p>
                  <p className={`mt-0.5 text-sm ${dark ? 'text-zinc-500' : 'text-zinc-500'}`}>{s.label}</p>
                </div>
              ))}
            </div>
          )}
          {href && cta && (
            <Link
              href={href}
              className={`group mt-9 inline-flex items-center gap-1.5 text-base font-semibold ${dark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-500'}`}
            >
              {cta}
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={`relative overflow-hidden rounded-3xl shadow-2xl ${imageSide === 'right' ? 'lg:order-2' : 'lg:order-1'}`}
        >
          <div className="relative aspect-[4/3]">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
