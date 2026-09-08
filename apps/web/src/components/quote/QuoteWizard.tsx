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
import { AnimatePresence, motion } from 'framer-motion'
import { EASE, useReducedMotion } from '@/components/motion'
import { FormError, FormToneProvider, SubmitButton } from '@/components/form'
import { validatePhone } from '@/lib/phone'

const quoteSchema = z.object({
  // Step 1
  // 🔴 값을 추가할 때는 Step1BusinessInfo 의 BUSINESS_TYPES 와 **반드시 같이** 고친다.
  // 화면 선택지만 늘리면 zod 가 막아 제출이 통째로 실패한다(2026-09-07 실제로 냈던 실수).
  // 'apartment' 신설 — industries.ts 에는 있는데 폼에 없어 관리사무소 리드가 '기타' 로 떨어졌다.
  businessType: z.enum([
    'cafe', 'restaurant', 'bar', 'hospital', 'academy',
    'gym', 'franchise', 'school', 'government', 'factory', 'apartment', 'other',
  ], { required_error: '업종을 선택해주세요.' }),
  businessName: z.string().min(1, '상호명을 입력해주세요.'),
  contactName: z.string().min(1, '담당자 이름을 입력해주세요.'),
  // 🔴 서버(`/api/lead`·`/api/quotes` 계열)와 같은 규칙을 쓴다. 예전에는 원문 길이 10자
  // 이상만 봤는데, 서버는 **숫자 9~11자리**를 본다. "02-123-4567"(숫자 9자리)은 서버가
  // 받는데 화면이 먼저 막았고, 반대로 숫자가 모자란 긴 문자열은 화면을 통과해 서버 400 을
  // 맞았다. 화면과 서버가 어긋나면 담당자는 이유를 모른 채 이탈한다.
  phone: z.string().superRefine((v, ctx) => {
    const msg = validatePhone(v)
    if (msg) ctx.addIssue({ code: z.ZodIssueCode.custom, message: msg })
  }),
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

  // Step 3 — 사진은 선택이다.
  // 🔴 2026-09-07 이전에는 `.min(3)` 이었다. 3단계 화면은 "(선택) 사진 없이 넘어가셔도 됩니다"
  // 라고 안내하고 getStepFields(2) 도 검증을 건너뛰는데, 제출 시 전체 스키마 검증에서
  // photos 가 걸려 handleSubmit 의 onValid 가 아예 실행되지 않았다.
  // 오류 문구는 렌더되지 않는 3단계에 붙어 있어 화면에도 안 뜬다 →
  // 사진 없는 담당자가 '견적 요청 보내기' 를 눌러도 아무 일도 일어나지 않고 리드가 사라졌다.
  // 서버(`/api/quotes`)도 같은 이유로 400 을 던지고 있었다. 셋을 "선택"으로 맞춘다.
  photos: z.array(z.instanceof(File)).max(10, '사진은 10장까지 첨부하실 수 있습니다.'),

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
  // 2026-09-07 /industries 사례 확충분. lib/industries.ts 의 quoteType 과 1:1.
  // 키가 없으면 prefill 만 비고 폼은 그대로 뜬다(리드 경로는 안 끊긴다).
  'health-center': { businessType: 'hospital', environment: 'outdoor' },
  'fire-safety': { businessType: 'government', environment: 'outdoor' },
  'meeting-room': { businessType: 'government', environment: 'indoor' },
  auditorium: { businessType: 'school', environment: 'indoor' },
  daycare: { businessType: 'academy', environment: 'indoor' },
  traffic: { businessType: 'government', environment: 'outdoor' },
  parking: { businessType: 'government', environment: 'outdoor' },
  transit: { businessType: 'government', environment: 'outdoor' },
  apartment: { businessType: 'other', environment: 'outdoor' },
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
  const [restored, setRestored] = useState(false)

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

  // 초안 복원 — 첫 렌더에서 읽으면 서버 HTML 과 어긋나므로 마운트 후에 되돌린다.
  //
  // ⚠️ 값만 되돌리고 **단계는 옮기지 않는다.** 마운트 도중에 step 을 바꾸면
  // AnimatePresence(mode="wait") 가 나가는 패널의 exit 을 끝내지 못한 채 멈춰,
  // 진행 표시줄만 다음 단계로 가고 화면은 1단계에 그대로 남는다(브라우저에서 재현함).
  // 리드 경로가 걸린 화면이라 애니메이션 경합을 감수할 이유가 없다.
  useEffect(() => {
    const draft = readDraft()
    if (!draft?.values) return
    methods.reset({ ...methods.getValues(), ...draft.values, photos: [] })
    setRestored(true)
    // 마운트 시 1회만
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 초안 저장 — 값이 바뀔 때마다
  useEffect(() => {
    const sub = methods.watch((value) => {
      const { photos: _photos, ...rest } = value as QuoteFormData
      writeDraft({ values: rest as Partial<QuoteFormData> })
    })
    return () => sub.unsubscribe()
  }, [methods])

  const handleSubmit = methods.handleSubmit(
    async (data) => {
      setSubmitting(true)
      setSubmitError('')
      try {
        const formData = new FormData()
        Object.entries(data).forEach(([key, val]) => {
          if (key === 'photos') {
            ;(val as File[]).forEach((f) => formData.append('photos', f))
            return
          }
          // 빈 선택값을 String() 으로 감싸면 문자열 "undefined" 가 그대로 서버에 넘어가
          // 추가 요청사항·예산 칸에 "undefined" 가 저장된다. 값이 있을 때만 보낸다.
          if (val === undefined || val === null || val === '') return
          formData.append(key, String(val))
        })
        const res = await fetch('/api/quotes', { method: 'POST', body: formData })
        const json = (await res.json().catch(() => null)) as
          | { estimate?: EstimateSummary | null; error?: string }
          | null
        if (!res.ok) {
          // 서버가 무엇이 잘못됐는지 알려주면 그대로 보여준다. 전부 "네트워크 오류" 로
          // 뭉뚱그리면 담당자는 고칠 방법을 알 수 없다.
          throw new Error(json?.error ?? '')
        }
        setEstimate(json?.estimate ?? null)
        setSubmitted(true)
        clearDraft()
      } catch (e) {
        const msg = e instanceof Error ? e.message : ''
        setSubmitError(
          msg ||
            '제출 중 오류가 발생했습니다. 네트워크를 확인하고 다시 시도해주세요. 계속 안 되면 전화로 접수하실 수 있습니다.',
        )
      } finally {
        setSubmitting(false)
      }
    },
    // 🔴 검증 실패 경로. 이게 없으면 제출 버튼이 아무 반응도 하지 않는다 —
    // 못 채운 칸이 지금 화면에 없으면 오류 문구도 렌더되지 않기 때문이다.
    // 어느 단계가 비었는지 말해 주고 그 단계로 되돌린다.
    (errors) => {
      const firstField = Object.keys(errors)[0]
      const target = STEP_OF_FIELD[firstField ?? '']
      const message =
        (errors as Record<string, { message?: string }>)[firstField ?? '']?.message ??
        '입력하지 않은 항목이 있습니다.'
      if (typeof target === 'number' && target !== step) {
        setDir(-1)
        setStep(target)
        setSubmitError(`${STEPS[target]} 단계를 확인해 주세요 — ${message}`)
      } else {
        setSubmitError(message)
      }
    },
  )

  if (submitted) return <QuoteSuccess estimate={estimate} />

  return (
    <FormProvider {...methods}>
      <FormToneProvider tone="light">
      <div className="rounded-card border border-wk-line bg-white p-6 shadow-wk-2 sm:p-9">
        <ProgressBar current={step} total={STEPS.length} labels={STEPS} />

        {restored && (
          <p className="mt-5 rounded-btn border border-wk-line bg-wk-bgFaint px-4 py-3 text-label text-wk-ink3">
            작성하시던 내용을 그대로 불러왔습니다. 사진은 다시 첨부해 주셔야 합니다.
          </p>
        )}

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
          <div className="mt-5">
            <FormError>{submitError}</FormError>
          </div>
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
            // 전송 중 문구('접수 중…')는 폼 4종이 같은 부품에서 가져온다
            <SubmitButton type="button" onClick={handleSubmit} pending={submitting}>
              견적 문의 보내기
            </SubmitButton>
          )}
        </div>
      </div>
      </FormToneProvider>
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

/** 어느 칸이 어느 단계에 있는지. 제출 검증이 실패했을 때 그 단계로 되돌리는 데 쓴다. */
const STEP_OF_FIELD: Record<string, number> = {
  businessType: 0, businessName: 0, contactName: 0, phone: 0, region: 0,
  environment: 1, desiredWidth: 1, desiredHeight: 1, viewingDistance: 1,
  purpose: 1, urgency: 1, familyCode: 1, highRes: 1, needsLiveInput: 1, exactSizeRequired: 1,
  photos: 2,
  budgetRange: 3, additionalNotes: 3, agreePrivacy: 3,
}

// ── 작성 중이던 내용 보존 ───────────────────────────────────────────
// 관공서 담당자는 예산 과목이나 설치 위치를 확인하러 창을 떠났다 돌아온다.
// 그 사이 새로고침·뒤로가기 한 번에 4단계를 다시 채우게 하면 그대로 이탈한다.
// 사진(File)은 직렬화할 수 없어 제외한다. 같은 탭 안에서만 남는다(sessionStorage).
const DRAFT_KEY = 'wk-quote-draft-v1'

function readDraft(): { values?: Partial<QuoteFormData> } | null {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeDraft(payload: { values?: Partial<QuoteFormData> }) {
  try {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(payload))
  } catch {
    /* 시크릿 모드 등 저장 불가 — 폼은 그대로 동작한다 */
  }
}

function clearDraft() {
  try {
    window.sessionStorage.removeItem(DRAFT_KEY)
  } catch {
    /* noop */
  }
}
