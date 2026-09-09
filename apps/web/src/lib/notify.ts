/**
 * 알림 시스템
 * - 카카오 BizTalk (알림톡): 고객 견적 접수 확인
 * - 알리고 SMS: 관리자 즉시 알림 (카카오 실패 시 폴백)
 * - Slack 웹훅: 내부 운영 채널
 */

import { mailConfigured, sendMail } from './mail'

interface QuoteNotifyData {
  businessName: string
  contactName: string
  phone: string
  region: string
  environment: 'indoor' | 'outdoor'
  urgency: string
  quoteId: string
}

// ─── 고객 견적 접수 확인 (카카오 알림톡) ─────────────────────────
export async function notifyCustomerQuoteReceived(data: QuoteNotifyData) {
  const kakaoApiKey = process.env.KAKAO_BIZTALK_API_KEY
  const senderKey = process.env.KAKAO_BIZTALK_SENDER_KEY

  if (!kakaoApiKey || !senderKey) {
    // 알리고 SMS로 폴백
    return notifyCustomerSMS(data)
  }

  try {
    // 카카오 알림톡 (BizTalk API)
    const res = await fetch('https://alimtalk-api.kakao.com/v2/sender/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'kakaoApiKey': kakaoApiKey,
      },
      body: JSON.stringify({
        senderKey,
        templateCode: 'LCD_QUOTE_RECEIVED',
        recipientList: [
          {
            recipientNo: data.phone.replace(/-/g, ''),
            templateParameter: {
              businessName: data.businessName,
              estimateTime: '범위 견적을 안내드립니다.',
              contactUrl: `https://wooktech.co.kr/quote/status/${data.quoteId}`,
            },
          },
        ],
      }),
    })

    if (res.ok) return { success: true, channel: 'kakao' }
  } catch {
    // 폴백
  }

  return notifyCustomerSMS(data)
}

// ─── 고객 SMS (알리고) ────────────────────────────────────────────
async function notifyCustomerSMS(data: QuoteNotifyData) {
  const aligoApiKey = process.env.ALIGO_API_KEY
  const aligoUserId = process.env.ALIGO_USER_ID
  const senderNumber = process.env.ALIGO_SENDER_NUMBER

  if (!aligoApiKey || !aligoUserId || !senderNumber) {
    return { success: false, channel: 'none', reason: 'SMS 설정 없음' }
  }

  try {
    const formData = new URLSearchParams({
      key: aligoApiKey,
      user_id: aligoUserId,
      sender: senderNumber,
      receiver: data.phone.replace(/-/g, ''),
      msg: `[우강테크] ${data.businessName} 견적 요청이 접수되었습니다.\n범위 견적을 안내드립니다.\n문의: wooktech.co.kr`,
      testmode_yn: process.env.NODE_ENV === 'production' ? 'N' : 'Y',
    })

    const res = await fetch('https://apis.aligo.in/send/', {
      method: 'POST',
      body: formData,
    })

    const result = await res.json() as { result_code: number; message: string }

    return {
      success: result.result_code === 1,
      channel: 'sms',
      message: result.message,
    }
  } catch {
    return { success: false, channel: 'sms', reason: 'API 오류' }
  }
}

// ─── 관리자 알림 (Slack + SMS) ────────────────────────────────────
export async function notifyAdminNewQuote(data: QuoteNotifyData) {
  const results = await Promise.allSettled([
    notifyAdminSlack(data),
    notifyAdminSMS(data),
  ])

  return results.map((r) => r.status === 'fulfilled' ? r.value : { success: false })
}

async function notifyAdminSlack(data: QuoteNotifyData) {
  const webhook = process.env.ADMIN_SLACK_WEBHOOK || process.env.ADMIN_KAKAO_WEBHOOK
  if (!webhook) return { success: false, channel: 'slack' }

  const urgencyEmoji: Record<string, string> = {
    low: '🟢', normal: '🟡', high: '🟠', urgent: '🔴',
  }

  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `${urgencyEmoji[data.urgency] ?? '📩'} *신규 견적 접수*`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: [
              `*${urgencyEmoji[data.urgency] ?? '📩'} 신규 견적 접수*`,
              `> *업체:* ${data.businessName}`,
              `> *담당자:* ${data.contactName} · ${data.phone}`,
              `> *지역:* ${data.region} · ${data.environment === 'indoor' ? '실내' : '옥외'}`,
              `> *긴급도:* ${{ low:'여유', normal:'보통', high:'빠름', urgent:'긴급' }[data.urgency] ?? data.urgency}`,
            ].join('\n'),
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: '견적 처리하기' },
              url: `https://admin.wooktech.co.kr/quotes/${data.quoteId}`,
              style: 'primary',
            },
          ],
        },
      ],
    }),
  })

  return { success: res.ok, channel: 'slack' }
}

async function notifyAdminSMS(data: QuoteNotifyData) {
  const aligoApiKey = process.env.ALIGO_API_KEY
  const aligoUserId = process.env.ALIGO_USER_ID
  const senderNumber = process.env.ALIGO_SENDER_NUMBER
  const adminPhone = process.env.ADMIN_PHONE

  if (!aligoApiKey || !aligoUserId || !senderNumber || !adminPhone) {
    return { success: false, channel: 'admin_sms' }
  }

  try {
    const urgencyLabel: Record<string, string> = {
      low: '여유', normal: '보통', high: '빠름', urgent: '긴급',
    }

    const formData = new URLSearchParams({
      key: aligoApiKey,
      user_id: aligoUserId,
      sender: senderNumber,
      receiver: adminPhone,
      msg: `[우강테크 신규견적]\n${data.businessName} (${data.region})\n${data.phone}\n${data.environment === 'indoor' ? '실내' : '옥외'} / ${urgencyLabel[data.urgency] ?? ''}\n처리: admin.wooktech.co.kr`,
      testmode_yn: process.env.NODE_ENV === 'production' ? 'N' : 'Y',
    })

    const res = await fetch('https://apis.aligo.in/send/', {
      method: 'POST',
      body: formData,
    })

    const result = await res.json() as { result_code: number }
    return { success: result.result_code === 1, channel: 'admin_sms' }
  } catch {
    return { success: false, channel: 'admin_sms' }
  }
}

// ─── 리드 웹훅 알림 (DB 저장과 독립) ─────────────────────────────
// Supabase 없이도 사장이 견적 리드를 즉시 받게 하는 최소 경로.
// ADMIN_LEAD_WEBHOOK 하나만 설정하면 동작한다 (Slack·Discord·카카오웍스 호환).
// Slack은 `text`, Discord는 `content` 키를 사용하므로 둘 다 넣어 호환성 확보.
export interface LeadWebhookData extends QuoteNotifyData {
  priceMin?: number | null
  priceMax?: number | null
  purpose?: string
  /**
   * 리드의 성격. 알림 제목이 여기서 갈린다.
   * A/S 는 이미 설치된 화면이 멈춘 상황이라 신규 견적보다 먼저 봐야 한다.
   * 제목이 전부 "신규 견적 문의" 로 오면 그 구분이 사라진다.
   */
  kind?: 'quote' | 'as' | 'consult'
}

const LEAD_TITLE: Record<NonNullable<LeadWebhookData['kind']>, string> = {
  quote: '신규 견적 문의',
  as: 'A/S 장애 접수',
  consult: '빠른 상담 요청',
}
const leadTitle = (kind?: LeadWebhookData['kind']) => LEAD_TITLE[kind ?? 'quote']

export async function notifyLeadWebhook(data: LeadWebhookData): Promise<{ success: boolean }> {
  const webhook =
    process.env.ADMIN_LEAD_WEBHOOK ||
    process.env.ADMIN_SLACK_WEBHOOK ||
    process.env.ADMIN_KAKAO_WEBHOOK
  if (!webhook) return { success: false }

  const urgencyLabel: Record<string, string> = {
    low: '여유', normal: '보통', high: '빠름', urgent: '긴급',
  }
  const fmtMan = (won: number) => `${Math.round(won / 10_000).toLocaleString()}만원`
  const priceLine =
    data.priceMin && data.priceMax
      ? `\n예상 범위: 약 ${fmtMan(data.priceMin)} ~ ${fmtMan(data.priceMax)} (VAT 별도)`
      : ''

  const emoji = data.kind === 'as' ? '🚨' : '📩'
  const message =
    `${emoji} ${leadTitle(data.kind)}\n` +
    `업체: ${data.businessName}\n` +
    `담당자: ${data.contactName} · ${data.phone}\n` +
    `지역: ${data.region} · ${data.environment === 'indoor' ? '실내' : '옥외'}\n` +
    `긴급도: ${urgencyLabel[data.urgency] ?? data.urgency}` +
    (data.purpose ? `\n용도: ${data.purpose}` : '') +
    priceLine

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message, content: message }),
    })
    return { success: res.ok }
  } catch {
    return { success: false }
  }
}

// ─── 카카오워크 봇 알림 ──────────────────────────────────────────
/**
 * 견적 문의가 들어오면 카카오워크로 바로 보낸다.
 *
 * 왜 이 경로가 필요한가 —
 * 지금까지는 문의가 Supabase 에 저장만 되고 아무도 알림을 받지 못했다.
 * 사장이 DB 를 직접 열어보지 않으면 문의가 온 줄 몰랐다는 뜻이다.
 * 리드는 시간이 생명이라 저장보다 알림이 먼저다.
 *
 * conversation_id 대신 send_by_email 을 쓴다. 봇이 대화방을 먼저 만들어 두지 않아도
 * 워크스페이스 멤버 이메일만 알면 개인 대화로 도착한다.
 *
 * 설정: KAKAOWORK_BOT_KEY, KAKAOWORK_ADMIN_EMAIL (apps/web/.env.local)
 */
export async function notifyKakaoWork(data: LeadWebhookData): Promise<{ success: boolean; reason?: string }> {
  const key = process.env.KAKAOWORK_BOT_KEY
  const email = process.env.KAKAOWORK_ADMIN_EMAIL
  if (!key || !email) return { success: false, reason: '설정 없음' }

  const urgencyLabel: Record<string, string> = {
    low: '여유', normal: '보통', high: '빠름', urgent: '긴급',
  }
  const fmtMan = (won: number) => `${Math.round(won / 10_000).toLocaleString()}만원`
  const price =
    data.priceMin && data.priceMax
      ? `약 ${fmtMan(data.priceMin)} ~ ${fmtMan(data.priceMax)} (VAT 별도)`
      : '실측 후 산출'

  const text = `${leadTitle(data.kind)} · ${data.businessName}`

  try {
    const res = await fetch('https://api.kakaowork.com/v1/messages.send_by_email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        email,
        text,
        blocks: [
          {
            type: 'header',
            text: leadTitle(data.kind),
            style: data.kind === 'as' ? 'red' : 'blue',
          },
          {
            type: 'description',
            term: '기관 · 업체',
            content: { type: 'text', text: data.businessName, markdown: false },
            accent: true,
          },
          {
            type: 'description',
            term: '담당자',
            content: { type: 'text', text: `${data.contactName} · ${data.phone}`, markdown: false },
            accent: true,
          },
          {
            type: 'description',
            term: '설치 지역',
            content: {
              type: 'text',
              text: `${data.region} · ${data.environment === 'indoor' ? '실내' : '옥외'}`,
              markdown: false,
            },
            accent: true,
          },
          {
            type: 'description',
            term: '긴급도',
            content: { type: 'text', text: urgencyLabel[data.urgency] ?? data.urgency, markdown: false },
            accent: true,
          },
          {
            type: 'description',
            term: '예상 범위',
            content: { type: 'text', text: price, markdown: false },
            accent: true,
          },
          ...(data.purpose
            ? [{
                type: 'text' as const,
                text: `용도: ${data.purpose}`,
                markdown: false,
              }]
            : []),
          { type: 'divider' },
          // 🔴 2026-09-09 실측 — `action` 블록(전화 걸기 버튼)을 넣으면 카카오워크 API 가
          //    "요청한 블록 정보가 올바르지 않습니다"(invalid_parameter) 로 메시지 전체를 거부한다.
          //    그래서 견적·상담·A/S 리드가 단 한 건도 사장에게 도착하지 않았다 (CEO 확인 2026-09-09).
          //    버튼 대신 연락처를 본문 텍스트로 싣는다. 휴대폰 카카오워크는 번호를 길게 누르면 바로 걸린다.
          {
            type: 'text',
            text: `연락처: ${data.phone}`,
            markdown: false,
          },
        ],
      }),
    })
    const json = (await res.json()) as { success?: boolean; error?: { code?: string; message?: string } }
    if (json.success) return { success: true }
    // 블록 형식이 또 거부되더라도 리드는 죽지 않게 — 텍스트만으로 한 번 더 보낸다.
    if (json.error?.code === 'invalid_parameter') {
      const plain =
        `${leadTitle(data.kind)} · ${data.businessName}
` +
        `담당자: ${data.contactName} · ${data.phone}
` +
        `지역: ${data.region} · ${data.environment === 'indoor' ? '실내' : '옥외'}
` +
        `긴급도: ${urgencyLabel[data.urgency] ?? data.urgency}
` +
        `예상 범위: ${price}` +
        (data.purpose ? `
용도: ${data.purpose}` : '')
      const res2 = await fetch('https://api.kakaowork.com/v1/messages.send_by_email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({ email, text: plain }),
      })
      const json2 = (await res2.json()) as { success?: boolean; error?: { message?: string } }
      if (json2.success) return { success: true }
      return { success: false, reason: json2.error?.message ?? '전송 실패' }
    }
    return { success: false, reason: json.error?.message ?? '전송 실패' }
  } catch (e) {
    return { success: false, reason: e instanceof Error ? e.message : '네트워크 오류' }
  }
}


// ─── 이메일 알림 (네이버 SMTP) ──────────────────────────────────
/**
 * 🔴 2026-09-09 CEO 지시 "견적은 네이버 메일로 보내라. 카카오워크는 쓰지 말라."
 * 리드 한 건 = 메일 한 통. 제목에 종류·업체, 본문에 연락처·자리·용도·예상 범위.
 */
export async function notifyEmail(data: LeadWebhookData): Promise<{ success: boolean; reason?: string }> {
  if (!mailConfigured()) return { success: false, reason: 'SMTP 설정 없음' }
  const urgencyLabel: Record<string, string> = { low: '여유', normal: '보통', high: '빠름', urgent: '긴급' }
  const fmtMan = (won: number) => `${Math.round(won / 10_000).toLocaleString()}만원`
  const price =
    data.priceMin && data.priceMax ? `약 ${fmtMan(data.priceMin)} ~ ${fmtMan(data.priceMax)} (VAT 별도)` : '실측 후 산출'
  const subject = `[우강테크] ${leadTitle(data.kind)} · ${data.businessName}`
  const text =
    `${leadTitle(data.kind)}
` +
    `─────────────────────
` +
    `기관·업체 : ${data.businessName}
` +
    `담당자    : ${data.contactName}
` +
    `연락처    : ${data.phone}
` +
    `설치 지역 : ${data.region} · ${data.environment === 'indoor' ? '실내' : '옥외'}
` +
    `긴급도    : ${urgencyLabel[data.urgency] ?? data.urgency}
` +
    `예상 범위 : ${price}
` +
    (data.purpose ? `용도·내용 : ${data.purpose}
` : '') +
    `접수 시각 : ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
` +
    `─────────────────────
` +
    `wooktech.co.kr 홈페이지에서 자동 발송된 접수 알림입니다.`
  return sendMail({ subject, text })
}

// ─── 리드 알림 통합 진입점 ──────────────────────────────────────
/**
 * 설정된 알림 경로를 전부 시도한다. 하나라도 성공하면 성공.
 *  · 이메일(네이버 SMTP) — 기본 경로 (CEO 2026-09-09)
 *  · 범용 웹훅(ADMIN_LEAD_WEBHOOK) — 있으면 같이
 *  · 카카오워크 — `NOTIFY_KAKAOWORK=on` 일 때만 (CEO "카카오워크 하지 말라" → 기본 꺼짐)
 */
export async function notifyLead(data: LeadWebhookData): Promise<{ success: boolean; channels: string[] }> {
  const channels: string[] = []
  const fail = (name: string, reason?: string) => console.error('[NOTIFY-FAIL]', name, reason ?? '')

  // 1순위 — 이메일(네이버) + 범용 웹훅
  const primary: { name: string; run: Promise<{ success: boolean; reason?: string }> }[] = []
  if (mailConfigured()) primary.push({ name: 'email', run: notifyEmail(data) })
  primary.push({ name: 'webhook', run: notifyLeadWebhook(data) })

  const settled = await Promise.allSettled(primary.map((p) => p.run))
  settled.forEach((r, i) => {
    const name = primary[i].name
    if (r.status === 'fulfilled' && r.value.success) channels.push(name)
    else if (r.status === 'fulfilled') fail(name, (r.value as { reason?: string }).reason)
    else fail(name, String(r.reason))
  })

  // 🔴 2순위 — 카카오워크. CEO 는 카카오워크를 쓰지 않기로 했지만(2026-09-09),
  //    1순위가 전부 실패하면 리드가 통째로 사라진다. 그때만 마지막 보루로 쓴다.
  //    (NOTIFY_KAKAOWORK=off 로 완전히 끌 수 있다)
  if (channels.length === 0 && process.env.NOTIFY_KAKAOWORK !== 'off') {
    try {
      const kw = await notifyKakaoWork(data)
      if (kw.success) channels.push('kakaowork')
      else fail('kakaowork', kw.reason)
    } catch (e) {
      fail('kakaowork', e instanceof Error ? e.message : 'unknown')
    }
  }

  return { success: channels.length > 0, channels }
}

