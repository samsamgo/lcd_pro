'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Phone, Mail, FileText, MessageCircle } from 'lucide-react'
import { SITE } from '@/lib/seo/site'
import { useSiteModals } from '@/components/modals/SiteModals'

/**
 * 우측 하단 고정 문의 버튼 (데스크톱·태블릿 전용).
 *
 * 국내 시공·사이니지 업체 사이트의 표준 배치를 그대로 따른다 — 세로 스택,
 * 아래로 갈수록 강조. 모바일(<md)은 하단 바(MobileCtaBar)가 같은 역할을 하므로
 * 여기서는 렌더하지 않는다. 두 개가 동시에 뜨면 화면 우하단이 겹친다.
 *
 * 넣는 채널은 **실제로 열려 있는 것만**이다 (CEO 확인 2026-09-08):
 *   전화 = 회사 대표번호 042-621-7982. 개인 휴대폰은 넣지 않는다.
 *   이메일 = contact@wooktech.co.kr
 *   견적 = /quote
 * 카카오 채널은 개설 전이라 뺐다. 개설되면 SITE.kakaoChannelUrl 에 값이 들어오고,
 * 그때 이 배열에 한 줄 추가하면 된다.
 */
const TEL = SITE.phone.replace(/[^+\d]/g, '')

export function FloatingCta() {
  const [shown, setShown] = useState(false)
  const { openConsult } = useSiteModals()

  // 첫 화면에서는 히어로를 가리지 않게 조금 내려간 뒤 나타난다
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 280)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-6 right-5 z-40 hidden flex-col items-end gap-2 transition-all duration-300 ease-state md:flex ${
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <a
        href={`tel:${TEL}`}
        className="group flex h-12 items-center gap-0 overflow-hidden rounded-full border border-wk-line bg-white pl-3.5 pr-3.5 shadow-wk-2 transition-all duration-200 hover:border-wk-blue hover:pr-4"
        aria-label={`전화 문의 ${SITE.phone}`}
      >
        <Phone size={19} strokeWidth={1.9} className="shrink-0 text-wk-blue" aria-hidden="true" />
        <span className="max-w-0 whitespace-nowrap text-sm font-semibold text-wk-ink opacity-0 transition-all duration-200 group-hover:ml-2 group-hover:max-w-[9rem] group-hover:opacity-100">
          {SITE.phone}
        </span>
      </a>

      <a
        href={`mailto:${SITE.email}`}
        className="group flex h-12 items-center gap-0 overflow-hidden rounded-full border border-wk-line bg-white pl-3.5 pr-3.5 shadow-wk-2 transition-all duration-200 hover:border-wk-blue hover:pr-4"
        aria-label={`이메일 문의 ${SITE.email}`}
      >
        <Mail size={19} strokeWidth={1.9} className="shrink-0 text-wk-blue" aria-hidden="true" />
        <span className="max-w-0 whitespace-nowrap text-sm font-semibold text-wk-ink opacity-0 transition-all duration-200 group-hover:ml-2 group-hover:max-w-[13rem] group-hover:opacity-100">
          이메일 문의
        </span>
      </a>

      {/* 2026-09-09 — 빠른 상담(이름·연락처·한 줄). 타사(WEDS) 실제 화면의 우측 즉석 문의 패널에 해당.
          견적 마법사 4단계가 부담스러운 담당자에게 문턱 낮은 문 하나를 더 둔다. 모바일 하단바와 같은 모달 */}
      <button
        type="button"
        onClick={() => openConsult('floating')}
        className="group flex h-12 items-center gap-0 overflow-hidden rounded-full border border-wk-line bg-white pl-3.5 pr-3.5 shadow-wk-2 transition-all duration-200 hover:border-wk-blue hover:pr-4"
        aria-label="빠른 상담"
      >
        <MessageCircle size={19} strokeWidth={1.9} className="shrink-0 text-wk-blue" aria-hidden="true" />
        <span className="max-w-0 whitespace-nowrap text-sm font-semibold text-wk-ink opacity-0 transition-all duration-200 group-hover:ml-2 group-hover:max-w-[9rem] group-hover:opacity-100">
          빠른 상담
        </span>
      </button>

      <Link
        href="/quote"
        className="flex h-14 items-center gap-2 rounded-full bg-wk-cta px-5 text-sm font-bold text-white shadow-wk-glow transition-colors duration-200 hover:bg-wk-ctaActive"
      >
        <FileText size={19} strokeWidth={2} aria-hidden="true" />
        견적 문의
      </Link>
    </div>
  )
}
