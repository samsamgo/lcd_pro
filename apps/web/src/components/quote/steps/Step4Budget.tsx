'use client'

import { useFormContext } from 'react-hook-form'
import { AlertCircle } from 'lucide-react'

import type { QuoteFormData } from '../QuoteWizard'
import { Field, OptionButton, PrivacyConsent, TextArea } from '@/components/form'

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
    <div className="space-y-6">
      {/* 예산 */}
      <fieldset>
        <legend className="mb-2 block text-label font-semibold text-wk-ink">
          예상 예산 범위
          <span className="ml-1.5 text-caption font-normal text-wk-ink3">(선택)</span>
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {BUDGET_OPTIONS.map((o) => (
            <OptionButton
              key={o.value}
              selected={budget === o.value}
              onClick={() => setValue('budgetRange', o.value)}
            >
              {o.label}
            </OptionButton>
          ))}
        </div>
      </fieldset>

      {/* 추가 메모 */}
      <Field label="추가 요청사항">
        <TextArea
          {...register('additionalNotes')}
          placeholder="특이사항, 원하는 설치 일정, 허가 필요 여부 등을 자유롭게 적어주세요."
        />
      </Field>

      {/* 견적 면책 고지 */}
      <div className="rounded-btn border border-amber-500/20 bg-amber-500/5 p-4">
        <div className="flex gap-2.5">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-600" aria-hidden="true" />
          <p className="text-caption leading-relaxed text-amber-700/90">
            제출하신 견적은 <strong>범위 견적(추정치)</strong>입니다. 최종 금액은 전기·구조·
            허가 조건 등 현장 실사 후 확정됩니다. 계약 전 어떠한 비용도 청구되지 않습니다.
          </p>
        </div>
      </div>

      {/* 개인정보 동의 — 문구·체크박스 크기는 폼 4종이 같은 부품을 쓴다 */}
      <div>
        <PrivacyConsent
          {...register('agreePrivacy')}
          purpose="견적 발송"
          items="담당자명·연락처·기관명"
        />
        {errors.agreePrivacy && (
          <p role="alert" className="mt-1 text-label text-wk-bad">
            {errors.agreePrivacy.message}
          </p>
        )}
      </div>
    </div>
  )
}
