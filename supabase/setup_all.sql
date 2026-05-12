-- ============================================================
-- LCD PRO — Initial Schema
-- MVP 1~4 전체 커버
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- 텍스트 검색

-- ============================================================
-- ENUMS
-- ============================================================

create type customer_type as enum (
  'cafe', 'restaurant', 'bar', 'hospital', 'academy',
  'gym', 'franchise', 'school', 'government', 'factory', 'other'
);

create type environment as enum ('indoor', 'outdoor');

create type sku_code as enum (
  'IN-S', 'IN-M', 'OUT-S', 'OUT-M', 'OUT-L', 'P2.5'
);

create type package_tier as enum ('basic', 'standard', 'premium', 'rental');

create type quote_status as enum (
  'pending',      -- 고객 요청 접수
  'reviewing',    -- 관리자 검토 중
  'estimated',    -- 범위 견적 발송
  'site_check',   -- 현장 실사 예정
  'confirmed',    -- 최종 견적 확정
  'contracted',   -- 계약 완료
  'rejected',     -- 거절/취소
  'expired'       -- 만료
);

create type project_status as enum (
  'deposit_pending',  -- 계약금 대기
  'materials_order',  -- 자재 발주
  'scheduled',        -- 설치 일정 확정
  'in_progress',      -- 설치 진행
  'completed',        -- 설치 완료
  'as_warranty'       -- AS 기간
);

create type subscription_status as enum (
  'active', 'paused', 'cancelled', 'expired'
);

create type device_status as enum (
  'online', 'offline', 'error', 'maintenance'
);

create type installer_status as enum (
  'active', 'inactive', 'suspended'
);

create type urgency_level as enum ('low', 'normal', 'high', 'urgent');

-- ============================================================
-- CORE TABLES
-- ============================================================

-- 고객
create table customers (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  name          text not null,
  phone         text not null,
  email         text,
  business_name text,
  business_type customer_type not null,
  region        text not null,          -- 시/도
  address       text,

  kakao_id      text,                   -- 카카오 채널 연동
  referral_source text,                 -- 유입 경로
  notes         text
);

-- SKU 제품 카탈로그
create table products (
  id            uuid primary key default uuid_generate_v4(),
  sku           sku_code not null unique,
  display_name  text not null,          -- 고객 노출 이름
  pitch         text not null,          -- ex: P3, P4, P5, P6
  environment   environment not null,
  width_mm      int,
  height_mm     int,
  resolution    text,
  brightness_nit int,

  base_price_krw    int not null,       -- 모듈 기준가 (원)
  install_price_krw int not null,       -- 설치 기준가
  monthly_cms_krw   int not null,       -- CMS 월 구독료

  is_active     boolean not null default true,
  sort_order    int not null default 0,
  spec_doc_url  text                    -- 스펙시트 PDF
);

-- 패키지 구성
create table packages (
  id            uuid primary key default uuid_generate_v4(),
  tier          package_tier not null unique,
  display_name  text not null,
  description   text,

  includes_cms        boolean not null default false,
  includes_warranty   int not null default 0,  -- 개월
  includes_spare_parts boolean not null default false,
  includes_monthly_check boolean not null default false,
  includes_emergency  boolean not null default false,
  includes_content_setup boolean not null default false,

  price_multiplier numeric(4,2) not null default 1.00,
  is_active       boolean not null default true
);

-- 견적 요청
create table quotes (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  customer_id   uuid not null references customers(id),
  status        quote_status not null default 'pending',

  -- 고객 입력값
  environment   environment not null,
  desired_width_mm  int,
  desired_height_mm int,
  viewing_distance_m numeric(5,1),
  purpose       text,
  budget_krw    int,
  urgency       urgency_level not null default 'normal',
  additional_notes text,

  -- 시스템 추천
  recommended_sku sku_code,
  recommended_package package_tier,

  -- 범위 견적 (고객 노출)
  estimate_min_krw  int,
  estimate_max_krw  int,
  estimate_disclaimer text default '최종 금액은 현장 실사(전기·구조·허가) 후 확정됩니다.',

  -- 내부 관리
  internal_cost_krw     int,           -- 원가
  target_margin_pct     numeric(5,2),  -- 목표 마진율
  admin_notes           text,
  assigned_admin_id     uuid references auth.users(id),

  -- 추적
  site_check_date   date,
  expired_at        timestamptz,
  contracted_at     timestamptz
);

-- 견적 첨부 사진
create table quote_photos (
  id          uuid primary key default uuid_generate_v4(),
  created_at  timestamptz not null default now(),
  quote_id    uuid not null references quotes(id) on delete cascade,
  storage_path text not null,          -- Supabase Storage 경로
  file_name   text not null,
  sort_order  int not null default 0
);

-- 견적 항목 (SKU 상세)
create table quote_items (
  id          uuid primary key default uuid_generate_v4(),
  quote_id    uuid not null references quotes(id) on delete cascade,
  product_id  uuid not null references products(id),
  package_id  uuid not null references packages(id),

  quantity    int not null default 1,
  width_mm    int not null,
  height_mm   int not null,

  unit_price_krw      int not null,
  install_price_krw   int not null,
  monthly_cms_krw     int not null,
  discount_pct        numeric(5,2) not null default 0,

  notes       text
);

-- 설치 파트너 (인스톨러)
create table installers (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),

  company_name  text not null,
  contact_name  text not null,
  phone         text not null,
  email         text,
  regions       text[] not null,       -- 담당 지역
  specialties   text[],                -- 특기 (옥외, 실내, 대형 등)

  status        installer_status not null default 'active',
  rating        numeric(3,2),          -- 평균 평점
  completed_projects int not null default 0,

  bank_account  text,                  -- 정산 계좌
  business_reg_no text,               -- 사업자번호
  notes         text
);

-- 설치 프로젝트
create table projects (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  quote_id      uuid not null unique references quotes(id),
  customer_id   uuid not null references customers(id),
  status        project_status not null default 'deposit_pending',

  installer_id  uuid references installers(id),

  -- 일정
  scheduled_date    date,
  completed_date    date,

  -- 현장 정보
  site_address      text not null,
  electrical_ok     boolean,
  network_ok        boolean,
  permit_required   boolean,
  permit_status     text,

  -- 자재
  materials_ordered_at timestamptz,
  supplier_name     text,

  -- 정산
  deposit_paid_at   timestamptz,
  deposit_amount_krw int,
  final_payment_at  timestamptz,
  final_amount_krw  int,
  installer_fee_krw int,

  completion_photos text[],            -- 완료 사진 Storage 경로
  checklist         jsonb,             -- 설치 체크리스트
  as_reserve_krw    int,              -- AS 예비비
  notes             text
);

-- 구독
create table subscriptions (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),

  customer_id   uuid not null references customers(id),
  project_id    uuid not null references projects(id),
  package_tier  package_tier not null,
  status        subscription_status not null default 'active',

  monthly_fee_krw   int not null,
  billing_day       int not null default 1,   -- 매월 청구일
  started_at        date not null,
  expires_at        date,                      -- null = 자동 갱신
  cancelled_at      timestamptz,

  toss_billing_key  text,                     -- Toss 자동결제 빌링키
  last_billed_at    timestamptz,
  next_billing_at   timestamptz
);

-- 디바이스 (설치된 LED 패널)
create table devices (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),

  project_id    uuid not null references projects(id),
  subscription_id uuid references subscriptions(id),

  device_code   text not null unique,  -- 관리 코드 (ex: DEV-2024-001)
  product_id    uuid not null references products(id),

  status        device_status not null default 'offline',
  last_seen_at  timestamptz,
  ip_address    inet,

  location_name text,                  -- ex: "1층 입구", "매장 정면"
  timezone      text not null default 'Asia/Seoul',

  firmware_version text,
  health_score  int                    -- 0~100
);

-- CMS 콘텐츠
create table content_items (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),

  customer_id   uuid not null references customers(id),
  title         text not null,
  file_type     text not null,         -- image, video, html
  storage_path  text not null,
  duration_sec  int,                   -- 재생 시간 (초)
  file_size_bytes bigint,
  thumbnail_path text,
  is_active     boolean not null default true
);

-- 재생 플레이리스트
create table playlists (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  device_id     uuid not null references devices(id),
  name          text not null,

  schedule_start time,
  schedule_end   time,
  repeat_days    int[],               -- 0=일 1=월 ... 6=토
  is_active     boolean not null default true,
  priority      int not null default 0
);

-- 플레이리스트 항목
create table playlist_items (
  id            uuid primary key default uuid_generate_v4(),
  playlist_id   uuid not null references playlists(id) on delete cascade,
  content_id    uuid not null references content_items(id),
  sort_order    int not null default 0,
  duration_sec  int                   -- 오버라이드 (null = 기본값 사용)
);

-- AS / 유지보수 이력
create table maintenance_records (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),

  project_id    uuid not null references projects(id),
  device_id     uuid references devices(id),
  installer_id  uuid references installers(id),

  record_type   text not null,        -- 'inspection', 'repair', 'emergency', 'remote_fix'
  description   text not null,
  resolution    text,

  cost_krw      int not null default 0,
  covered_by_subscription boolean not null default false,

  completed_at  timestamptz,
  photos        text[]
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_quotes_customer on quotes(customer_id);
create index idx_quotes_status on quotes(status);
create index idx_projects_customer on projects(customer_id);
create index idx_projects_status on projects(status);
create index idx_devices_project on devices(project_id);
create index idx_devices_status on devices(status);
create index idx_subscriptions_customer on subscriptions(customer_id);
create index idx_content_customer on content_items(customer_id);
create index idx_playlists_device on playlists(device_id);
create index idx_maintenance_project on maintenance_records(project_id);
create index idx_customers_phone on customers(phone);

-- ============================================================
-- UPDATED_AT 자동 갱신 트리거
-- ============================================================

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_customers_updated before update on customers
  for each row execute function update_updated_at();

create trigger trg_quotes_updated before update on quotes
  for each row execute function update_updated_at();

create trigger trg_projects_updated before update on projects
  for each row execute function update_updated_at();

create trigger trg_playlists_updated before update on playlists
  for each row execute function update_updated_at();

-- ============================================================
-- SEED: SKU 기본 데이터
-- ============================================================

-- 단가 기준: 시장 조사 반영 (2024년 국내 기준)
-- P3 실내 ~350만/m², P4/P5 옥외 ~200~300만/m² (도매가 기준 55~60% 마진)
-- base_price = 패널 단가 (표준 크기 기준), install_price = 설치 노무+자재
insert into products (sku, display_name, pitch, environment, brightness_nit,
  base_price_krw, install_price_krw, monthly_cms_krw, sort_order) values
('IN-S',  '실내 소형 메뉴판',        'P3',  'indoor',  800,  1500000, 500000, 29000, 1),
('IN-M',  '실내 중형 홍보 전광판',    'P3',  'indoor',  1000, 2800000, 700000, 49000, 2),
('OUT-S', '옥외 소형 입구 전광판',    'P4',  'outdoor', 5000, 2200000, 800000, 49000, 3),
('OUT-M', '옥외 중형 광고 전광판',    'P5',  'outdoor', 6000, 4200000, 1400000, 79000, 4),
('OUT-L', '옥외 대형 빌딩 전광판',    'P6',  'outdoor', 7000, 7500000, 3000000, 99000, 5),
('P2.5',  '고해상도 실내 프리미엄',   'P2.5','indoor',  1200, 4000000, 1000000, 69000, 6);

insert into packages (tier, display_name, description,
  includes_cms, includes_warranty, includes_spare_parts,
  includes_monthly_check, includes_emergency, includes_content_setup,
  price_multiplier) values
('basic',    '베이직',  '하드웨어 + 설치',                        false, 0,  false, false, false, false, 1.00),
('standard', '스탠다드', '베이직 + CMS + 원격관리 + 1년 보증',    true,  12, false, false, false, true,  1.25),
('premium',  '프리미엄', '스탠다드 + 예비 부품 + 월 점검 + 긴급AS', true, 24, true,  true,  true,  true,  1.55),
('rental',   '렌탈',    '임시 설치 + 철거 포함 (이벤트용)',       true,  0,  false, false, false, false, 0.15);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table customers enable row level security;
alter table quotes enable row level security;
alter table quote_photos enable row level security;
alter table quote_items enable row level security;
alter table projects enable row level security;
alter table subscriptions enable row level security;
alter table devices enable row level security;
alter table content_items enable row level security;
alter table playlists enable row level security;
alter table playlist_items enable row level security;
alter table maintenance_records enable row level security;

-- 관리자는 전체 접근 (서비스 롤 사용)
-- 고객은 본인 데이터만 접근
create policy "customers_own_data" on customers
  for all using (auth.uid() = id);

create policy "quotes_own_data" on quotes
  for all using (
    customer_id in (select id from customers where auth.uid() = id)
  );

create policy "content_own_data" on content_items
  for all using (
    customer_id in (select id from customers where auth.uid() = id)
  );
-- ============================================================
-- LCD PRO — Storage 버킷 + RLS 설정
-- service_role key가 RLS를 우회하므로
-- 서버 전용 업로드 구성 (client 직접 접근 불가)
-- ============================================================

-- quote-photos 버킷 생성 (없으면 생성, 있으면 업데이트)
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'quote-photos',
  'quote-photos',
  false,              -- private (직접 URL 접근 불가)
  20971520,           -- 20MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update
set
  public = false,
  file_size_limit = 20971520,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

-- storage.objects RLS는 Supabase가 기본 활성화 — 별도 alter 불필요

-- 기존 정책 제거 후 재생성
drop policy if exists "quote_photos_server_only" on storage.objects;

-- anon/authenticated 모두 직접 접근 불가
-- service_role만 접근 가능 (API route에서 사용)
-- SELECT 정책 없음 = 외부에서 읽기 불가
-- INSERT 정책 없음 = 외부에서 쓰기 불가
-- → service_role이 RLS 우회하므로 서버 코드만 동작함

-- ============================================================
-- 관리자 전용 조회 정책 (admin 앱 구축 시 활성화)
-- ============================================================
-- create policy "admin_can_read_quote_photos"
-- on storage.objects for select
-- to authenticated
-- using (
--   bucket_id = 'quote-photos'
--   and exists (
--     select 1 from auth.users
--     where id = auth.uid()
--     and raw_user_meta_data->>'role' = 'admin'
--   )
-- );
