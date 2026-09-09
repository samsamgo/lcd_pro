/**
 * 동적 OG 이미지 (홈 · 모든 페이지 기본값)
 *
 * 🔴 2026-09-09 CEO "링크 공유하면 미리보기 이미지가 이상하다. 더 멋있게."
 *    이전 버전은 검은 그라디언트 위 얇은 글자 + "LED 사이니지 B2B 플랫폼"(낡은 문구)뿐이었다.
 *    지금은 ① 블루아워 타워 대형 LED 월 실사(회사소개 오프닝과 같은 컷) 위에
 *    ② 왼쪽을 어둡게 눌러 ③ 로고 + BEYOND THE DISPLAY + 한 줄 + 도메인을 얹는다.
 *    ④ 한글 굵기가 얇게 나오던 문제는 Noto Sans KR 800 을 실제로 불러와 해결했다
 *       (satori 기본 폰트는 굵기 하나뿐이라 fontWeight 가 먹지 않는다).
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
export const alt = `${SITE.nameKo} ${SITE.nameEn} — BEYOND THE DISPLAY`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const PHOTO = '/wk/A1_downtown-tower-bluehour.jpg'
const LOGO = '/brand/wk-logo-dark-full.svg'
const ORANGE = '#DE671D'

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
          background: '#05080C',
          fontFamily: font ? 'NotoSansKR' : 'sans-serif',
          color: 'white',
        }}
      >
        {/* 사진 — 오른쪽에 대형 LED 월이 보이도록 살짝 오른쪽 정렬 */}
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            width={1200}
            height={630}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '62% 40%' }}
          />
        )}
        {/* 왼쪽을 눌러 글자 자리를 만든다. 오른쪽 LED 월은 살린다 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(5,8,12,0.94) 0%, rgba(5,8,12,0.86) 38%, rgba(5,8,12,0.42) 66%, rgba(5,8,12,0.18) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(5,8,12,0.35) 0%, rgba(5,8,12,0) 30%, rgba(5,8,12,0) 70%, rgba(5,8,12,0.55) 100%)',
          }}
        />

        {/* 내용 */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '56px 72px 52px',
          }}
        >
          {/* 상단: 로고 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="" width={86} height={72} style={{ width: 86, height: 72 }} />
            ) : (
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em' }}>{SITE.nameKo}</div>
            )}
          </div>

          {/* 중단: 슬로건 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                color: ORANGE,
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: '0.22em',
              }}
            >
              <div style={{ width: 36, height: 3, background: ORANGE }} />
              LED 전광판 · 전자현수막
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 18, fontSize: 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.035em' }}>
              <div>BEYOND</div>
              <div>THE DISPLAY</div>
            </div>
            <div style={{ marginTop: 26, fontSize: 30, fontWeight: 800, color: '#E8EBEF', letterSpacing: '-0.01em' }}>
              설계부터 유지보수까지, 우강테크가 책임집니다.
            </div>
          </div>

          {/* 하단: 회사명 · 도메인 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 22, color: '#B7BEC7' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <span style={{ color: 'white', fontWeight: 800 }}>{SITE.nameKo}</span>
              <span>{SITE.nameEn}</span>
            </div>
            <div style={{ letterSpacing: '0.04em' }}>wooktech.co.kr</div>
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
