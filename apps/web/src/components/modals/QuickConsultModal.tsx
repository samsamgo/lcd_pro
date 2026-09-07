'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { readApiError, validatePhone } from '@/lib/phone'
import {
  Field,
  FormError,
  FormSuccess,
  FormToneProvider,
  PrivacyConsent,
  RequiredLegend,
  SUBMIT_FAILED,
  SubmitButton,
  TextArea,
  TextInput,
} from '@/components/form'

/**
 * 간단 문의 모달.
 *
 * 이전 버전은 업종·지역·설치환경까지 받는 소형 견적폼이라 /quote 와 하는 일이
 * 겹쳤다. 견적은 /quote 한 곳에서만 받고, 여기서는 연락처와 문의 내용만 받는다.
 *
 * 필수는 연락처 하나뿐이다. 입력 항목이 늘수록 이탈한다.
 *
 * 2026-09-07 폼 통일 — 겉모습·동작만 `components/form` 부품으로 바꿨다.
 * 보내는 항목(contactName/phone/message/source)과 목적지는 그대로다.
 */
export function QuickConsultModal({
  open,
  onClose,
  source,
}: {
  open: boolean
  onClose: () => void
  source?: string
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [agree, setAgree] = useState(false)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const phoneError = validatePhone(phone)
    if (phoneError) {
      setError(phoneError)
      return
    }
    if (!agree) {
      setError('개인정보 수집·이용에 동의해 주십시오.')
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: name.trim(),
          phone: phone.trim(),
          message: message.trim(),
          agreePrivacy: true,
          source: source ?? 'quick-consult',
        }),
      })
      if (!res.ok) {
        setError(await readApiError(res, SUBMIT_FAILED))
        return
      }
      setDone(true)
    } catch {
      // 접수 실패를 고객에게 그대로 떠넘기지 않는다. 대체 연락 수단을 안내한다.
      setError(SUBMIT_FAILED)
    } finally {
      setSending(false)
    }
  }

  function close() {
    onClose()
    // 닫힘 애니메이션이 끝난 뒤 초기화
    setTimeout(() => {
      setDone(false)
      setError('')
      setName('')
      setPhone('')
      setMessage('')
      setAgree(false)
    }, 250)
  }

  // 완료 화면의 제목은 FormSuccess 가 갖는다. 모달 헤더까지 "접수되었습니다" 로
  // 바꾸면 같은 말이 두 번 뜬다(다른 폼 셋은 헤더가 없어 한 번만 뜬다).
  return (
    <Modal open={open} onClose={close} title="빠른 상담" size="sm">
      <FormToneProvider tone="light">
        {done ? (
          <FormSuccess
            title="문의가 접수되었습니다"
            detail="남겨주신 연락처로 담당자가 확인 후 연락드립니다."
          >
            <button type="button" onClick={close} className="wk-btn-p mt-6">
              확인
            </button>
          </FormSuccess>
        ) : (
          <form onSubmit={submit} className="space-y-4" noValidate>
            <p className="text-label text-wk-ink3">
              연락처와 문의 내용만 남겨주시면 담당자가 확인 후 연락드립니다.
              견적이 필요하시면 견적 요청을 이용해 주십시오.
            </p>

            <RequiredLegend />

            <Field label="성함">
              <TextInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </Field>

            <Field label="연락처" required>
              <TextInput
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                inputMode="tel"
                autoComplete="tel"
              />
            </Field>

            <Field label="문의 내용">
              <TextArea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="설치 장소나 궁금한 점을 자유롭게 적어주십시오."
              />
            </Field>

            <PrivacyConsent
              purpose="문의 응대"
              items="성함·연락처"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />

            <FormError>{error}</FormError>

            <SubmitButton pending={sending}>문의 보내기</SubmitButton>
          </form>
        )}
      </FormToneProvider>
    </Modal>
  )
}
