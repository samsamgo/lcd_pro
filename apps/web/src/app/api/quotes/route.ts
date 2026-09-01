import { NextRequest, NextResponse } from 'next/server'
import { serverClient } from '@/lib/supabase'
import { notifyCustomerQuoteReceived, notifyAdminNewQuote, notifyLeadWebhook } from '@/lib/notify'
import { features } from '@/lib/features'
import {
  estimateProject,
  FAMILIES,
  recommendFamily,
  type FamilyCode,
  type PackageTier,
} from '@/lib/standardBlock'
import { priceFromBom } from '@/lib/bomPricing'
import type { Database } from '@lcd-pro/db'

type CustomerType = Database['public']['Enums']['customer_type']
type Environment = Database['public']['Enums']['environment']
type UrgencyLevel = Database['public']['Enums']['urgency_level']
type SkuCode = Database['public']['Enums']['sku_code']
type PackageTierEnum = Database['public']['Enums']['package_tier']

// 신엔진 family → legacy sku_code (admin 호환용, types.gen.ts 재생성 전까지 임시 매핑)
function familyToLegacySku(family: FamilyCode, areaM2: number): SkuCode {
  // P1.86 은 legacy SkuCode enum에 없다 → 가장 가까운 실내 파인피치로 매핑 (admin 표시용)
  if (family === 'F-IN-P1.86' || family === 'F-IN-P2.5') return 'P2.5'
  if (family === 'F-IN-P3')   return areaM2 <= 4 ? 'IN-S' : 'IN-M'
  // F-OUT-P5
  if (areaM2 <= 6)  return 'OUT-S'
  if (areaM2 <= 20) return 'OUT-M'
  return 'OUT-L'
}

const PKG_TO_DB: Record<PackageTier, PackageTierEnum> = {
  BASIC: 'basic',
  STANDARD: 'standard',
  PREMIUM: 'premium',
  RENTAL: 'rental',
}

function recommendPackageTier(env: Environment, areaM2: number): PackageTier {
  if (areaM2 >= 20) return 'PREMIUM'
  if (env === 'outdoor' && areaM2 >= 10) return 'PREMIUM'
  return 'STANDARD'
}

export async function POST(req: NextRequest) {
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
  const familyCodeInput = formData.get('familyCode')
  const highResFlag = formData.get('highRes') === 'true'
  const needsLiveInput = formData.get('needsLiveInput') === 'true'
  const exactSizeRequired = formData.get('exactSizeRequired') === 'true'
  const isPublicProcurement = formData.get('isPublicProcurement') === 'true'
  const photos = formData.getAll('photos') as File[]
  const agreePrivacy = formData.get('agreePrivacy')

  // ── 서버측 필수 입력 검증 (quotePersistence ON/OFF 무관하게 항상) ───
  if (photos.length < 3) {
    return NextResponse.json({ error: '사진을 3장 이상 첨부해주세요.' }, { status: 400 })
  }
  if (agreePrivacy !== 'true' && agreePrivacy !== '1' && agreePrivacy !== 'on') {
    return NextResponse.json({ error: '개인정보 수집 동의가 필요합니다.' }, { status: 400 })
  }

  // ── 견적 계산 (순수 로컬 · 항상 실행, 외부 의존 없음) ───────────────
  // 입력값(cm → mm 변환은 기존 폼 컨벤션 유지)
  const widthMm = desiredWidth ? Math.round(parseFloat(desiredWidth) * 10) : null
  const heightMm = desiredHeight ? Math.round(parseFloat(desiredHeight) * 10) : null

  // 표준 블록 견적 산출 (치수 입력이 있을 때만)
  let estimate: ReturnType<typeof estimateProject> | null = null
  let familyCode: FamilyCode | null = null
  let packageTier: PackageTier = 'STANDARD'
  if (widthMm && heightMm && widthMm > 0 && heightMm > 0) {
    familyCode =
      typeof familyCodeInput === 'string' &&
      Object.prototype.hasOwnProperty.call(FAMILIES, familyCodeInput)
        ? familyCodeInput as FamilyCode
        : recommendFamily(environment, highResFlag)
    // 면적 사전계산 → 패키지 추천 (estimate 후 area_m2 fix-up)
    const provisionalArea = (widthMm / 1000) * (heightMm / 1000)
    packageTier = recommendPackageTier(environment, provisionalArea)
    estimate = estimateProject({
      width_mm: widthMm,
      height_mm: heightMm,
      family_code: familyCode,
      packageTier,
      needs_live_input: needsLiveInput,
      exact_size_required: exactSizeRequired,
      is_public_procurement: isPublicProcurement,
    })
  }

  // 견적 결과 페이지에서 표시할 요약 (DB 여부와 무관하게 항상 반환)
  const estimateSummary = estimate
    ? {
        classification: estimate.classification,
        classification_reasons: estimate.classification_reasons,
        layout_code: estimate.layout_code,
        requested: estimate.requested,
        standard: estimate.standard,
        bom: estimate.bom,
        pricing_blocked: estimate.pricing_blocked,
        action: estimate.action,
        // 판매가 범위 (표준 견적 + 치수 입력 시에만). 엔지니어링 라우팅·차단 시 null.
        price:
          estimate.bom && !estimate.pricing_blocked
            ? priceFromBom(estimate.bom, environment)
            : null,
      }
    : null

  // ── 리드 최후 보루 ────────────────────────────────────────────────
  // 웹훅도 DB도 실패하면 리드가 통째로 증발한다(실제로 그렇게 소실됐다).
  // 어떤 경로가 실패하든 리드 원문을 stderr에 남긴다 — Vercel 로그에서 회수 가능.
  const leadRecord = {
    businessName, contactName, phone, region, businessType,
    environment, urgency, purpose,
    widthMm, heightMm, viewingDistance, additionalNotes,
    photoCount: photos.length,
    at: new Date().toISOString(),
  }
  const logLead = (why: string) =>
    console.error('[LEAD-FALLBACK]', why, JSON.stringify(leadRecord))

  // ── 리드 웹훅 알림 (DB 저장과 독립 · 항상 시도) ───────────────────
  // ADMIN_LEAD_WEBHOOK(또는 Slack/Kakao 웹훅)만 있으면 Supabase 없이도
  // 사장이 리드를 즉시 받는다. 미설정·실패 시 로그로 떨어뜨린다(더는 조용히 삼키지 않는다).
  const priceRange = estimateSummary?.price ?? null
  try {
    const result = await notifyLeadWebhook({
      businessName,
      contactName,
      phone,
      region,
      environment,
      urgency,
      purpose,
      quoteId: 'pending',
      priceMin: priceRange?.min ?? null,
      priceMax: priceRange?.max ?? null,
    })
    if (!result.success) logLead('webhook-unsent')
  } catch {
    logLead('webhook-unsent')
  }

  // ── DB 저장 불가 조건: 플래그 OFF 또는 Supabase env 미설정 ─────────
  // env 없이 serverClient()를 부르면 throw → 고객이 500을 본다. 먼저 막는다.
  const supabaseReady =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_KEY
  if (!features.quotePersistence || !supabaseReady) {
    logLead(features.quotePersistence ? 'supabase-env-missing' : 'persistence-off')
    return NextResponse.json({
      success: true,
      quoteId: null,
      estimate: estimateSummary,
    })
  }

  // ── 이하: DB 저장 경로 ─────────────────────────────────────────────
  const supabase = serverClient()

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
      // 고객에게 에러를 던지면 리드도 같이 죽는다. 로그로 회수하고 접수는 성공 처리.
      logLead(`customer-insert-failed: ${customerError?.message ?? 'unknown'}`)
      return NextResponse.json({ success: true, quoteId: null, estimate: estimateSummary })
    }
    customerId = newCustomer.id
  }

  // 견적 insert payload
  const bom = estimate?.bom
  const insertPayload: Record<string, unknown> = {
    customer_id: customerId,
    environment,
    purpose,
    urgency,
    desired_width_mm: widthMm,
    desired_height_mm: heightMm,
    viewing_distance_m: viewingDistance ? parseFloat(viewingDistance) : null,
    additional_notes: additionalNotes ?? null,
    status: 'pending' as const,
  }
  if (estimate && familyCode) {
    insertPayload.family_code = familyCode
    insertPayload.layout_code = estimate.layout_code
    insertPayload.classification = estimate.classification
    insertPayload.classification_reasons = estimate.classification_reasons
    insertPayload.zone_count = estimate.zone_count
    if (estimate.standard) {
      insertPayload.standard_width_mm = estimate.standard.width_mm
      insertPayload.standard_height_mm = estimate.standard.height_mm
    }
    insertPayload.recommended_package = PKG_TO_DB[packageTier]
  }
  if (bom) {
    insertPayload.cabinet_count          = bom.cabinet_count
    insertPayload.module_count           = bom.module_count
    insertPayload.spare_modules          = bom.spare_modules
    insertPayload.screen_px_w            = bom.screen_px_w
    insertPayload.screen_px_h            = bom.screen_px_h
    insertPayload.total_px               = bom.total_px
    insertPayload.controller_model       = bom.controller_model
    insertPayload.controller_count       = bom.controller_count
    insertPayload.lan_ports_used         = bom.lan_ports_needed_per_controller * bom.controller_count
    insertPayload.receiving_card_count   = bom.receiving_card_count
    insertPayload.smps_count             = bom.smps_count
    insertPayload.area_m2                = bom.area_m2
    insertPayload.peak_power_w           = bom.peak_power_w
    insertPayload.circuit_count          = bom.circuit_count
    insertPayload.needs_rack             = bom.needs_rack
    insertPayload.needs_cooling_review   = bom.needs_cooling_review
    insertPayload.recommended_sku        = familyToLegacySku(bom.family_code, bom.area_m2)
  }

  // 신컬럼 타입은 types.gen.ts 재생성 전까지 미반영 → unsafe cast
  // (재생성 후 제거 가능: pnpm db:types)
  const { data: quote, error: quoteError } = await supabase
    .from('quotes')
    .insert(insertPayload as never)
    .select('id')
    .single()

  if (quoteError || !quote) {
    logLead(`quote-insert-failed: ${quoteError?.message ?? 'unknown'}`)
    return NextResponse.json({ success: true, quoteId: null, estimate: estimateSummary })
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

  // 고객 + 관리자 알림 (features.notifications ON 일 때만 · 실패해도 접수에 영향 없음)
  if (features.notifications) {
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
  }

  return NextResponse.json({
    success: true,
    quoteId: quote.id,
    estimate: estimateSummary,
    ...(uploadErrors.length > 0 && { uploadErrors }),
  })
}
