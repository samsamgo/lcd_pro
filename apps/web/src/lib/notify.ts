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

  const text = `신규 견적 문의 · ${data.businessName}`

  try {
    const res = await fetch('https://api.kakaowork.com/v1/messages.send_by_email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        email,
        text,
        blocks: [
          { type: 'header', text: '신규 견적 문의', style: 'blue' },
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
          {
            type: 'action',
            elements: [
              {
                type: 'button',
                text: '전화 걸기',
                style: 'default',
                action_type: 'call',
                value: data.phone.replace(/-/g, ''),
              },
            ],
          },
        ],
      }),
    })
    const json = (await res.json()) as { success?: boolean; error?: { message?: string } }
    return json.success ? { success: true } : { success: false, reason: json.error?.message ?? '전송 실패' }
  } catch (e) {
    return { success: false, reason: e instanceof Error ? e.message : '네트워크 오류' }
  }
}


// ─── 리드 알림 통합 진입점 ──────────────────────────────────────
/**
 * 설정된 알림 경로를 전부 시도한다.
 * 경로가 하나뿐이면 그게 막히는 순간 리드가 통째로 사라지기 때문에
 * 카카오워크와 범용 웹훅을 병렬로 보내고, 하나라도 성공하면 성공으로 본다.
 */
export async function notifyLead(data: LeadWebhookData): Promise<{ success: boolean; channels: string[] }> {
  const [kw, hook] = await Promise.allSettled([notifyKakaoWork(data), notifyLeadWebhook(data)])
  const channels: string[] = []
  if (kw.status === 'fulfilled' && kw.value.success) channels.push('kakaowork')
  if (hook.status === 'fulfilled' && hook.value.success) channels.push('webhook')
  return { success: channels.length > 0, channels }
}
