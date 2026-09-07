'use client'

import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from 'react'
import { AlertCircle } from 'lucide-react'

import { useFormTone } from './tone'

/**
 * 폼 한 칸 — 라벨 · 필수 표시 · 설명 · 오류를 한 형식으로 묶는다.
 *
 * 원래 `components/quote/FormField.tsx` 에만 있던 부품이다.
 * 견적 마법사만 이걸 쓰고 나머지 폼 3종(빠른 상담 · A/S · /about 문의)은
 * 각자 `<label><span>…</span><input/></label>` 을 직접 적었다. 그래서
 *   ①라벨 글자 크기가 `text-label` 과 `text-sm` 로 갈리고
 *   ②필수 표시가 빨간 `*` 와 "필수" 글자로 갈리고
 *   ③오류가 어떤 곳은 아이콘 있고 어떤 곳은 없고
 *   ④라벨과 입력이 `htmlFor` 로 연결되지 않아 스크린리더가 칸 이름을 못 읽었다.
 * 넷을 한 부품으로 모은다.
 *
 * 접근성 — id 를 만들어 자식 입력에 주입하고, 오류가 있으면 `aria-invalid`·
 * `aria-describedby` 를 함께 건다. 각 폼이 id 를 직접 관리하지 않아도 된다.
 *
 * 설명(hint)은 입력 **아래**에 둔다. 위에 두면 2열 격자에서 설명이 있는 칸만
 * 입력이 내려가 옆 칸과 줄이 어긋난다.
 */
export function Field({
  label,
  error,
  required,
  hint,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  /** 입력 전에 알아야 하는 설명. 오류 메시지와 자리를 나눠 쓴다 */
  hint?: string
  children: ReactNode
}) {
  const t = useFormTone()
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  const described = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ')

  const child = Children.only(children)
  const bound = isValidElement(child)
    ? cloneElement(child as ReactElement<Record<string, unknown>>, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': described || undefined,
        'aria-required': required || undefined,
      })
    : child

  return (
    <div>
      <label htmlFor={id} className={`mb-2 block text-label font-semibold ${t.label}`}>
        {label}
        {required && (
          <>
            {/* 필수 표시는 별표 하나로 통일한다. "필수" 글자를 칸마다 붙이면
                라벨 줄이 길어져 2열 격자에서 줄바꿈이 제각각 생긴다. */}
            <span aria-hidden="true" className={`ml-1 ${t.required}`}>
              *
            </span>
            <span className="sr-only"> (필수)</span>
          </>
        )}
      </label>

      {bound}

      {hint && !error && (
        <p id={hintId} className={`mt-2 text-caption ${t.hint}`}>
          {hint}
        </p>
      )}

      {error && (
        // 색만으로 오류를 알리지 않는다 — 아이콘 + 문구를 함께 쓴다
        <p
          id={errorId}
          role="alert"
          className={`mt-2 flex items-start gap-1.5 text-label ${t.error}`}
        >
          <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

/**
 * 폼 맨 위에 한 줄. "이 폼에서 꼭 채워야 하는 칸이 몇 개뿐" 임을 먼저 알린다.
 * 별표만 두면 무엇이 필수인지 훑어봐야 알 수 있다.
 */
export function RequiredLegend({ children }: { children?: ReactNode }) {
  const t = useFormTone()
  return (
    <p className={`text-caption ${t.hint}`}>
      {children ?? (
        <>
          <span aria-hidden="true" className={t.required}>
            *
          </span>{' '}
          표시가 있는 칸만 채우시면 됩니다. 나머지는 비워두셔도 접수됩니다.
        </>
      )}
    </p>
  )
}
