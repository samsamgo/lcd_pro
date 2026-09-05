'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { IMAGES } from '@/lib/imageAssets'
import { Magnetic, Reveal, SplitText } from '@/components/motion'

/**
 * 제품 페이지 히어로.
 *
 * 구매자는 모델명을 모른다. 그래서 첫 화면에서 묻는 것은
 *"어떤 모델이 필요하십니까" 가 아니라 "어디에, 얼마나 멀리서 보십니까" 다.
 * 사진은 저각도·흐린 하늘 — 옥외 화면이 가장 불리한 조건에서 어떻게 읽히는지 보여준다.
 */
export function ProductsHero() {
  return (
    <section
      data-wk-dark-hero className="relative isolate flex min-h-[72svh] items-end overflow-hidden bg-wk-night lg:min-h-[84svh]">
      <div className="wk-grain absolute inset-0" aria-hidden="true">
        <Image
          src={IMAGES.productsHero}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={82}
          className="object-cover object-[58%_50%] lg:object-center"
        />
        <div className="wk-scrim-l absolute inset-0" />
        <div className="wk-scrim-b absolute inset-0 lg:hidden" />
      </div>

      <div className="relative z-10 w-full pb-14 pt-32 lg:pb-24">
        <div className="wk-wrap">
          <nav aria-label="위치" className="mb-6 flex items-center gap-1.5 text-caption text-white/70">
            <Link href="/" className="hover:text-white">
              홈
            </Link>
            <ChevronRight size={12} aria-hidden="true" className="text-white/40" />
            <span className="font-semibold text-white">제품</span>
          </nav>

          <p className="wk-eyebrow !text-white/70">설치 환경별 안내</p>

          <SplitText
            as="h1"
            className="wk-h1 max-w-2xl text-white"
            text="보는 거리로 고릅니다"
          />

          <Reveal delay={0.25} y={16}>
            <p className="wk-lead mt-6 !text-white/85">
              화소 간격과 밝기는 모델의 등급이 아니라 설치 조건의 결과입니다. 보는 거리와
              햇빛 조건을 먼저 정하면 규격은 따라옵니다.
            </p>
          </Reveal>

          <Reveal delay={0.35} y={14}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Magnetic>
                <Link href="/quote" className="wk-btn-p sm:px-8">
                  설치 조건으로 견적 요청
                </Link>
              </Magnetic>
              <a
                href="#compare"
                className="wk-btn-sm w-full justify-center border border-white/25 text-white hover:bg-white/10 sm:w-auto"
              >
                규격 비교표 보기
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
