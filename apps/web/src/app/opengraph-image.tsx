/**
 * 동적 OG 이미지 (홈)
 * 다른 페이지·블로그도 같은 패턴 재사용 가능.
 */
import { ImageResponse } from 'next/og'
import { SITE } from '@/lib/seo/site'

/**
 * 🔴 edge 런타임을 유지해야 한다. 바꾸지 마라 (2026-09-08 실측).
 *
 * Node 런타임으로 내리면 `next/og` 가 **Windows 에서 통째로 깨진다.**
 * `@vercel/og/index.node.js` 가 폰트·wasm 을 이렇게 읽는다:
 *     fileURLToPath(join(import.meta.url, '../noto-sans-....ttf'))
 * `path.join` 은 Windows 에서 구분자를 역슬래시로 바꾸므로 `file:///D:/...` 가
 * `file:\D:\...` 가 되고, 더 이상 URL 이 아니라 `TypeError: Invalid URL` 로 죽는다.
 * 라이브러리 버그이고 우리 코드로는 못 고친다. 그래서 edge 로 둔다.
 *
 * edge 로 두면 이번엔 빌드가 "Collecting page data" 에서 `.next/prerender-manifest.js`
 * 를 못 찾아 죽는데, 그건 next.config.mjs 의 `PrerenderManifestStub` 이 막는다.
 */
export const runtime = 'edge'
export const alt = `${SITE.nameKo} ${SITE.nameEn} — LED 사이니지 B2B 플랫폼`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(135deg, #050505 0%, #1b0d04 50%, #0a0a0a 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '20px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              fontSize: '96px',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              backgroundImage: 'linear-gradient(90deg, #DE671D, #F0913F)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {SITE.nameKo}
          </div>
          <div style={{ fontSize: '44px', color: '#a1a1aa', fontWeight: 500 }}>
            {SITE.nameEn}
          </div>
        </div>
        <div style={{ fontSize: '40px', color: '#e4e4e7', fontWeight: 600, marginBottom: '20px' }}>
          LED 사이니지 B2B 플랫폼
        </div>
        <div style={{ fontSize: '28px', color: '#a1a1aa', maxWidth: '900px', lineHeight: 1.4 }}>
          설계 · 제작 · 시공 · 유지보수를 한 창구에서
        </div>
        <div
          style={{
            marginTop: '40px',
            fontSize: '22px',
            color: '#71717a',
            fontStyle: 'italic',
            maxWidth: '900px',
          }}
        >
          {SITE.sloganEn}
        </div>
      </div>
    ),
    { ...size },
  )
}
