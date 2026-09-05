import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '@/lib/seo/site'
import { Reveal, Magnetic } from '@/components/motion'

/**
 * 전역 CTA 섹션 — 페이지 하단, 라이트→다크 전환의 종착지.
 * 위 섹션 명도가 페이지마다 달라 `.wk-bridge-down`은 이 섹션 최상단이 소유한다
 * (Footer가 소유하면 라이트 하단 페이지에서 흰 띠가 생긴다).
 */
export function CtaSection() {
  return (
    <section className="relative">
      <div className="wk-bridge-down h-32 md:h-44" aria-hidden="true" />
      <div className="wk-night-glow wk-sec-lg">
        <div className="wk-wrap text-center">
          <Reveal>
            <p className="wk-eyebrow justify-center">문의</p>
            <h2 className="wk-display text-wk-nightInk">
              예산 세우기 전에
              <br />
              규격서부터 받아보십시오
            </h2>
            <p className="wk-lead mx-auto mt-5 text-wk-nightMuted">
              설치 장소와 대략적인 크기만 알려주셔도 됩니다. 현장 사진까지 보내주시면 더 정확한 제안이 가능합니다.
              검토용 자료로 쓰실 수 있게 개략 견적과 함께 문서로 보내드립니다.
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
