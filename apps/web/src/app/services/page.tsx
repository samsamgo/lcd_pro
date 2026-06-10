import { redirect } from 'next/navigation'

// 단일 페이지 통합(2026-06-10): 서비스는 홈 섹션(/#services)으로 흡수.
// 기존 /services 라우트는 홈 앵커로 영구 리다이렉트한다. (파일 보존)
// 과거 상세 UI 컴포넌트(ServicesInteractive, DetailModal, services-data)는
// 복원 여지를 위해 파일만 남겨둔다 — 현재 라우트에서는 렌더되지 않음.
export default function ServicesPage() {
  redirect('/#services')
}
