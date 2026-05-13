import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@lcd-pro/db'
import { adminDb } from '@/lib/supabase'

type InstallerInsert = Database['public']['Tables']['installers']['Insert']

export async function POST(req: NextRequest) {
  const body = (await req.json()) as InstallerInsert

  if (!body.company_name || !body.contact_name || !body.phone || !body.regions?.length) {
    return NextResponse.json({ error: '회사명, 담당자, 전화, 담당 지역은 필수입니다.' }, { status: 400 })
  }

  const { data, error } = await adminDb
    .from('installers')
    .insert(body)
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ id: data?.id })
}
