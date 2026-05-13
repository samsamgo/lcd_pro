import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function SubscribeFailPage({
  params,
  searchParams,
}: {
  params: { projectId: string }
  searchParams: { code?: string; message?: string }
}) {
  return (
    <main className="mx-auto max-w-xl px-5 py-16 text-center">
      <XCircle size={48} className="mx-auto text-red-400" />
      <h1 className="mt-5 text-xl font-bold text-zinc-100">카드 인증이 취소되었습니다</h1>
      {searchParams.message && (
        <p className="mt-2 text-sm text-zinc-400">{searchParams.message}</p>
      )}
      {searchParams.code && (
        <p className="mt-1 text-xs text-zinc-600">코드: {searchParams.code}</p>
      )}
      <Link
        href={`/subscribe/${params.projectId}`}
        className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
      >
        다시 시도하기
      </Link>
    </main>
  )
}
