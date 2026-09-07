'use client'

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useFormTone } from './tone'

/**
 * 입력 상자 3종 — 텍스트 · 여러 줄 · 선택.
 *
 * 각 폼이 `className="input-base"` 를 직접 적던 것을 부품으로 바꾼다.
 * 다크 구간(`/about#contact`)은 `.wk-input-dark` 를 써야 하는데, 그걸 각 폼이
 * 기억해야 하면 다음에 폼을 하나 더 만들 때 또 갈라진다. 톤은 부품이 안다.
 *
 * react-hook-form 의 `{...register('x')}` 를 그대로 펼칠 수 있게 forwardRef 다.
 */
export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className, ...props }, ref) {
    const t = useFormTone()
    return <input ref={ref} className={cn(t.input, className)} {...props} />
  },
)

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextArea({ className, ...props }, ref) {
  const t = useFormTone()
  // 최소 높이를 부품이 정한다. 폼마다 110px·128px 로 갈려 있었다.
  return <textarea ref={ref} className={cn(t.input, 'min-h-[120px] resize-y', className)} {...props} />
})

export const SelectInput = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function SelectInput({ className, ...props }, ref) {
  const t = useFormTone()
  return <select ref={ref} className={cn(t.input, className)} {...props} />
})

/**
 * 선택형 버튼(업종 · 설치환경 · 설치일정 · 예산).
 *
 * 견적 1단계는 전역 `.wk-chip-on/off` 를 쓰는데 2·4단계는 각자 `rounded-xl border …`
 * 를 직접 적어 두었다. 같은 마법사 안에서도 선택 버튼이 두 종류로 보였다.
 * 하나로 모으고, 선택 상태를 색만으로 알리지 않도록 체크 표시를 함께 준다.
 *
 * 탭 타깃 — 높이 44px 이상. 예전에 38px 짜리가 실제로 적발됐다.
 */
export function OptionButton({
  selected,
  hint,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  selected: boolean
  /** 라벨 뒤 작은 보조 설명 */
  hint?: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'flex min-h-[44px] items-center justify-center gap-1.5 text-center',
        selected ? 'wk-chip-on' : 'wk-chip-off',
        className,
      )}
      {...props}
    >
      {selected && <Check size={14} strokeWidth={3} aria-hidden="true" />}
      <span>
        {children}
        {hint && <span className="ml-1.5 text-caption font-normal opacity-70">{hint}</span>}
      </span>
    </button>
  )
}

/**
 * 체크박스 한 줄(옵션 선택용). 동의 체크는 `PrivacyConsent` 를 쓴다.
 * 체크박스 자체를 20px 로 두고 행 전체를 44px 로 잡는다 — 16px 짜리는 손가락으로 못 누른다.
 */
export const CheckRow = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label: ReactNode }
>(function CheckRow({ label, className, ...props }, ref) {
  const t = useFormTone()
  return (
    <label
      className={cn(
        'flex min-h-[44px] cursor-pointer items-center gap-3 py-1 text-label',
        t.body,
        className,
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        className="h-5 w-5 shrink-0 accent-wk-cta"
        {...props}
      />
      <span>{label}</span>
    </label>
  )
})
