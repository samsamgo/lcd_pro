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
          /** 시네마틱 다크 섹션 전용 — 순수 #000은 화면에서 구멍처럼 보인다 */
          night: '#0B0B0F',      // 다크 섹션 바닥 (#000은 카드와 경계를 만들 여지가 없다)
          night2: '#111218',     // 다크 섹션 보조면
          nightCard: '#171922',  // 다크 위 카드
          nightInk: '#F5F7FA',   // 다크 위 1차 텍스트 (18.3:1)
          nightMuted: '#A8B0BD', // 다크 위 설명 텍스트 (8.99:1)
          /** 흰 글자 CTA 전용 — #3182F6은 흰 글자와 3.71:1 로 AA 미달이다 */
          cta: '#1B64DA',        // 5.41:1
          ctaHover: '#1957C2',
          ctaActive: '#194AA6',
          ink2: '#4E5968',       // 강조 본문
          ink3: '#66707D',       // 설명 본문 (흰 5.03 / #F9FAFB 4.81 / #F2F4F6 4.56)
          /** ⚠️ 다크 표면 전용. 흰 배경 3.04:1 로 WCAG AA 미달이라 라이트 배경 텍스트에 쓰지 말 것 */
          ink4: '#8B95A1',
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
      /**
       * 유동형 타입 스케일 — 375px→1440px 선형 보간.
       * 한글은 영문보다 글자 상자가 커서 같은 행간이면 답답하다.
       * 그래서 행간은 영문 기준 +0.08~0.10, tracking 음수는 영문의 절반만 준다.
       * 출처: COO/research/web-benchmark-2026.md §1.2
       */
      fontSize: {
        'display-hero': ['clamp(2.75rem, 1.606rem + 4.883vw, 6rem)', { lineHeight: '1.13', letterSpacing: '-0.025em' }],
        'display-xl': ['clamp(2.25rem, 1.458rem + 3.380vw, 4.5rem)', { lineHeight: '1.16', letterSpacing: '-0.02em' }],
        h1: ['clamp(2rem, 1.296rem + 3.005vw, 4rem)', { lineHeight: '1.18', letterSpacing: '-0.018em' }],
        h2: ['clamp(1.75rem, 1.310rem + 1.878vw, 3rem)', { lineHeight: '1.24', letterSpacing: '-0.014em' }],
        h3: ['clamp(1.5rem, 1.236rem + 1.127vw, 2.25rem)', { lineHeight: '1.30', letterSpacing: '-0.01em' }],
        lead: ['clamp(1.25rem, 1.162rem + 0.376vw, 1.5rem)', { lineHeight: '1.62', letterSpacing: '-0.006em' }],
        'body-lg': ['clamp(1.0625rem, 0.996rem + 0.282vw, 1.25rem)', { lineHeight: '1.68' }],
        body: ['clamp(1rem, 0.956rem + 0.188vw, 1.125rem)', { lineHeight: '1.68' }],
        label: ['clamp(0.875rem, 0.853rem + 0.094vw, 0.9375rem)', { lineHeight: '1.5' }],
        caption: ['clamp(0.75rem, 0.728rem + 0.094vw, 0.8125rem)', { lineHeight: '1.55', letterSpacing: '0.015em' }],
      },
      borderRadius: {
        btn: '12px',      // 데스크톱 버튼
        'btn-m': '16px',  // 모바일 버튼
        card: '20px',
        'card-m': '16px',
        surface: '28px',  // 대형 이미지·시네마틱 카드
      },
      spacing: {
        sec: '96px',
        'sec-lg': '120px',
        'sec-m': '72px',
      },
      /**
       * 모션 토큰 — 사이트 전체가 이 4개 곡선만 쓴다.
       * 곡선이 섞이면 아무리 잘 만들어도 "템플릿" 냄새가 난다.
       */
      transitionTimingFunction: {
        entrance: 'cubic-bezier(0.16, 1, 0.3, 1)',   // 등장 (out-expo)
        state: 'cubic-bezier(0.4, 0, 0.2, 1)',        // hover/press 상태
        scrub: 'cubic-bezier(0.83, 0, 0.17, 1)',      // 스크롤 스크럽
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',  // 강조 팝
      },
      transitionDuration: {
        state: '150ms',
        enter: '600ms',
        cine: '900ms',
        image: '1200ms',
      },
      boxShadow: {
        /** 그림자 계층은 3단까지만. 그 이상은 지저분해진다. */
        'wk-1': '0 1px 2px rgba(15,23,42,.04)',
        'wk-2': '0 1px 2px rgba(15,23,42,.06), 0 8px 30px rgba(15,23,42,.08)',
        'wk-3': '0 24px 80px rgba(0,0,0,.24)',
        'wk-glow': '0 0 0 1px rgba(49,130,246,.16), 0 24px 80px -32px rgba(49,130,246,.55)',
      },
      keyframes: {
        'wk-marquee': {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-50%,0,0)' },
        },
        'wk-scan': {
          '0%,100%': { opacity: '0.06' },
          '50%': { opacity: '0.14' },
        },
        'wk-rise': {
          from: { opacity: '0', transform: 'translate3d(0,14px,0)' },
          to: { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        marquee: 'wk-marquee 38s linear infinite',
        'marquee-fast': 'wk-marquee 22s linear infinite',
        scan: 'wk-scan 4s ease-in-out infinite',
        rise: 'wk-rise 600ms cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
}

export default config
