import { NextRequest, NextResponse } from 'next/server'
import { notifyLead } from '@/lib/notify'

/**
 * 경량 상담 리드 엔드포인트 (빠른 상담 모달용).
 * 사진 없이 최소 정보(연락처 + 업종 + 용도)만 받아 사장에게 즉시 웹훅 전달한다.
 * 전체 견적(설치 조건 + 개략 범위 산출)은 /api/quotes 를 사용한다.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  const leadRecord = {
    ...body,
    at: new Date().toISOString(),
  }
  const logLead = (why: string) =>
    console.error('[LEAD-FALLBACK]', why, JSON.stringify(leadRecord))
  logLead('received')

  const phone = String(body.phone ?? '').trim()
  const businessType = String(body.businessType ?? '').trim()
  const contactName = String(body.contactName ?? '').trim()
  const region = String(body.region ?? '').trim()
  const message = String(body.message ?? '').trim()
  const environment = body.environment === 'outdoor' ? 'outdoor' : 'indoor'
  const agreePrivacy = body.agreePrivacy === true || body.agreePrivacy === 'true'

  // 최소 검증: 연락처 + 개인정보 동의
  const digits = phone.replace(/[^\d]/g, '')
  if (digits.length < 9 || digits.length > 11) {
    return NextResponse.json({ error: '올바른 연락처를 입력해주세요.' }, { status: 400 })
  }
  if (!agreePrivacy) {
    return NextResponse.json({ error: '개인정보 수집 동의가 필요합니다.' }, { status: 400 })
  }

  try {
    const result = await notifyLead({
      businessName: businessType || '(빠른 상담)',
      contactName: contactName || '-',
      phone,
      region: region || '-',
      environment: environment as 'indoor' | 'outdoor',
      urgency: 'normal',
      quoteId: 'lead',
      purpose: message || '빠른 상담 요청',
    })
    if (!result.success) logLead('webhook-unsent')
  } catch {
    logLead('webhook-unsent')
  }

  return NextResponse.json({ success: true })
}
