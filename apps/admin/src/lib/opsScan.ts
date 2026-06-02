// 서버 전용 유틸 — 서버 컴포넌트(app/ops/page.tsx)에서만 import 한다.
import fs from 'node:fs'
import path from 'node:path'

/**
 * 하네스(pro/) 폴더를 런타임에 스캔해 부서별 작업 현황을 집계한다.
 * - inbox 의 ORDER / CODEX 파일  → 할당된 작업
 * - outbox 의 REPORT 파일         → 완료 보고
 * - workspace 의 .md 파일         → 산출물
 * 로컬·내부 운영 도구 전용. 하네스 루트를 못 찾으면 빈 결과를 반환(빌드/배포 안전).
 */

export type DeptScan = {
  found: boolean
  orders: number
  reports: number
  workspace: number
  lastActivity: number | null
  latest: { name: string; mtime: number }[]
}

const EMPTY: DeptScan = { found: false, orders: 0, reports: 0, workspace: 0, lastActivity: null, latest: [] }

function isHarnessRoot(dir: string): boolean {
  try {
    return (
      fs.existsSync(path.join(dir, '00-COO')) &&
      fs.existsSync(path.join(dir, 'shared', 'STRATEGY.md'))
    )
  } catch {
    return false
  }
}

let cachedRoot: string | null | undefined
export function findHarnessRoot(): string | null {
  if (cachedRoot !== undefined) return cachedRoot
  const envRoot = process.env.HARNESS_ROOT
  if (envRoot && isHarnessRoot(envRoot)) return (cachedRoot = envRoot)
  let dir = process.cwd()
  for (let i = 0; i < 8; i++) {
    if (isHarnessRoot(dir)) return (cachedRoot = dir)
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return (cachedRoot = null)
}

function listFiles(dir: string): { name: string; mtime: number }[] {
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) => {
        let mtime = 0
        try {
          mtime = fs.statSync(path.join(dir, d.name)).mtimeMs
        } catch {
          /* noop */
        }
        return { name: d.name, mtime }
      })
  } catch {
    return []
  }
}

function listMdRecursive(dir: string): { name: string; mtime: number }[] {
  const out: { name: string; mtime: number }[] = []
  const walk = (d: string) => {
    let entries: fs.Dirent[]
    try {
      entries = fs.readdirSync(d, { withFileTypes: true })
    } catch {
      return
    }
    for (const e of entries) {
      const full = path.join(d, e.name)
      if (e.isDirectory()) walk(full)
      else if (e.isFile() && e.name.endsWith('.md')) {
        let mtime = 0
        try {
          mtime = fs.statSync(full).mtimeMs
        } catch {
          /* noop */
        }
        out.push({ name: e.name, mtime })
      }
    }
  }
  walk(dir)
  return out
}

/** 부서 폴더(루트 기준 상대경로) 하나를 스캔한다. */
export function scanDept(rel: string): DeptScan {
  const root = findHarnessRoot()
  if (!root) return EMPTY
  const base = path.join(root, rel)
  if (!fs.existsSync(base)) return EMPTY

  const inbox = listFiles(path.join(base, 'inbox'))
  const outbox = listFiles(path.join(base, 'outbox'))
  const ws = listMdRecursive(path.join(base, 'workspace'))

  const orders = inbox.filter((f) => /^(ORDER|CODEX)-/i.test(f.name))
  const reports = outbox.filter((f) => /^REPORT-/i.test(f.name))

  const all = [...orders, ...reports, ...ws]
  const lastActivity = all.length ? Math.max(...all.map((f) => f.mtime)) : null

  const latest = [...reports, ...ws]
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, 3)

  return {
    found: true,
    orders: orders.length,
    reports: reports.length,
    workspace: ws.length,
    lastActivity,
    latest,
  }
}
