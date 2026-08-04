/**
 * 중앙 기능 플래그 (MVP 다운그레이드)
 *
 * 전부 default OFF = 외부 서비스 0으로 동작하는 MVP 모드.
 * 켜는 방법 / 복원 절차는 apps/web/FEATURES.md, apps/web/.env.example 참고.
 *
 * 확장 여지: 새 외부 의존 기능을 추가하면 여기 플래그 한 줄 추가 → 분기에서만 사용.
 */
export const features = {
  /**
   * Supabase: 견적 저장·고객 upsert·사진 업로드 (NEXT_PUBLIC_FEAT_QUOTE_PERSISTENCE=off 로 끔)
   * 기본 ON(opt-out). default OFF 시절 고객 리드가 100% 소실됐다 — 저장 시도가 기본이어야 한다.
   * Supabase env가 없어도 안전: 저장 실패는 route에서 잡아 리드 원문을 로그로 떨어뜨린다.
   */
  quotePersistence: process.env.NEXT_PUBLIC_FEAT_QUOTE_PERSISTENCE !== 'off',
  /** 카카오 알림톡 / 알리고 SMS / Slack 알림 (FEAT_NOTIFICATIONS=on) */
  notifications: process.env.FEAT_NOTIFICATIONS === 'on',
  /** 구독·결제 (Toss) — subscribe/account 페이지, billing API (NEXT_PUBLIC_FEAT_BILLING=on) */
  billing: process.env.NEXT_PUBLIC_FEAT_BILLING === 'on',
} as const

export type FeatureFlags = typeof features
