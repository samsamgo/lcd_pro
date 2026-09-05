'use client'

import { useState } from 'react'
import { SITE } from '@/lib/seo/site'

/**
 * A/S 신청 폼.
 *
 * 견적 문의(/quote)와 분리한다. 이미 설치된 화면에 문제가 생긴 상황이라
 * 필요한 정보가 다르다 — 설치 장소와 증상만 있으면 원격 확인을 시작할 수 있다.
 *
 * 전송은 /api/lead 로 보내되 source 로 구분한다.
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
    if (!phone.trim()) return setError('연락처를 입력해 주십시오.')
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
      if (!res.ok) throw new Error('failed')
      setDone(true)
    } catch {
      setError(`접수 중 문제가 발생했습니다. ${SITE.email} 으로 보내주시면 확인하겠습니다.`)
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="as" className="wk-sec bg-wk-bg">
      <div className="wk-wrap grid items-start gap-5 lg:grid-cols-2 lg:gap-8">
        <div>
          <p className="wk-eyebrow">A/S 신청</p>
          <h2 className="wk-h2 text-wk-ink">장애 접수</h2>
          <p className="wk-lead mt-4">
            화면이 켜지지 않거나 일부가 어둡게 보이는 등 이상이 있으면 접수해 주십시오.
            증상과 화면 사진만 있으면 원격으로 원인을 먼저 확인합니다.
          </p>
          {SITE.phone && (
            <p className="mt-5 text-label text-wk-ink3">
              급한 건은 전화로 접수하시는 편이 빠릅니다 —{' '}
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
          {done ? (
            <div>
              <p className="wk-h3 text-wk-ink">접수되었습니다</p>
              <p className="mt-2 text-label text-wk-ink3">
                담당자가 확인 후 연락드립니다. 원격 확인이 가능한 건은 방문 없이 처리됩니다.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-wk-ink2">기관·설치 장소</span>
                <input
                  className="input-base"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  placeholder="예) ○○구청 1층 민원실"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-wk-ink2">담당자</span>
                  <input
                    className="input-base"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-wk-ink2">
                    연락처 <span className="text-wk-cta">필수</span>
                  </span>
                  <input
                    className="input-base"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    inputMode="tel"
                    autoComplete="tel"
                    required
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-wk-ink2">
                  증상 <span className="text-wk-cta">필수</span>
                </span>
                <textarea
                  className="input-base min-h-[110px] resize-y"
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  placeholder="예) 화면 오른쪽 아래 부분이 어제부터 어둡습니다."
                  required
                />
              </label>

              <label className="flex cursor-pointer items-start gap-2.5 text-label text-wk-ink3">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-wk-blue"
                />
                <span>A/S 처리를 위한 개인정보(담당자명·연락처) 수집·이용에 동의합니다.</span>
              </label>

              {error && <p className="text-label text-wk-bad">{error}</p>}

              <button type="submit" disabled={sending} className="wk-btn-p disabled:opacity-45">
                {sending ? '접수 중…' : 'A/S 접수하기'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
