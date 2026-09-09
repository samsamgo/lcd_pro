'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Phone, MessageCircle, FileText, X } from 'lucide-react'
import { SITE } from '@/lib/seo/site'
import { useSiteModals } from '@/components/modals/SiteModals'

const TEL = SITE.phone.replace(/[^+\d]/g, '')

const DISMISS_KEY = 'wk-mobile-cta-dismissed'
/** 첫 화면(히어로)을 벗어나면 바로 등장한다 — 2026-09-09 CEO "전화·문의 더 눈에 띄게". 종전 40% 지점은 너무 늦었다 */
const SCROLL_PX_THRESHOLD = 240

/**
 * 모바일 하단 고정 CTA 바.
 * - 히어로를 지나면 등장, 아래로 스크롤하면 숨고 위로 스크롤하면 다시 나타난다(원래 동작).
 *   2026-09-09 전화 아이콘 버튼 하나만 추가 — CEO "기존과 비슷하게, 조금만 눈에 띄게"
 * - 2026-09-09 전화 버튼 신설. 담당자는 폰에서 보면 바로 걸고 싶어 한다 — 견적 폼보다 빠른 문이 필요하다.
 * - 닫기 버튼 — 누르면 세션 동안 다시 뜨지 않는다(sessionStorage).
 * - 모바일 키보드가 올라오면(visualViewport 축소) 숨긴다.
 * - md 이상(데스크톱)에서는 렌더하지 않는다.
 */
export function MobileCtaBar() {
  const [pastThreshold, setPastThreshold] = useState(false)
  const [dismissed, setDismissed] = useState(true) // 초기엔 숨김 — sessionStorage 확인 전까지 깜빡임 방지
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [hiddenByDirection, setHiddenByDirection] = useState(false)
  const { openConsult } = useSiteModals()
  const lastY = useRef(0)

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === '1')
    } catch {
      setDismissed(false)
    }
  }, [])

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const y = window.scrollY
        setPastThreshold(y >= SCROLL_PX_THRESHOLD)

        const delta = y - lastY.current
        if (Math.abs(delta) > 4) {
          setHiddenByDirection(delta > 0) // 아래로 스크롤 = 숨김, 위로 = 다시 등장
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
        <a
          href={`tel:${TEL}`}
          tabIndex={visible ? 0 : -1}
          aria-label={`전화 문의 ${SITE.phone}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn border border-wk-line2 text-wk-blue transition-colors duration-150 active:bg-wk-bgFaint"
        >
          <Phone size={17} aria-hidden="true" />
        </a>
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
          견적 문의
        </Link>
      </div>
    </div>
  )
}
