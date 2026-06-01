/**
 * 동적 OG 이미지 (홈)
 * 다른 페이지·블로그도 같은 패턴 재사용 가능.
 */
import { ImageResponse } from 'next/og'
import { SITE } from '@/lib/seo/site'

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
            'linear-gradient(135deg, #050505 0%, #0a1428 50%, #0a0a0a 100%)',
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
              backgroundImage: 'linear-gradient(90deg, #60a5fa, #22d3ee)',
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
          사진 3장 → 30분 견적 → 표준화 시공 → CMS 구독
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
