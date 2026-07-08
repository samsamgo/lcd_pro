'use client'

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModalProps {
  open: boolean
  onClose: () => void
  /** 접근성: 제목 (aria-labelledby 로 연결). title 을 넣으면 헤더가 렌더된다. */
  title?: ReactNode
  /** 제목 밑 보조 설명 */
  description?: ReactNode
  children: ReactNode
  /** 데스크톱 카드 최대 너비 (tailwind max-w-*). 기본 max-w-lg */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** 모바일에서 바텀시트로 표시 (기본 true). false 면 중앙 카드 유지 */
  mobileSheet?: boolean
  /** 백드롭 클릭으로 닫기 (기본 true) */
  dismissable?: boolean
  /** 우측 상단 닫기 버튼 표시 (기본 true) */
  showClose?: boolean
  /** 헤더/본문 패딩 없이 자유 레이아웃 (예: 라이트박스) */
  bare?: boolean
  className?: string
}

const SIZES: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  full: 'sm:max-w-6xl',
}

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  mobileSheet = true,
  dismissable = true,
  showClose = true,
  bare = false,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const reduce = useReducedMotion()
  const titleId = useId()
  const descId = useId()

  // ESC 로 닫기 + 포커스 트랩(Tab 순환)
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dismissable) {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const nodes = panel.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (nodes.length === 0) {
        e.preventDefault()
        return
      }
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [dismissable, onClose],
  )

  useEffect(() => {
    if (!open) return
    previouslyFocused.current = document.activeElement as HTMLElement | null

    // 본문 스크롤 락 (레이아웃 시프트 방지 위해 패딩 보정)
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = document.body.style.overflow
    const prevPadding = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`

    document.addEventListener('keydown', onKeyDown, true)

    // 최초 포커스 이동 (패널 내 첫 포커서블, 없으면 패널)
    const t = window.setTimeout(() => {
      const panel = panelRef.current
      const focusable = panel?.querySelector<HTMLElement>(FOCUSABLE)
      ;(focusable ?? panel)?.focus()
    }, 0)

    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKeyDown, true)
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPadding
      // 닫힐 때 이전 포커스 복원
      previouslyFocused.current?.focus?.()
    }
  }, [open, onKeyDown])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-stretch justify-center sm:items-center sm:p-4"
          aria-hidden={false}
        >
          {/* 백드롭 */}
          <motion.div
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            onClick={dismissable ? onClose : undefined}
          />

          {/* 패널 */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: mobileSheet ? 40 : 12, scale: mobileSheet ? 1 : 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: mobileSheet ? 40 : 12, scale: mobileSheet ? 1 : 0.98 }
            }
            transition={{ duration: reduce ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative z-10 mt-auto flex max-h-[92dvh] w-full flex-col overflow-hidden bg-white shadow-2xl outline-none',
              mobileSheet
                ? 'rounded-t-3xl sm:mt-0 sm:rounded-2xl'
                : 'mt-0 rounded-2xl',
              SIZES[size],
              className,
            )}
          >
            {/* 모바일 그랩 핸들 */}
            {mobileSheet && (
              <div className="flex justify-center pt-3 sm:hidden" aria-hidden="true">
                <span className="h-1.5 w-10 rounded-full bg-zinc-300" />
              </div>
            )}

            {(title || showClose) && !bare && (
              <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-5">
                <div className="min-w-0">
                  {title && (
                    <h2 id={titleId} className="text-lg font-bold text-zinc-900">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id={descId} className="mt-1 text-sm text-zinc-600">
                      {description}
                    </p>
                  )}
                </div>
                {showClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="닫기"
                    className="-mr-2 -mt-1 shrink-0 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}

            {/* 헤더 없는 bare 모드에서도 닫기 버튼은 띄운다 */}
            {bare && showClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="absolute right-3 top-3 z-20 rounded-full bg-zinc-950/50 p-2 text-white backdrop-blur transition-colors hover:bg-zinc-950/70"
              >
                <X size={20} />
              </button>
            )}

            <div className={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain', bare ? '' : 'px-6 pb-6')}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
