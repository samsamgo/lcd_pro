import { NextResponse } from 'next/server'

import { serverClient } from '@/lib/supabase'
import { LIST_COLUMNS, supabaseReady, toDetail, type InquiryRow } from '../_shared'

/**
 * 공개 문의 상세.
 *
 * 목록(GET /api/inquiries)이 이미 공개 글의 본문·답변을 함께 내려주므로 화면은
 * 대개 이 경로를 쓰지 않는다. 링크로 한 건만 열거나 답변이 방금 달렸는지 다시 볼 때 쓴다.
 *
 * 🔴 비공개 글은 여기서 절대 내주지 않는다 — `POST /api/inquiries/[id]/view` 로만 연다.
 */
export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!supabaseReady()) {
    return NextResponse.json({ error: '문의를 불러오지 못했습니다.' }, { status: 503 })
  }

  try {
    const { data, error } = await serverClient()
      .from('inquiries')
      .select(LIST_COLUMNS)
      .eq('id', params.id)
      .maybeSingle()

    if (error || !data) {
      return NextResponse.json({ error: '문의를 찾을 수 없습니다.' }, { status: 404 })
    }

    const row = data as unknown as InquiryRow
    if (!row.is_public) {
      return NextResponse.json(
        { error: '비공개 문의입니다. 비밀번호를 입력해 주십시오.' },
        { status: 403 },
      )
    }

    return NextResponse.json(toDetail(row))
  } catch (e) {
    console.error('[INQUIRY-DETAIL-FAILED]', e instanceof Error ? e.message : 'unknown')
    return NextResponse.json({ error: '문의를 불러오지 못했습니다.' }, { status: 500 })
  }
}
