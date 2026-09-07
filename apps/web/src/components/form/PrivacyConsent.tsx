'use client'

import Link from 'next/link'
import { forwardRef, type InputHTMLAttributes } from 'react'

import { useFormTone } from './tone'

/**
 * 목적어 조사(을/를). 'A/S 처리' + '을' 은 어색하다.
 * 한글 음절이면 종성 유무로 고르고, 그 외(영문·기호로 끝나는 경우)는 '를' 로 둔다.
 */
function objectParticle(word: string): '을' | '를' {
  const last = word.trim().slice(-1)
  const code = last.charCodeAt(0)
  if (code < 0xac00 || code > 0xd7a3) return '를'
  return (code - 0xac00) % 28 === 0 ? '를' : '을'
}

/**
 * 개인정보 수집·이용 동의.
 *
 * 네 폼이 서로 다른 문장·다른 체크박스 크기를 쓰고 있었다.
 *   /about   "문의 응대를 위한 개인정보(담당자명·연락처·이메일) 수집·이용에 동의합니다" + 방침 링크
 *   빠른상담  "문의 응대를 위한 개인정보(성함·연락처) 수집·이용에 동의합니다. 문의 처리 후 파기합니다" (링크 없음)
 *   A/S      "A/S 처리를 위한 개인정보(담당자명·연락처) 수집·이용에 동의합니다" (링크 없음, 🔴 체크박스 16px)
 *   견적     "견적 발송을 위한 [개인정보 수집 및 이용]에 동의합니다. (필수)"
 * 무엇을 받는지 안 적은 폼, 방침 링크가 없는 폼, 손가락으로 못 누르는 폼이 섞여 있었다.
 *
 * 통일 규칙 — **목적 + 받는 항목 + 파기 + 방침 링크 + (필수)** 다섯이 항상 있다.
 * 목적과 항목만 폼이 정하고 나머지는 부품이 쓴다.
 *
 * 🔴 탭 타깃 — 체크박스 20px, 행 전체 44px 이상.
 */
export const PrivacyConsent = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & {
    /** 무엇을 하기 위해 받는가. 예) 'A/S 처리' */
    purpose: string
    /** 무엇을 받는가. 예) '담당자명·연락처' */
    items: string
  }
>(function PrivacyConsent({ purpose, items, className, ...props }, ref) {
  const t = useFormTone()
  return (
    <label
      className={`flex min-h-[44px] cursor-pointer items-start gap-3 py-2 text-label ${t.muted} ${className ?? ''}`}
    >
      <input
        ref={ref}
        type="checkbox"
        className="mt-0.5 h-5 w-5 shrink-0 accent-wk-cta"
        {...props}
      />
      <span>
        {purpose}
        {objectParticle(purpose)} 위해 개인정보({items})를 수집·이용하는 데 동의합니다. 목적
        달성 후 파기합니다.{' '}
        <Link href="/privacy" target="_blank" rel="noopener" className={t.link}>
          개인정보처리방침
        </Link>{' '}
        <span className={t.required}>(필수)</span>
      </span>
    </label>
  )
})
