'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Phone } from 'lucide-react'

import { Modal } from '@/components/ui/Modal'
import type { CaseItem } from '@/lib/cases'
import { SITE } from '@/lib/seo/site'

/**
 * 시공사례 상세 모달 — **사례 한 건만.**
 *
 * 🔴 2026-09-10 CEO "시공사례 각각이 다 다른 시공사례다. 묶으면 안 된다. 다 개별의 사례들이기 때문에."
 *    1차(같은 날 오전)엔 모달 안에 같은 자리의 다른 사진 썸네일과 자리 공용 구축정보 표를 두었다 —
 *    그게 곧 '묶음'이었다. 걷어낸다. 이 모달은 **이 사례의 사진 한 장 + 제목 + 한 줄 + 자리·환경 태그**
 *    그리고 전화·견적 버튼뿐이다. 다른 사례로 가는 길은 이전·다음 버튼 하나.
 *    `IndustryGallery`(썸네일 + 표)는 업종 상세 페이지(`/industries/[slug]`)에서만 쓴다.
 *
 * 🔴 주소 동기화는 부모(`IndustryGrid`)가 `?case=<업종>.<번호>` 로 한다.
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

          <div className="wk-card-img relative aspect-[16/10] bg-wk-ink">
            <Image
              key={item.src}
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 100vw, 860px"
              className="object-cover"
            />
          </div>

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
              비슷한 자리로 견적 받기
            </Link>
            <a
              href={`tel:${tel}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-btn border border-wk-line bg-white px-5 py-3 text-label font-semibold text-wk-ink transition-colors duration-state ease-state hover:bg-wk-bg"
            >
              <Phone size={16} aria-hidden="true" />
              <span className="wk-metric">{SITE.phone}</span>
            </a>
          </div>
        </div>
      )}
    </Modal>
  )
}
