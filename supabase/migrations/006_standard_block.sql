-- 006_standard_block.sql
-- 표준 블록 아키텍처 — STANDARD-LAYOUT-MATRIX-20260519 반영
-- 견적 record 에 family_code / layout_code / BOM·분류 컬럼 추가.
-- 기존 sku_code 컬럼은 호환을 위해 유지 (recommended_sku NULL 허용).

-- 1) family / classification enums
do $$ begin
  create type family_code as enum ('F-IN-P3', 'F-IN-P2.5', 'F-OUT-P5');
exception when duplicate_object then null; end $$;

do $$ begin
  create type quote_classification as enum (
    'STANDARD_LAYOUT', 'STANDARD_ZONE', 'ENGINEERING_CUSTOM'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type controller_model as enum ('TB30', 'TB50', 'TB60');
exception when duplicate_object then null; end $$;

-- 2) quotes 테이블 확장
alter table quotes
  add column if not exists family_code                 family_code,
  add column if not exists layout_code                 text,
  add column if not exists classification              quote_classification,
  add column if not exists classification_reasons      text[],
  add column if not exists cabinet_count               int,
  add column if not exists module_count                int,
  add column if not exists spare_modules               int,
  add column if not exists screen_px_w                 int,
  add column if not exists screen_px_h                 int,
  add column if not exists total_px                    bigint,
  add column if not exists controller_model            controller_model,
  add column if not exists controller_count            int,
  add column if not exists lan_ports_used              int,
  add column if not exists receiving_card_count        int,
  add column if not exists smps_count                  int,
  add column if not exists area_m2                     numeric(7,2),
  add column if not exists peak_power_w                int,
  add column if not exists circuit_count               int,
  add column if not exists needs_rack                  boolean,
  add column if not exists needs_cooling_review        boolean,
  add column if not exists standard_width_mm           int,
  add column if not exists standard_height_mm          int,
  add column if not exists zone_count                  int;

-- 3) 인덱스 (admin filter)
create index if not exists idx_quotes_classification on quotes (classification);
create index if not exists idx_quotes_family_layout  on quotes (family_code, layout_code);

-- 4) 코멘트
comment on column quotes.family_code      is '표준 제품군 — F-IN-P3 / F-IN-P2.5 / F-OUT-P5';
comment on column quotes.layout_code      is '표준 레이아웃 코드 (A-2x1 ~ A-10x5) 또는 ZONE-A x N';
comment on column quotes.classification   is 'STANDARD_LAYOUT (80~90%) / STANDARD_ZONE (5~10%) / ENGINEERING_CUSTOM (10~20%)';
comment on column quotes.lan_ports_used   is 'NovaStar 컨트롤러 LAN 포트 사용 수 (CANDIDATE — RFQ B-Q2 검증 대기)';
