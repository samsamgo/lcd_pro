'use client'

import { useFormContext } from 'react-hook-form'
import type { QuoteFormData } from '../QuoteWizard'
import { CheckRow, Field, OptionButton, TextArea, TextInput } from '@/components/form'

const URGENCY_OPTIONS = [
  { value: 'low', label: '여유 있음 (2개월+)' },
  { value: 'normal', label: '보통 (1~2개월)' },
  { value: 'high', label: '빠르게 (2~4주)' },
  { value: 'urgent', label: '긴급 (2주 이내)' },
]

/** 라벨만 있고 입력이 아닌 묶음(선택 버튼 그룹)의 머리. Field 의 라벨과 형식을 맞춘다. */
function GroupLabel({
  children,
  required,
  note,
}: {
  children: React.ReactNode
  required?: boolean
  note?: string
}) {
  return (
    <legend className="mb-2 block text-label font-semibold text-wk-ink">
      {children}
      {required && (
        <>
          <span aria-hidden="true" className="ml-1 text-wk-cta">
            *
          </span>
          <span className="sr-only"> (필수)</span>
        </>
      )}
      {note && <span className="ml-1.5 text-caption font-normal text-wk-ink3">{note}</span>}
    </legend>
  )
}

export function Step2InstallInfo() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<QuoteFormData>()
  const env = watch('environment')
  const urgency = watch('urgency')
  const highRes = watch('highRes')
  const needsLiveInput = watch('needsLiveInput')
  const exactSizeRequired = watch('exactSizeRequired')

  return (
    <div className="space-y-7">
      {/* 실내/옥외 */}
      <fieldset>
        <GroupLabel required>설치 환경</GroupLabel>
        <div className="grid grid-cols-2 gap-3">
          {(['indoor', 'outdoor'] as const).map((e) => (
            <OptionButton
              key={e}
              selected={env === e}
              onClick={() => setValue('environment', e, { shouldValidate: true })}
              hint={e === 'indoor' ? '(건물 안)' : '(건물 밖)'}
              className="py-3.5"
            >
              {e === 'indoor' ? '실내' : '옥외'}
            </OptionButton>
          ))}
        </div>
        {errors.environment && (
          <p role="alert" className="mt-2.5 text-label text-wk-bad">
            {errors.environment.message}
          </p>
        )}
      </fieldset>

      {/* 크기 */}
      <fieldset>
        <GroupLabel note="(대략적인 수치도 괜찮습니다)">희망 크기</GroupLabel>
        <div className="flex items-center gap-2">
          <TextInput
            {...register('desiredWidth')}
            aria-label="희망 가로 크기 (cm)"
            placeholder="가로 (cm)"
            inputMode="numeric"
          />
          <span aria-hidden="true" className="shrink-0 text-wk-ink3">
            ×
          </span>
          <TextInput
            {...register('desiredHeight')}
            aria-label="희망 세로 크기 (cm)"
            placeholder="세로 (cm)"
            inputMode="numeric"
          />
        </div>
      </fieldset>

      {/* 표준 적용 안내 */}
      <div className="rounded-btn border border-wk-line bg-white/60 p-4 text-caption text-wk-ink3">
        <p className="mb-1 font-semibold text-wk-ink2">제작 크기 안내</p>
        <p>요청하신 크기에 가장 가까운 기본 제작 단위로 제안드립니다. 납기 단축, 가격 안정,
          유지보수·예비부품 호환성이 좋아집니다.</p>
      </div>

      {/* 옵션: 고해상도 / 라이브 입력 / 정확치수 (실내만 노출) */}
      <div className="space-y-1">
        {env === 'indoor' && (
          <>
            <CheckRow
              {...register('highRes')}
              label="가까이서 보는 자리 — 민원실·로비·회의실"
            />
            <CheckRow
              {...register('needsLiveInput')}
              label="HDMI 라이브 입력 필요 (방송/실시간 미러링)"
            />
          </>
        )}
        <CheckRow
          {...register('exactSizeRequired')}
          label="반드시 정확한 치수로 제작 필요 (표준 사이즈 적용 불가)"
        />
        {(highRes || needsLiveInput || exactSizeRequired) && (
          <p className="text-caption text-amber-600">
            {exactSizeRequired
              ? '정확치수 요구 시 엔지니어링 설계비가 별도 발생합니다.'
              : '선택하신 옵션은 컨트롤러/패키지에 반영됩니다.'}
          </p>
        )}
      </div>

      {/* 시청 거리 */}
      <Field label="주 시청 거리">
        <TextInput {...register('viewingDistance')} placeholder="예: 3m, 10m, 50m" />
      </Field>

      {/* 목적 */}
      <Field label="사용 목적" error={errors.purpose?.message} required>
        <TextArea
          {...register('purpose')}
          placeholder="예: 민원실 대기번호 표시, 학교 행사·급식 안내, 재난 문구 게시, 층별 종합안내 등"
        />
      </Field>

      {/* 설치 일정 */}
      <fieldset>
        <GroupLabel>설치 일정</GroupLabel>
        <div className="grid grid-cols-2 gap-2">
          {URGENCY_OPTIONS.map((o) => (
            <OptionButton
              key={o.value}
              selected={urgency === o.value}
              onClick={() => setValue('urgency', o.value as QuoteFormData['urgency'])}
            >
              {o.label}
            </OptionButton>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
