import { NextRequest, NextResponse } from 'next/server'
import type { Database } from '@lcd-pro/db'
import { adminDb } from '@/lib/supabase'

type InstallerUpdate = Database['public']['Tables']['installers']['Update']

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = (await req.json()) as InstallerUpdate

  const { error } = await adminDb
    .from('installers')
    .update(body)
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  // 진행 중 프로젝트가 있으면 삭제 차단 (정산/이력 보존)
  const { count } = await adminDb
    .from('projects')
    .select('id', { count: 'exact', head: true })
    .eq('installer_id', params.id)
    .neq('status', 'completed')

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: `진행 중 프로젝트 ${count}건이 있어 삭제할 수 없습니다. '비활성' 상태로 변경하세요.` },
      { status: 409 },
    )
  }

  const { error } = await adminDb.from('installers').delete().eq('id', params.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
