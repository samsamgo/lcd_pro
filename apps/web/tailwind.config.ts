import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eff6ff',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
        /**
         * 우강테크 UI 팔레트.
         * 출처: COO/reports/codex/토스-UI-분석.md (TDS 실측)
         * - 파랑은 '동작 가능한 요소'에만. 장식에 쓰지 않는다.
         * - 본문에 순수 검정(#000)을 쓰지 않는다. ink 계열을 쓴다.
         */
        wk: {
          blue: '#3182F6',       // 기본 UI 파랑 (CTA 기준)
          blueHover: '#2272EB',
          blueActive: '#1B64DA',
          blueWeak: '#E8F3FF',   // 2차 버튼 색면
          ink: '#191F28',        // 1차 텍스트
          ink2: '#4E5968',       // 강조 본문
          ink3: '#6B7684',       // 설명 본문
          ink4: '#8B95A1',       // 캡션·메타
          disabled: '#B0B8C1',
          line: '#E5E8EB',       // 구분선
          line2: '#D1D6DB',
          bg: '#F2F4F6',         // 회색 섹션 배경
          bgFaint: '#F9FAFB',
          ok: '#03B26C',
          warn: '#FE9800',
          bad: '#F04452',
          /** 로고 전용 — UI 버튼에 쓰지 않는다 (자료/우강테그 로코.svg 실측) */
          logo: '#de671d',
          logoInk: '#03111f',
          logoGrey: '#6c7073',
        },
      },
      borderRadius: {
        btn: '12px',      // 데스크톱 버튼
        'btn-m': '16px',  // 모바일 버튼
        card: '20px',
        'card-m': '16px',
      },
      spacing: {
        sec: '96px',
        'sec-lg': '120px',
        'sec-m': '72px',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
