import { notFound } from 'next/navigation'
import { randomUUID } from 'crypto'
import { serverClient } from '@/lib/supabase'
import { SubscribeClient } from './SubscribeClient'

export const dynamic = 'force-dynamic'

async function loadProjectBilling(projectId: string) {
  const db = serverClient()
  // 프로젝트 + 고객 + 견적의 quote_items.monthly_cms 합산 + 추천 패키지
  const { data: project } = await db
    .from('projects')
    .select(`
      id,
      quote_id,
      customers (id, name, business_name, phone, email),
      quotes (recommended_package, quote_items (monthly_cms_krw, quantity))
    `)
    .eq('id', projectId)
    .single()

  if (!project) return null

  const items = (project as any)?.quotes?.quote_items ?? []
  const monthly = items.reduce(
    (sum: number, it: any) => sum + (it.monthly_cms_krw ?? 0) * (it.quantity ?? 1),
    0,
  )

  return {
    projectId,
    customer: (project as any).customers as {
      id: string
      name: string
      business_name: string | null
      phone: string
      email: string | null
    } | null,
    monthlyKrw: monthly || 90000, // 패키지 없으면 9만원 디폴트
    tier: (project as any)?.quotes?.recommended_package ?? 'standard',
  }
}

export default async function SubscribePage({ params }: { params: { projectId: string } }) {
  const info = await loadProjectBilling(params.projectId)
  if (!info) notFound()

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? ''
  // customerKey는 추측 불가능한 UUID — 이메일/전화/증분ID 금지 (Toss 규칙)
  const customerKey = randomUUID()

  return (
    <SubscribeClient
      projectId={info.projectId}
      customerKey={customerKey}
      clientKey={clientKey}
      monthlyKrw={info.monthlyKrw}
      tier={info.tier}
      customerName={info.customer?.name ?? ''}
      customerEmail={info.customer?.email ?? ''}
      businessName={info.customer?.business_name ?? ''}
    />
  )
}
