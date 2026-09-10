'use client'

/**
 * 모바일 하단 고정 CTA 바 — 🔴 2026-09-10 CEO 지시로 **렌더하지 않는다.**
 * "그냥 빠른상담만 작은 아이콘해서 오른쪽 하단에 모달로." → FloatingCta 하나가 전 뷰포트를 맡는다.
 * 각 페이지가 <MobileCtaBar /> 를 아직 import 하므로 파일은 남기고 null 을 돌려준다.
 * 되살리려면 git 에서 2026-09-10 이전 버전을 꺼낸다(전화·빠른상담·견적 3버튼 + 닫기 + 키보드 감지).
 */
export function MobileCtaBar() {
  return null
}
