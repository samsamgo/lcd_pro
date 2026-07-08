'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Modal } from './Modal'

export interface LightboxImage {
  src: string
  alt: string
  caption?: string
  tag?: string
}

/**
 * 이미지 갤러리 라이트박스 — 썸네일 클릭 시 확대, 좌우 키보드/버튼 탐색.
 * 접근성: role=dialog(Modal), 좌우 화살표 키 지원, 캡션 노출.
 */
export function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: {
  images: LightboxImage[]
  index: number | null
  onIndexChange: (i: number) => void
  onClose: () => void
}) {
  const open = index !== null
  const safeIndex = index ?? 0
  const current = images[safeIndex]

  const prev = useCallback(() => {
    onIndexChange((safeIndex - 1 + images.length) % images.length)
  }, [safeIndex, images.length, onIndexChange])
  const next = useCallback(() => {
    onIndexChange((safeIndex + 1) % images.length)
  }, [safeIndex, images.length, onIndexChange])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, prev, next])

  if (!current) return null

  return (
    <Modal open={open} onClose={onClose} size="xl" bare mobileSheet={false} className="bg-zinc-950">
      <div className="relative">
        <div className="relative aspect-[4/3] w-full bg-zinc-900 sm:aspect-[16/10]">
          <Image
            src={current.src}
            alt={current.alt}
            fill
            sizes="(max-width: 640px) 100vw, 80vw"
            className="object-contain"
            priority
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="이전 이미지"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-zinc-950/50 p-2.5 text-white backdrop-blur transition-colors hover:bg-zinc-950/70"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="다음 이미지"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-zinc-950/50 p-2.5 text-white backdrop-blur transition-colors hover:bg-zinc-950/70"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            {current.tag && (
              <span className="text-xs font-semibold text-cyan-400">{current.tag}</span>
            )}
            {current.caption && (
              <p className="truncate text-sm text-zinc-200">{current.caption}</p>
            )}
          </div>
          {images.length > 1 && (
            <span className="shrink-0 text-xs text-zinc-400">
              {safeIndex + 1} / {images.length}
            </span>
          )}
        </div>
      </div>
    </Modal>
  )
}

/** 간단한 훅 — 라이트박스 열림 인덱스 상태 관리 */
export function useLightbox() {
  const [index, setIndex] = useState<number | null>(null)
  return {
    index,
    open: (i: number) => setIndex(i),
    close: () => setIndex(null),
    setIndex,
  }
}
