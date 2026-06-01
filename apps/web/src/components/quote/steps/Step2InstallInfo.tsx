'use client'

import { useFormContext } from 'react-hook-form'
import type { QuoteFormData } from '../QuoteWizard'
import { FormField } from '../FormField'

const URGENCY_OPTIONS = [
  { value: 'low', label: '여유 있음 (2개월+)' },
  { value: 'normal', label: '보통 (1~2개월)' },
  { value: 'high', label: '빠르게 (2~4주)' },
  { value: 'urgent', label: '긴급 (2주 이내)' },
]

export function Step2InstallInfo() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<QuoteFormData>()
  const env = watch('environment')
  const urgency = watch('urgency')
  const highRes = watch('highRes')
  const needsLiveInput = watch('needsLiveInput')
  const exactSizeRequired = watch('exactSizeRequired')

  return (
    <div className="space-y-5">
      {/* 실내/옥외 */}
      <div>
        <label className="mb-2.5 block text-sm font-semibold text-zinc-200">
          설치 환경 <span className="text-blue-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['indoor', 'outdoor'] as const).map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setValue('environment', e)}
              className={`rounded-xl border py-4 text-sm font-semibold transition-all ${
                env === e
                  ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              {e === 'indoor' ? '실내' : '옥외'}
              <span className="ml-2 text-xs font-normal text-zinc-600">
                {e === 'indoor' ? '(P2.5~P4)' : '(P4~P6)'}
              </span>
            </button>
          ))}
        </div>
        {errors.environment && (
          <p className="mt-1.5 text-xs text-red-400">{errors.environment.message}</p>
        )}
      </div>

      {/* 크기 */}
      <div>
        <label className="mb-2.5 block text-sm font-semibold text-zinc-200">
          희망 크기 <span className="text-zinc-600 text-xs font-normal">(대략적인 수치도 괜찮아요)</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            {...register('desiredWidth')}
            placeholder="가로 (cm)"
            className="input-base w-full"
          />
          <span className="shrink-0 text-zinc-600">×</span>
          <input
            {...register('desiredHeight')}
            placeholder="세로 (cm)"
            className="input-base w-full"
          />
        </div>
      </div>

      {/* 표준 적용 안내 */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs text-zinc-400">
        <p className="mb-1 font-semibold text-zinc-200">표준 사이즈 안내</p>
        <p>요청 크기에 가장 가까운 표준 캐비닛 사이즈로 제안드립니다. 납기 단축, 가격 안정,
          유지보수·예비부품 호환성이 좋아집니다.</p>
      </div>

      {/* 옵션: 고해상도 / 라이브 입력 / 정확치수 (실내만 노출) */}
      {env === 'indoor' && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" {...register('highRes')} className="h-4 w-4" />
            근거리 고해상도 (P2.5) 권장 — 회의실·바·로비
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input type="checkbox" {...register('needsLiveInput')} className="h-4 w-4" />
            HDMI 라이브 입력 필요 (방송/실시간 미러링)
          </label>
        </div>
      )}
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" {...register('exactSizeRequired')} className="h-4 w-4" />
        반드시 정확한 치수로 제작 필요 (표준 사이즈 적용 불가)
      </label>
      {(highRes || needsLiveInput || exactSizeRequired) && (
        <p className="text-xs text-amber-400">
          {exactSizeRequired
            ? '정확치수 요구 시 엔지니어링 설계비가 별도 발생합니다.'
            : '선택하신 옵션은 컨트롤러/패키지에 반영됩니다.'}
        </p>
      )}

      {/* 시청 거리 */}
      <FormField label="주 시청 거리" error={undefined}>
        <input
          {...register('viewingDistance')}
          placeholder="예: 3m, 10m, 50m"
          className="input-base"
        />
      </FormField>

      {/* 목적 */}
      <FormField label="사용 목적" error={errors.purpose?.message} required>
        <textarea
          {...register('purpose')}
          rows={3}
          placeholder="예: 매장 입구 홍보, 메뉴판 교체, 행사 광고, 원내 공지 등"
          className="input-base resize-none"
        />
      </FormField>

      {/* 설치 급urgency */}
      <div>
        <label className="mb-2.5 block text-sm font-semibold text-zinc-200">설치 일정</label>
        <div className="grid grid-cols-2 gap-2">
          {URGENCY_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setValue('urgency', o.value as QuoteFormData['urgency'])}
              className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                urgency === o.value
                  ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
