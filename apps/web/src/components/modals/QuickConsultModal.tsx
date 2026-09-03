'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { SITE } from '@/lib/seo/site'

/**
 * 간단 문의 모달.
 *
 * 이전 버전은 업종·지역·설치환경까지 받는 소형 견적폼이라 /quote 와 하는 일이
 * 겹쳤다. 견적은 /quote 한 곳에서만 받고, 여기서는 연락처와 문의 내용만 받는다.
 *
 * 필수는 연락처 하나뿐이다. 입력 항목이 늘수록 이탈한다.
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

    if (!phone.trim()) {
      setError('연락처를 입력해 주십시오.')
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
      if (!res.ok) throw new Error('failed')
      setDone(true)
    } catch {
      // 접수 실패를 고객에게 그대로 떠넘기지 않는다. 대체 연락 수단을 안내한다.
      setError(`접수 중 문제가 발생했습니다. ${SITE.email} 으로 보내주시면 확인하겠습니다.`)
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

  return (
    <Modal open={open} onClose={close} title={done ? '접수되었습니다' : '문의하기'} size="sm">
      {done ? (
        <div>
          <p className="text-body text-wk-ink2">
            문의를 접수했습니다. 영업일 기준 1일 이내에 담당자가 연락드립니다.
          </p>
          <button type="button" onClick={close} className="wk-btn-p mt-6">
            확인
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <p className="text-label text-wk-ink3">
            연락처와 문의 내용만 남겨주시면 담당자가 확인 후 연락드립니다.
            견적이 필요하시면 견적 요청을 이용해 주십시오.
          </p>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-wk-ink2">성함</span>
            <input
              className="input-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="선택 입력"
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
              placeholder="휴대전화 또는 사무실 번호"
              inputMode="tel"
              autoComplete="tel"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-wk-ink2">문의 내용</span>
            <textarea
              className="input-base min-h-[110px] resize-y"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="설치 장소나 궁금한 점을 자유롭게 적어주십시오."
            />
          </label>

          <label className="flex cursor-pointer items-start gap-2.5 text-label text-wk-ink3">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-wk-blue"
            />
            <span>
              문의 응대를 위한 개인정보(성함·연락처) 수집·이용에 동의합니다.
              문의 처리 후 파기합니다.
            </span>
          </label>

          {error && <p className="text-label text-wk-bad">{error}</p>}

          <button type="submit" disabled={sending} className="wk-btn-p disabled:opacity-45">
            {sending ? '접수 중…' : '문의 보내기'}
          </button>
        </form>
      )}
    </Modal>
  )
}
