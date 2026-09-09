'use client'

import Link from 'next/link'

import { useSiteModals } from '@/components/modals/SiteModals'

/**
 * 모델 상세의 문의 버튼 두 개.
 *
 * 리드가 여기서 새면 안 된다 — 그래서 길을 둘 둔다.
 *  · 주황 '문의하기' = 빠른상담 모달(연락처만 남기면 끝). 어느 모델을 보다 눌렀는지 `source` 로 남는다.
 *  · '견적 요청' = /quote 정식 견적. 크기·수량이 정해진 담당자용.
 */
export function ModelInquiryButtons({ series }: { series: string }) {
  const { openConsult } = useSiteModals()

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row">
      <button
        type="button"
        onClick={() => openConsult(`product-model:${series}`)}
        className="wk-btn-p justify-center"
      >
        문의하기
      </button>
      <Link href="/quote" className="wk-btn wk-btn-w justify-center">
        견적 요청
      </Link>
    </div>
  )
}
