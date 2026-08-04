/**
 * 알림 시스템
 * - 카카오 BizTalk (알림톡): 고객 견적 접수 확인
 * - 알리고 SMS: 관리자 즉시 알림 (카카오 실패 시 폴백)
 * - Slack 웹훅: 내부 운영 채널
 */

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
}

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

  const message =
    `📩 신규 견적 문의\n` +
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
