import { NextRequest, NextResponse } from 'next/server'
import { serverClient } from '@/lib/supabase'
import { notifyCustomerQuoteReceived, notifyAdminNewQuote } from '@/lib/notify'
import type { Database } from '@lcd-pro/db'

type CustomerType = Database['public']['Enums']['customer_type']
type Environment = Database['public']['Enums']['environment']
type UrgencyLevel = Database['public']['Enums']['urgency_level']

export async function POST(req: NextRequest) {
  const supabase = serverClient()
  const formData = await req.formData()

  const phone = formData.get('phone') as string
  const businessName = formData.get('businessName') as string
  const contactName = formData.get('contactName') as string
  const businessType = formData.get('businessType') as CustomerType
  const region = formData.get('region') as string
  const environment = formData.get('environment') as Environment
  const purpose = formData.get('purpose') as string
  const urgency = (formData.get('urgency') ?? 'normal') as UrgencyLevel
  const desiredWidth = formData.get('desiredWidth') as string | null
  const desiredHeight = formData.get('desiredHeight') as string | null
  const viewingDistance = formData.get('viewingDistance') as string | null
  const additionalNotes = formData.get('additionalNotes') as string | null
  const photos = formData.getAll('photos') as File[]

  // 고객 upsert (phone 기준)
  const { data: existingCustomer } = await supabase
    .from('customers')
    .select('id')
    .eq('phone', phone)
    .maybeSingle()

  let customerId: string

  if (existingCustomer) {
    customerId = existingCustomer.id
  } else {
    const { data: newCustomer, error: customerError } = await supabase
      .from('customers')
      .insert({ phone, name: contactName, business_name: businessName, business_type: businessType, region })
      .select('id')
      .single()

    if (customerError || !newCustomer) {
      return NextResponse.json({ error: '고객 생성 실패' }, { status: 500 })
    }
    customerId = newCustomer.id
  }

  // 견적 생성
  const { data: quote, error: quoteError } = await supabase
    .from('quotes')
    .insert({
      customer_id: customerId,
      environment,
      purpose,
      urgency,
      desired_width_mm: desiredWidth ? Math.round(parseFloat(desiredWidth) * 10) : null,
      desired_height_mm: desiredHeight ? Math.round(parseFloat(desiredHeight) * 10) : null,
      viewing_distance_m: viewingDistance ? parseFloat(viewingDistance) : null,
      additional_notes: additionalNotes ?? null,
      status: 'pending' as const,
    })
    .select('id')
    .single()

  if (quoteError || !quote) {
    return NextResponse.json({ error: '견적 생성 실패' }, { status: 500 })
  }

  // 사진 업로드
  const uploadErrors: string[] = []
  for (let i = 0; i < photos.length; i++) {
    const file = photos[i]
    const ext = file.name.split('.').pop() ?? 'jpg'
    const storagePath = `quotes/${quote.id}/${i}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('quote-photos')
      .upload(storagePath, file, { contentType: file.type })

    if (uploadError) {
      uploadErrors.push(storagePath)
      continue
    }

    await supabase.from('quote_photos').insert({
      quote_id: quote.id,
      storage_path: storagePath,
      file_name: file.name,
      sort_order: i,
    })
  }

  // 고객 + 관리자 알림 (비동기 — 실패해도 견적 접수에 영향 없음)
  const notifyData = {
    businessName,
    contactName,
    phone,
    region,
    environment,
    urgency,
    quoteId: quote.id,
  }

  void Promise.allSettled([
    notifyCustomerQuoteReceived(notifyData),
    notifyAdminNewQuote(notifyData),
  ])

  return NextResponse.json({
    success: true,
    quoteId: quote.id,
    ...(uploadErrors.length > 0 && { uploadErrors }),
  })
}
