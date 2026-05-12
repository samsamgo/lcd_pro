'use client'

import { useFormContext } from 'react-hook-form'
import type { QuoteFormData } from '../QuoteWizard'
import { FormField } from '../FormField'
import { AlertCircle } from 'lucide-react'

const BUDGET_OPTIONS = [
  { value: '~200', label: '200만원 이하' },
  { value: '200-500', label: '200 ~ 500만원' },
  { value: '500-1000', label: '500만원 ~ 1천만원' },
  { value: '1000-3000', label: '1천 ~ 3천만원' },
  { value: '3000+', label: '3천만원 이상' },
  { value: 'unknown', label: '미정 (견적 후 결정)' },
]

export function Step4Budget() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<QuoteFormData>()
  const budget = watch('budgetRange')

  return (
    <div className="space-y-5">
      {/* 예산 */}
      <div>
        <label className="mb-2.5 block text-sm font-semibold text-zinc-200">
          예상 예산 범위 <span className="text-zinc-600 text-xs font-normal">(선택)</span>
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {BUDGET_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setValue('budgetRange', o.value)}
              className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                budget === o.value
                  ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* 추가 메모 */}
      <FormField label="추가 요청사항" error={undefined}>
        <textarea
          {...register('additionalNotes')}
          rows={3}
          placeholder="특이사항, 원하는 설치 일정, 허가 필요 여부 등을 자유롭게 적어주세요."
          className="input-base resize-none"
        />
      </FormField>

      {/* 견적 면책 고지 */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <div className="flex gap-2.5">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-400" />
          <p className="text-xs leading-relaxed text-amber-300/80">
            제출하신 견적은 <strong>범위 견적(추정치)</strong>입니다. 최종 금액은 전기·구조·
            허가 조건 등 현장 실사 후 확정됩니다. 계약 전 어떠한 비용도 청구되지 않습니다.
          </p>
        </div>
      </div>

      {/* 개인정보 동의 */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          {...register('agreePrivacy')}
          className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-blue-600 accent-blue-600"
        />
        <span className="text-sm text-zinc-400">
          견적 발송을 위한{' '}
          <a href="/privacy" target="_blank" className="underline text-blue-400 hover:text-blue-300">
            개인정보 수집 및 이용
          </a>
          에 동의합니다. (필수)
        </span>
      </label>
      {errors.agreePrivacy && (
        <p className="text-xs text-red-400">{errors.agreePrivacy.message}</p>
      )}
    </div>
  )
}
