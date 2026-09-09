/**
 * SEO 전수 크롤 — 실행 중인 서버를 sitemap + 내부 링크로 재귀 크롤해 crawl.json 을 남긴다.
 *
 *   node scripts/seo-crawl.mjs crawl.json      # 서버가 http://localhost:3000 에 떠 있어야 한다
 *   node scripts/seo-audit.mjs                 # 같은 폴더의 crawl.json 을 읽어 점검표를 출력
 *
 * 서버를 띄우지 않는다. 읽기만 한다. (2026-09-09 최종 점검용으로 작성 — teams/web/reports/final-audit-20260909.md)
 */
import fs from 'node:fs'
const BASE = 'http://localhost:3000'
const PROD = 'https://wooktech.co.kr'

const pages = new Map() // path -> {status, html, redirect}
const queue = []
const seenLink = new Map() // path -> Set(from)

function norm(u) {
  if (!u) return null
  if (u.startsWith(PROD)) u = u.slice(PROD.length) || '/'
  if (u.startsWith(BASE)) u = u.slice(BASE.length) || '/'
  if (!u.startsWith('/')) return null
  return u
}

async function fetchPage(p) {
  const res = await fetch(BASE + p, { redirect: 'manual' })
  const loc = res.headers.get('location')
  let html = ''
  const ct = res.headers.get('content-type') || ''
  if (res.status === 200 && (ct.includes('html') || ct.includes('xml') || ct.includes('text'))) html = await res.text()
  return { status: res.status, loc, html, ct, size: Buffer.byteLength(html) }
}

async function main() {
  // sitemap
  const sm = await fetchPage('/sitemap.xml')
  const smUrls = [...sm.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
  const robots = await fetchPage('/robots.txt')

  const start = ['/', ...smUrls.map(norm).filter(Boolean)]
  for (const s of start) { if (!seenLink.has(s)) { seenLink.set(s, new Set(['sitemap'])); queue.push(s) } }

  while (queue.length) {
    const p = queue.shift()
    if (pages.has(p)) continue
    const r = await fetchPage(p)
    pages.set(p, r)
    if (r.status !== 200 || !r.html.includes('<html')) continue
    for (const m of r.html.matchAll(/href="(\/[^"#?][^"]*|\/)"/g)) {
      const t = norm(m[1])
      if (!t) continue
      if (/\.(png|jpg|jpeg|svg|webp|ico|pdf|xml|txt|json|webmanifest|mp4|woff2?)$/i.test(t)) continue
      if (!seenLink.has(t)) { seenLink.set(t, new Set()); queue.push(t) }
      seenLink.get(t).add(p)
    }
    // also record anchor links
    for (const m of r.html.matchAll(/href="(\/[^"]*#[^"]+)"/g)) {
      const t = norm(m[1]); if (!t) continue
      const base = t.split('#')[0] || '/'
      if (!seenLink.has(base)) { seenLink.set(base, new Set()); queue.push(base) }
    }
  }

  const out = { sitemapUrls: smUrls, robots: robots.html, pages: {} }
  for (const [p, r] of pages) {
    out.pages[p] = { status: r.status, loc: r.loc, size: r.size, ct: r.ct, from: [...(seenLink.get(p) || [])], html: r.html }
  }
  fs.writeFileSync(process.argv[2], JSON.stringify(out))
  console.log('pages crawled:', pages.size)
}
main()
