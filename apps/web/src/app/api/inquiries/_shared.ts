import type { NextRequest } from 'next/server'

import {
  LOCKED_TITLE,
  maskName,
  type InquiryDetail,
  type InquiryListItem,
  type InquiryStatus,
} from '@/lib/inquiries'

/**
 * 문의 게시판 서버 공통부 — DB 행 → 화면용 객체 변환, 스팸 제한.
 *
 * 🔴 화면에 내보내도 되는 값을 정하는 곳이 여기 하나다.
 *    `phone` 과 `admin_note` 와 `password_hash` 는 어떤 경로로도 나가지 않는다.
 *    라우트에서 행을 직접 spread 하지 말고 반드시 이 함수를 거친다.
 */

/** DB 행. `@lcd-pro/db` 타입 재생성 전이라 여기서 최소 형태만 적는다 */
export interface InquiryRow {
  id: string
  created_at: string
  title: string
  body: string
  author_name: string | null
  is_public: boolean
  password_hash: string | null
  status: string | null
  answer: string | null
  answered_at: string | null
}

/** 목록에서 뽑는 컬럼. `phone`·`admin_note` 는 애초에 select 하지 않는다 */
export const LIST_COLUMNS =
  'id, created_at, title, body, author_name, is_public, status, answer, answered_at'

const asStatus = (v: string | null): InquiryStatus => (v === 'answered' ? 'answered' : 'open')

/**
 * 목록 한 줄. 비공개 글은 제목·본문·답변·작성자를 모두 숨긴다 —
 * "있다"는 사실과 상태(답변 대기/완료)만 남긴다.
 */
export function toListItem(row: InquiryRow, no: number): InquiryListItem {
  const status = asStatus(row.status)
  if (!row.is_public) {
    return {
      id: row.id,
      no,
      title: LOCKED_TITLE,
      authorName: null,
      createdAt: row.created_at,
      status,
      isPublic: false,
      body: null,
      answer: null,
      answeredAt: null,
    }
  }
  return {
    id: row.id,
    no,
    title: row.title,
    authorName: maskName(row.author_name),
    createdAt: row.created_at,
    status,
    isPublic: true,
    body: row.body,
    answer: row.answer,
    answeredAt: row.answered_at,
  }
}

/** 비밀번호가 맞았거나 공개 글일 때 돌려주는 상세 */
export function toDetail(row: InquiryRow): InquiryDetail {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    authorName: maskName(row.author_name),
    createdAt: row.created_at,
    status: asStatus(row.status),
    answer: row.answer,
    answeredAt: row.answered_at,
  }
}

export function supabaseReady(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_KEY
}

export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

/**
 * 같은 IP 1분에 3건 제한.
 *
 * 🔴 서버리스라 인스턴스마다 메모리가 따로 논다 — 완전한 차단이 아니라
 *    "실수로 두 번 누름 / 단순 반복 도배"를 막는 1차 방어다. 진짜 방어는 Vercel WAF 몫.
 *    그래도 여기서 막는 게 낫다. 도배 한 번이면 게시판 첫 화면이 통째로 날아간다.
 */
const HITS = new Map<string, number[]>()
const WINDOW_MS = 60_000
const MAX_HITS = 3

export function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_HITS) {
    HITS.set(ip, recent)
    return true
  }
  recent.push(now)
  HITS.set(ip, recent)

  // 오래된 항목 정리 — Map 이 무한히 자라지 않게
  if (HITS.size > 500) {
    for (const [k, v] of HITS) {
      if (v.every((t) => now - t >= WINDOW_MS)) HITS.delete(k)
    }
  }
  return false
}
