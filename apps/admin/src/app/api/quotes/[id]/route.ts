import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@lcd-pro/db'
import { adminDb } from '@/lib/supabase'

type QuoteUpdate = Database['public']['Tables']['quotes']['Update']

// 30% 마진 미달 견적 발송 차단
const MIN_MARGIN_PCT = 30

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json()
  const { status, admin_notes, estimate_min_krw, estimate_max_krw, recommended_sku } = body

  // 마진 체크 (견적 발송 전)
  if (status === 'estimated' && estimate_min_krw && estimate_max_krw) {
    const { data: quoteItems } = await adminDb
      .from('quote_items')
      .select('unit_price_krw, install_price_krw, quantity')
      .eq('quote_id', params.id)

    if (quoteItems && quoteItems.length > 0) {
      const totalCost = quoteItems.reduce(
        (sum, item) => sum + (item.unit_price_krw + item.install_price_krw) * item.quantity,
        0
      )
      const margin = ((estimate_min_krw - totalCost) / estimate_min_krw) * 100
      if (margin < MIN_MARGIN_PCT) {
        return NextResponse.json(
          { error: `마진율 ${margin.toFixed(1)}% — 최소 ${MIN_MARGIN_PCT}% 미달. 견적 금액을 확인하세요.` },
          { status: 400 }
        )
      }
    }
  }

  const updateData: QuoteUpdate = { updated_at: new Date().toISOString() }
  if (status !== undefined) updateData.status = status
  if (admin_notes !== undefined) updateData.admin_notes = admin_notes
  if (estimate_min_krw !== undefined) updateData.estimate_min_krw = estimate_min_krw
  if (estimate_max_krw !== undefined) updateData.estimate_max_krw = estimate_max_krw
  if (recommended_sku !== undefined) updateData.recommended_sku = recommended_sku

  const { error } = await adminDb
    .from('quotes')
    .update(updateData)
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
