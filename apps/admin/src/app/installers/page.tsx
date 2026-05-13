import { adminDb } from '@/lib/supabase'
import { InstallersClient } from './InstallersClient'

export const revalidate = 0

async function getInstallers() {
  const { data } = await adminDb
    .from('installers')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

async function getActiveProjectCounts() {
  // 진행 중(완료되지 않은) 프로젝트 수를 인스톨러별 집계
  const { data } = await adminDb
    .from('projects')
    .select('installer_id, status')
    .neq('status', 'completed')

  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    if (!row.installer_id) continue
    counts[row.installer_id] = (counts[row.installer_id] ?? 0) + 1
  }
  return counts
}

export default async function InstallersPage() {
  const [installers, activeCounts] = await Promise.all([
    getInstallers(),
    getActiveProjectCounts(),
  ])

  return <InstallersClient initialInstallers={installers} activeCounts={activeCounts} />
}
