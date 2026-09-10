/**
 * 동적 OG 이미지 (홈 · 모든 페이지 기본값) — **로고만.**
 *
 * 🔴 2026-09-10 CEO "지금 미리보기 이미지는 너무 촌스러워. 그냥 로고만 넣어라." — 3차. 4차 "더 심플하게": 도메인 글자도 뺀다.
 *    사진·헤드라인·슬로건 전부 뺀다. 흰 바탕 가운데 정식 로고(심볼 + WOOKANG TECH + 우강테크)만 두고
 *    맨 아래 도메인 한 줄. 카카오톡·네이버 카드에서 회사 이름이 곧 그림이 된다.
 *
 * 🔴 edge 런타임을 유지해야 한다. 바꾸지 마라 (2026-09-08 실측).
 *    Node 런타임으로 내리면 `next/og` 가 Windows 에서 `Invalid URL` 로 통째로 깨진다
 *    (`@vercel/og/index.node.js` 가 path.join 으로 file: URL 을 만드는 라이브러리 버그).
 *
 * 로고·폰트는 fetch 로 받는다(edge 에는 fs 가 없다). 로고를 못 받으면 회사명 글자로 대신 그린다.
 *
 * ⚠️ 카카오톡·슬랙은 OG 이미지를 **URL 단위로 캐시**한다. www 와 apex 가 각각 캐시돼 서로 다른 카드가 보였다
 *    (2026-09-10 CEO 실측) → next.config.mjs 에서 www → apex 308 + og:image URL 에 버전 쿼리.
 */
import { ImageResponse } from 'next/og'
import { SITE } from '@/lib/seo/site'

export const runtime = 'edge'
export const alt = `${SITE.nameKo} ${SITE.nameEn}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const LOGO = '/brand/wk-logo-full.svg' // 밝은 배경용 정식 로크업
const PANEL = '#FFFFFF'

async function fetchDataUrl(url: string, mime: string): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: 'force-cache' })
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    const bytes = new Uint8Array(buf)
    let bin = ''
    for (let i = 0; i < bytes.length; i += 0x8000) {
      bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
    }
    return `data:${mime};base64,${btoa(bin)}`
  } catch {
    return null
  }
}

async function fetchFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&display=swap',
      { headers: { 'User-Agent': 'Mozilla/5.0' }, cache: 'force-cache' },
    ).then((r) => r.text())
    const m = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype|woff)'\)/)
    if (!m) return null
    const res = await fetch(m[1], { cache: 'force-cache' })
    return res.ok ? res.arrayBuffer() : null
  } catch {
    return null
  }
}

export default async function OG() {
  const base = SITE.url.replace(/\/$/, '')
  const [logo, font] = await Promise.all([fetchDataUrl(`${base}${LOGO}`, 'image/svg+xml'), fetchFont()])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: PANEL,
          fontFamily: font ? 'NotoSansKR' : 'sans-serif',
          color: '#0B1017',
          position: 'relative',
        }}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" aria-hidden="true" width={600} height={500} style={{ width: 600, height: 500 }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: '-0.03em' }}>{SITE.nameKo}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#6C7073', letterSpacing: '0.2em', marginTop: 12 }}>
              {SITE.nameEn}
            </div>
          </div>
        )}
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: 'NotoSansKR', data: font, weight: 700, style: 'normal' }] : undefined,
    },
  )
}
