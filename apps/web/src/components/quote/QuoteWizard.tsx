'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Step1BusinessInfo } from './steps/Step1BusinessInfo'
import { Step2InstallInfo } from './steps/Step2InstallInfo'
import { Step3PhotoUpload } from './steps/Step3PhotoUpload'
import { Step4Budget } from './steps/Step4Budget'
import { QuoteSuccess, type EstimateSummary } from './QuoteSuccess'
import { ProgressBar } from './ProgressBar'

const quoteSchema = z.object({
  // Step 1
  businessType: z.enum([
    'cafe', 'restaurant', 'bar', 'hospital', 'academy',
    'gym', 'franchise', 'school', 'government', 'factory', 'other',
  ], { required_error: '업종을 선택해주세요.' }),
  businessName: z.string().min(1, '상호명을 입력해주세요.'),
  contactName: z.string().min(1, '담당자 이름을 입력해주세요.'),
  phone: z.string().min(10, '올바른 전화번호를 입력해주세요.'),
  region: z.string().min(1, '지역을 선택해주세요.'),

  // Step 2
  environment: z.enum(['indoor', 'outdoor'], { required_error: '설치 환경을 선택해주세요.' }),
  desiredWidth: z.string().optional(),
  desiredHeight: z.string().optional(),
  viewingDistance: z.string().optional(),
  purpose: z.string().min(5, '사용 목적을 간략히 입력해주세요.'),
  urgency: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  // 표준 블록 (선택값)
  familyCode: z.enum(['F-IN-P3', 'F-IN-P2.5', 'F-OUT-P5']).optional(),
  highRes: z.boolean().default(false),
  needsLiveInput: z.boolean().default(false),
  exactSizeRequired: z.boolean().default(false),

  // Step 3
  photos: z.array(z.instanceof(File)).min(1, '사진을 최소 1장 업로드해주세요.').max(10),

  // Step 4
  budgetRange: z.string().optional(),
  additionalNotes: z.string().optional(),
  agreePrivacy: z.boolean().refine((v) => v, '개인정보 수집에 동의해주세요.'),
})

export type QuoteFormData = z.infer<typeof quoteSchema>

const STEPS = ['업체 정보', '설치 정보', '현장 사진', '예산 & 제출']

export function QuoteWizard() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [estimate, setEstimate] = useState<EstimateSummary | null>(null)

  const methods = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      urgency: 'normal',
      photos: [],
      agreePrivacy: false,
      highRes: false,
      needsLiveInput: false,
      exactSizeRequired: false,
    },
    mode: 'onBlur',
  })

  const handleNext = async () => {
    const fields = getStepFields(step)
    const valid = await methods.trigger(fields as (keyof QuoteFormData)[])
    if (valid) setStep((s) => s + 1)
  }

  const handleSubmit = methods.handleSubmit(async (data) => {
    setSubmitting(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, val]) => {
        if (key === 'photos') {
          ;(val as File[]).forEach((f) => formData.append('photos', f))
        } else {
          formData.append(key, String(val))
        }
      })
      const res = await fetch('/api/quotes', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('제출 실패')
      const json = (await res.json()) as { estimate?: EstimateSummary | null }
      setEstimate(json.estimate ?? null)
      setSubmitted(true)
    } catch {
      alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  })

  if (submitted) return <QuoteSuccess estimate={estimate} />

  return (
    <FormProvider {...methods}>
      <div className="glass rounded-2xl p-6 sm:p-8">
        <ProgressBar current={step} total={STEPS.length} labels={STEPS} />

        <div className="mt-8">
          {step === 0 && <Step1BusinessInfo />}
          {step === 1 && <Step2InstallInfo />}
          {step === 2 && <Step3PhotoUpload />}
          {step === 3 && <Step4Budget />}
        </div>

        <div className="mt-8 flex justify-between gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-100"
            >
              이전
            </button>
          )}
          <div className="ml-auto">
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-blue-500 active:scale-95"
              >
                다음
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-60"
              >
                {submitting ? '제출 중...' : '견적 요청 완료'}
              </button>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

function getStepFields(step: number): string[] {
  switch (step) {
    case 0: return ['businessType', 'businessName', 'contactName', 'phone', 'region']
    case 1: return ['environment', 'purpose', 'urgency']
    case 2: return ['photos']
    case 3: return ['agreePrivacy']
    default: return []
  }
}
