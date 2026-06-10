import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SITE } from '@/lib/seo/site'

export function CtaSection() {
  return (
    <section className="py-32 px-4">
      <div className="mx-auto max-w-3xl text-center">
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-b from-blue-600/10 to-transparent p-16">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[80px]" />
          </div>

          <div className="relative">
            <h2 className="mb-4 text-4xl font-extrabold sm:text-5xl">
              지금 바로 시작하세요
            </h2>
            <p className="mb-10 text-lg text-zinc-700">
              매장 사진 3장으로 즉석 범위 견적.
              <br />
              기술 지식 없이도 누구나 LED 전광판을 운영합니다.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/quote"
                className="group flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-blue-500 active:scale-95 glow"
              >
                견적 요청하기
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              {SITE.phone && (
                <a
                  href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`}
                  className="rounded-xl border border-zinc-300 px-8 py-4 text-base font-semibold text-zinc-700 transition-all hover:bg-zinc-100"
                >
                  전화 문의
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
