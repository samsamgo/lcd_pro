'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Reveal } from '@/components/motion'
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
 * 회사 소개 마무리 — 문의 폼(Contact).
 *
 * 2026-09-07 (3차, CEO 지시) 링크 3개 → 실제 접수 폼으로 바꿨다.
 * 이전에는 전화·이메일·견적요청 링크만 있었다. "문의하고 싶다"는 사람을
 * /quote 로 떠넘기면 그쪽은 설치 조건·사진까지 받는 견적 마법사라
 * "그냥 한번 물어보려던" 사람은 거기서 이탈한다. 이 자리에서 바로 접수되게 한다.
 *
 * 🔴 새 API 를 만들지 않는다. 기존 리드 경로 `POST /api/lead` 를 그대로 쓴다.
 *    - 검증은 `lib/phone.ts` 의 validatePhone/readApiError 재사용.
 *      화면 규칙과 서버 규칙이 어긋나면 담당자는 왜 400 인지 알 수 없다.
 *    - `source: 'about-contact'` → 서버(`app/api/lead/route.ts`)에서 kind 'consult'.
 *      A/S(`as-request`)만 'as' 로 갈라지고 나머지는 전부 'consult' 다.
 *      일반 문의는 이미 설치된 화면이 멈춘 상황이 아니므로 긴급도 normal 이 맞다.
 *    - 이메일은 서버 스키마에 칸이 없다. 버려지지 않도록 message 앞에 붙여 보낸다
 *      (서버는 message → purpose 로 알림에 그대로 싣는다).
 *
 * 🔴 이 섹션만 다크 배경(`wk-night`)이다. 폼 부품은 `FormToneProvider tone="dark"` 로
 *    감싸 색만 갈라 쓴다. 라이트용 `.input-base` 를 쓰면 검은 면 위에 흰 상자가 뜬다.
 * 🔴 전화번호는 SITE.phone 만 참조한다. 하드코딩 금지.
 * 🔴 업무시간은 바로 위 CompanyLocation 카드가 갖는다. 여기서 반복하지 않는다.
 */
export function AboutContact() {
  const tel = SITE.phone.replace(/[^0-9+]/g, '')

  const [org, setOrg] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [agree, setAgree] = useState(false)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // 🔴 막는 조건은 서버가 실제로 400 을 내는 둘(연락처 형식·동의)뿐이다.
    //    문의 내용이 비었다고 화면에서 막던 것을 풀었다 — 연락처만 있어도 전화해서
    //    물어보면 되는 건이라, 여기서 되돌려 보내면 리드 하나를 그냥 잃는다.
    const phoneError = validatePhone(phone)
    if (phoneError) return setError(phoneError)
    if (!agree) return setError('개인정보 수집·이용에 동의해 주십시오.')

    setSending(true)
    try {
      const body = email.trim()
        ? `이메일: ${email.trim()}\n${message.trim()}`
        : message.trim()

      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: org.trim(),
          contactName: name.trim(),
          phone: phone.trim(),
          message: body,
          agreePrivacy: true,
          source: 'about-contact',
        }),
      })
      if (!res.ok) {
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
    <>
      <div className="wk-bridge-down h-20 md:h-28" aria-hidden="true" />

      <section id="contact" className="wk-sec wk-night">
        <div className="wk-wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5" y={16}>
            <p className="text-label font-semibold uppercase tracking-widest text-wk-blue">
              Contact
            </p>
            <h2 className="wk-h2 mt-5 text-wk-nightInk">문의하기</h2>
            <p className="wk-lead mt-6 !text-wk-nightMuted">
              설치를 검토 중이시거나 궁금한 점이 있으시면 남겨 주십시오.
              영업일 기준 1일 안에 담당자가 연락드립니다.
            </p>

            {/* 전화·이메일은 폼을 쓰기 싫은 분을 위한 대체 수단이다.
                버튼이 아니라 정보 행으로 둔다 — 이 섹션의 주 CTA 는 폼 하나뿐이다. */}
            <div className="mt-9 flex flex-col">
              {SITE.phone && (
                <a
                  href={`tel:${tel}`}
                  className="flex items-baseline gap-4 border-t border-white/10 py-4 transition-colors hover:bg-white/5"
                >
                  <span className="w-16 shrink-0 text-label font-medium text-wk-nightMuted">
                    전화
                  </span>
                  <span className="wk-metric min-w-0 break-all text-body-lg font-semibold text-wk-nightInk">
                    {SITE.phone}
                  </span>
                </a>
              )}
              {SITE.email && (
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-baseline gap-4 border-t border-white/10 py-4 transition-colors hover:bg-white/5"
                >
                  <span className="w-16 shrink-0 text-label font-medium text-wk-nightMuted">
                    이메일
                  </span>
                  <span className="min-w-0 break-all text-body-lg font-semibold text-wk-nightInk">
                    {SITE.email}
                  </span>
                </a>
              )}
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7" y={16} delay={0.1}>
            <div className="rounded-card-m bg-white/[0.04] p-6 ring-1 ring-white/10 sm:rounded-card sm:p-8">
              <FormToneProvider tone="dark">
                {done ? (
                  <FormSuccess
                    title="문의가 접수되었습니다"
                    detail="남겨주신 연락처로 담당자가 확인 후 연락드립니다."
                  />
                ) : (
                  <form onSubmit={submit} className="space-y-4" noValidate>
                    <RequiredLegend />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="기관 · 회사명">
                        <TextInput
                          value={org}
                          onChange={(e) => setOrg(e.target.value)}
                          placeholder="예) ○○구청 총무과"
                          autoComplete="organization"
                        />
                      </Field>
                      <Field label="담당자">
                        <TextInput
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          autoComplete="name"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="연락처" required>
                        <TextInput
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="010-0000-0000"
                        />
                      </Field>
                      <Field label="이메일">
                        <TextInput
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          inputMode="email"
                          autoComplete="email"
                        />
                      </Field>
                    </div>

                    <Field label="문의 내용">
                      <TextArea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="예) 청사 1층 민원실 벽면에 안내용 화면을 검토 중입니다. 대략 가로 3m 정도 생각하고 있습니다."
                      />
                    </Field>

                    <PrivacyConsent
                      purpose="문의 응대"
                      items="담당자명·연락처·이메일"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                    />

                    <FormError>{error}</FormError>

                    <SubmitButton pending={sending}>문의 보내기</SubmitButton>

                    {/* 보조 경로 하나. 버튼이 아니라 문장으로 둔다 —
                        같은 화면에 주 CTA 버튼이 둘이면 어디를 눌러야 할지 갈린다. */}
                    <p className="text-caption text-wk-nightMuted">
                      설치 조건과 사진까지 담아 정식 견적을 받으시려면{' '}
                      <Link
                        href="/quote"
                        className="font-semibold text-wk-blue underline underline-offset-4"
                      >
                        견적 요청
                      </Link>
                      으로 진행하십시오.
                    </p>
                  </form>
                )}
              </FormToneProvider>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="wk-bridge-up h-20 md:h-28" aria-hidden="true" />
    </>
  )
}
