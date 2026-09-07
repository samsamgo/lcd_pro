'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Reveal } from '@/components/motion'
import { SITE } from '@/lib/seo/site'
import { readApiError, validatePhone } from '@/lib/phone'

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

    const phoneError = validatePhone(phone)
    if (phoneError) return setError(phoneError)
    if (!message.trim()) return setError('문의 내용을 입력해 주십시오.')
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
        setError(
          await readApiError(
            res,
            `접수 중 문제가 발생했습니다. ${SITE.email} 으로 보내주시면 확인하겠습니다.`,
          ),
        )
        return
      }
      setDone(true)
    } catch {
      setError(`접수 중 문제가 발생했습니다. ${SITE.email} 으로 보내주시면 확인하겠습니다.`)
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
              {done ? (
                <div>
                  <p className="wk-h3 text-wk-nightInk">문의가 접수되었습니다</p>
                  <p className="mt-3 text-label text-wk-nightMuted">
                    남겨주신 연락처로 영업일 기준 1일 안에 담당자가 연락드립니다.
                    급한 건은 {SITE.phone ? `${SITE.phone} 로 ` : ''}전화 주셔도 됩니다.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4" noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold text-wk-nightInk">
                        기관 · 회사명
                      </span>
                      <input
                        className="wk-input-dark"
                        value={org}
                        onChange={(e) => setOrg(e.target.value)}
                        placeholder="예) ○○구청 총무과"
                        autoComplete="organization"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold text-wk-nightInk">
                        담당자
                      </span>
                      <input
                        className="wk-input-dark"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold text-wk-nightInk">
                        연락처 <span className="text-wk-blue">필수</span>
                      </span>
                      <input
                        className="wk-input-dark"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="042-621-7982"
                        required
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold text-wk-nightInk">
                        이메일
                      </span>
                      <input
                        type="email"
                        className="wk-input-dark"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        inputMode="email"
                        autoComplete="email"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-wk-nightInk">
                      문의 내용 <span className="text-wk-blue">필수</span>
                    </span>
                    <textarea
                      className="wk-input-dark min-h-[128px] resize-y"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="예) 청사 1층 민원실 벽면에 안내용 화면을 검토 중입니다. 대략 가로 3m 정도 생각하고 있습니다."
                      required
                    />
                  </label>

                  {/* 탭 타깃 44px 이상 — 체크박스만 20px 이면 손가락으로 못 누른다 */}
                  <label className="flex min-h-[44px] cursor-pointer items-start gap-3 py-2 text-label text-wk-nightMuted">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-wk-blue"
                    />
                    <span>
                      문의 응대를 위한 개인정보(담당자명·연락처·이메일) 수집·이용에 동의합니다.{' '}
                      <Link
                        href="/privacy"
                        className="underline underline-offset-4 hover:text-wk-nightInk"
                      >
                        개인정보처리방침
                      </Link>
                    </span>
                  </label>

                  {error && <p className="text-label text-wk-bad">{error}</p>}

                  <button
                    type="submit"
                    disabled={sending}
                    className="wk-btn-p disabled:opacity-45"
                  >
                    {sending ? '접수 중…' : '문의 보내기'}
                  </button>

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
            </div>
          </Reveal>
        </div>
      </section>

      <div className="wk-bridge-up h-20 md:h-28" aria-hidden="true" />
    </>
  )
}
