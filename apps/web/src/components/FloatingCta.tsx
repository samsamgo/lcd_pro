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
/* 알약 — 기본은 아이콘만, 호버하면 오른쪽으로 글자가 펼쳐진다(원래 동작) */
const PILL =
  'group flex h-[52px] items-center gap-0 overflow-hidden rounded-full border border-wk-line bg-white p-1 shadow-wk-2 transition-all duration-200 hover:border-wk-blue hover:pr-4'
/* 아이콘 원판 — 파란 바탕에 흰 아이콘. 흰 알약 안에서 이것만 색이 있어 눈에 먼저 들어온다 */
const ICON =
  'flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-wk-blue text-white shadow-[0_2px_8px_rgba(222,103,29,0.35)]'
const LABEL =
  'max-w-0 whitespace-nowrap text-sm font-semibold text-wk-ink opacity-0 transition-all duration-200 group-hover:ml-2.5 group-hover:max-w-[13rem] group-hover:opacity-100'

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
      {/* 2026-09-09 CEO "번호만 보이게 하지 말고 아이콘 쓰되 눈에 더 잘 띄게 — 이메일·연락 전부".
          구조는 원래(아이콘, 호버 시 펼침) 그대로. 아이콘만 파란 원판 위 흰색으로 키워 한눈에 들어오게 한다. */}
      <a
        href={`tel:${TEL}`}
        className={PILL}
        aria-label={`전화 문의 ${SITE.phone}`}
      >
        <span className={ICON}><Phone size={20} strokeWidth={2.1} aria-hidden="true" /></span>
        <span className={LABEL}>{SITE.phone}</span>
      </a>

      <a
        href={`mailto:${SITE.email}`}
        className={PILL}
        aria-label={`이메일 문의 ${SITE.email}`}
      >
        <span className={ICON}><Mail size={20} strokeWidth={2.1} aria-hidden="true" /></span>
        <span className={LABEL}>이메일 문의</span>
      </a>

      {/* 2026-09-09 — 빠른 상담(이름·연락처·한 줄). 타사(WEDS) 실제 화면의 우측 즉석 문의 패널에 해당.
          견적 마법사 4단계가 부담스러운 담당자에게 문턱 낮은 문 하나를 더 둔다. 모바일 하단바와 같은 모달 */}
      <button
        type="button"
        onClick={() => openConsult('floating')}
        className={PILL}
        aria-label="빠른 상담"
      >
        <span className={ICON}><MessageCircle size={20} strokeWidth={2.1} aria-hidden="true" /></span>
        <span className={LABEL}>빠른 상담</span>
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
