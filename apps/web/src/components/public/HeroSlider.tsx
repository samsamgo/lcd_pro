'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

import { IMAGES } from '@/lib/imageAssets'
import { Magnetic, Parallax, Reveal, SplitText } from '@/components/motion'

/**
 * 홈 히어로 — 주연 사진 한 장.
 *
 * 8초 자동 슬라이더 6장을 걷어냈다(벤치마크 §6 안티패턴 1).
 * 자동 전환은 메시지를 스스로 지우고, LCP 후보 이미지를 6장 경쟁시키며,
 * 사진마다 카피 위치가 흔들려 "템플릿" 인상을 만든다.
 * 사례 사진은 아래 ScreenGallery 에서 사용자가 직접 연다.
 *
 * 연출
 * - 사진: A5 광장 세로형 전광판 두 대(블루아워) 한 장. priority + sizes= "100vw".
 * - 아주 약한 Parallax(0.12). 사진 컨테이너를 위아래로 넘겨 잡아 여백이 뜨지 않게 한다.
 * - .wk-scrim-l 로 좌측 텍스트 영역만 눌러 대비를 만든다(전면 검정 40% 오버레이 금지).
 * - .wk-grain 으로 생성 이미지의 매끈함을 죽인다.
 * - 제목은 SplitText 어절 상승. CTA 2개, 1차에만 Magnetic.
 *
 * export 이름은 PublicHero.tsx 가 재export 하므로 유지한다.
 */
export function HeroSlider() {
  return (
    <section
      data-wk-dark-hero className="relative isolate flex min-h-[86svh] items-end overflow-hidden bg-wk-ink lg:min-h-[92svh]">
      {/* 배경 사진 — 패럴랙스가 움직이는 만큼 위아래로 넘겨 잡는다 */}
      <Parallax strength={0.12} className="pointer-events-none absolute inset-0">
        {/* 높이/오프셋은 디자인 토큰이 아니라 패럴랙스 이동량(±12%)을 흡수하는 구조값이다 */}
        <div className="relative w-full" style={{ height: '126%', marginTop: '-13%' }}>
          <Image
            src={IMAGES.home.hero}
            alt="군청 출입구 위 캐노피에 설치된 가로형 LED 전자현수막이 주민 설명회 안내를 표시하고 있다"
            fill
            priority
            sizes="100vw"
            quality={82}
            className="object-cover object-[50%_38%] lg:object-[50%_42%]"
          />
        </div>
      </Parallax>

      {/* 스크림 — 좌측 텍스트 뒤만 누른다 */}
      <div aria-hidden="true" className="wk-scrim-l-deep pointer-events-none absolute inset-0 z-10" />
      {/* 하단 스크림 — 인디케이터·캡션 판독용 */}
      <div aria-hidden="true" className="wk-scrim-b pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/3" />
      {/* 그레인 */}
      <div aria-hidden="true" className="wk-grain pointer-events-none absolute inset-0 z-10" />

      {/* 문구 */}
      <div className="relative z-20 w-full pb-24 pt-36 md:pb-28 md:pt-44">
        <div className="wk-wrap">
          <Reveal y={0} duration={0.6}>
            <p className="wk-eyebrow !text-white/70">관공서 · 학교 LED 전광판</p>
          </Reveal>

          <SplitText
            as="h1"
            text="설계부터 유지보수까지"
            className="wk-hero text-white"
            gap={0.06}
          />

          <Reveal y={18} delay={0.22}>
            <p className="wk-lead mt-6 !text-white/85">
              제작 · 설치 · A/S까지, 우강테크가 책임집니다.
            </p>
          </Reveal>

          <Reveal y={16} delay={0.34}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Magnetic className="w-full sm:w-auto">
                <Link href="/quote" className="wk-btn-p">
                  견적 요청하기
                </Link>
              </Magnetic>
              <Link
                href="/products"
                className="wk-btn border border-white/35 bg-white/5 text-white backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                제품 규격 보기
              </Link>
            </div>
            <p className="mt-4 max-w-[34em] text-label text-white/65">
              설치 장소와 크기만 알려주시면 맞춤 규격과 예상 견적을 안내드립니다.
            </p>
          </Reveal>
        </div>
      </div>

      {/* 스크롤 유도 — 과하지 않게 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-5 z-20 hidden justify-center md:flex"
      >
        <span className="flex flex-col items-center gap-1.5 text-caption font-medium text-white/55 animate-pulse-slow">
          아래로 스크롤
          <ChevronDown size={16} strokeWidth={2} />
        </span>
      </div>
    </section>
  )
}
