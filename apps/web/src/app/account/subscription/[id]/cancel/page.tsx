import { serverClient } from '@/lib/supabase'
import { CancelClient } from './CancelClient'
import { notFound, redirect } from 'next/navigation'
import { features } from '@/lib/features'

export const revalidate = 0

export default async function CancelPage({ params }: { params: { id: string } }) {
  // MVP: 결제 기능 잠금(features.billing OFF) — 홈으로 redirect (파일은 보존)
  if (!features.billing) redirect('/')

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
