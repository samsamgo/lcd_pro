import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '@/lib/seo/site'
import { Reveal, Magnetic } from '@/components/motion'

/**
 * 전역 CTA 섹션 — 페이지 하단, 라이트→다크 전환의 종착지.
 * 위 섹션 명도가 페이지마다 달라 `.wk-bridge-down`은 이 섹션 최상단이 소유한다
 * (Footer가 소유하면 라이트 하단 페이지에서 흰 띠가 생긴다).
 */
export function CtaSection({
  title = ['예산 잡기 전이어도', '괜찮습니다'],
  sub = '설치 장소와 대략적인 크기만 알려주셔도 됩니다. 현장 사진이 있으면 더 정확해집니다.',
}: {
  /** 두 줄 제목. 페이지마다 다르게 준다 — 같은 CTA가 다섯 페이지에 반복되면 광고 배너처럼 읽힌다 */
  title?: [string, string]
  sub?: string
} = {}) {
  return (
    <section className="relative">
      <div className="wk-bridge-down h-32 md:h-44" aria-hidden="true" />
      <div className="wk-night-glow wk-sec-lg">
        <div className="wk-wrap text-center">
          <Reveal>
            <p className="wk-eyebrow justify-center">문의</p>
            <h2 className="wk-display text-wk-nightInk">
              {title[0]}
              <br />
              {title[1]}
            </h2>
            <p className="wk-lead mx-auto mt-5 text-wk-nightMuted">
              {sub}
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Magnetic>
                <Link href="/quote" className="wk-btn-p group">
                  견적 요청하기
                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                    className="transition-transform duration-150 group-hover:translate-x-1"
                  />
                </Link>
              </Magnetic>
              {SITE.phone && (
                <a
                  href={`tel:${SITE.phone.replace(/[^+\d]/g, '')}`}
                  className="inline-flex h-[56px] w-full items-center justify-center gap-1.5 rounded-btn-m border border-white/15 px-6 text-body font-semibold text-wk-nightInk transition-colors duration-150 hover:bg-white/5 sm:h-[52px] sm:w-auto sm:rounded-btn"
                >
                  <Phone size={16} aria-hidden="true" />
                  전화 문의
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
