/**
 * 동적 OG 이미지 (홈 · 모든 페이지 기본값)
 *
 * 🔴 2026-09-10 CEO "공유 링크 속 미리보기 페이지가 구리다." — 2차 재설계.
 *    이전(09-09)판은 사진 전면 위에 글자를 얹어 카카오톡 작은 카드에서 글자가 배경 건물에 묻혔다.
 *    지금은 ① 왼쪽 58% 를 단색 어두운 패널로 비워 글자 자리를 확보하고 ② 오른쪽 42% 에만 사진(로비 성운 LED 월)을
 *    ③ 로고를 키우고 ④ 한국어 헤드라인을 크게, 영어 슬로건은 작은 라벨로 내렸다. 카드가 400px 로 줄어도 읽힌다.
 *    ⑤ 한글 굵기는 Noto Sans KR 800 을 실제로 불러온다(satori 기본 폰트는 굵기 하나뿐).
 *
 * 🔴 edge 런타임을 유지해야 한다. 바꾸지 마라 (2026-09-08 실측).
 *    Node 런타임으로 내리면 `next/og` 가 Windows 에서 `Invalid URL` 로 통째로 깨진다
 *    (`@vercel/og/index.node.js` 가 path.join 으로 file: URL 을 만드는 라이브러리 버그).
 *    edge 에서 빌드가 prerender-manifest 를 못 찾는 문제는 next.config.mjs 의 스텁이 막는다.
 *
 * 사진·로고·폰트는 전부 fetch 로 받는다(edge 에는 fs 가 없다). 하나라도 실패하면
 * 그 요소만 빼고 그린다 — 미리보기가 아예 안 뜨는 것보다 낫다.
 *
 * ⚠️ 카카오톡·슬랙은 OG 이미지를 **캐시**한다. 배포 후에도 옛 이미지가 보이면
 *    https://developers.kakao.com/tool/debugger/sharing 에서 주소를 넣고 '초기화'.
 */
import { ImageResponse } from 'next/og'
import { SITE } from '@/lib/seo/site'

export const runtime = 'edge'
export const alt = `${SITE.nameKo} — LED 전광판 · 전자현수막 설계·제작·시공`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/* 2026-09-10 CEO 제공 로비 성운 LED 월 컷 — 어두운 패널과 톤이 이어진다 */
const PHOTO = '/cases/gen/gen-lobby-nebula.jpg'
const LOGO = '/brand/wk-logo-dark-full.svg'
const ORANGE = '#DE671D'
const PANEL = '#0B1017'

async function fetchDataUrl(url: string, mime: string): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: 'force-cache' })
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    // edge 에는 Buffer 가 없다 — 청크로 btoa
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

/** Google Fonts CSS 에서 실제 ttf/woff 주소를 뽑아 받는다 (한글 굵은 글꼴) */
async function fetchFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@800&display=swap',
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
  const [photo, logo, font] = await Promise.all([
    fetchDataUrl(`${base}${PHOTO}`, 'image/jpeg'),
    fetchDataUrl(`${base}${LOGO}`, 'image/svg+xml'),
    fetchFont(),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: PANEL,
          fontFamily: font ? 'NotoSansKR' : 'sans-serif',
          color: 'white',
        }}
      >
        {/* 오른쪽 42% — 사진. 왼쪽 끝을 패널색으로 녹여 경계를 없앤다 */}
        {photo && (
          <div style={{ position: 'absolute', top: 0, right: 0, width: 560, height: 630, display: 'flex' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt=""
              aria-hidden="true"
              width={560}
              height={630}
              style={{ width: 560, height: 630, objectFit: 'cover', objectPosition: '58% 50%' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(90deg, ${PANEL} 0%, rgba(11,16,23,0.55) 22%, rgba(11,16,23,0) 48%)`,
              }}
            />
          </div>
        )}

        {/* 왼쪽 패널 — 글자 */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 700,
            height: '100%',
            padding: '60px 0 54px 72px',
          }}
        >
          {/* 상단: 로고 + 회사명 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="" aria-hidden="true" width={104} height={88} style={{ width: 104, height: 88 }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{SITE.nameKo}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#9AA3AE', letterSpacing: '0.18em', marginTop: 4 }}>
                {SITE.nameEn}
              </div>
            </div>
          </div>

          {/* 중단: 헤드라인 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                color: ORANGE,
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: '0.16em',
              }}
            >
              <div style={{ width: 40, height: 4, background: ORANGE }} />
              BEYOND THE DISPLAY
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: 22,
                fontSize: 76,
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: '-0.035em',
              }}
            >
              <div>LED 전광판</div>
              <div>전자현수막</div>
            </div>
            <div style={{ marginTop: 24, fontSize: 31, fontWeight: 800, color: '#E8EBEF', letterSpacing: '-0.01em' }}>
              설계 · 제작 · 시공 · 유지보수를 직접 합니다
            </div>
          </div>

          {/* 하단: 도메인 · 전화 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 24, color: '#B7BEC7' }}>
            <span style={{ color: 'white', fontWeight: 800, letterSpacing: '0.02em' }}>wooktech.co.kr</span>
            <span style={{ width: 1, height: 22, background: '#3A4350' }} />
            <span>{SITE.phone}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: 'NotoSansKR', data: font, weight: 800, style: 'normal' }] : undefined,
    },
  )
}
