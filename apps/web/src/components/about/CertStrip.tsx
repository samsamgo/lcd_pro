import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { CREDENTIALS, certThumb } from '@/lib/credentials'
import { Reveal, RiseMask, Stagger } from '@/components/motion'

/**
 * 인증·서류 미리보기 띠 — `/about` 안.
 *
 * 전체 갤러리는 `/about/certification` 이다(서류는 계속 늘어나는 항목이라 회사소개에
 * 다 걸면 그 페이지가 서류철이 된다 — CEO 지시 2026-09-08). 여기서는 **있다는 사실**만
 * 썸네일로 보이고 전체 보기로 넘긴다. 데이터는 갤러리와 같은 `lib/credentials.ts` 다.
 *
 * ⚠️ 여기 카드는 누르면 갤러리 페이지로 간다(라이트박스가 아니다). 그래서 서버 컴포넌트다.
 */
export function CertStrip() {
  return (
    <section aria-labelledby="cert-strip-h" className="wk-sec bg-wk-bgFaint">
      <div className="wk-wrap">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <Reveal y={10}>
              <p className="wk-eyebrow">인증 · 서류</p>
            </Reveal>
            <h2 id="cert-strip-h" className="wk-h2 text-wk-ink">
              <RiseMask delay={0.06}>말 대신 서류로</RiseMask>
            </h2>
          </div>
          <Reveal y={10} delay={0.12}>
            <Link
              href="/about/certification"
              className="inline-flex items-center gap-1.5 text-label font-semibold text-wk-cta hover:underline"
            >
              전체 보기
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <Reveal y={14} delay={0.14}>
          <p className="wk-lead mt-5">발급기관에서 받은 원본입니다.</p>
        </Reveal>

        <Stagger
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8 lg:gap-4"
          y={16}
          gap={0.05}
        >
          {CREDENTIALS.map((c) => (
            <Link
              key={c.key}
              href="/about/certification"
              className="wk-hov-card group block overflow-hidden rounded-card-m border border-wk-line bg-white"
            >
              <span className="relative block aspect-[1/1.414] overflow-hidden bg-white">
                <Image
                  src={certThumb(c.key)}
                  alt={`${c.title} 스캔본`}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 140px"
                  className="object-contain p-1.5"
                />
              </span>
              <span className="block border-t border-wk-line px-3 py-3">
                <span className="block text-caption font-semibold leading-snug text-wk-ink2">
                  {c.title}
                </span>
              </span>
            </Link>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
