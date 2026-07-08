'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export interface ServiceBlockProps {
  id: string
  index: string
  eyebrow: string
  title: string
  body: string
  points: string[]
  image: string
  imageAlt: string
  reverse?: boolean
  dark?: boolean
}

export function ServiceBlock({
  id, index, eyebrow, title, body, points, image, imageAlt, reverse, dark,
}: ServiceBlockProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 px-6 py-24 sm:py-28 ${dark ? 'bg-zinc-950' : 'bg-white'}`}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: reverse ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={reverse ? 'lg:order-2' : 'lg:order-1'}
        >
          <div className="flex items-center gap-3">
            <span className={`font-mono text-sm font-bold ${dark ? 'text-cyan-400' : 'text-blue-600'}`}>{index}</span>
            <span className={`h-px w-8 ${dark ? 'bg-cyan-400/40' : 'bg-blue-600/40'}`} />
            <span className={`text-sm font-semibold uppercase tracking-[0.2em] ${dark ? 'text-cyan-400' : 'text-blue-600'}`}>{eyebrow}</span>
          </div>
          <h2 className={`mt-4 text-[clamp(1.7rem,3.6vw,2.6rem)] font-bold leading-[1.1] tracking-tight ${dark ? 'text-white' : 'text-zinc-900'}`}>
            {title}
          </h2>
          <p className={`mt-5 text-lg font-light leading-relaxed ${dark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {body}
          </p>
          <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className={`flex items-center gap-2 text-sm font-medium ${dark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${dark ? 'bg-cyan-400/15 text-cyan-300' : 'bg-blue-600/10 text-blue-600'}`}>
                  <Check size={12} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={`relative overflow-hidden rounded-3xl shadow-2xl ${reverse ? 'lg:order-1' : 'lg:order-2'}`}
        >
          <div className="relative aspect-[4/3]">
            <Image src={image} alt={imageAlt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
