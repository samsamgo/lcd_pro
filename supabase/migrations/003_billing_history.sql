-- 결제 이력 — Toss 웹훅/직접 결제 결과 멱등 보존
-- 멱등키: payment_key UNIQUE (같은 paymentKey가 두 번 INSERT 되면 충돌)

create table if not exists billing_history (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),

  subscription_id uuid references subscriptions(id),
  customer_id     uuid not null references customers(id),

  payment_key   text not null unique,             -- Toss paymentKey (멱등키)
  order_id      text not null,                    -- 우리 주문 ID
  amount_krw    int not null,
  status        text not null,                    -- DONE | CANCELED | PARTIAL_CANCELED | ABORTED | EXPIRED
  method        text,
  approved_at   timestamptz,
  canceled_at   timestamptz,

  raw_payload   jsonb not null,                   -- 원본 페이로드 보존 (감사/디버깅)
  webhook_received_at timestamptz                 -- 웹훅으로 들어온 경우만 기록
);

create index if not exists idx_billing_history_subscription on billing_history(subscription_id);
create index if not exists idx_billing_history_status on billing_history(status);
create index if not exists idx_billing_history_created on billing_history(created_at desc);

-- RLS — 클라이언트 접근 금지 (service_role만)
alter table billing_history enable row level security;
-- 정책 없음 = 모든 anon/authenticated 접근 차단. service_role은 RLS 우회.
