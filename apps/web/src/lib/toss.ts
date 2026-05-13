// Toss Payments 빌링 API 클라이언트
// 키 prefix로 환경 분기: test_sk_* / live_sk_*
//
// 주의:
// - 빌링키는 발급 후 재조회 불가 → 발급 즉시 DB 저장
// - customerKey는 추측 불가능한 UUID 권장 (이메일·전화·증분 ID 금지)
// - Toss는 자체 정기결제 스케줄링 미제공 → cron으로 매월 trigger 필요
// - 라이브 정기결제는 별도 MID 계약 승인 필요

const TOSS_BASE = 'https://api.tosspayments.com'

function authHeader(): string {
  const secret = process.env.TOSS_SECRET_KEY
  if (!secret) throw new Error('TOSS_SECRET_KEY 환경변수 누락')
  // Basic base64(secret + ":")
  return 'Basic ' + Buffer.from(secret + ':').toString('base64')
}

export interface TossPayment {
  paymentKey: string
  orderId: string
  status: 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'ABORTED' | 'EXPIRED' | string
  totalAmount: number
  method?: string
  approvedAt?: string
  card?: Record<string, unknown>
  [key: string]: unknown
}

export interface IssueBillingKeyInput {
  authKey: string          // Toss SDK로 카드 인증 후 받는 임시 키 (권장 흐름)
  customerKey: string      // UUID 등
}

export interface IssuedBillingKey {
  billingKey: string
  customerKey: string
  cardCompany?: string
  cardNumber?: string      // 마스킹된 번호
  [key: string]: unknown
}

// SDK 인증 흐름: authKey → billingKey 발급
export async function issueBillingKey(input: IssueBillingKeyInput): Promise<IssuedBillingKey> {
  const res = await fetch(`${TOSS_BASE}/v1/billing/authorizations/issue`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })
  const data = await res.json()
  if (!res.ok) throw new TossError(data?.message ?? '빌링키 발급 실패', res.status, data)
  return data
}

export interface ExecutePaymentInput {
  billingKey: string
  customerKey: string
  amount: number
  orderId: string          // 우리 시스템 주문 ID — 중복 금지
  orderName: string
  customerEmail?: string
  customerName?: string
  taxFreeAmount?: number
}

export async function executePayment(input: ExecutePaymentInput): Promise<TossPayment> {
  const { billingKey, ...body } = input
  const res = await fetch(`${TOSS_BASE}/v1/billing/${billingKey}`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
      'Idempotency-Key': body.orderId,  // 재시도 시 동일 orderId면 중복 결제 방지
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new TossError(data?.message ?? '결제 실패', res.status, data)
  return data
}

export interface CancelPaymentInput {
  paymentKey: string
  cancelReason: string
  cancelAmount?: number    // 미지정 시 전액 취소
}

export async function cancelPayment(input: CancelPaymentInput): Promise<TossPayment> {
  const { paymentKey, ...body } = input
  const res = await fetch(`${TOSS_BASE}/v1/payments/${paymentKey}/cancel`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new TossError(data?.message ?? '결제 취소 실패', res.status, data)
  return data
}

export function isTestMode(): boolean {
  return (process.env.TOSS_SECRET_KEY ?? '').startsWith('test_')
}

export class TossError extends Error {
  status: number
  body: unknown
  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'TossError'
    this.status = status
    this.body = body
  }
}
