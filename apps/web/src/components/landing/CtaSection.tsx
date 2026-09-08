import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '@/lib/seo/site'
import { Reveal, Magnetic, RiseMask, ScrollBridge } from '@/components/motion'

/**
 * 전역 CTA 섹션 — 페이지 하단, 라이트→다크 전환의 종착지.
 * 위 섹션 명도가 페이지마다 달라 `.wk-bridge-down`은 이 섹션 최상단이 소유한다
 * (Footer가 소유하면 라이트 하단 페이지에서 흰 띠가 생긴다).
 */
/**
 * 🔴 2026-09-08 CEO 지시 "문의하는 칸이 페이지마다 다르니까 통일해라".
 *    전에는 페이지마다 제목·문장을 다르게 넘겼다(광고 배너처럼 읽히지 않게 하려던 의도).
 *    결과는 반대였다 — 같은 자리에 매번 다른 말이 있으니 "문의 칸" 으로 인식되지 않았다.
 *    이제 props 를 받지 않는다. 어느 페이지에서든 같은 칸, 같은 말, 같은 버튼.
 */
export function CtaSection() {
  const title: [string, string] = ['예산 잡기 전이어도', '괜찮습니다']
  const sub = '설치 장소와 대략적인 크기만 알려주셔도 됩니다. 현장 사진이 있으면 더 정확해집니다.'
  return (
    <section className="relative">
      {/* 사이트의 마지막 라이트→다크 전환. 이 다리에서 화소가 켜진다.
          CtaSection 은 여러 페이지가 공유하므로 이 한 곳을 고치면 어휘가 전 페이지로 퍼진다. */}
      <ScrollBridge direction="down" className="wk-bridge-down h-20 md:h-28" />
      <div className="wk-night-glow wk-sec-lg">
        <div className="wk-wrap text-center">
          <Reveal y={10} duration={0.6}>
            <p className="wk-eyebrow justify-center">문의</p>
          </Reveal>

          {/* 🔴 제목은 Reveal 밖에 둔다. 움직이는 부모 안에서 마스크를 올리면
              두 움직임이 겹쳐 어느 쪽도 읽히지 않는다. 마감 문장은 두 줄이 차례로 올라온다. */}
          <h2 className="wk-display text-wk-nightInk">
            <RiseMask>{title[0]}</RiseMask>
            <RiseMask delay={0.1}>{title[1]}</RiseMask>
          </h2>

          <Reveal y={16} delay={0.24}>
            <p className="wk-lead mx-auto mt-5 text-wk-nightMuted">
              {sub}
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Magnetic>
                <Link href="/quote" className="wk-btn-p group">
                  견적 문의하기
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
