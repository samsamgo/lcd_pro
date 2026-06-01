'use client'

import { Monitor, Wifi, WifiOff, AlertTriangle, Wrench, Clock } from 'lucide-react'
import type { DeviceRow } from './page'

interface Props {
  initialDevices: DeviceRow[]
}

const STATUS_STYLE: Record<DeviceRow['status'], { label: string; cls: string; icon: JSX.Element }> = {
  online: {
    label: '온라인',
    cls: 'bg-emerald-500/20 text-emerald-300',
    icon: <Wifi size={11} />,
  },
  offline: {
    label: '오프라인',
    cls: 'bg-red-500/20 text-red-300',
    icon: <WifiOff size={11} />,
  },
  error: {
    label: '오류',
    cls: 'bg-orange-500/20 text-orange-300',
    icon: <AlertTriangle size={11} />,
  },
  maintenance: {
    label: '점검중',
    cls: 'bg-yellow-500/20 text-yellow-300',
    icon: <Wrench size={11} />,
  },
}

function fmtSince(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60) return `${Math.floor(diff)}초 전`
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  return `${Math.floor(diff / 86400)}일 전`
}

function healthBadge(score: number | null): JSX.Element {
  if (score == null) return <span className="text-zinc-600">—</span>
  if (score >= 90) return <span className="text-emerald-300">{score}</span>
  if (score >= 60) return <span className="text-yellow-300">{score}</span>
  return <span className="text-red-300">{score}</span>
}

export function DevicesClient({ initialDevices }: Props) {
  const total = initialDevices.length
  const online = initialDevices.filter((d) => d.status === 'online').length
  const offline = initialDevices.filter((d) => d.status === 'offline').length
  const errored = initialDevices.filter((d) => d.status === 'error').length

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">디바이스 모니터</h1>
        <p className="mt-1 text-sm text-zinc-500">
          MVP3 진입 v0 · heartbeat 폴링/MQTT 전환 전, 등록 디바이스 목록 표시
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={<Monitor size={16} />} label="전체" value={total} />
        <StatCard icon={<Wifi size={16} className="text-emerald-400" />} label="온라인" value={online} />
        <StatCard icon={<WifiOff size={16} className="text-red-400" />} label="오프라인" value={offline} />
        <StatCard icon={<AlertTriangle size={16} className="text-orange-400" />} label="오류" value={errored} />
      </div>

      <div className="glass overflow-hidden rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-xs text-zinc-500">
              <th className="px-4 py-3 font-medium">디바이스</th>
              <th className="px-4 py-3 font-medium">매장</th>
              <th className="px-4 py-3 font-medium">위치</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium">마지막 통신</th>
              <th className="px-4 py-3 font-medium">Health</th>
              <th className="px-4 py-3 font-medium">FW</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {total === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-zinc-600">
                  등록된 디바이스 없음 · 첫 설치 완료 시 device_code 부여 후 표시됩니다.
                </td>
              </tr>
            ) : (
              initialDevices.map((d) => {
                const merchant =
                  d.projects?.customers?.business_name ?? d.projects?.customers?.name ?? '—'
                const s = STATUS_STYLE[d.status] ?? STATUS_STYLE.offline
                return (
                  <tr key={d.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-xs text-zinc-200">{d.device_code}</td>
                    <td className="px-4 py-3 text-sm text-zinc-300">{merchant}</td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{d.location_name ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-zinc-400">{d.products?.sku ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`badge inline-flex items-center gap-1 ${s.cls}`}>
                        {s.icon} {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} /> {fmtSince(d.last_seen_at)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{healthBadge(d.health_score)}</td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{d.firmware_version ?? '—'}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-zinc-600">
        ※ heartbeat 자동 수신은 다음 마이그레이션(폴링 또는 MQTT)에서 활성화. 현재는 admin에서 device_code·status 수동 등록·표시만.
      </p>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-1 text-2xl font-bold text-zinc-100">{value}</p>
    </div>
  )
}
