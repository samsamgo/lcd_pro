'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'

const BUSINESS_TYPES: { value: string; label: string }[] = [
  { value: 'cafe', label: '카페' },
  { value: 'restaurant', label: '식당·외식' },
  { value: 'bar', label: '주점·바' },
  { value: 'gym', label: '헬스장·필라테스' },
  { value: 'academy', label: '학원·교육' },
  { value: 'hospital', label: '병원·의원' },
  { value: 'franchise', label: '프랜차이즈' },
  { value: 'school', label: '학교·기관' },
  { value: 'government', label: '관공서' },
  { value: 'factory', label: '공장·산업' },
  { value: 'other', label: '기타' },
]

export function QuickConsultModal({
  open,
  onClose,
  source,
}: {
  open: boolean
  onClose: () => void
  source?: string
}) {
  const [businessType, setBusinessType] = useState('cafe')
  const [environment, setEnvironment] = useState<'indoor' | 'outdoor'>('indoor')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [region, setRegion] = useState('')
  const [message, setMessage] = useState('')
  const [agree, setAgree] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const reset = () => {
    setStatus('idle')
    setErrorMsg('')
  }

  const handleClose = () => {
    onClose()
    // 닫힘 애니메이션 후 상태 초기화
    window.setTimeout(reset, 250)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    const digits = phone.replace(/[^\d]/g, '')
    if (digits.length < 9) {
      setErrorMsg('올바른 연락처를 입력해주세요.')
      return
    }
    if (!agree) {
      setErrorMsg('개인정보 수집·이용에 동의해주세요.')
      return
    }
    setErrorMsg('')
    setStatus('sending')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessType: BUSINESS_TYPES.find((b) => b.value === businessType)?.label ?? businessType,
          environment,
          contactName,
          phone,
          region,
          message: message + (source ? ` (경로: ${source})` : ''),
          agreePrivacy: agree,
        }),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('done')
    } catch {
      setStatus('error')
      setErrorMsg('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={status === 'done' ? undefined : '30초 빠른 상담 신청'}
      description={
        status === 'done'
          ? undefined
          : '연락처만 남기시면 담당자가 빠르게 연락드립니다. 사진·상세 정보는 통화로 안내드려요.'
      }
      size="md"
    >
      {status === 'done' ? (
        <div className="py-6 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-blue-600" />
          <h2 className="text-xl font-bold text-zinc-900">상담 신청이 접수되었습니다</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-600">
            담당자가 남겨주신 연락처로 곧 연락드립니다. 지금 바로 예상 범위 견적을 확인하고
            싶다면 사진 3장으로 진행해 보세요.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              href="/quote"
              onClick={handleClose}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blue-500 active:scale-95"
            >
              사진 3장 즉석 견적
              <ArrowRight size={16} />
            </Link>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-100"
            >
              닫기
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">업종</span>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="input-base"
              >
                {BUSINESS_TYPES.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">설치 환경</span>
              <div className="grid grid-cols-2 gap-2">
                {(['indoor', 'outdoor'] as const).map((env) => (
                  <button
                    type="button"
                    key={env}
                    onClick={() => setEnvironment(env)}
                    aria-pressed={environment === env}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${
                      environment === env
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-zinc-300 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    {env === 'indoor' ? '실내' : '옥외'}
                  </button>
                ))}
              </div>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">
                담당자 이름 <span className="text-zinc-400">(선택)</span>
              </span>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="예) 김대표"
                className="input-base"
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">
                연락처 <span className="text-blue-600">*</span>
              </span>
              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="input-base"
                autoComplete="tel"
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-700">
              지역 <span className="text-zinc-400">(선택)</span>
            </span>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="예) 서울 강남구"
              className="input-base"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-700">
              문의 내용 <span className="text-zinc-400">(선택)</span>
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              placeholder="설치 위치, 원하는 크기, 예산 등 자유롭게 남겨주세요."
              className="input-base resize-none"
            />
          </label>

          <label className="flex items-start gap-2.5 text-sm text-zinc-600">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300"
            />
            <span>
              상담을 위한 개인정보(연락처) 수집·이용에 동의합니다.{' '}
              <Link href="/privacy" target="_blank" className="text-blue-600 underline-offset-2 hover:underline">
                개인정보처리방침
              </Link>
            </span>
          </label>

          {errorMsg && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-60"
          >
            {status === 'sending' ? (
              <>
                <Loader2 size={18} className="animate-spin" /> 전송 중...
              </>
            ) : (
              '상담 신청하기'
            )}
          </button>

          <p className="text-center text-xs text-zinc-500">
            상세한 예상 범위 견적이 필요하면{' '}
            <Link href="/quote" onClick={handleClose} className="font-semibold text-blue-600 hover:underline">
              사진 3장 즉석 견적
            </Link>
            도 이용할 수 있어요.
          </p>
        </form>
      )}
    </Modal>
  )
}
