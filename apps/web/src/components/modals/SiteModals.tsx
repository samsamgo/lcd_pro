'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { QuickConsultModal } from './QuickConsultModal'

type ModalKey = 'consult' | null

interface SiteModalsCtx {
  openConsult: (source?: string) => void
  close: () => void
}

const Ctx = createContext<SiteModalsCtx | null>(null)

/** 전역 모달 컨트롤러 — 어느 CTA에서든 useSiteModals().openConsult() 로 상담 모달을 연다. */
export function SiteModalsProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ModalKey>(null)
  const [source, setSource] = useState<string | undefined>(undefined)

  const openConsult = useCallback((src?: string) => {
    setSource(src)
    setActive('consult')
  }, [])
  const close = useCallback(() => setActive(null), [])

  return (
    <Ctx.Provider value={{ openConsult, close }}>
      {children}
      <QuickConsultModal open={active === 'consult'} onClose={close} source={source} />
    </Ctx.Provider>
  )
}

export function useSiteModals(): SiteModalsCtx {
  const ctx = useContext(Ctx)
  if (!ctx) {
    // Provider 밖에서 호출돼도 앱이 죽지 않도록 no-op 폴백
    return { openConsult: () => {}, close: () => {} }
  }
  return ctx
}
