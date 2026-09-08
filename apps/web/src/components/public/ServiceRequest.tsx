'use client'

import { useState } from 'react'
import { SITE } from '@/lib/seo/site'
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
 * A/S 신청 폼.
 *
 * 견적 문의(/quote)와 분리한다. 이미 설치된 화면에 문제가 생긴 상황이라
 * 필요한 정보가 다르다 — 설치 장소와 증상만 있으면 원격 확인을 시작할 수 있다.
 *
 * 전송은 /api/lead 로 보내되 source 로 구분한다(`as-request` → kind 'as', 긴급도 high).
 * 🔴 설치 장소는 `businessName` 으로 보낸다. 서버는 businessName ∪ businessType 둘 다 읽는다.
 *
 * 2026-09-07 폼 통일 — 라벨·필수 표시·오류·동의·버튼·완료 화면을 `components/form` 부품으로 바꿨다.
 * 받는 항목과 목적지는 그대로다(리드 경로 무변경).
 */
export function ServiceRequest() {
  const [org, setOrg] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [symptom, setSymptom] = useState('')
  const [agree, setAgree] = useState(false)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const phoneError = validatePhone(phone)
    if (phoneError) return setError(phoneError)
    if (!symptom.trim()) return setError('증상을 입력해 주십시오.')
    if (!agree) return setError('개인정보 수집·이용에 동의해 주십시오.')

    setSending(true)
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: org.trim(),
          contactName: name.trim(),
          phone: phone.trim(),
          message: symptom.trim(),
          agreePrivacy: true,
          source: 'as-request',
        }),
      })
      if (!res.ok) {
        // 서버가 사유를 말해 줬으면 그대로 띄운다. 뭉개면 담당자는 고칠 방법이 없다.
        setError(await readApiError(res, SUBMIT_FAILED))
        return
      }
      setDone(true)
    } catch {
      setError(SUBMIT_FAILED)
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="as" className="wk-sec bg-wk-bg">
      <div className="wk-wrap grid items-start gap-5 lg:grid-cols-2 lg:gap-8">
        <div>
          <p className="wk-eyebrow">A/S 신청</p>
          <h2 className="wk-h2 text-wk-ink">A/S 접수</h2>
          <p className="wk-lead mt-4">증상과 화면 사진만 있으면 원격으로 원인을 먼저 확인합니다.</p>
          {SITE.phone && (
            <p className="mt-5 text-label text-wk-ink3">
              급한 건은 전화가 빠릅니다 —{' '}
              <a
                href={`tel:${SITE.phone.replace(/[^0-9+]/g, '')}`}
                className="font-semibold text-wk-cta"
              >
                {SITE.phone}
              </a>
            </p>
          )}
        </div>

        <div className="wk-card bg-white">
          <FormToneProvider tone="light">
            {done ? (
              <FormSuccess
                title="접수되었습니다"
                detail="담당자가 증상을 확인하고 원격 점검부터 시작합니다."
                promiseDetail={
                  <>
                    원격으로 확인되는 건은 방문 없이 처리됩니다. 방문이 필요하면 일정을 함께
                    잡아 드립니다.
                  </>
                }
              />
            ) : (
              // 브라우저 기본 말풍선 대신 우리가 쓴 문구를 띄운다.
              // 폼마다 한쪽은 말풍선, 한쪽은 문장이 뜨던 것을 맞춘다.
              <form onSubmit={submit} className="space-y-4" noValidate>
                <RequiredLegend />

                <Field label="기관 · 설치 장소">
                  <TextInput
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="예) ○○구청 1층 민원실"
                    autoComplete="organization"
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="담당자">
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
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="010-0000-0000"
                    />
                  </Field>
                </div>

                <Field label="증상" required>
                  <TextArea
                    value={symptom}
                    onChange={(e) => setSymptom(e.target.value)}
                    placeholder="예) 화면 오른쪽 아래 부분이 어제부터 어둡습니다."
                  />
                </Field>

                <PrivacyConsent
                  purpose="A/S 처리"
                  items="담당자명·연락처"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />

                <FormError>{error}</FormError>

                <SubmitButton pending={sending}>A/S 접수하기</SubmitButton>
              </form>
            )}
          </FormToneProvider>
        </div>
      </div>
    </section>
  )
}
