-- 008_leads.sql — 고객 문의(빠른 상담 · A/S 접수 · 회사소개 문의) 저장
-- 2026-09-09 CEO 지시 "고객 문의 사항들은 데이터로 저장되어야 한다".
-- 그동안 /api/lead 는 카카오워크 알림만 보내고 DB 에 남기지 않았다(견적 /api/quotes 만 quotes 테이블 저장).
-- 🔴 적용: Supabase 대시보드 → SQL Editor 에 이 파일을 붙여 넣고 실행한다(CLI 링크 없음).

create table if not exists leads (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),

  kind          text not null,             -- 'consult' | 'as'
  source        text,                      -- quick-consult | navbar | mobile-bar | product-* | about-contact | as-request
  business_name text,
  contact_name  text,
  phone         text not null,
  region        text,
  environment   text,                      -- 'indoor' | 'outdoor'
  urgency       text,                      -- 'low' | 'normal' | 'high' | 'urgent'
  message       text,

  notified      boolean not null default false,   -- 카카오워크 알림 성공 여부
  channels      text[],                           -- 성공한 알림 채널
  status        text not null default 'new',      -- 'new' | 'contacted' | 'closed'
  note          text                              -- 담당자 메모
);

create index if not exists idx_leads_created on leads(created_at desc);
create index if not exists idx_leads_status on leads(status);

alter table leads enable row level security;
-- 서비스 키(서버)만 읽고 쓴다. anon 정책은 만들지 않는다.
