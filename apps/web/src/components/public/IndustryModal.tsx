'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Modal } from '@/components/ui/Modal'
import type { Industry } from '@/lib/industries'

/**
 * 업종 상세 모달.
 *
 * 기존에는 업종마다 별도 페이지(/industries/[slug])로 넘어갔다.
 * 페이지가 6개로 갈리면서 회사 설명이 페이지마다 반복됐고, 글이 많아
 * 담당자가 필요한 것만 빠르게 훑기 어려웠다.
 *
 * 그래서 목록에서 누르면 모달로 띄운다. 내용은 세 덩어리로만 자른다.
 *   ① 어떤 현장인가(사진 + 한 줄)
 *   ② 담당자가 겪는 일 → 우리가 하는 일
 *   ③ 문의
 * 긴 설명은 넣지 않는다. 판단에 필요한 것만 남긴다.
 */
export function IndustryModal({
  industry,
  onClose,
}: {
  industry: Industry | null
  onClose: () => void
}) {
  const i = industry

  return (
    <Modal open={Boolean(i)} onClose={onClose} title={i?.nameKo} size="lg">
      {i && (
        <div className="space-y-6">
          <div className="wk-card-img relative aspect-[16/9]">
            <Image
              src={i.heroImage}
              alt={i.heroImageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover"
            />
          </div>

          <p className="text-body text-wk-ink2">{i.description}</p>

          {/* 담당자가 겪는 일 */}
          {i.pains?.length > 0 && (
            <div>
              <p className="wk-cap mb-2">이런 상황에서 씁니다</p>
              <ul className="m-0 list-none space-y-2 p-0">
                {i.pains.map((p) => (
                  <li key={p} className="flex gap-2.5 text-label text-wk-ink3">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-wk-ink4" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 우리가 하는 일 */}
          {i.solutions?.length > 0 && (
            <div className="rounded-card-m bg-wk-bg px-4">
              {i.solutions.map((s) => (
                <div key={s.title} className="wk-row">
                  <span className="flex-1">
                    <b className="block text-body font-semibold text-wk-ink">{s.title}</b>
                    <span className="mt-0.5 block text-label text-wk-ink3">
                      {s.desc}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Link href={`/quote?type=${i.quoteType}`} className="wk-btn-p" onClick={onClose}>
              이 조건으로 견적 요청
            </Link>
            <p className="wk-cap">{i.priceHint}</p>
          </div>
        </div>
      )}
    </Modal>
  )
}
