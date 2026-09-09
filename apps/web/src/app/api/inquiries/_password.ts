import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

/**
 * 비공개 문의 비밀번호 해시.
 *
 * 이건 로그인 계정이 아니라 "본인이 쓴 글을 다시 열어보는 열쇠"다. 그래도 평문으로
 * 두지 않는다 — DB 가 새면 담당자가 다른 데서 쓰는 비밀번호까지 같이 새기 때문이다.
 *
 * 형식: `scrypt$N$r$p$salt(hex)$hash(hex)`
 *   파라미터를 문자열에 같이 적어 둔다. 나중에 비용을 올려도 옛 해시를 그대로 검증할 수 있다.
 *
 * 🔴 서버 전용. 클라이언트에서 import 하지 않는다.
 */

const N = 16384 // 2^14 — 서버리스 한 요청 안에서 수십 ms
const R = 8
const P = 1
const KEYLEN = 32

export function hashPassword(plain: string): string {
  const salt = randomBytes(16)
  const hash = scryptSync(plain, salt, KEYLEN, { N, r: R, p: P })
  return `scrypt$${N}$${R}$${P}$${salt.toString('hex')}$${hash.toString('hex')}`
}

export function verifyPassword(plain: string, stored: string | null | undefined): boolean {
  if (!stored) return false
  const parts = stored.split('$')
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false

  const n = Number(parts[1])
  const r = Number(parts[2])
  const p = Number(parts[3])
  if (!n || !r || !p) return false

  try {
    const salt = Buffer.from(parts[4], 'hex')
    const expected = Buffer.from(parts[5], 'hex')
    const actual = scryptSync(plain, salt, expected.length, { N: n, r, p })
    // 길이가 다르면 timingSafeEqual 이 throw 한다
    if (actual.length !== expected.length) return false
    return timingSafeEqual(actual, expected)
  } catch {
    return false
  }
}
