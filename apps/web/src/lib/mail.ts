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
  return !!process.env.NAVER_SMTP_USER && !!process.env.NAVER_SMTP_PASS
}

export async function sendMail(input: MailInput): Promise<{ success: boolean; reason?: string }> {
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
