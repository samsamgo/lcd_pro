'use client'

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useSiteModals } from '@/components/modals/SiteModals'

/**
 * 우측 하단 고정 "빠른 상담" 아이콘 — 전 뷰포트 공통, 누르면 QuickConsultModal.
 *
 * 🔴 2026-09-10 CEO "그냥 빠른상담만 작은 아이콘해서 오른쪽 하단에 모달로 띄워 놓고."
 *    이전엔 데스크톱 = 전화·이메일·빠른상담·견적 4단 스택, 모바일 = 하단 바(MobileCtaBar).
 *    둘 다 걷어내고 이 버튼 하나만 남긴다. 전화·이메일·견적은 헤더·푸터·모달 안에서 간다.
 *    MobileCtaBar 는 각 페이지가 아직 import 하므로 파일은 두고 렌더만 비웠다.
 *
 * 히어로를 가리지 않게 조금 내려간 뒤 나타난다(원래 동작 유지).
 */
export function FloatingCta() {
  const [shown, setShown] = useState(false)
  const { openConsult } = useSiteModals()

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 160)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => openConsult('floating')}
      aria-label="빠른 상담"
      title="빠른 상담"
      className={`fixed bottom-5 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-wk-cta text-white shadow-wk-glow transition-all duration-300 ease-state hover:bg-wk-ctaActive md:bottom-6 md:right-6 md:h-[52px] md:w-[52px] ${
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
      style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
    >
      <MessageCircle size={22} strokeWidth={2.1} aria-hidden="true" />
    </button>
  )
}
