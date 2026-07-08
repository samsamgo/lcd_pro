'use client'

import Image from 'next/image'
import { Maximize2 } from 'lucide-react'
import { Lightbox, useLightbox, type LightboxImage } from '@/components/ui/Lightbox'

export interface CaseItem {
  type: string
  spec: string
  img: string
  desc: string
}

export function CaseGallery({ cases }: { cases: CaseItem[] }) {
  const lb = useLightbox()

  const images: LightboxImage[] = cases.map((c) => ({
    src: c.img,
    alt: `${c.type} LED 사이니지 설치 예시`,
    tag: c.spec,
    caption: `${c.type} — ${c.desc}`,
  }))

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-3">
        {cases.map((c, i) => (
          <button
            key={c.type}
            type="button"
            onClick={() => lb.open(i)}
            aria-label={`${c.type} 사진 확대 보기`}
            className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:led-frame"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
              <Image
                src={c.img}
                alt={`${c.type} LED 사이니지 설치 예시`}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover img-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/10 to-transparent" />
              <span className="absolute right-3 top-3 rounded-full bg-zinc-950/50 p-1.5 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                <Maximize2 size={15} />
              </span>
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-base font-bold text-white">{c.type}</p>
                <p className="text-xs font-medium text-cyan-300">{c.spec}</p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm leading-relaxed text-zinc-700">{c.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        images={images}
        index={lb.index}
        onIndexChange={lb.setIndex}
        onClose={lb.close}
      />
    </>
  )
}
