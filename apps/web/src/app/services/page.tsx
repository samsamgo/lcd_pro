import { redirect } from 'next/navigation'

// 단일 페이지 통합(2026-06-10): 서비스는 홈 섹션(/#services)으로 흡수.
// 기존 /services 라우트는 홈 앵커로 영구 리다이렉트한다. (파일 보존)
export default function ServicesPage() {
  redirect('/#services')
}
