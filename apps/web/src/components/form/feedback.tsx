'use client'

import { AlertCircle, CheckCircle2 } from 'lucide-react'
import type { ReactNode } from 'react'

import { SITE } from '@/lib/seo/site'
import { useFormTone } from './tone'

/**
 * 폼 전체 오류(제출 실패 · 검증 실패).
 *
 * 넷이 제각각이었다 — 견적 마법사만 테두리 있는 상자였고 나머지 셋은 맨 문장이라
 * 오류가 났는지 눈치채기 어려웠다. 상자 + 아이콘 + `role="alert"` 로 통일한다.
 *
 * 🔴 문구는 부품이 만들지 않는다. 서버가 준 사유(`readApiError`)를 그대로 싣는다.
 *    "접수 중 문제가 발생했습니다" 로 뭉개면 담당자는 무엇을 고쳐야 하는지 모른 채 이탈한다.
 */
export function FormError({ children }: { children?: ReactNode }) {
  const t = useFormTone()
  if (!children) return null
  return (
    <p
      role="alert"
      className={`flex items-start gap-2 rounded-btn border px-4 py-3 text-label font-medium ${t.errorBox}`}
    >
      <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

/** 접수 실패 시 대체 연락 수단까지 붙인 기본 문구. 폼 4종이 같은 말을 쓴다. */
export const SUBMIT_FAILED = `접수 중 문제가 발생했습니다. ${SITE.email} 으로 보내주시면 확인하겠습니다.`

/**
 * 접수 후 안내 — "언제 무엇이 오는지".
 *
 * 완료 화면이 폼마다 다른 말을 하고 있었다.
 *   /about  "영업일 기준 1일 안에 연락드립니다" (시한 있음)
 *   빠른상담 "영업일 기준 1일 이내에 연락드립니다" (시한 있음, 표현만 다름)
 *   A/S     "담당자가 확인 후 연락드립니다"      ← 🔴 시한이 없다
 *   견적    "영업일 기준 1일 안에 담당자가 연락드립니다" (시한 있음)
 * 시한이 없는 완료 화면은 기다릴지 다른 데를 알아볼지 판단할 근거를 주지 않는다.
 * 약속은 한 곳에서만 적는다.
 */
export const RESPONSE_PROMISE = '영업일 기준 1일 안에 담당자가 연락드립니다.'

export function ResponsePromise({ detail }: { detail?: ReactNode }) {
  const t = useFormTone()
  return (
    <div className={`rounded-btn border p-4 text-left sm:p-5 ${t.noticeBox}`}>
      <p className={`text-label font-semibold ${t.title}`}>{RESPONSE_PROMISE}</p>
      <p className={`mt-1.5 text-caption leading-relaxed ${t.hint}`}>
        {detail ?? (
          <>
            남겨주신 연락처로 먼저 전화드립니다. 요청하시면 개략 견적 범위와 제품 규격서를
            문서로 보내드립니다.
          </>
        )}
        {SITE.openingHours && ` 연락 가능 시간은 ${SITE.openingHours}입니다.`}
        {SITE.phone && ` 급한 건은 ${SITE.phone} 로 전화 주셔도 됩니다.`}
      </p>
    </div>
  )
}

/**
 * 완료 화면 — 폼 4종이 같은 형식으로 끝난다.
 * 확인 표시 → 무엇이 접수됐는지 → 언제 무엇이 오는지 → (필요하면) 추가 안내.
 */
export function FormSuccess({
  title,
  detail,
  promiseDetail,
  children,
}: {
  title: string
  detail?: ReactNode
  /** 접수 후 안내 문단을 폼 성격에 맞게 바꿀 때 */
  promiseDetail?: ReactNode
  children?: ReactNode
}) {
  const t = useFormTone()
  return (
    <div>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wk-cta/10">
          <CheckCircle2 size={20} className="text-wk-cta" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className={`wk-h3 ${t.title}`}>{title}</p>
          {detail && <p className={`mt-2 text-label ${t.body}`}>{detail}</p>}
        </div>
      </div>

      <div className="mt-5">
        <ResponsePromise detail={promiseDetail} />
      </div>

      {children}
    </div>
  )
}
