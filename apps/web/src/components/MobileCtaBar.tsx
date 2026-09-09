'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Phone, FileText, X } from 'lucide-react'
import { SITE } from '@/lib/seo/site'

const TEL = SITE.phone.replace(/[^+\d]/g, '')

const DISMISS_KEY = 'wk-mobile-cta-dismissed'
/** 첫 화면(히어로)을 벗어나면 바로 등장한다 — 2026-09-09 CEO "전화·문의 더 눈에 띄게". 종전 40% 지점은 너무 늦었다 */
const SCROLL_PX_THRESHOLD = 240

/**
 * 모바일 하단 고정 CTA 바.
 * - 히어로를 지나면 등장하고 그 뒤로는 계속 떠 있다. (종전 '아래로 스크롤하면 숨김'은 2026-09-09 실측에서
 *   담당자가 읽어 내려가는 동안 바가 늘 숨어 있어 없는 것과 같았다 → 제거. 닫기 버튼은 그대로)
 * - 2026-09-09 전화 버튼 신설. 담당자는 폰에서 보면 바로 걸고 싶어 한다 — 견적 폼보다 빠른 문이 필요하다.
 * - 닫기 버튼 — 누르면 세션 동안 다시 뜨지 않는다(sessionStorage).
 * - 모바일 키보드가 올라오면(visualViewport 축소) 숨긴다.
 * - md 이상(데스크톱)에서는 렌더하지 않는다.
 */
export function MobileCtaBar() {
  const [pastThreshold, setPastThreshold] = useState(false)
  const [dismissed, setDismissed] = useState(true) // 초기엔 숨김 — sessionStorage 확인 전까지 깜빡임 방지
  const [keyboardOpen, setKeyboardOpen] = useState(false)

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

  const visible = pastThreshold && !dismissed && !keyboardOpen

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
          className="flex flex-1 items-center justify-center gap-1.5 rounded-btn border border-wk-blue/40 bg-wk-blue/5 py-3 text-sm font-bold text-wk-blue transition-colors duration-150 active:bg-wk-blue/10"
        >
          <Phone size={16} aria-hidden="true" />
          전화 문의
        </a>
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
