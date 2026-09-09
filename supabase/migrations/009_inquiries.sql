-- 009_inquiries.sql — 문의 게시판 (/support/faq 하단)
-- 2026-09-09 CEO 지시 "자주 묻는 질문 아래에 실제로 고객이 문의를 달 수 있게, 공개/비공개 포함 게시판처럼".
-- 008(leads) 는 폼 리드 저장이고, 이건 화면에 목록으로 노출되는 공개 게시판이다. 성격이 달라 테이블을 나눈다.
-- 🔴 적용: Supabase 대시보드 → SQL Editor 에 이 파일을 붙여 넣고 실행한다(CLI 링크 없음).
--
-- 답변하는 법 — Supabase 대시보드 → Table Editor → inquiries 행에서
--   answer 를 채우고 status 를 'answered' 로 바꾸면 사이트 목록에 바로 뜬다.
--   (apps/admin 은 배포되지 않으므로 관리 화면은 Supabase 대시보드가 정본이다)

create table if not exists inquiries (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),

  title         text not null,
  body          text not null,
  author_name   text,
  phone         text,                              -- 답변 연락용. 화면에는 절대 노출하지 않는다

  is_public     boolean not null default true,     -- false = 작성자만 비밀번호로 열람
  password_hash text,                              -- 비공개 글만. scrypt$N$r$p$salt$hash

  status        text not null default 'open',      -- 'open'(답변 대기) | 'answered'(답변 완료)
  answer        text,                              -- 우강테크 답변 본문
  answered_at   timestamptz,
  admin_note    text                               -- 내부 메모. 화면에 나가지 않는다
);

create index if not exists idx_inquiries_created on inquiries(created_at desc);

alter table inquiries enable row level security;
-- 서비스 키(서버)만 읽고 쓴다. anon 정책은 만들지 않는다 —
-- 비공개 글 본문과 연락처가 anon 키로 그대로 새는 것을 막기 위해서다.
-- 화면은 /api/inquiries 를 통해서만 데이터를 받고, 그 API 가 마스킹·비공개 처리를 한다.
