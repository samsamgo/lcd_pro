'use client'

import { useFormContext } from 'react-hook-form'
import type { QuoteFormData } from '../QuoteWizard'
import { FormField } from '../FormField'

const BUSINESS_TYPES = [
  { value: 'cafe', label: '카페' },
  { value: 'restaurant', label: '음식점/레스토랑' },
  { value: 'bar', label: '바/펍' },
  { value: 'hospital', label: '병원/의원' },
  { value: 'academy', label: '학원/교육' },
  { value: 'gym', label: '헬스장/스포츠' },
  { value: 'franchise', label: '프랜차이즈' },
  { value: 'school', label: '학교' },
  { value: 'government', label: '공공기관' },
  { value: 'factory', label: '공장/물류' },
  { value: 'other', label: '기타' },
]

const REGIONS = [
  '서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산',
  '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
]

export function Step1BusinessInfo() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<QuoteFormData>()
  const selectedType = watch('businessType')

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2.5 block text-sm font-semibold text-zinc-200">
          업종 선택 <span className="text-blue-400">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {BUSINESS_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setValue('businessType', t.value as QuoteFormData['businessType'])}
              className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                selectedType === t.value
                  ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {errors.businessType && (
          <p className="mt-1.5 text-xs text-red-400">{errors.businessType.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="상호명" error={errors.businessName?.message} required>
          <input
            {...register('businessName')}
            placeholder="예: OO카페 홍대점"
            className="input-base"
          />
        </FormField>

        <FormField label="담당자 이름" error={errors.contactName?.message} required>
          <input
            {...register('contactName')}
            placeholder="예: 홍길동"
            className="input-base"
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="연락처" error={errors.phone?.message} required>
          <input
            {...register('phone')}
            placeholder="010-0000-0000"
            type="tel"
            className="input-base"
          />
        </FormField>

        <FormField label="설치 지역" error={errors.region?.message} required>
          <select {...register('region')} className="input-base">
            <option value="">지역 선택</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </FormField>
      </div>
    </div>
  )
}
