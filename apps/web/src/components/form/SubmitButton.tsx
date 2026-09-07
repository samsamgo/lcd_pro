'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * 제출 버튼.
 *
 * 문구 규칙 — **평상시는 폼마다 다른 동사구, 전송 중은 항상 같은 말.**
 * 전에는 '접수 중…' 셋 · '제출 중…' 하나로 갈려 있었다. 같은 회사 사이트에서
 * 어떤 폼은 접수되고 어떤 폼은 제출된다고 말할 이유가 없다.
 *
 * 전송 중에는 `disabled` + `aria-busy` 를 함께 건다. 중복 제출을 막고,
 * 스크린리더에도 "지금 처리 중" 이 전달된다(예전엔 시각적으로만 흐려졌다).
 */
export function SubmitButton({
  pending,
  children,
  className,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  pending?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending || undefined}
      className={cn('wk-btn-p disabled:cursor-not-allowed disabled:opacity-50', className)}
      {...props}
    >
      {pending ? '접수 중…' : children}
    </button>
  )
}
