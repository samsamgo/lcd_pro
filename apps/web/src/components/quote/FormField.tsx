'use client'

import { Children, cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

/**
 * 폼 한 칸.
 *
 * 고친 것 — 기존 구현은 `<label>` 이 입력과 연결돼 있지 않았다.
 * `htmlFor` 도 없고 입력을 감싸지도 않아서, 스크린리더가 "상호명" 을 읽지 못하고
 * 빈 편집창으로만 안내했다. 라벨을 눌러도 포커스가 가지 않았다.
 * WCAG 3.3.2(레이블 또는 지시) 위반이다.
 *
 * 그래서 여기서 id 를 만들어 자식 입력에 주입한다.
 * 오류가 있으면 `aria-invalid` 와 `aria-describedby` 도 함께 건다.
 * 각 단계 파일을 전부 고치지 않아도 되도록 주입 방식으로 처리했다.
 *
 * 힌트는 입력 **아래**에 둔다. 위에 두면 2열 격자에서 힌트가 있는 칸만
 * 입력이 내려가 옆 칸과 줄이 어긋난다(연락처 칸만 밀려 보이던 원인).
 */
export function FormField({
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
      <label htmlFor={id} className="mb-2 block text-label font-semibold text-wk-ink">
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="ml-1 text-wk-cta">
              *
            </span>
            <span className="sr-only"> (필수)</span>
          </>
        )}
      </label>

      {bound}

      {hint && !error && (
        <p id={hintId} className="wk-cap mt-2">
          {hint}
        </p>
      )}

      {error && (
        // 색만으로 오류를 알리지 않는다 — 아이콘 + 문구를 함께 쓴다
        <p id={errorId} role="alert" className="mt-2 flex items-start gap-1.5 text-label text-wk-bad">
          <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
