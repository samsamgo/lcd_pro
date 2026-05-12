import { QuoteWizard } from '@/components/quote/QuoteWizard'
import { NavBar } from '@/components/NavBar'

export const metadata = {
  title: '견적 요청 — LCD PRO',
  description: '사진 3장으로 30분 내 LED 전광판 견적을 받으세요.',
}

export default function QuotePage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-16">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              견적 요청
            </h1>
            <p className="mt-3 text-zinc-500">
              5분 입력 → 30분 내 범위 견적 발송
            </p>
          </div>
          <QuoteWizard />
        </div>
      </main>
    </>
  )
}
