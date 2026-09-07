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
  // A/S 폼은 설치 장소를 businessName 으로, 빠른 상담 모달은 업종을 businessType 으로 보낸다.
  // 하나만 읽으면 다른 쪽 값이 통째로 버려진다.
  const businessType =
    String(body.businessName ?? '').trim() || String(body.businessType ?? '').trim()
  const contactName = String(body.contactName ?? '').trim()
  const region = String(body.region ?? '').trim()
  const message = String(body.message ?? '').trim()
  const environment = body.environment === 'outdoor' ? 'outdoor' : 'indoor'
  const agreePrivacy = body.agreePrivacy === true || body.agreePrivacy === 'true'
  // 장애 접수는 이미 설치된 화면이 멈춘 상황이라 신규 상담보다 먼저 봐야 한다.
  // source 를 여기서 읽지 않으면 알림 제목이 전부 "신규 견적 문의" 로 와서 그 구분이 사라진다.
  //
  // 현재 들어오는 source 와 kind 매핑 (2026-09-07 기준) —
  //   as-request      (/support ServiceRequest)     → 'as'      긴급도 high
  //   about-contact   (/about  AboutContact 폼)     → 'consult' 긴급도 normal
  //   quick-consult · navbar · mobile-bar · product-* · quote-success
  //                   (QuickConsultModal)           → 'consult' 긴급도 normal
  // about-contact 를 별도 kind 로 가르지 않는 이유 — 알림 제목이 갈려야 하는 기준은
  // "지금 화면이 멈췄는가"뿐이다. 일반 문의는 빠른 상담과 처리 순서가 같다.
  // 기관명은 businessName 으로, 문의 내용은 message→purpose 로 알림에 그대로 실린다.
  const source = String(body.source ?? '').trim()
  const kind = source === 'as-request' ? 'as' : 'consult'

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
      businessName: businessType || (kind === 'as' ? '(설치 장소 미기재)' : '(빠른 상담)'),
      contactName: contactName || '-',
      phone,
      region: region || '-',
      environment: environment as 'indoor' | 'outdoor',
      // 장애는 이미 쓰던 화면이 멈춘 것이라 기본 긴급도를 올린다.
      urgency: kind === 'as' ? 'high' : 'normal',
      quoteId: 'lead',
      purpose: message || (kind === 'as' ? '증상 미기재' : '빠른 상담 요청'),
      kind,
    })
    if (!result.success) logLead('webhook-unsent')
  } catch {
    logLead('webhook-unsent')
  }

  return NextResponse.json({ success: true })
}
