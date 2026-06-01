'use client'

import { useState } from 'react'
import Image from 'next/image'
import { DetailModal, type ModalPayload } from './DetailModal'
import {
  SERVICES,
  FIELD_CASES,
  CAPABILITY_AREAS,
  type ServiceCard,
  type CaseCard,
  type CapabilityArea,
} from './services-data'

function toServicePayload(s: ServiceCard): ModalPayload {
  return { title: s.title, image: s.image, summary: s.summary, bullets: s.bullets, details: s.details }
}

function toCasePayload(c: CaseCard): ModalPayload {
  return { title: c.title, subtitle: c.location, image: c.image, summary: c.detail, bullets: [c.spec], details: c.details }
}

function toCapPayload(a: CapabilityArea): ModalPayload {
  return { title: a.env, image: a.image, summary: a.detail, details: a.details }
}

export function ServicesGrid() {
  const [payload, setPayload] = useState<ModalPayload | null>(null)
  return (
    <>
      <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => setPayload(toServicePayload(s))}
              className="group block w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] text-left transition-colors hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-haspopup="dialog"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-800">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{s.summary}</p>
                <ul className="mt-4 space-y-1.5">
                  {s.bullets.map((b) => (
                    <li key={b} className="text-sm text-zinc-300">· {b}</li>
                  ))}
                </ul>
                <div className="mt-4 text-xs font-medium text-blue-400">자세히 보기 →</div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* SSR 보존 — 크롤러용 상세 본문. 시각적으로는 숨김. */}
      <div className="sr-only">
        {SERVICES.map((s) => (
          <section key={`sr-${s.id}`} aria-label={`${s.title} 상세`}>
            <h3>{s.title}</h3>
            <p>{s.summary}</p>
            {s.details.map((d) => (
              <div key={d.heading}>
                <h4>{d.heading}</h4>
                <ul>
                  {d.items.map((it) => (<li key={it}>{it}</li>))}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </div>

      <DetailModal open={payload !== null} payload={payload} onClose={() => setPayload(null)} />
    </>
  )
}

export function FieldCasesGrid() {
  const [payload, setPayload] = useState<ModalPayload | null>(null)
  return (
    <>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {FIELD_CASES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setPayload(toCasePayload(c))}
            className="group block overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] text-left transition-colors hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-haspopup="dialog"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-800">
              <Image
                src={c.image}
                alt={c.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <div className="text-xs uppercase tracking-wide text-blue-400">{c.location}</div>
              <div className="mt-1 text-lg font-semibold text-white">{c.title}</div>
              <div className="mt-2 text-sm text-zinc-300">{c.spec}</div>
              <p className="mt-3 text-sm text-zinc-400">{c.detail}</p>
              <div className="mt-4 text-xs font-medium text-blue-400">자세히 보기 →</div>
            </div>
          </button>
        ))}
      </div>

      <div className="sr-only">
        {FIELD_CASES.map((c) => (
          <section key={`sr-${c.id}`} aria-label={`${c.title} 상세`}>
            <h3>{c.title}</h3>
            <p>{c.location} — {c.spec}</p>
            <p>{c.detail}</p>
            {c.details.map((d) => (
              <div key={d.heading}>
                <h4>{d.heading}</h4>
                <ul>{d.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </div>
            ))}
          </section>
        ))}
      </div>

      <DetailModal open={payload !== null} payload={payload} onClose={() => setPayload(null)} />
    </>
  )
}

export function CapabilityGrid() {
  const [payload, setPayload] = useState<ModalPayload | null>(null)
  return (
    <>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITY_AREAS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setPayload(toCapPayload(a))}
            className="group block overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] text-left transition-colors hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-haspopup="dialog"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-800">
              <Image
                src={a.image}
                alt={a.env}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <div className="text-sm font-semibold text-white">{a.env}</div>
              <div className="mt-1 text-sm text-zinc-400">{a.detail}</div>
              <div className="mt-3 text-xs font-medium text-blue-400">자세히 보기 →</div>
            </div>
          </button>
        ))}
      </div>

      <div className="sr-only">
        {CAPABILITY_AREAS.map((a) => (
          <section key={`sr-${a.id}`} aria-label={`${a.env} 상세`}>
            <h3>{a.env}</h3>
            <p>{a.detail}</p>
            {a.details.map((d) => (
              <div key={d.heading}>
                <h4>{d.heading}</h4>
                <ul>{d.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </div>
            ))}
          </section>
        ))}
      </div>

      <DetailModal open={payload !== null} payload={payload} onClose={() => setPayload(null)} />
    </>
  )
}
