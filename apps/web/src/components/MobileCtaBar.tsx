'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { MessageCircle, FileText } from 'lucide-react'
import { useSiteModals } from '@/components/modals/SiteModals'

/**
 * 모바일 하단 고정 CTA 바 — 엄지 영역 전환 최적화.
 * 히어로를 지나 스크롤하면 나타나고, 견적/상담 두 채널을 상시 노출한다.
 * md 이상에서는 숨김(데스크톱은 sticky 헤더 CTA 사용).
 */
export function MobileCtaBar() {
  const [visible, setVisible] = useState(false)
  const { openConsult } = useSiteModals()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 backdrop-blur-md transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-md items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={() => openConsult('mobile-bar')}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-zinc-300 py-3 text-sm font-semibold text-zinc-700 transition-all active:scale-95"
        >
          <MessageCircle size={16} className="text-blue-600" />
          빠른 상담
        </button>
        <Link
          href="/quote"
          className="flex flex-[1.4] items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition-all active:scale-95"
        >
          <FileText size={16} />
          사진 3장 즉석 견적
        </Link>
      </div>
    </div>
  )
}
