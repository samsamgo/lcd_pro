'use client'

import { useFormContext } from 'react-hook-form'
import { Check } from 'lucide-react'

import type { QuoteFormData } from '../QuoteWizard'
import { FormField } from '../FormField'

/**
 * 1단계 — 어디에서 오셨는지.
 *
 * 순서를 바꿨다. 기존 목록은 카페·음식점·바가 맨 앞이었는데,
 * 회사가 관공서·학교로 방향을 잡은 뒤에도 그대로 남아 있었다.
 * 담당 공무원이 자기 기관을 목록 끝에서 찾아야 하는 폼은 그 자체로 신호를 준다.
 *
 * value 는 QuoteWizard 의 스키마와 API 계약이라 건드리지 않는다. 순서와 라벨만 바꾼다.
 */
const BUSINESS_TYPES = [
  { value: 'government', label: '관공서 · 공공기관' },
  { value: 'school', label: '학교 · 교육기관' },
  { value: 'hospital', label: '병원 · 보건소' },
  { value: 'academy', label: '학원 · 평생교육' },
  { value: 'gym', label: '체육 · 문화시설' },
  { value: 'factory', label: '공장 · 물류' },
  { value: 'franchise', label: '프랜차이즈' },
  { value: 'restaurant', label: '음식점' },
  { value: 'cafe', label: '카페' },
  { value: 'bar', label: '주점' },
  { value: 'other', label: '기타' },
] as const

const REGIONS = [
  '서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산',
  '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
]

export function Step1BusinessInfo() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<QuoteFormData>()
  const selected = watch('businessType')

  return (
    <div className="space-y-7">
      <fieldset>
        <legend className="mb-3 block text-label font-semibold text-wk-ink">
          기관 · 업종
          <span aria-hidden="true" className="ml-1 text-wk-cta">
            *
          </span>
          <span className="sr-only"> (필수)</span>
        </legend>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {BUSINESS_TYPES.map((t) => {
            const on = selected === t.value
            return (
              <button
                key={t.value}
                type="button"
                aria-pressed={on}
                onClick={() => setValue('businessType', t.value, { shouldValidate: true })}
                className={`flex items-center justify-center gap-1.5 text-center ${
                  on ? 'wk-chip-on' : 'wk-chip-off'
                }`}
              >
                {/* 선택을 색만으로 알리지 않는다 — 체크 표시와 굵기를 함께 준다 */}
                {on && <Check size={14} strokeWidth={3} aria-hidden="true" />}
                {t.label}
              </button>
            )
          })}
        </div>

        {errors.businessType && (
          <p role="alert" className="mt-2.5 text-label text-wk-bad">
            {errors.businessType.message}
          </p>
        )}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="기관명 · 상호" error={errors.businessName?.message} required>
          <input
            {...register('businessName')}
            placeholder="예: OO시청, OO초등학교"
            autoComplete="organization"
            className="input-base"
          />
        </FormField>

        <FormField label="담당자 성함" error={errors.contactName?.message} required>
          <input
            {...register('contactName')}
            placeholder="예: 홍길동"
            autoComplete="name"
            className="input-base"
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="연락처"
          error={errors.phone?.message}
          hint="개략 견적과 규격서를 보내드릴 때만 사용합니다."
          required
        >
          <input
            {...register('phone')}
            placeholder="010-0000-0000"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="input-base"
          />
        </FormField>

        <FormField label="설치 지역" error={errors.region?.message} required>
          <select {...register('region')} className="input-base">
            <option value="">지역 선택</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </FormField>
      </div>
    </div>
  )
}
