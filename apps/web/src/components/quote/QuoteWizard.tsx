'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Step1BusinessInfo } from './steps/Step1BusinessInfo'
import { Step2InstallInfo } from './steps/Step2InstallInfo'
import { Step3PhotoUpload } from './steps/Step3PhotoUpload'
import { Step4Budget } from './steps/Step4Budget'
import { QuoteSuccess, type EstimateSummary } from './QuoteSuccess'
import { ProgressBar } from './ProgressBar'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE } from '@/components/motion'

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
  familyCode: z.enum(['F-IN-P1.86', 'F-IN-P3', 'F-IN-P2.5', 'F-OUT-P5']).optional(),
  highRes: z.boolean().default(false),
  needsLiveInput: z.boolean().default(false),
  exactSizeRequired: z.boolean().default(false),

  // Step 3 — 정확한 범위 견적을 위해 최소 3장 (카피와 일치)
  photos: z.array(z.instanceof(File)).min(3, '사진을 최소 3장 업로드해주세요.').max(10),

  // Step 4
  budgetRange: z.string().optional(),
  additionalNotes: z.string().optional(),
  agreePrivacy: z.boolean().refine((v) => v, '개인정보 수집에 동의해주세요.'),
})

export type QuoteFormData = z.infer<typeof quoteSchema>

const STEPS = ['기관 정보', '설치 정보', '현장 사진', '제출']

// /quote?type=... 업종 CTA 개인화 — 업종 기본값 + 설치환경/SKU 추천 prefill
const PREFILL: Record<string, Partial<QuoteFormData>> = {
  food: { businessType: 'cafe', environment: 'indoor' },
  health: { businessType: 'gym', environment: 'indoor' },
  franchise: { businessType: 'franchise', environment: 'indoor' },
  outdoor: { businessType: 'other', environment: 'outdoor' },
  event: { businessType: 'other', environment: 'outdoor' },
  rental: { businessType: 'other', environment: 'outdoor' },
  // 업종값 직접 전달도 허용
  cafe: { businessType: 'cafe', environment: 'indoor' },
  restaurant: { businessType: 'restaurant', environment: 'indoor' },
  bar: { businessType: 'bar', environment: 'indoor' },
  hospital: { businessType: 'hospital', environment: 'indoor' },
  academy: { businessType: 'academy', environment: 'indoor' },
  gym: { businessType: 'gym', environment: 'indoor' },
  school: { businessType: 'school', environment: 'indoor' },
  government: { businessType: 'government', environment: 'indoor' },
  factory: { businessType: 'factory', environment: 'outdoor' },
  'public-office': { businessType: 'government', environment: 'indoor' },
  banner: { businessType: 'government', environment: 'outdoor' },
  institution: { businessType: 'government', environment: 'indoor' },
}

export function QuoteWizard({ defaultType }: { defaultType?: string }) {
  const [step, setStep] = useState(0)
  // 단계 전환 방향 — 뒤로 갈 때는 반대로 미끄러져야 "돌아왔다" 가 읽힌다
  const [dir, setDir] = useState(1)
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [estimate, setEstimate] = useState<EstimateSummary | null>(null)

  const prefill = defaultType ? PREFILL[defaultType] : undefined

  const methods = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      urgency: 'normal',
      photos: [],
      agreePrivacy: false,
      highRes: false,
      needsLiveInput: false,
      exactSizeRequired: false,
      ...prefill,
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })

  const handleNext = async () => {
    const fields = getStepFields(step)
    const valid = await methods.trigger(fields as (keyof QuoteFormData)[])
    if (valid) setStep((s) => s + 1)
  }

  useEffect(() => {
    if (step === 0) return
    panelRef.current?.focus()
  }, [step])

  const handleSubmit = methods.handleSubmit(async (data) => {
    setSubmitting(true)
    setSubmitError('')
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
      setSubmitError('제출 중 오류가 발생했습니다. 네트워크를 확인하고 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  })

  if (submitted) return <QuoteSuccess estimate={estimate} />

  return (
    <FormProvider {...methods}>
      <div className="rounded-card border border-wk-line bg-white p-6 shadow-wk-2 sm:p-9">
        <ProgressBar current={step} total={STEPS.length} labels={STEPS} />

        <div className="relative mt-9 overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div
              key={step}
              ref={panelRef}
              tabIndex={-1}
              role="group"
              aria-label={`${step + 1}단계: ${STEPS[step]}`}
              custom={dir}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -28 }}
              transition={{ duration: reduce ? 0.15 : 0.32, ease: EASE.entrance }}
              className="outline-none"
            >
              {step === 0 && <Step1BusinessInfo />}
              {step === 1 && <Step2InstallInfo />}
              {step === 2 && <Step3PhotoUpload />}
              {step === 3 && <Step4Budget />}
            </motion.div>
          </AnimatePresence>
        </div>

        {submitError && (
          <p
            role="alert"
            className="mt-5 rounded-btn border border-wk-bad/30 bg-wk-bad/[0.06] px-4 py-3 text-label font-medium text-wk-bad"
          >
            {submitError}
          </p>
        )}

        <div className="mt-9 flex flex-col-reverse gap-3 border-t border-wk-line pt-7 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => {
                setDir(-1)
                setStep((s) => s - 1)
              }}
              className="wk-btn border border-wk-line2 bg-white text-wk-ink2 hover:bg-wk-bgFaint"
            >
              이전
            </button>
          ) : (
            <span className="hidden sm:block" />
          )}

          {step < STEPS.length - 1 ? (
            <button type="button" onClick={handleNext} className="wk-btn-p">
              다음
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              aria-busy={submitting}
              className="wk-btn-p disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? '제출 중…' : '견적 요청 보내기'}
            </button>
          )}
        </div>
      </div>
    </FormProvider>
  )
}

function getStepFields(step: number): string[] {
  switch (step) {
    case 0: return ['businessType', 'businessName', 'contactName', 'phone', 'region']
    case 1: return ['environment', 'purpose', 'urgency']
    case 2: return []   // 사진은 선택이라 검증하지 않는다
    case 3: return ['agreePrivacy']
    default: return []
  }
}
