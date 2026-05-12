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
