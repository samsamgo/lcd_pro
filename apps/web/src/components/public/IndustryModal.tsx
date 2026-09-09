'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight, Phone } from 'lucide-react'

import { Modal } from '@/components/ui/Modal'
import { IndustryGallery } from '@/components/public/IndustryGallery'
import { siblingIndustries, type Industry } from '@/lib/industries'
import { SITE } from '@/lib/seo/site'

/**
 * 설치사례 상세 모달.
 *
 * 🔴 2026-09-09 CEO 지시 — "시공사례는 케이시스처럼 누르면 사진 크게 하고 간단하게 이것저것 나오게."
 *    케이시스(ksys.co.kr) 설치사례 상세를 그대로 옮겼다:
 *      설치 자리(작은 소제목) → 이름 큰 제목 → 큰 사진 + 썸네일 → 구축정보 표
 *      → 이전·다음 → 전화·견적 버튼.
 *
 *    이전 버전(2026-09-08)은 모달을 없애고 전부 상세 페이지로 보냈다. 그때 문제는
 *    "같은 내용이 두 경로로 갈렸다"는 것이었지, 모달 자체가 아니었다. 이번에는 본문을
 *    `IndustryGallery` 한 곳에 두고 모달과 상세 페이지가 **같은 컴포넌트**를 쓴다.
 *
 * 🔴 주소 동기화는 부모(`IndustryGrid`)가 `?case=<slug>` 로 한다.
 *    모달인데 주소가 안 바뀌면 뒤로가기로 못 닫고 공유도 안 된다.
 *
 * ⚠️ 긴 설명은 넣지 않는다. 케이시스 상세에도 설명 문단이 없다 — 사진과 표뿐이다.
 *    담당자는 자기 현장과 닮은 사진을 확인하러 여는 것이지 글을 읽으러 열지 않는다.
 */
export function IndustryModal({
  industry,
  onClose,
  onNavigate,
}: {
  industry: Industry | null
  onClose: () => void
  /** 이전/다음 자리로 이동 (부모가 주소도 같이 바꾼다) */
  onNavigate?: (slug: string) => void
}) {
  const i = industry
  const sib = i ? siblingIndustries(i.slug) : null
  const tel = SITE.phone.replace(/[^+\d]/g, '')

  return (
    <Modal
      open={Boolean(i)}
      onClose={onClose}
      size="xl"
      title={i ? <span className="sr-only">{i.nameKo}</span> : undefined}
    >
      {i && (
        <div className="space-y-6">
          <header>
            <p className="text-label font-semibold text-wk-cta">{i.eyebrow}</p>
            <h2 className="mt-1 text-h3 font-bold tracking-[-0.025em] text-wk-ink">{i.nameKo}</h2>
            <p className="mt-2 text-label text-wk-ink3">{i.title}</p>
          </header>

          <IndustryGallery industry={i} />

          {/* 이전·다음 — 케이시스 상세 하단과 같은 자리. 사진을 훑는 사람이
              목록으로 돌아갔다가 다시 열지 않아도 된다. */}
          {sib && onNavigate && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onNavigate(sib.prev.slug)}
                className="flex min-w-0 items-center gap-2 rounded-card-m border border-wk-line bg-white px-4 py-3 text-left transition-colors duration-state ease-state hover:bg-wk-bg"
              >
                <ChevronLeft size={18} className="shrink-0 text-wk-ink4" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-caption text-wk-ink4">이전</span>
                  <span className="block truncate text-label font-semibold text-wk-ink">{sib.prev.nameKo}</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate(sib.next.slug)}
                className="flex min-w-0 items-center justify-end gap-2 rounded-card-m border border-wk-line bg-white px-4 py-3 text-right transition-colors duration-state ease-state hover:bg-wk-bg"
              >
                <span className="min-w-0">
                  <span className="block text-caption text-wk-ink4">다음</span>
                  <span className="block truncate text-label font-semibold text-wk-ink">{sib.next.nameKo}</span>
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
          {/* 2026-09-09 감사: /industries/[slug] 정적 페이지가 어디서도 링크되지 않는 고아 라우트였다.
              검색 유입 착지 페이지로 살리기 위해 모달에서 한 줄 링크를 둔다 */}
          <p className="text-center text-caption text-wk-ink3">
            <Link href={`/industries/${i.slug}`} className="underline-offset-4 hover:underline">
              이 자리 자세히 보기
            </Link>
          </p>
        </div>
      )}
    </Modal>
  )
}
