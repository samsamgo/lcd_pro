'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import { IMAGES } from '@/lib/imageAssets'
import { Stagger } from '@/components/motion'

/**
 * 화면 용도 갤러리.
 *
 * ⚠️ 이 섹션을 "시공 사례" · "납품 실적" 이라고 부르지 않는다.
 *    여기 걸린 사진은 제품 용도를 보여주는 예시 이미지다. 실적으로 읽히게 적으면
 *    관공서 조달 심사에서 실적 허위기재가 되고, 그건 부정당업자 제재로 이어진다.
 *    다만 표기는 짧게 한 줄이면 충분하다 — 길게 변명할 자리가 아니다.
 *    준공이 나오면 기관 동의 범위 안에서 실제 사진으로 교체한다.
 *
 * 히어로에서 자동 슬라이드를 걷어낸 대신(벤치마크 §6 안티패턴 1),
 * 사례 사진은 여기서 **사용자가 눌러서 연다.**
 */
type Screen = { src: string; title: string; meta: string; alt: string }

const SCREENS: Screen[] = [
  {
    src: IMAGES.homeGallery[0],
    title: '주민 공지 · 마을 알림',
    meta: '마을회관 · 벽부형',
    alt: '흐린 날 마을회관 출입구 위에 설치된 가로형 LED 안내 화면',
  },
  {
    src: IMAGES.homeGallery[1],
    title: '운영 시간 · 당일 공지',
    meta: '민원 창구 · 출입구 상단',
    alt: '이른 아침 공공기관 출입구 위에서 당일 운영 안내를 표시하는 LED 화면',
  },
  {
    src: IMAGES.homeGallery[2],
    title: '오늘의 급식 · 학사 일정',
    meta: '학교 현관 · 벽부형',
    alt: '학교 현관 게시판 옆 벽면에 설치된 화면이 그날의 급식 메뉴를 표시하고 있다',
  },
  {
    src: IMAGES.homeGallery[3],
    title: '시세 · 영업 안내',
    meta: '농협 · 전자현수막',
    alt: '농협 직거래장터 건물 외벽에 걸린 전자현수막',
  },
  {
    src: IMAGES.homeGallery[4],
    title: '행사 · 주민 설명회',
    meta: '강당 · 무대 배경형',
    alt: '주민 설명회가 열린 강당 무대 뒤편의 대형 실내 LED 화면',
  },
  {
    src: IMAGES.homeGallery[5],
    title: '졸업식 · 학교 행사',
    meta: '체육관 · 무대 배경형',
    alt: '학교 체육관 무대 위에 설치된 화면이 졸업식 안내를 표시하고 있다',
  },
]

export function ScreenGallery() {
  const [open, setOpen] = useState<number | null>(null)

  const close = useCallback(() => setOpen(null), [])
  const move = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + SCREENS.length) % SCREENS.length)),
    [],
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') move(1)
      if (e.key === 'ArrowLeft') move(-1)
    }
    window.addEventListener('keydown', onKey)
    // 배경 스크롤 잠금 — 스크롤바 폭을 패딩으로 보정해 레이아웃이 튀지 않게 한다
    const pad = window.innerWidth - document.documentElement.clientWidth
    const prev = document.body.style.cssText
    document.body.style.overflow = 'hidden'
    if (pad > 0) document.body.style.paddingRight = `${pad}px`
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.cssText = prev
    }
  }, [open, close, move])

  return (
    <section id="screens" aria-labelledby="screens-h" className="wk-sec-lg bg-wk-bg">
      <div className="wk-wrap-wide">
        <p className="wk-eyebrow">화면 용도</p>
        <h2 id="screens-h" className="wk-h2 text-wk-ink">
          어디에, 무엇을 띄우나
        </h2>
        <p className="wk-lead mt-5">
          기관에서 실제로 바뀌는 정보는 대기번호, 층별 안내, 행사 일정, 재난 문구입니다.
          인쇄물로는 매번 다시 만들어야 하는 것들입니다.
        </p>

        <Stagger
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          y={16}
          gap={0.07}
        >
          {SCREENS.map((s, n) => (
            <figure key={s.src} className="m-0">
              <button
                type="button"
                onClick={() => setOpen(n)}
                aria-label={`${s.title} 사진 크게 보기`}
                className="group block w-full overflow-hidden rounded-card bg-white text-left shadow-wk-1
 transition-shadow duration-state ease-state hover:shadow-wk-2"
              >
                <span className="relative block aspect-[4/3] overflow-hidden bg-wk-bg">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-cine ease-entrance
 motion-safe:group-hover:scale-[1.03]"
                  />
                </span>
                <span className="block px-5 py-4">
                  <b className="block text-body-lg font-semibold text-wk-ink">{s.title}</b>
                  <span className="wk-cap mt-1 block">{s.meta}</span>
                </span>
              </button>
            </figure>
          ))}
        </Stagger>

        <p className="wk-cap mt-10">※ 설치 형태와 화면 용도를 보여드리기 위한 예시 이미지입니다.</p>
      </div>

      {/* 확대 보기 */}
      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${SCREENS[open].title} 확대 보기`}
          onClick={close}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm
 motion-safe:animate-rise"
        >
          <figure
            className="relative m-0 w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-surface bg-wk-night2">
              <Image
                src={SCREENS[open].src}
                alt={SCREENS[open].alt}
                fill
                sizes="(min-width: 1024px) 960px, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span>
                <b className="block text-body-lg font-semibold text-wk-nightInk">
                  {SCREENS[open].title}
                </b>
                <span className="wk-cap !text-wk-nightMuted">{SCREENS[open].meta} · 예시 이미지</span>
              </span>
              <span className="wk-metric wk-cap !text-wk-nightMuted">
                {open + 1} / {SCREENS.length}
              </span>
            </figcaption>

            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="이전 사진"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-3 text-white
 backdrop-blur transition-colors duration-state ease-state hover:bg-black/70"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="다음 사진"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-3 text-white
 backdrop-blur transition-colors duration-state ease-state hover:bg-black/70"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={close}
              aria-label="닫기"
              autoFocus
              className="absolute -top-12 right-0 rounded-full bg-white/10 p-2.5 text-white
 transition-colors duration-state ease-state hover:bg-white/25"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </figure>
        </div>
      )}
    </section>
  )
}
