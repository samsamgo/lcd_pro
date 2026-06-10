'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import type { DetailBlock } from './services-data'

export type ModalPayload = {
  title: string
  subtitle?: string
  image: string
  summary?: string
  bullets?: string[]
  details: DetailBlock[]
}

type Props = {
  open: boolean
  payload: ModalPayload | null
  onClose: () => void
}

export function DetailModal({ open, payload, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && payload && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          role="dialog"
          aria-modal="true"
          aria-label={payload.title}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            className="relative w-full max-w-3xl overflow-hidden rounded-t-2xl border border-zinc-200 bg-zinc-50 sm:rounded-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100">
              <Image
                src={payload.image}
                alt={payload.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-black/80"
                aria-label="닫기"
              >
                닫기 ✕
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-6 sm:p-8">
              {payload.subtitle && (
                <div className="text-xs uppercase tracking-wide text-blue-600">{payload.subtitle}</div>
              )}
              <h2 className="mt-1 text-2xl font-bold text-zinc-900 sm:text-3xl">{payload.title}</h2>
              {payload.summary && <p className="mt-3 text-zinc-700">{payload.summary}</p>}
              {payload.bullets && payload.bullets.length > 0 && (
                <ul className="mt-4 space-y-1.5">
                  {payload.bullets.map((b) => (
                    <li key={b} className="text-sm text-zinc-700">· {b}</li>
                  ))}
                </ul>
              )}
              <div className="mt-6 space-y-6">
                {payload.details.map((block) => (
                  <div key={block.heading}>
                    <div className="text-sm font-semibold uppercase tracking-wide text-zinc-600">{block.heading}</div>
                    <ul className="mt-2 space-y-1.5">
                      {block.items.map((it) => (
                        <li key={it} className="text-sm text-zinc-800">· {it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
