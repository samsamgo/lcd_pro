-- 고객 등급 (T0~T4) 자동 부여 — 06-customer-cs/workspace/customer-tiering.md 기반
--
-- 등급 정의:
--   T0_lead       : 견적 신청만, 결제 이력 없음
--   T1_one_shot   : 단발 설치 (project 1+ 또는 contracted quote 1+, 활성 구독 없음)
--   T2_sub_lite   : 활성 구독 1+ (월 요금 < 90k 추정 = Lite)
--   T3_sub_pro    : 활성 구독 1+ (월 요금 ≥ 90k = Pro)
--   T4_vip        : 매장 3+ 또는 누적 결제 500만원 이상

create type customer_tier as enum (
  'T0_lead', 'T1_one_shot', 'T2_sub_lite', 'T3_sub_pro', 'T4_vip'
);

alter table customers
  add column if not exists tier customer_tier not null default 'T0_lead',
  add column if not exists tier_updated_at timestamptz not null default now();

create index if not exists idx_customers_tier on customers(tier);

-- 자동 승급 함수
create or replace function recompute_customer_tier(p_customer_id uuid)
returns customer_tier
language plpgsql
security definer
as $$
declare
  v_project_count int := 0;
  v_active_sub_max_fee int := 0;
  v_active_sub_count int := 0;
  v_billing_total int := 0;
  v_new_tier customer_tier;
begin
  -- 매장(프로젝트) 수
  select count(*) into v_project_count
  from projects
  where customer_id = p_customer_id;

  -- 활성 구독 최대 요금 + 활성 구독 수
  select coalesce(max(monthly_fee_krw), 0), count(*)
    into v_active_sub_max_fee, v_active_sub_count
  from subscriptions
  where customer_id = p_customer_id and status = 'active';

  -- 누적 결제 (DONE 만 합산)
  select coalesce(sum(amount_krw), 0) into v_billing_total
  from billing_history
  where customer_id = p_customer_id and status = 'DONE';

  -- 분류 (우선순위 높은 것부터)
  if v_project_count >= 3 or v_billing_total >= 5000000 then
    v_new_tier := 'T4_vip';
  elsif v_active_sub_count > 0 and v_active_sub_max_fee >= 90000 then
    v_new_tier := 'T3_sub_pro';
  elsif v_active_sub_count > 0 then
    v_new_tier := 'T2_sub_lite';
  elsif v_project_count > 0 then
    v_new_tier := 'T1_one_shot';
  else
    v_new_tier := 'T0_lead';
  end if;

  update customers
  set tier = v_new_tier,
      tier_updated_at = now()
  where id = p_customer_id;

  return v_new_tier;
end;
$$;

-- 트리거: project/subscription/billing 변경 시 자동 재계산
create or replace function _trg_recompute_tier_proj()
returns trigger language plpgsql as $$
begin
  perform recompute_customer_tier(coalesce(new.customer_id, old.customer_id));
  return new;
end $$;

create or replace function _trg_recompute_tier_sub()
returns trigger language plpgsql as $$
begin
  perform recompute_customer_tier(coalesce(new.customer_id, old.customer_id));
  return new;
end $$;

create or replace function _trg_recompute_tier_billing()
returns trigger language plpgsql as $$
begin
  if new.customer_id is not null then
    perform recompute_customer_tier(new.customer_id);
  end if;
  return new;
end $$;

drop trigger if exists trg_customer_tier_proj on projects;
create trigger trg_customer_tier_proj
  after insert or update or delete on projects
  for each row execute function _trg_recompute_tier_proj();

drop trigger if exists trg_customer_tier_sub on subscriptions;
create trigger trg_customer_tier_sub
  after insert or update or delete on subscriptions
  for each row execute function _trg_recompute_tier_sub();

drop trigger if exists trg_customer_tier_billing on billing_history;
create trigger trg_customer_tier_billing
  after insert or update on billing_history
  for each row execute function _trg_recompute_tier_billing();

-- 기존 고객 일괄 재계산
do $$
declare r record;
begin
  for r in select id from customers loop
    perform recompute_customer_tier(r.id);
  end loop;
end $$;
