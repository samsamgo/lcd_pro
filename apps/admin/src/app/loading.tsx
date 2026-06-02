// 라우트 전환 시 즉시 표시되는 스켈레톤.
// admin 의 모든 페이지는 revalidate=0 서버 컴포넌트(Supabase await)라,
// 이 파일이 없으면 새 페이지 렌더가 끝날 때까지 이전 화면이 멈춰 보인다.
// Suspense fallback 으로 클릭 즉시 전환감을 준다. (레이아웃의 Sidebar 는 유지)
export default function Loading() {
  return (
    <div className="animate-pulse p-6">
      {/* 제목 영역 */}
      <div className="mb-8">
        <div className="h-7 w-44 rounded bg-white/10" />
        <div className="mt-2 h-4 w-60 rounded bg-white/[0.06]" />
      </div>

      {/* 통계 카드 4칸 */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass rounded-xl p-5">
            <div className="h-3 w-20 rounded bg-white/[0.08]" />
            <div className="mt-3 h-8 w-16 rounded bg-white/10" />
          </div>
        ))}
      </div>

      {/* 리스트/테이블 */}
      <div className="glass rounded-xl">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <div className="h-4 w-32 rounded bg-white/10" />
        </div>
        <div className="divide-y divide-white/[0.04]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1">
                <div className="h-4 w-40 rounded bg-white/10" />
                <div className="mt-2 h-3 w-56 rounded bg-white/[0.06]" />
              </div>
              <div className="h-3 w-16 rounded bg-white/[0.06]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
