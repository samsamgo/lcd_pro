-- 정기결제 시 Toss API에 customerKey + billingKey 페어로 요청해야 결제 성공
-- 003 마이그레이션 후 추가: subscriptions에 toss_customer_key 컬럼

alter table subscriptions add column if not exists toss_customer_key text;

comment on column subscriptions.toss_customer_key is
  'Toss Payments customerKey. billingKey 발급 시 사용한 동일 값. 추측 불가능한 UUID 권장.';
