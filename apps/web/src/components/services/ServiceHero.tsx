'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const JUMP = [
  { label: '표준 시공', href: '#install' },
  { label: '컨트롤러', href: '#controller' },
  { label: 'CMS 운영', href: '#cms' },
  { label: '인증·인허가', href: '#cert' },
  { label: '공공조달', href: '#b2b' },
]

export function ServiceHero() {
  return (
    <section className="relative flex min-h-[72svh] items-center overflow-hidden bg-black px-6 pt-28 pb-16">
      <div className="absolute inset-0" aria-hidden="true">
        <Image src="/curated/hero-services.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black" />
        <div className="absolute right-1/4 top-1/4 h-[440px] w-[440px] rounded-full bg-cyan-500/15 blur-[150px]" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mb-5 text-sm font-medium uppercase tracking-[0.25em] text-cyan-300"
        >
          Services
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl text-[clamp(2.4rem,6vw,4.6rem)] font-extrabold leading-[1.02] tracking-tight text-white"
        >
          시공부터 운영까지,<br />한 파트너로
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-zinc-300"
        >
          설계·시공·컨트롤러·CMS·AS·인허가·공공조달까지 —
          LED 디스플레이에 필요한 모든 영역을 하나의 표준으로 끝냅니다.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-9 flex flex-wrap gap-2"
        >
          {JUMP.map((j) => (
            <Link key={j.href} href={j.href} className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 backdrop-blur transition-all hover:bg-white/10">
              {j.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
