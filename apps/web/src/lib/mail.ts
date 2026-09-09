import { connect as tlsConnect, type TLSSocket } from 'node:tls'

/**
 * 네이버 SMTP 로 메일 한 통 보내기 — 외부 패키지 없음.
 *
 * 🔴 2026-09-09 CEO 지시 "견적은 네이버 메일로 보내라. 카카오워크는 따로 다 깔아야 해서 안 쓴다."
 *    nodemailer 를 붙이려 했으나 exFAT 볼륨에서 pnpm add 가 심볼릭링크(EISDIR)로 실패해
 *    Node 내장 `node:tls` 로 최소 SMTP 클라이언트를 직접 썼다. 서버리스(Vercel Node 런타임)에서 동작한다.
 *
 * 설정 (Vercel env + `_보안/keys.env`):
 *   NAVER_SMTP_USER  = 네이버 아이디 (예: wk_cop)  ← @naver.com 앞부분
 *   NAVER_SMTP_PASS  = 네이버 비밀번호 또는 2단계 인증 시 '애플리케이션 비밀번호'
 *   NOTIFY_EMAIL_TO  = 받을 주소 (기본 wk_cop@naver.com)
 *   네이버 메일 → 환경설정 → POP3/IMAP 설정 → "IMAP/SMTP 사용" 을 켜 둬야 한다.
 *
 * 프로토콜: smtp.naver.com:465 (implicit TLS) → EHLO → AUTH LOGIN → MAIL FROM → RCPT TO → DATA → QUIT
 * 실패해도 throw 하지 않는다 — 호출부(notifyLead)가 리드 원문을 로그로 남긴다.
 */
export interface MailInput {
  subject: string
  text: string
  to?: string
}

const HOST = 'smtp.naver.com'
const PORT = 465
const TIMEOUT_MS = 12_000

function b64(s: string) {
  return Buffer.from(s, 'utf8').toString('base64')
}

/** RFC 2047 — 제목에 한글을 넣기 위한 인코딩 */
function encodeHeader(s: string) {
  return `=?UTF-8?B?${b64(s)}?=`
}

export function mailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY || (!!process.env.NAVER_SMTP_USER && !!process.env.NAVER_SMTP_PASS)
}

/**
 * Resend 발송 — 1순위.
 *
 * 🔴 2026-09-09 네이버 SMTP 가 계정 인증에서 계속 막혀(535 · 2단계 인증 꺼져 있음에도) 발송 경로를 옮겼다.
 *    계정 비밀번호가 필요 없어 네이버 비번을 바꿔도 홈페이지가 멈추지 않는다.
 *
 * ⚠️ 도메인 인증 전에는 `onboarding@resend.dev` 로만 보낼 수 있고, **받는 사람도 Resend 계정 주인 메일로 제한**된다.
 *    wooktech.co.kr 을 Resend 에 등록하고 DNS 3건을 넣으면 `noreply@wooktech.co.kr` → 아무 주소로 보낼 수 있다.
 */
async function sendViaResend(input: MailInput): Promise<{ success: boolean; reason?: string }> {
  const key = process.env.RESEND_API_KEY
  if (!key) return { success: false, reason: 'RESEND_API_KEY 없음' }
  const from = process.env.RESEND_FROM || '우강테크 홈페이지 <onboarding@resend.dev>'
  const to = input.to || process.env.NOTIFY_EMAIL_TO || 'wk_cop@naver.com'
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], subject: input.subject, text: input.text }),
    })
    if (res.ok) return { success: true }
    const body = (await res.text()).slice(0, 200)
    return { success: false, reason: `Resend ${res.status}: ${body}` }
  } catch (e) {
    return { success: false, reason: e instanceof Error ? e.message : '네트워크 오류' }
  }
}

export async function sendMail(input: MailInput): Promise<{ success: boolean; reason?: string }> {
  // 1순위 Resend, 2순위 네이버 SMTP
  if (process.env.RESEND_API_KEY) {
    const r = await sendViaResend(input)
    if (r.success) return r
    console.error('[MAIL] Resend 실패, SMTP 로 재시도:', r.reason)
  }
  const user = process.env.NAVER_SMTP_USER
  const pass = process.env.NAVER_SMTP_PASS
  if (!user || !pass) return { success: false, reason: 'SMTP 설정 없음' }
  const from = user.includes('@') ? user : `${user}@naver.com`
  const to = input.to || process.env.NOTIFY_EMAIL_TO || 'wk_cop@naver.com'

  return new Promise((resolve) => {
    let socket: TLSSocket
    let buffer = ''
    let step = 0
    let done = false
    const finish = (r: { success: boolean; reason?: string }) => {
      if (done) return
      done = true
      clearTimeout(timer)
      try {
        socket.end()
      } catch {
        /* ignore */
      }
      resolve(r)
    }
    const timer = setTimeout(() => finish({ success: false, reason: 'SMTP 시간 초과' }), TIMEOUT_MS)

    // 본문: CRLF 개행, 점으로 시작하는 줄은 점 하나 더(RFC 5321 §4.5.2)
    const body = input.text.replace(/\r?\n/g, '\r\n').replace(/^\./gm, '..')
    const message =
      `From: ${encodeHeader('우강테크 홈페이지')} <${from}>\r\n` +
      `To: <${to}>\r\n` +
      `Subject: ${encodeHeader(input.subject)}\r\n` +
      `MIME-Version: 1.0\r\n` +
      `Content-Type: text/plain; charset=UTF-8\r\n` +
      `Content-Transfer-Encoding: 8bit\r\n` +
      `Date: ${new Date().toUTCString()}\r\n` +
      `\r\n${body}\r\n.\r\n`

    // 서버 응답 코드에 따라 다음 명령을 보낸다
    const commands: { expect: string; send: string | null }[] = [
      { expect: '220', send: `EHLO wooktech.co.kr\r\n` },
      { expect: '250', send: `AUTH LOGIN\r\n` },
      { expect: '334', send: `${b64(from.split('@')[0])}\r\n` }, // 네이버는 @ 앞 아이디로 인증
      { expect: '334', send: `${b64(pass)}\r\n` },
      { expect: '235', send: `MAIL FROM:<${from}>\r\n` },
      { expect: '250', send: `RCPT TO:<${to}>\r\n` },
      { expect: '250', send: `DATA\r\n` },
      { expect: '354', send: message },
      { expect: '250', send: `QUIT\r\n` },
      { expect: '221', send: null },
    ]

    socket = tlsConnect({ host: HOST, port: PORT, servername: HOST }, () => {
      /* 서버 인사(220)를 기다린다 */
    })
    socket.setEncoding('utf8')
    socket.on('data', (chunk: string) => {
      buffer += chunk
      // 여러 줄 응답(250-...)은 마지막 줄이 "250 " 로 끝난다
      const lines = buffer.split('\r\n')
      const last = lines.filter((l) => l.length > 0).pop() ?? ''
      if (!/^\d{3} /.test(last)) return
      const code = last.slice(0, 3)
      buffer = ''
      const cur = commands[step]
      if (!cur) return
      if (code !== cur.expect) {
        finish({ success: false, reason: `SMTP ${step}: ${last.slice(0, 120)}` })
        return
      }
      step += 1
      if (cur.send === null) {
        finish({ success: true })
        return
      }
      socket.write(cur.send)
      if (step === commands.length - 1 && cur.send === `QUIT\r\n`) {
        // QUIT 뒤 221 이 안 와도 DATA 가 250 이면 발송된 것
        setTimeout(() => finish({ success: true }), 800)
      }
    })
    socket.on('error', (e) => finish({ success: false, reason: e.message }))
    socket.on('close', () => finish({ success: step >= 9, reason: step >= 9 ? undefined : 'SMTP 연결 종료' }))
  })
}
