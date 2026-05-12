import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export function QuoteSuccess() {
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/10">
        <CheckCircle2 size={32} className="text-blue-400" />
      </div>
      <h2 className="mb-3 text-2xl font-bold text-white">견적 요청 완료!</h2>
      <p className="mb-2 text-zinc-400">
        30분 내로 카카오 또는 문자로 범위 견적을 보내드립니다.
      </p>
      <p className="mb-8 text-sm text-zinc-600">
        영업시간 외 요청 시 다음 영업일 오전에 연락드립니다.
      </p>

      <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-left text-sm text-zinc-400">
        <p className="mb-2 font-semibold text-zinc-200">다음 단계</p>
        <ol className="space-y-1.5 list-inside">
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold">1.</span>
            범위 견적 수신 (30분 내)
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold">2.</span>
            현장 실사 일정 조율 (1~3일)
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold">3.</span>
            최종 견적 확정 + 계약
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold">4.</span>
            설치 + CMS 시작
          </li>
        </ol>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href="http://pf.kakao.com/_lcdpro"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-6 py-3 text-sm font-semibold text-yellow-300 transition-all hover:bg-yellow-400/20"
        >
          카카오로 빠른 문의
        </a>
        <Link
          href="/"
          className="rounded-xl border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
        >
          홈으로
        </Link>
      </div>
    </div>
  )
}
