import { BrandLockup } from '@/components/brand/BrandLogo'
import { Reveal, RiseMask } from '@/components/motion'

/**
 * 회사소개 여는 장 — **슬로건 한 장.**
 *
 * 🔴 2026-09-09 CEO 지시. "회사소개를 케이시스처럼 멋있게. 우강테크 메시지 할 때
 *    슬로건 하나 크게 띄워 줘야 멋있어 보인다."
 *    케이시스 인사말 페이지(ksys.co.kr/page/ceo_greeting.php)의 여는 장 구조를 따랐다 —
 *    다크 풀블리드 + 초대형 영문 슬로건 + 그 아래 한 줄 한글 문장. 그게 전부다.
 *
 * 설계 규칙 — **한 화면에 메시지 하나.**
 *  · 여기에 버튼·숫자·카드·설명 목록을 붙이지 마라. 하나라도 붙으면 배너가 된다.
 *  · 로고는 이 장의 **하단 중앙에 작게** 둔다(옛 '로고 띠' 섹션은 이 장에 흡수돼 사라졌다).
 *    로고를 다시 크게 키우거나 별도 섹션으로 떼지 마라 — 슬로건과 주역 자리를 다툰다.
 *  · 뒤 배경은 사진이 아니라 **빛**이다(방사형 주황 + 화소 격자). `CompanyCredo` 와 같은 방식이라
 *    두 다크 장이 한 손에서 나온 것처럼 읽힌다. 실적 사진이 없는 상태에서 연출컷보다 정직하다.
 */
const SLOGAN_A = 'BEYOND'
const SLOGAN_B = 'THE DISPLAY'
/** 한 줄 문장 — '빛' 한 어절만 주황이다. 강조를 늘리지 마라 */
const LINE_BEFORE = '공간에 '
const LINE_ACCENT = '빛'
const LINE_AFTER = '을 더하고, 기술로 완성합니다.'

export function AboutSlogan() {
  return (
    <section
      aria-labelledby="slogan-h"
      className="relative isolate overflow-hidden bg-wk-night py-28 md:py-36 lg:py-44"
    >
      {/* 뒤에서 번지는 빛 — CompanyCredo 와 같은 radial-gradient 처방 */}
      <Reveal y={0} duration={1.8} className="pointer-events-none absolute inset-0">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(56% 46% at 50% 46%, rgba(222,103,29,.22) 0%, rgba(222,103,29,.07) 44%, transparent 74%)',
          }}
        />
      </Reveal>
      {/* 화소 격자 — 아주 옅게. 이 면이 '화면'이라는 것만 알린다 */}
      <div aria-hidden="true" className="wk-pixelgrid wk-pixelgrid-coarse absolute inset-0 opacity-40" />

      <div className="wk-wrap relative text-center">
        <h2
          id="slogan-h"
          className="text-display-hero font-extrabold leading-[1.02] tracking-[-0.04em] text-white"
        >
          <RiseMask>{SLOGAN_A}</RiseMask>
          <RiseMask delay={0.1}>{SLOGAN_B}</RiseMask>
        </h2>

        <Reveal y={16} delay={0.24}>
          <p className="mx-auto mt-8 max-w-[24em] text-h3 font-semibold leading-snug tracking-tight text-white/85 md:mt-10">
            {LINE_BEFORE}
            <span className="text-wk-cta">{LINE_ACCENT}</span>
            {LINE_AFTER}
          </p>
        </Reveal>

        {/* 로고 — 서명처럼 작게. 🔴 `/brand/wk-logo-dark-full.svg` 원본을 그대로 쓴다.
            SVG 를 다시 그리지 마라(BrandLockup 이 원본을 가리킨다). */}
        <Reveal y={12} delay={0.34}>
          <BrandLockup dark height={64} className="mx-auto mt-14 h-14 w-auto opacity-90 md:mt-20 md:h-16" />
        </Reveal>
      </div>
    </section>
  )
}
