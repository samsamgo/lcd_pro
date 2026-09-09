import { NextRequest, NextResponse } from 'next/server'

import { serverClient } from '@/lib/supabase'
import { verifyPassword } from '../../_password'
import {
  LIST_COLUMNS,
  clientIp,
  rateLimited,
  supabaseReady,
  toDetail,
  type InquiryRow,
} from '../../_shared'

/**
 * 비공개 문의 열람 — 작성자가 남긴 비밀번호로만 연다.
 *
 * GET 이 아니라 POST 인 이유: 비밀번호가 쿼리스트링에 실려 액세스 로그·리퍼러에
 * 남는 것을 막는다.
 *
 * 무차별 대입 방지 — 시도도 같은 1분/3회 제한을 쓴다(`view:` 접두어로 접수와 분리).
 */
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  let raw: Record<string, unknown>
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  const password = String(raw.password ?? '').trim()
  if (!password) {
    return NextResponse.json({ error: '비밀번호를 입력해 주십시오.' }, { status: 400 })
  }

  if (rateLimited(`view:${clientIp(req)}`)) {
    return NextResponse.json(
      { error: '잠시 후 다시 시도해 주십시오. 확인 시도가 너무 잦습니다.' },
      { status: 429 },
    )
  }

  if (!supabaseReady()) {
    return NextResponse.json({ error: '문의를 불러오지 못했습니다.' }, { status: 503 })
  }

  try {
    const { data, error } = await serverClient()
      .from('inquiries')
      .select(`${LIST_COLUMNS}, password_hash`)
      .eq('id', params.id)
      .maybeSingle()

    if (error || !data) {
      return NextResponse.json({ error: '문의를 찾을 수 없습니다.' }, { status: 404 })
    }

    const row = data as unknown as InquiryRow
    // 공개 글은 비밀번호 없이도 볼 수 있다. 굳이 막지 않는다.
    if (row.is_public) return NextResponse.json(toDetail(row))

    if (!verifyPassword(password, row.password_hash)) {
      return NextResponse.json({ error: '비밀번호가 맞지 않습니다.' }, { status: 401 })
    }

    return NextResponse.json(toDetail(row))
  } catch (e) {
    console.error('[INQUIRY-VIEW-FAILED]', e instanceof Error ? e.message : 'unknown')
    return NextResponse.json({ error: '문의를 불러오지 못했습니다.' }, { status: 500 })
  }
}
