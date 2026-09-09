'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, Lock, MessageSquarePlus } from 'lucide-react'

import { readApiError } from '@/lib/phone'
import {
  INQUIRY_LIMITS,
  INQUIRY_STATUS_LABEL,
  formatInquiryDate,
  validateInquiryInput,
  type InquiryDetail,
  type InquiryListItem,
  type InquiryListResponse,
} from '@/lib/inquiries'
import {
  Field,
  FormError,
  FormSuccess,
  FormToneProvider,
  OptionButton,
  PrivacyConsent,
  RequiredLegend,
  SUBMIT_FAILED,
  SubmitButton,
  TextArea,
  TextInput,
} from '@/components/form'
import { Reveal, RiseMask } from '@/components/motion'

/**
 * 문의 게시판 — `/support/faq` 자주 묻는 질문 바로 아래.
 *
 * 2026-09-09 CEO 지시. FAQ 에 없는 질문을 담당자가 그 자리에서 남기고,
 * 우강테크 답변이 같은 줄에 붙는다. 공개 글은 다음 담당자가 읽을 수 있어
 * 시간이 지날수록 FAQ 를 스스로 늘린다. 민감한 건은 비공개로 남길 수 있다.
 *
 * 왜 클라이언트 컴포넌트인가 — `/support/faq` 는 정적으로 나가야 한다(SEO·속도).
 * 목록만 마운트 후 `/api/inquiries` 에서 가져온다. 페이지 캐시와 무관하게 최신이 뜬다.
 *
 * 🔴 비공개 글은 서버가 제목까지 가려서 내려준다. 화면에서 숨기는 방식이 아니다 —
 *    그렇게 하면 개발자도구로 본문이 그대로 보인다.
 */

const EMPTY_FORM = {
  title: '',
  body: '',
  authorName: '',
  phone: '',
  password: '',
  company: '', // 허니팟. 사람에게는 보이지 않는다
}

export function InquiryBoard() {
  const [items, setItems] = useState<InquiryListItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState('')

  const [openId, setOpenId] = useState<string | null>(null)
  /** 비밀번호로 열린 비공개 글 본문 (이 브라우저 세션에서만 유지) */
  const [unlocked, setUnlocked] = useState<Record<string, InquiryDetail>>({})

  const [writing, setWriting] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async (p: number, append: boolean) => {
    setLoading(true)
    setListError('')
    try {
      const res = await fetch(`/api/inquiries?page=${p}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('list')
      const json = (await res.json()) as InquiryListResponse
      setItems((prev) => (append ? [...prev, ...json.items] : json.items))
      setTotal(json.total)
      setHasMore(json.hasMore)
      setPage(json.page)
    } catch {
      // 목록을 못 불러와도 문의는 남길 수 있어야 한다 — 작성 폼은 그대로 둔다
      if (!append) setItems([])
      setListError('문의 목록을 불러오지 못했습니다. 새로고침 후 다시 시도해 주십시오.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load(1, false)
  }, [load])

  function openWriter() {
    setWriting(true)
    // 폼이 화면 밖에서 열리면 눌러도 아무 일 없는 것처럼 보인다
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  return (
    <section id="inquiry" aria-labelledby="inquiry-h" className="wk-sec scroll-mt-32 bg-wk-bg">
      <div className="wk-wrap">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal y={10} duration={0.6}>
              <p className="wk-eyebrow">문의 게시판</p>
            </Reveal>
            <h2 id="inquiry-h" className="wk-h2 text-wk-ink">
              <RiseMask delay={0.06}>궁금한 점을 남겨 주세요</RiseMask>
            </h2>
            <Reveal y={14} delay={0.16}>
              <p className="wk-lead mt-5">
                위에 없는 질문은 여기에 남겨 주시면 확인 후 답변을 답니다. 공개하기 어려운
                내용은 비공개로 남기실 수 있습니다.
              </p>
            </Reveal>
          </div>

          {!writing && (
            <button type="button" onClick={openWriter} className="wk-btn-p shrink-0">
              <MessageSquarePlus size={18} aria-hidden="true" />
              문의하기
            </button>
          )}
        </div>

        {/* 작성 폼 — 표 위에서 펼쳐진다 */}
        <div ref={formRef}>
          {writing && (
            <div className="mt-8 rounded-card border border-wk-line bg-white p-5 sm:p-7">
              <InquiryForm
                onDone={() => {
                  setWriting(false)
                  setOpenId(null)
                  void load(1, false)
                }}
                onCancel={() => setWriting(false)}
              />
            </div>
          )}
        </div>

        {/* 목록 */}
        <div className="mt-8 overflow-hidden rounded-card border border-wk-line bg-white">
          {/* 표 머리 — 모바일에서는 열이 좁아 의미가 없다 */}
          <div
            aria-hidden="true"
            className="hidden whitespace-nowrap border-b border-wk-line bg-wk-bgFaint px-5 py-3 text-caption font-semibold text-wk-ink3 md:grid md:grid-cols-[4.5rem_1fr_7rem_7rem_6.5rem] md:gap-4"
          >
            <span>번호</span>
            <span>제목</span>
            <span>작성자</span>
            <span>작성일</span>
            <span className="text-right">상태</span>
          </div>

          {items.length === 0 && !loading && (
            <p className="px-5 py-12 text-center text-label text-wk-ink3">
              {listError || '아직 등록된 문의가 없습니다. 첫 문의를 남겨 주세요.'}
            </p>
          )}

          {items.map((item) => (
            <InquiryRow
              key={item.id}
              item={item}
              open={openId === item.id}
              detail={unlocked[item.id]}
              onToggle={() => setOpenId(openId === item.id ? null : item.id)}
              onUnlock={(d) => setUnlocked((prev) => ({ ...prev, [item.id]: d }))}
            />
          ))}

          {loading && (
            <p className="px-5 py-8 text-center text-label text-wk-ink3">불러오는 중…</p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="wk-cap">{total > 0 ? `전체 ${total}건` : ''}</p>
          {hasMore && (
            <button
              type="button"
              onClick={() => void load(page + 1, true)}
              disabled={loading}
              className="wk-btn-sm border border-wk-line bg-white text-wk-ink2 hover:bg-wk-bgFaint disabled:opacity-50"
            >
              더 보기
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── 목록 한 줄 ─────────────────────────────────────────────── */

function StatusBadge({ status }: { status: InquiryListItem['status'] }) {
  const answered = status === 'answered'
  return (
    <span
      className={`inline-flex h-[26px] items-center rounded-lg px-2.5 text-caption font-semibold ${
        answered ? 'bg-wk-cta/10 text-wk-cta' : 'bg-wk-bg text-wk-ink3'
      }`}
    >
      {INQUIRY_STATUS_LABEL[status]}
    </span>
  )
}

function InquiryRow({
  item,
  open,
  detail,
  onToggle,
  onUnlock,
}: {
  item: InquiryListItem
  open: boolean
  detail?: InquiryDetail
  onToggle: () => void
  onUnlock: (d: InquiryDetail) => void
}) {
  const locked = !item.isPublic && !detail
  const shownBody = item.isPublic ? item.body : detail?.body ?? null
  const shownAnswer = item.isPublic ? item.answer : detail?.answer ?? null

  return (
    <div className="border-b border-wk-line last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3 px-5 py-4 text-left transition-colors duration-state ease-state hover:bg-wk-bgFaint md:grid-cols-[4rem_1fr_7rem_7rem_6.5rem] md:gap-4"
      >
        <span className="wk-metric text-caption text-wk-ink3">{item.no}</span>

        <span className="min-w-0">
          <span className="flex items-center gap-2">
            {!item.isPublic && (
              <Lock size={14} className="shrink-0 text-wk-ink3" aria-hidden="true" />
            )}
            <span
              className={`truncate text-label font-semibold ${
                item.isPublic ? 'text-wk-ink' : 'text-wk-ink3'
              }`}
            >
              {item.title}
            </span>
            <ChevronDown
              size={15}
              aria-hidden="true"
              className={`shrink-0 text-wk-ink3 transition-transform duration-state ease-state ${
                open ? 'rotate-180' : ''
              }`}
            />
          </span>
          {/* 모바일 — 작성자·작성일 열이 없으니 제목 아래로 내린다 */}
          <span className="mt-1 block text-caption text-wk-ink3 md:hidden">
            {(item.authorName ?? '비공개') + ' · ' + formatInquiryDate(item.createdAt)}
          </span>
        </span>

        <span className="hidden truncate text-caption text-wk-ink3 md:block">
          {item.authorName ?? '비공개'}
        </span>
        <span className="wk-metric hidden text-caption text-wk-ink3 md:block">
          {formatInquiryDate(item.createdAt)}
        </span>
        <span className="justify-self-end">
          <StatusBadge status={item.status} />
        </span>
      </button>

      {/* 0fr → 1fr. height 애니메이션과 달리 매 프레임 레이아웃을 다시 재지 않는다 */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-enter ease-entrance ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-wk-line bg-wk-bgFaint px-5 py-6">
            {locked ? (
              <UnlockForm id={item.id} onUnlock={onUnlock} />
            ) : (
              <>
                {!item.isPublic && detail && (
                  <p className="mb-3 text-caption font-semibold text-wk-ink3">{detail.title}</p>
                )}
                <p className="wk-body whitespace-pre-wrap !text-wk-ink2">{shownBody ?? '-'}</p>

                {shownAnswer ? (
                  <div className="mt-5 rounded-btn border border-wk-cta/30 bg-wk-cta/[0.06] p-4 sm:p-5">
                    <p className="text-label font-semibold text-wk-cta">우강테크 답변</p>
                    <p className="wk-body mt-2 whitespace-pre-wrap !text-wk-ink2">
                      {shownAnswer}
                    </p>
                  </div>
                ) : (
                  <p className="mt-5 text-caption text-wk-ink3">
                    아직 답변이 등록되지 않았습니다. 확인 후 답변을 남기고 연락드립니다.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── 비공개 글 열람 ─────────────────────────────────────────── */

function UnlockForm({ id, onUnlock }: { id: string; onUnlock: (d: InquiryDetail) => void }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!pw.trim()) return setError('비밀번호를 입력해 주십시오.')
    setSending(true)
    try {
      const res = await fetch(`/api/inquiries/${id}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      })
      if (!res.ok) {
        setError(await readApiError(res, '문의를 불러오지 못했습니다.'))
        return
      }
      onUnlock((await res.json()) as InquiryDetail)
    } catch {
      setError('문의를 불러오지 못했습니다. 잠시 후 다시 시도해 주십시오.')
    } finally {
      setSending(false)
    }
  }

  return (
    <FormToneProvider tone="light">
      <form onSubmit={submit} className="max-w-sm space-y-3" noValidate>
        <p className="text-label text-wk-ink2">
          비공개 문의입니다. 작성하실 때 정하신 비밀번호를 입력하시면 열립니다.
        </p>
        <Field label="비밀번호">
          <TextInput
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="off"
          />
        </Field>
        <FormError>{error}</FormError>
        <SubmitButton pending={sending} className="sm:w-auto">
          확인
        </SubmitButton>
      </form>
    </FormToneProvider>
  )
}

/* ── 문의 작성 ──────────────────────────────────────────────── */

function InquiryForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [v, setV] = useState({ ...EMPTY_FORM })
  const [isPublic, setIsPublic] = useState(true)
  const [agree, setAgree] = useState(false)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof EMPTY_FORM) => (e: { target: { value: string } }) =>
    setV((prev) => ({ ...prev, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const invalid = validateInquiryInput({
      title: v.title,
      body: v.body,
      authorName: v.authorName,
      phone: v.phone,
      isPublic,
      password: v.password,
      agreePrivacy: agree,
    })
    if (invalid) return setError(invalid)

    setSending(true)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: v.title.trim(),
          body: v.body.trim(),
          authorName: v.authorName.trim(),
          phone: v.phone.trim(),
          isPublic,
          password: isPublic ? undefined : v.password,
          agreePrivacy: true,
          company: v.company, // 허니팟 — 사람이 채웠을 리 없는 칸
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

  if (done) {
    return (
      <FormToneProvider tone="light">
        <FormSuccess
          title="접수됐습니다"
          detail="확인 후 답변을 남기고 연락드리겠습니다."
          promiseDetail={
            <>
              답변은 아래 목록의 해당 글에 붙습니다.
              {isPublic
                ? ' 공개 문의라 다른 담당자도 답변을 볼 수 있습니다.'
                : ' 비공개 문의는 작성하실 때 정하신 비밀번호로만 열립니다.'}
            </>
          }
        >
          <div className="mt-5">
            <button
              type="button"
              onClick={onDone}
              className="wk-btn-sm border border-wk-line bg-white text-wk-ink2 hover:bg-wk-bgFaint"
            >
              목록으로
            </button>
          </div>
        </FormSuccess>
      </FormToneProvider>
    )
  }

  return (
    <FormToneProvider tone="light">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <RequiredLegend />

        <Field label="제목" required>
          <TextInput
            value={v.title}
            onChange={set('title')}
            maxLength={INQUIRY_LIMITS.titleMax}
            placeholder="예) 초등학교 정문에 다는 전광판 예산은 어느 과목인가요?"
          />
        </Field>

        <Field label="내용" required>
          <TextArea
            value={v.body}
            onChange={set('body')}
            maxLength={INQUIRY_LIMITS.bodyMax}
            placeholder="설치 장소, 대략적인 크기, 언제까지 필요한지를 적어 주시면 답변이 정확해집니다."
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="이름">
            <TextInput value={v.authorName} onChange={set('authorName')} autoComplete="name" />
          </Field>
          <Field label="연락처" required hint="답변과 함께 전화로 알려 드립니다. 화면에는 나가지 않습니다.">
            <TextInput
              value={v.phone}
              onChange={set('phone')}
              inputMode="tel"
              autoComplete="tel"
              placeholder="010-0000-0000"
            />
          </Field>
        </div>

        <div>
          <p className="mb-2 block text-label font-semibold text-wk-ink">공개 여부</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <OptionButton selected={isPublic} onClick={() => setIsPublic(true)}>
              공개
            </OptionButton>
            <OptionButton selected={!isPublic} onClick={() => setIsPublic(false)}>
              비공개
            </OptionButton>
          </div>
          <p className="mt-2 text-caption text-wk-ink3">
            {isPublic
              ? '공개 문의는 제목과 내용, 답변이 목록에 보입니다. 이름은 가운데를 가려 표시합니다.'
              : '비공개 문의는 작성자만 비밀번호로 열람할 수 있습니다. 목록에는 제목도 보이지 않습니다.'}
          </p>
        </div>

        {!isPublic && (
          <Field
            label="비밀번호"
            required
            hint={`${INQUIRY_LIMITS.passwordMin}~${INQUIRY_LIMITS.passwordMax}자. 잊으시면 다시 찾아 드릴 수 없습니다.`}
          >
            <TextInput
              type="password"
              value={v.password}
              onChange={set('password')}
              maxLength={INQUIRY_LIMITS.passwordMax}
              autoComplete="new-password"
            />
          </Field>
        )}

        {/* 허니팟 — 화면 밖에 둔다. 사람은 볼 수도 누를 수도 없다 */}
        <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="inquiry-company">회사명 (입력하지 마세요)</label>
          <input
            id="inquiry-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={v.company}
            onChange={set('company')}
          />
        </div>

        <PrivacyConsent
          purpose="문의 답변"
          items="이름·연락처"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
        />

        <FormError>{error}</FormError>

        <div className="flex flex-col gap-2 sm:flex-row">
          <SubmitButton pending={sending}>문의 등록하기</SubmitButton>
          <button
            type="button"
            onClick={onCancel}
            className="wk-btn border border-wk-line bg-white text-wk-ink2 hover:bg-wk-bgFaint"
          >
            취소
          </button>
        </div>
      </form>
    </FormToneProvider>
  )
}
