-- P1.86 제품군을 견적에 저장하려면 family_code enum 확장이 필요하다.
-- 앱에는 이미 제품군이 존재하지만 DB enum 누락으로 insert가 실패할 수 있다.
alter type family_code add value if not exists 'F-IN-P1.86';
