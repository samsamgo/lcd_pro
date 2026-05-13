'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, X, Star, Briefcase, Phone, MapPin } from 'lucide-react'

type Installer = {
  id: string
  created_at: string
  company_name: string
  contact_name: string
  phone: string
  email: string | null
  regions: string[]
  specialties: string[] | null
  status: 'active' | 'inactive' | 'suspended'
  rating: number | null
  completed_projects: number
  bank_account: string | null
  business_reg_no: string | null
  notes: string | null
}

const STATUS_MAP: Record<Installer['status'], { label: string; color: string }> = {
  active:    { label: '활동중', color: 'bg-green-500/20 text-green-300' },
  inactive:  { label: '비활성', color: 'bg-zinc-500/20 text-zinc-400' },
  suspended: { label: '정지',   color: 'bg-red-500/20 text-red-300' },
}

interface Props {
  initialInstallers: Installer[]
  activeCounts: Record<string, number>
}

export function InstallersClient({ initialInstallers, activeCounts }: Props) {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<Installer['status'] | 'all'>('all')
  const [editing, setEditing] = useState<Installer | null>(null)
  const [creating, setCreating] = useState(false)

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return initialInstallers
    return initialInstallers.filter((i) => i.status === statusFilter)
  }, [initialInstallers, statusFilter])

  async function handleDelete(id: string) {
    if (!confirm('정말 삭제하시겠습니까? 진행 중 프로젝트가 있다면 거부됩니다.')) return
    const res = await fetch(`/api/installers/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: '삭제 실패' }))
      alert(error)
      return
    }
    router.refresh()
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">파트너 관리</h1>
          <p className="mt-1 text-sm text-zinc-500">설치 파트너 총 {initialInstallers.length}개사</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          <Plus size={16} /> 파트너 추가
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`badge px-3 py-1.5 ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
        >
          전체
        </button>
        {(Object.entries(STATUS_MAP) as [Installer['status'], { label: string; color: string }][]).map(
          ([key, { label, color }]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`badge px-3 py-1.5 ${statusFilter === key ? color : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
            >
              {label}
            </button>
          ),
        )}
      </div>

      <div className="glass overflow-hidden rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-xs text-zinc-500">
              <th className="px-4 py-3 font-medium">회사 / 담당자</th>
              <th className="px-4 py-3 font-medium">연락처</th>
              <th className="px-4 py-3 font-medium">담당 지역</th>
              <th className="px-4 py-3 font-medium">특기</th>
              <th className="px-4 py-3 font-medium">실적</th>
              <th className="px-4 py-3 font-medium">평점</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-zinc-600">
                  해당 파트너 없음
                </td>
              </tr>
            ) : (
              filtered.map((i) => {
                const status = STATUS_MAP[i.status]
                const active = activeCounts[i.id] ?? 0
                return (
                  <tr key={i.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-zinc-100">{i.company_name}</p>
                      <p className="text-xs text-zinc-500">{i.contact_name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="flex items-center gap-1 text-sm text-zinc-300">
                        <Phone size={11} className="text-zinc-600" /> {i.phone}
                      </p>
                      {i.email && <p className="text-xs text-zinc-500">{i.email}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="flex flex-wrap items-center gap-1 text-xs text-zinc-300">
                        <MapPin size={11} className="text-zinc-600" />
                        {i.regions.join(', ') || '-'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(i.specialties ?? []).map((s) => (
                          <span key={s} className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                            {s}
                          </span>
                        ))}
                        {(!i.specialties || i.specialties.length === 0) && <span className="text-xs text-zinc-600">-</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <p className="text-zinc-200">완료 {i.completed_projects}</p>
                      <p className="flex items-center gap-1 text-xs text-blue-400">
                        <Briefcase size={11} /> 진행 {active}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {i.rating ? (
                        <span className="flex items-center gap-1 text-yellow-300">
                          <Star size={12} className="fill-yellow-300" />
                          {i.rating.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${status.color}`}>{status.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditing(i)} className="text-zinc-500 hover:text-white" title="수정">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(i.id)}
                          className="text-zinc-500 hover:text-red-400"
                          title="삭제"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <InstallerModal
          installer={editing}
          onClose={() => { setCreating(false); setEditing(null) }}
          onSaved={() => { setCreating(false); setEditing(null); router.refresh() }}
        />
      )}
    </div>
  )
}

function InstallerModal({
  installer,
  onClose,
  onSaved,
}: {
  installer: Installer | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!installer
  const [form, setForm] = useState({
    company_name: installer?.company_name ?? '',
    contact_name: installer?.contact_name ?? '',
    phone: installer?.phone ?? '',
    email: installer?.email ?? '',
    regions: installer?.regions.join(', ') ?? '',
    specialties: (installer?.specialties ?? []).join(', '),
    status: installer?.status ?? 'active',
    rating: installer?.rating?.toString() ?? '',
    completed_projects: installer?.completed_projects?.toString() ?? '0',
    bank_account: installer?.bank_account ?? '',
    business_reg_no: installer?.business_reg_no ?? '',
    notes: installer?.notes ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        company_name: form.company_name.trim(),
        contact_name: form.contact_name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        regions: form.regions.split(',').map((s) => s.trim()).filter(Boolean),
        specialties: form.specialties.split(',').map((s) => s.trim()).filter(Boolean),
        status: form.status,
        rating: form.rating ? Number(form.rating) : null,
        completed_projects: Number(form.completed_projects) || 0,
        bank_account: form.bank_account.trim() || null,
        business_reg_no: form.business_reg_no.trim() || null,
        notes: form.notes.trim() || null,
      }
      const res = await fetch(isEdit ? `/api/installers/${installer!.id}` : '/api/installers', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({ error: '저장 실패' }))
        throw new Error(msg ?? '저장 실패')
      }
      onSaved()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{isEdit ? '파트너 수정' : '파트너 추가'}</h2>
          <button type="button" onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="회사명 *" required value={form.company_name} onChange={(v) => setForm({ ...form, company_name: v })} />
          <Field label="담당자명 *" required value={form.contact_name} onChange={(v) => setForm({ ...form, contact_name: v })} />
          <Field label="전화 *" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Field label="이메일" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field
            label="담당 지역 (콤마 구분) *"
            required
            placeholder="서울, 경기, 인천"
            value={form.regions}
            onChange={(v) => setForm({ ...form, regions: v })}
            full
          />
          <Field
            label="특기 (콤마 구분)"
            placeholder="옥외, 실내, 대형"
            value={form.specialties}
            onChange={(v) => setForm({ ...form, specialties: v })}
            full
          />
          <div>
            <label className="mb-1 block text-xs text-zinc-500">상태</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Installer['status'] })}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            >
              {Object.entries(STATUS_MAP).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <Field
            label="평점 (0–5)"
            type="number"
            value={form.rating}
            onChange={(v) => setForm({ ...form, rating: v })}
          />
          <Field
            label="완료 프로젝트 수"
            type="number"
            value={form.completed_projects}
            onChange={(v) => setForm({ ...form, completed_projects: v })}
          />
          <Field label="사업자등록번호" value={form.business_reg_no} onChange={(v) => setForm({ ...form, business_reg_no: v })} />
          <Field label="정산 계좌" value={form.bank_account} onChange={(v) => setForm({ ...form, bank_account: v })} full />
          <div className="col-span-2">
            <label className="mb-1 block text-xs text-zinc-500">메모</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {saving ? '저장 중...' : isEdit ? '수정' : '추가'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
  full,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  placeholder?: string
  full?: boolean
}) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <label className="mb-1 block text-xs text-zinc-500">{label}</label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/60 focus:outline-none"
      />
    </div>
  )
}
