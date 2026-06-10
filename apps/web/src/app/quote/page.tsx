import { QuoteWizard } from '@/components/quote/QuoteWizard'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: '견적 요청 — 우강테크',
  description: '사진 3장으로 즉석 범위 견적을 화면에서 바로 확인하세요.',
}

export default function QuotePage({
  searchParams,
}: {
  searchParams: { type?: string }
}) {
  const type = searchParams?.type

  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-16">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-zinc-900 sm:text-4xl">
              견적 요청
            </h1>
            <p className="mt-3 text-zinc-600">
              사진 3장 입력 → 즉석 범위 견적을 화면에서 바로 확인
            </p>
          </div>
          <QuoteWizard defaultType={type} />
        </div>
      </main>
      <Footer />
    </>
  )
}
