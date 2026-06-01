import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@lcd-pro/db'
import { adminDb } from '@/lib/supabase'

type ProjectUpdate = Database['public']['Tables']['projects']['Update']

const ALLOWED_KEYS: (keyof ProjectUpdate)[] = [
  'status',
  'scheduled_date',
  'installer_id',
  'notes',
  'site_address',
  'completed_date',
  'electrical_ok',
  'network_ok',
  'permit_required',
  'permit_status',
  'materials_ordered_at',
  'supplier_name',
  'deposit_paid_at',
  'deposit_amount_krw',
  'final_payment_at',
  'final_amount_krw',
  'installer_fee_krw',
  'as_reserve_krw',
]

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = (await req.json()) as Record<string, unknown>

  const update: ProjectUpdate = { updated_at: new Date().toISOString() }
  for (const key of ALLOWED_KEYS) {
    const k = String(key)
    if (k in body) (update as Record<string, unknown>)[k] = body[k]
  }

  // status가 'completed'로 변경되면 completed_date 자동 기록
  if (update.status === 'completed' && update.completed_date === undefined) {
    update.completed_date = new Date().toISOString().slice(0, 10)
  }

  const { error } = await adminDb.from('projects').update(update).eq('id', params.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
