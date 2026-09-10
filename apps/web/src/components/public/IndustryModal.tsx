'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight, Phone } from 'lucide-react'

import { Modal } from '@/components/ui/Modal'
import { IndustryGallery } from '@/components/public/IndustryGallery'
import type { CaseItem } from '@/lib/cases'
import { SITE } from '@/lib/seo/site'

/**
 * 시공사례 상세 모달 — **사례 한 건(사진 한 장) 단위.**
 *
 * 🔴 2026-09-10 CEO "시공사례는 각각 다 따로 나와야." 모달의 주어가 업종에서 사례로 바뀌었다:
 *      사례 제목(큰 제목) → 설치 자리(작은 줄) → 큰 사진(이 사례) + 같은 자리의 다른 사진 썸네일
 *      → 구축정보 표(자리 기준) → 이전·다음 **사례** → 전화·견적 버튼.
 *    본문은 여전히 `IndustryGallery` 한 곳이다(정적 상세 페이지와 공유). `initialIndex` 로 이 사례 사진부터 연다.
 *
 * 🔴 주소 동기화는 부모(`IndustryGrid`)가 `?case=<업종>.<번호>` 로 한다.
 * ⚠️ 긴 설명은 넣지 않는다. 케이시스 상세에도 설명 문단이 없다 — 사진과 표뿐이다.
 */
export function IndustryModal({
  item,
  siblings,
  onClose,
  onNavigate,
}: {
  item: CaseItem | null
  siblings?: { prev: CaseItem; next: CaseItem } | null
  onClose: () => void
  /** 이전/다음 사례로 이동 (부모가 주소도 같이 바꾼다) */
  onNavigate?: (id: string) => void
}) {
  const i = item?.industry
  const tel = SITE.phone.replace(/[^+\d]/g, '')

  return (
    <Modal
      open={Boolean(item)}
      onClose={onClose}
      size="xl"
      title={item ? <span className="sr-only">{item.title}</span> : undefined}
    >
      {item && i && (
        <div className="space-y-6">
          <header>
            <p className="text-label font-semibold text-wk-cta">
              {i.nameKo} · {i.environment === 'indoor' ? '실내' : '옥외'}
            </p>
            <h2 className="mt-1 text-h3 font-bold tracking-[-0.025em] text-wk-ink">{item.title}</h2>
            <p className="mt-2 text-label text-wk-ink3">{item.alt}</p>
          </header>

          <IndustryGallery industry={i} initialIndex={item.index} />

          {siblings && onNavigate && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onNavigate(siblings.prev.id)}
                className="flex min-w-0 items-center gap-2 rounded-card-m border border-wk-line bg-white px-4 py-3 text-left transition-colors duration-state ease-state hover:bg-wk-bg"
              >
                <ChevronLeft size={18} className="shrink-0 text-wk-ink4" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-caption text-wk-ink4">이전 사례</span>
                  <span className="block truncate text-label font-semibold text-wk-ink">{siblings.prev.title}</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate(siblings.next.id)}
                className="flex min-w-0 items-center justify-end gap-2 rounded-card-m border border-wk-line bg-white px-4 py-3 text-right transition-colors duration-state ease-state hover:bg-wk-bg"
              >
                <span className="min-w-0">
                  <span className="block text-caption text-wk-ink4">다음 사례</span>
                  <span className="block truncate text-label font-semibold text-wk-ink">{siblings.next.title}</span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-wk-ink4" aria-hidden="true" />
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href={`/quote?type=${i.quoteType}`} className="wk-btn-p flex-1 justify-center" onClick={onClose}>
              이 자리로 견적 받기
            </Link>
            <a
              href={`tel:${tel}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-btn border border-wk-line bg-white px-5 py-3 text-label font-semibold text-wk-ink transition-colors duration-state ease-state hover:bg-wk-bg"
            >
              <Phone size={16} aria-hidden="true" />
              <span className="wk-metric">{SITE.phone}</span>
            </a>
          </div>
          <p className="text-center text-caption text-wk-ink3">
            <Link href={`/industries/${i.slug}`} className="underline-offset-4 hover:underline">
              {i.nameKo} 자리 자세히 보기
            </Link>
          </p>
        </div>
      )}
    </Modal>
  )
}
