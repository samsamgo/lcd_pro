/**
 * 문의 게시판 — 화면과 서버가 함께 쓰는 타입·마스킹·검증.
 *
 * 왜 한 파일에 모으나 — `lib/phone.ts` 와 같은 이유다. 검증 규칙이 화면과 서버에
 * 따로 적히면 담당자는 "왜 안 되는지 모른 채" 이탈한다. 규칙은 한 곳에만 둔다.
 *
 * 🔴 이 파일은 클라이언트 번들에도 들어간다. node:crypto 같은 서버 전용 모듈을
 *    여기서 import 하지 않는다(비밀번호 해시는 `app/api/inquiries/_password.ts`).
 */

import { phoneDigits } from '@/lib/phone'

export const INQUIRY_PAGE_SIZE = 20

/** 'open' = 답변 대기, 'answered' = 답변 완료 */
export type InquiryStatus = 'open' | 'answered'

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  open: '답변 대기',
  answered: '답변 완료',
}

/** 비공개 글의 제목 자리. 서버가 원제목 대신 이 문자열을 내려준다 */
export const LOCKED_TITLE = '비공개 문의입니다'

export interface InquiryListItem {
  id: string
  /** 게시판 번호. 최신 글이 가장 큰 번호를 갖는다(전체 건수 기준) */
  no: number
  /** 비공개 글이면 LOCKED_TITLE */
  title: string
  /** 마스킹된 작성자명. 비공개 글이면 null */
  authorName: string | null
  createdAt: string
  status: InquiryStatus
  isPublic: boolean
  /** 공개 글만. 비공개 글은 항상 null — 비밀번호 확인 후 별도로 받는다 */
  body: string | null
  answer: string | null
  answeredAt: string | null
}

export interface InquiryListResponse {
  items: InquiryListItem[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
  /**
   * 저장소(Supabase)가 붙어 있는가.
   * false 여도 접수는 받는다 — 알림은 나가고 원문은 서버 로그에 남는다.
   */
  available: boolean
}

/** 비공개 글을 비밀번호로 열었을 때 돌려주는 내용 */
export interface InquiryDetail {
  id: string
  title: string
  body: string
  authorName: string | null
  createdAt: string
  status: InquiryStatus
  answer: string | null
  answeredAt: string | null
}

export interface InquiryInput {
  title: string
  body: string
  authorName: string
  phone: string
  isPublic: boolean
  password?: string
  agreePrivacy: boolean
}

export const INQUIRY_LIMITS = {
  titleMin: 2,
  titleMax: 80,
  bodyMin: 5,
  bodyMax: 2000,
  passwordMin: 4,
  passwordMax: 20,
} as const

/**
 * 이름 마스킹 — 홍길동 → 홍*동, 김철 → 김*, 외자는 그대로.
 * 게시판은 아무나 보는 화면이라 실명을 그대로 두지 않는다.
 */
export function maskName(name: string | null | undefined): string {
  const v = (name ?? '').trim()
  if (!v) return '익명'
  if (v.length === 1) return v
  if (v.length === 2) return `${v[0]}*`
  return `${v[0]}${'*'.repeat(v.length - 2)}${v[v.length - 1]}`
}

/**
 * 통과하면 null, 아니면 화면에 그대로 띄울 사유를 돌려준다.
 * 화면과 `POST /api/inquiries` 가 같은 함수를 쓴다.
 */
export function validateInquiryInput(input: InquiryInput): string | null {
  const title = input.title.trim()
  const body = input.body.trim()

  if (title.length < INQUIRY_LIMITS.titleMin || title.length > INQUIRY_LIMITS.titleMax) {
    return `제목은 ${INQUIRY_LIMITS.titleMin}자 이상 ${INQUIRY_LIMITS.titleMax}자 이하로 입력해 주십시오.`
  }
  if (body.length < INQUIRY_LIMITS.bodyMin || body.length > INQUIRY_LIMITS.bodyMax) {
    return `내용은 ${INQUIRY_LIMITS.bodyMin}자 이상 ${INQUIRY_LIMITS.bodyMax}자 이하로 입력해 주십시오.`
  }

  const digits = phoneDigits(input.phone)
  if (digits.length < 9 || digits.length > 11) {
    return '연락처를 다시 확인해 주십시오. 지역번호나 휴대폰 번호를 숫자 9~11자리로 입력합니다.'
  }

  if (!input.agreePrivacy) return '개인정보 수집·이용에 동의해 주십시오.'

  if (!input.isPublic) {
    const pw = (input.password ?? '').trim()
    if (pw.length < INQUIRY_LIMITS.passwordMin || pw.length > INQUIRY_LIMITS.passwordMax) {
      return `비공개 문의는 ${INQUIRY_LIMITS.passwordMin}~${INQUIRY_LIMITS.passwordMax}자 비밀번호가 필요합니다.`
    }
  }

  return null
}

/** 2026-09-09 형식으로 표기. 게시판 목록은 시각까지 필요 없다 */
export function formatInquiryDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
