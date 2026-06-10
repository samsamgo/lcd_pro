import { redirect } from 'next/navigation'

// 단일 페이지 통합(2026-06-10): FAQ는 홈 인라인 섹션(/#faq)으로 흡수.
// 기존 /faq 라우트는 홈 앵커로 영구 리다이렉트한다. (파일 보존)
export default function FaqPage() {
  redirect('/#faq')
}
