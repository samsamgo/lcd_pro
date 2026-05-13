import { adminDb } from '@/lib/supabase'
import { ProjectsClient } from './ProjectsClient'

export const revalidate = 0

async function getProjects() {
  const { data } = await adminDb
    .from('projects')
    .select(`
      *,
      customers (name, business_name, phone, region),
      installers (id, company_name, contact_name, phone)
    `)
    .order('scheduled_date', { ascending: true, nullsFirst: false })
    .limit(200)
  return data ?? []
}

async function getActiveInstallers() {
  const { data } = await adminDb
    .from('installers')
    .select('id, company_name, contact_name')
    .eq('status', 'active')
    .order('company_name')
  return data ?? []
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { status?: string; view?: string }
}) {
  const [projects, installers] = await Promise.all([getProjects(), getActiveInstallers()])

  return (
    <ProjectsClient
      initialProjects={projects as any}
      installers={installers}
      statusFilter={searchParams.status ?? 'all'}
      view={(searchParams.view as 'list' | 'calendar') ?? 'list'}
    />
  )
}
