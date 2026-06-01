import { adminDb } from '@/lib/supabase'
import { BillingClient } from './BillingClient'

export const revalidate = 0

export type BillingRow = {
  id: string
  payment_key: string | null
  order_id: string
  amount_krw: number | null
  status: string | null
  method: string | null
  approved_at: string | null
  canceled_at: string | null
  webhook_received_at: string | null
  subscription_id: string | null
  customer_id: string | null
  raw_payload: any
}

async function fetchBilling(): Promise<{
  rows: BillingRow[]
  failureCounts: Record<string, number>
}> {
  try {
    const { data, error } = await adminDb
      .from('billing_history' as any)
      .select(`
        id, payment_key, order_id, amount_krw, status, method,
        approved_at, canceled_at, webhook_received_at,
        subscription_id, customer_id, raw_payload
      `)
      .order('webhook_received_at', { ascending: false })
      .limit(300)

    if (error || !data) return { rows: [], failureCounts: {} }

    const rows = ((data ?? []) as unknown) as BillingRow[]

    // 구독별 실패 카운트 (DONE이 아닌 마지막 N건 누적)
    const counts: Record<string, number> = {}
    for (const r of rows) {
      if (!r.subscription_id) continue
      const isFailure = r.status && r.status !== 'DONE' && !r.status.includes('CANCELED')
      if (isFailure) {
        counts[r.subscription_id] = (counts[r.subscription_id] ?? 0) + 1
      }
    }
    return { rows, failureCounts: counts }
  } catch {
    return { rows: [], failureCounts: {} }
  }
}

export default async function BillingPage() {
  const { rows, failureCounts } = await fetchBilling()
  return <BillingClient rows={rows} failureCounts={failureCounts} />
}
