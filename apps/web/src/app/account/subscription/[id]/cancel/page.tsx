import { serverClient } from '@/lib/supabase'
import { CancelClient } from './CancelClient'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function CancelPage({ params }: { params: { id: string } }) {
  const db = serverClient()
  const { data: sub, error } = await db
    .from('subscriptions')
    .select('id, status, customer_id, created_at, next_billing_at')
    .eq('id', params.id)
    .single()

  if (error || !sub) return notFound()

  return (
    <CancelClient
      subscriptionId={sub.id}
      customerId={sub.customer_id}
      status={sub.status}
      createdAt={sub.created_at}
      nextBillingAt={sub.next_billing_at}
    />
  )
}
