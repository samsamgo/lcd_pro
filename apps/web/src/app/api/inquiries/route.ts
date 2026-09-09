import { NextRequest, NextResponse } from 'next/server'

import { notifyLead } from '@/lib/notify'
import { serverClient } from '@/lib/supabase'
import {
  INQUIRY_PAGE_SIZE,
  validateInquiryInput,
  type InquiryInput,
  type InquiryListResponse,
} from '@/lib/inquiries'
import { hashPassword } from './_password'
import {
  LIST_COLUMNS,
  clientIp,
  rateLimited,
  supabaseReady,
  toListItem,
  type InquiryRow,
} from './_shared'

/**
 * 문의 게시판 — 목록 조회 · 문의 접수.
 *
 * 2026-09-09 CEO 지시로 신설. FAQ 아래에서 고객이 직접 질문을 올리고,
 * 우강테크가 답을 달면 그 자리에 붙는다(답변은 Supabase 대시보드에서 입력).
 *
 * 🔴 리드 경로 원칙은 `/api/lead` 와 같다 —
 *    **저장이 실패해도 알림은 나가고, 원문은 서버 로그에 남는다.**
 *    저장 실패가 고객 화면의 실패가 되면 문의는 그대로 사라진다.
 */

// 목록은 매번 최신이어야 한다. 라우트 캐시에 걸리면 방금 쓴 글이 안 보인다.
export const dynamic = 'force-dynamic'

// ─── 목록 ────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const page = Math.max(1, Number(req.nextUrl.searchParams.get('page') ?? '1') || 1)
  const from = (page - 1) * INQUIRY_PAGE_SIZE

  const empty = (available: boolean): InquiryListResponse => ({
    items: [],
    total: 0,
    page,
    pageSize: INQUIRY_PAGE_SIZE,
    hasMore: false,
    available,
  })

  if (!supabaseReady()) return NextResponse.json(empty(false))

  try {
    const { data, count, error } = await serverClient()
      .from('inquiries')
      .select(LIST_COLUMNS, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + INQUIRY_PAGE_SIZE - 1)

    if (error) {
      // 테이블 미적용(009 마이그레이션 미실행) 포함. 화면은 "아직 없음" 으로 떨어진다.
      console.error('[INQUIRY-LIST-FAILED]', error.message)
      return NextResponse.json(empty(false))
    }

    const rows = (data ?? []) as unknown as InquiryRow[]
    const total = count ?? rows.length
    const body: InquiryListResponse = {
      // 번호는 전체 건수 기준 역순 — 최신 글이 가장 큰 번호
      items: rows.map((row, i) => toListItem(row, total - from - i)),
      total,
      page,
      pageSize: INQUIRY_PAGE_SIZE,
      hasMore: from + rows.length < total,
      available: true,
    }
    return NextResponse.json(body)
  } catch (e) {
    console.error('[INQUIRY-LIST-FAILED]', e instanceof Error ? e.message : 'unknown')
    return NextResponse.json(empty(false))
  }
}

// ─── 접수 ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let raw: Record<string, unknown>
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  // 허니팟 — 사람에게는 보이지 않는 칸이다. 채워져 있으면 봇이다.
  // 봇에게 400 을 돌려주면 우회를 시도하므로 성공한 것처럼 응답하고 버린다.
  if (String(raw.company ?? '').trim()) {
    return NextResponse.json({ success: true, saved: false })
  }

  const ip = clientIp(req)
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: '잠시 후 다시 시도해 주십시오. 짧은 시간에 너무 많이 등록됐습니다.' },
      { status: 429 },
    )
  }

  const input: InquiryInput = {
    title: String(raw.title ?? ''),
    body: String(raw.body ?? ''),
    authorName: String(raw.authorName ?? ''),
    phone: String(raw.phone ?? ''),
    isPublic: raw.isPublic !== false,
    password: raw.password === undefined ? undefined : String(raw.password),
    agreePrivacy: raw.agreePrivacy === true || raw.agreePrivacy === 'true',
  }

  const invalid = validateInquiryInput(input)
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 })

  const title = input.title.trim()
  const body = input.body.trim()
  const authorName = input.authorName.trim()
  const phone = input.phone.trim()

  // 저장·알림 어느 쪽이 실패해도 원문은 남는다.
  const record = { title, body, authorName, phone, isPublic: input.isPublic, at: new Date().toISOString() }
  const logInquiry = (why: string) =>
    console.error('[INQUIRY-FALLBACK]', why, JSON.stringify(record))
  logInquiry('received')

  // ── 저장 ──
  let saved = false
  if (supabaseReady()) {
    try {
      const { error } = await serverClient()
        .from('inquiries')
        .insert({
          title,
          body,
          author_name: authorName || null,
          phone,
          is_public: input.isPublic,
          password_hash: input.isPublic ? null : hashPassword((input.password ?? '').trim()),
          status: 'open',
        } as never)
      if (error) logInquiry(`inquiries-insert-failed: ${error.message}`)
      else saved = true
    } catch (e) {
      logInquiry(`inquiries-insert-failed: ${e instanceof Error ? e.message : 'unknown'}`)
    }
  } else {
    logInquiry('supabase-env-missing')
  }

  // ── 알림 ── 저장 여부와 무관하게 보낸다. 리드는 시간이 생명이다.
  try {
    const result = await notifyLead({
      kind: 'consult',
      businessName: '(문의 게시판)',
      contactName: authorName || '-',
      phone,
      region: '-',
      environment: 'indoor',
      urgency: 'normal',
      quoteId: 'inquiry',
      purpose: `${title} — ${body.slice(0, 200)}${input.isPublic ? '' : ' [비공개]'}`,
    })
    if (!result.success) logInquiry('webhook-unsent')
  } catch {
    logInquiry('webhook-unsent')
  }

  return NextResponse.json({ success: true, saved })
}
