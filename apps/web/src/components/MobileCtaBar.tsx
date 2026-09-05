'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { MessageCircle, FileText, X } from 'lucide-react'
import { useSiteModals } from '@/components/modals/SiteModals'

const DISMISS_KEY = 'wk-mobile-cta-dismissed'
/** 페이지의 40% 지점을 지난 뒤에만 등장한다 */
const SCROLL_RATIO_THRESHOLD = 0.4

/**
 * 모바일 하단 고정 CTA 바.
 * - 40% 스크롤 이후 등장, 아래로 스크롤하면 숨고 위로 스크롤하면 다시 나타난다(축소 아님).
 * - 닫기 버튼 — 누르면 세션 동안 다시 뜨지 않는다(sessionStorage).
 * - 모바일 키보드가 올라오면(visualViewport 축소) 숨긴다.
 * - md 이상(데스크톱)에서는 렌더하지 않는다.
 */
export function MobileCtaBar() {
  const [pastThreshold, setPastThreshold] = useState(false)
  const [hiddenByDirection, setHiddenByDirection] = useState(false)
  const [dismissed, setDismissed] = useState(true) // 초기엔 숨김 — sessionStorage 확인 전까지 깜빡임 방지
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const { openConsult } = useSiteModals()
  const lastY = useRef(0)

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === '1')
    } catch {
      setDismissed(false)
    }
    lastY.current = window.scrollY
  }, [])

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const y = window.scrollY
        const max = document.documentElement.scrollHeight - window.innerHeight
        const ratio = max > 0 ? y / max : 0
        setPastThreshold(ratio >= SCROLL_RATIO_THRESHOLD)

        const delta = y - lastY.current
        if (Math.abs(delta) > 4) {
          setHiddenByDirection(delta > 0) // 아래로 스크롤 = 숨김
          lastY.current = y
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  // 모바일 키보드가 올라오면 visualViewport 높이가 줄어든다
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const onResize = () => {
      setKeyboardOpen(vv.height < window.innerHeight * 0.75)
    }
    onResize()
    vv.addEventListener('resize', onResize)
    return () => vv.removeEventListener('resize', onResize)
  }, [])

  const dismiss = () => {
    setDismissed(true)
    try {
      sessionStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // 세션 저장 불가 — 표시 억제만 못할 뿐 기능엔 지장 없다
    }
  }

  const visible = pastThreshold && !dismissed && !keyboardOpen && !hiddenByDirection

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-wk-line bg-white/95 backdrop-blur-md transition-transform duration-200 ease-state md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-md items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={dismiss}
          aria-label="닫기"
          tabIndex={visible ? 0 : -1}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn text-wk-ink3 transition-colors duration-150 hover:bg-wk-bgFaint hover:text-wk-ink2"
        >
          <X size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => openConsult('mobile-bar')}
          tabIndex={visible ? 0 : -1}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-btn border border-wk-line2 py-3 text-sm font-semibold text-wk-ink2 transition-colors duration-150 active:bg-wk-bgFaint"
        >
          <MessageCircle size={16} className="text-wk-blue" aria-hidden="true" />
          빠른 상담
        </button>
        <Link
          href="/quote"
          tabIndex={visible ? 0 : -1}
          className="flex flex-[1.4] items-center justify-center gap-1.5 rounded-btn bg-wk-cta py-3 text-sm font-bold text-white transition-colors duration-150 active:bg-wk-ctaActive"
        >
          <FileText size={16} aria-hidden="true" />
          개략 견적 바로 확인
        </Link>
      </div>
    </div>
  )
}
