import { MIN_MARGIN_PCT, AS_RESERVE_PCT, MAX_MARGIN_PCT } from '../../../../web/src/lib/pricing'

export const revalidate = 0

function flag(present: boolean) {
  return present ? (
    <span className="badge bg-emerald-500/20 text-emerald-300">설정됨</span>
  ) : (
    <span className="badge bg-red-500/20 text-red-300">누락</span>
  )
}

export default function SettingsPage() {
  // 서버 측에서만 환경변수 존재 여부 확인 (값 노출 금지)
  const env = {
    SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY,
    TOSS_SECRET_KEY: !!process.env.TOSS_SECRET_KEY,
    TOSS_CLIENT_KEY: !!process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY,
    CRON_SECRET: !!process.env.CRON_SECRET,
    TOSS_WEBHOOK_SECRET: !!process.env.TOSS_WEBHOOK_SECRET,
  }

  const tossMode = (process.env.TOSS_SECRET_KEY ?? '').startsWith('test_')
    ? 'TEST'
    : (process.env.TOSS_SECRET_KEY ?? '').startsWith('live_')
      ? 'LIVE'
      : 'UNSET'

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">설정</h1>
        <p className="mt-1 text-sm text-zinc-500">운영 환경 상태 + 비즈니스 규칙</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="환경변수">
          <Row label="NEXT_PUBLIC_SUPABASE_URL" value={flag(env.SUPABASE_URL)} />
          <Row label="SUPABASE_SERVICE_KEY" value={flag(env.SUPABASE_SERVICE_KEY)} />
          <Row label="TOSS_SECRET_KEY" value={flag(env.TOSS_SECRET_KEY)} />
          <Row label="NEXT_PUBLIC_TOSS_CLIENT_KEY" value={flag(env.TOSS_CLIENT_KEY)} />
          <Row label="CRON_SECRET" value={flag(env.CRON_SECRET)} />
          <Row label="TOSS_WEBHOOK_SECRET (옵셔널)" value={flag(env.TOSS_WEBHOOK_SECRET)} />
        </Card>

        <Card title="Toss 결제 모드">
          <Row
            label="현재 모드"
            value={
              <span
                className={`badge ${
                  tossMode === 'LIVE'
                    ? 'bg-red-500/20 text-red-300'
                    : tossMode === 'TEST'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-zinc-700/40 text-zinc-400'
                }`}
              >
                {tossMode}
              </span>
            }
          />
          <p className="text-xs text-zinc-500">
            LIVE 모드는 별도 MID 계약 승인 후에만 사용. orderId 컨벤션:{' '}
            <code className="text-zinc-300">sub_{'<subscriptionId>'}_{'<yyyymm>'}</code>
          </p>
        </Card>

        <Card title="비즈니스 규칙 (하드코딩)">
          <Row label="최소 마진" value={<code className="text-zinc-200">{(MIN_MARGIN_PCT * 100).toFixed(0)}%</code>} />
          <Row label="최대 마진 (상한)" value={<code className="text-zinc-200">{(MAX_MARGIN_PCT * 100).toFixed(0)}%</code>} />
          <Row label="AS 충당금" value={<code className="text-zinc-200">{(AS_RESERVE_PCT * 100).toFixed(0)}%</code>} />
          <Row label="계약금" value={<code className="text-zinc-200">50%</code>} />
          <p className="text-xs text-zinc-500">
            절대 원칙은 코드에 하드코딩 (`apps/web/src/lib/pricing.ts`). 변경은 CEO 결재 사항.
          </p>
        </Card>

        <Card title="운영 메모">
          <ul className="space-y-1 text-xs text-zinc-400">
            <li>· Supabase 마이그레이션 4건 (001~004) 운영 DB 반영 확인 필요</li>
            <li>· 알림톡 BizTalk 콘솔 템플릿 등록은 외부 작업</li>
            <li>· types.gen.ts 재생성 시 billing_history + toss_customer_key 포함 확인</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-xl p-5">
      <h2 className="mb-3 text-sm font-semibold text-zinc-200">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-zinc-500">{label}</span>
      <span>{value}</span>
    </div>
  )
}
