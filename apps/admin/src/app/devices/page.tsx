import { adminDb } from '@/lib/supabase'
import { DevicesClient } from './DevicesClient'

export const revalidate = 0

// 001_initial_schema.sql `devices` 테이블 스키마 사용
export type DeviceRow = {
  id: string
  created_at: string
  project_id: string
  subscription_id: string | null
  device_code: string
  product_id: string
  status: 'online' | 'offline' | 'error' | 'maintenance'
  last_seen_at: string | null
  ip_address: string | null
  location_name: string | null
  timezone: string | null
  firmware_version: string | null
  health_score: number | null
  products: { sku: string; display_name: string } | null
  projects: {
    customers: { business_name: string | null; name: string } | null
  } | null
}

async function fetchDevices(): Promise<DeviceRow[]> {
  try {
    const { data, error } = await adminDb
      .from('devices')
      .select(`
        id, created_at, project_id, subscription_id, device_code, product_id,
        status, last_seen_at, ip_address, location_name, timezone,
        firmware_version, health_score,
        products (sku, display_name),
        projects (customers (business_name, name))
      `)
      .order('created_at', { ascending: false })
      .limit(200)
    if (error || !data) return []
    return data as unknown as DeviceRow[]
  } catch {
    return []
  }
}

export default async function DevicesPage() {
  const devices = await fetchDevices()
  return <DevicesClient initialDevices={devices} />
}
