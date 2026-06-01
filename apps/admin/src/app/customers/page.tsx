import { adminDb } from '@/lib/supabase'
import { CustomersClient } from './CustomersClient'

export const revalidate = 0

async function searchCustomers(q?: string) {
  let query = adminDb
    .from('customers')
    .select(`
      id, created_at, name, business_name, business_type, phone, email, region, address, notes
    `)
    .order('created_at', { ascending: false })
    .limit(200)

  if (q?.trim()) {
    const term = q.trim()
    // 전화는 - 제거, 이름/사업체는 ilike
    query = query.or(
      `name.ilike.%${term}%,business_name.ilike.%${term}%,phone.ilike.%${term}%`,
    )
  }

  const { data } = await query
  return data ?? []
}

async function getStatsByCustomer(customerIds: string[]) {
  if (customerIds.length === 0) return {}
  const [quotesRes, projectsRes, subsRes] = await Promise.all([
    adminDb.from('quotes').select('customer_id').in('customer_id', customerIds),
    adminDb.from('projects').select('customer_id, status').in('customer_id', customerIds),
    adminDb.from('subscriptions').select('customer_id, status').in('customer_id', customerIds),
  ])

  const stats: Record<string, { quotes: number; projects: number; activeSubs: number }> = {}
  for (const id of customerIds) {
    stats[id] = { quotes: 0, projects: 0, activeSubs: 0 }
  }
  for (const q of quotesRes.data ?? []) {
    if (q.customer_id) stats[q.customer_id].quotes += 1
  }
  for (const p of projectsRes.data ?? []) {
    if (p.customer_id) stats[p.customer_id].projects += 1
  }
  for (const s of subsRes.data ?? []) {
    if (s.customer_id && s.status === 'active') stats[s.customer_id].activeSubs += 1
  }
  return stats
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const customers = await searchCustomers(searchParams.q)
  const stats = await getStatsByCustomer(customers.map((c) => c.id))

  return <CustomersClient initialCustomers={customers as any} stats={stats} initialQuery={searchParams.q ?? ''} />
}
