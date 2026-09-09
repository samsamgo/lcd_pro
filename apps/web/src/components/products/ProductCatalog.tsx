'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Stagger } from '@/components/motion'
import {
  ENV_FILTER_LABEL,
  FORM_LABEL,
  PRODUCT_MODELS,
  envText,
  matchesEnvFilter,
  pitchRange,
  type EnvFilter,
} from '@/lib/productModels'

/**
 * 제품 목록 — **전 시리즈 12종을 한 화면에 다 꺼내 놓고, 알약 세 개로만 가린다.**
 *
 * 🔴 2026-09-09 CEO 지시 원문: "제품 저렇게 잡다하게 해놓지 말고 그냥 전 제품 다 꺼내 놓고
 *    필터로 실내용/실외용만 구분 가능하게끔만 해줘. 이상한 거 다 지우고."
 *    그래서 여기 있는 것은 알약 3개 + 카드 격자뿐이다. '고르는 기준'·'이 자리에 맞는 모델'·
 *    '쓰이는 자리'·규격 요약 4칸·카테고리 입구 타일은 전부 걷어냈다. 되살리지 마라.
 *
 * 카드는 **검정 배경 위 흰 카드**다. 캐비닛 렌더가 대부분 어두운 회색 사출물이라
 * 흰 배경에 두면 카드 경계와 제품 윤곽이 같이 사라진다(국내 사이니지 업체 목록이 전부 이 형태다).
 * 카드에 적는 것은 넷 — 시리즈 이름 / 한글 이름 / 화소 간격 범위 / 구성 단위·환경.
 * 밝기는 쓰지 않는다(CEO "밝기로 쓰지 말고 크기로"). 밝기는 규격표 안에만 있다.
 *
 * ⚠️ 사진이 아니라 **렌더(`/images/products/*.webp`)만** 쓴다. 시공 사진처럼 보이는 이미지는
 *    우리 실적이 아니라서 카드에 붙이는 순간 날조가 된다(`company-vs-reference`).
 * ⚠️ '사진은 예시입니다' 류 각주를 달지 마라. 렌더는 제품 그림이지 현장 주장이 아니다.
 */
const FILTERS: EnvFilter[] = ['all', 'indoor', 'outdoor']

function readEnv(v: string | null): EnvFilter | null {
  return v === 'indoor' || v === 'outdoor' || v === 'all' ? v : null
}

export function ProductCatalog({
  initialEnv = 'all',
  title = '제품 시리즈 전체',
  eyebrow = '시리즈',
}: {
  /** 페이지가 미리 걸어 두는 필터 — /products/indoor · /products/outdoor */
  initialEnv?: EnvFilter
  title?: string
  eyebrow?: string
}) {
  const [env, setEnv] = useState<EnvFilter>(initialEnv)

  /**
   * 🔴 `useSearchParams()` 를 쓰지 않는다(2026-09-09). 정적 페이지에서 그 훅을 부르면
   *    Next 가 이 경계를 통째로 클라이언트 렌더로 내려, **카드 12장이 정적 HTML에서 사라진다.**
   *    /products 는 검색으로 들어오는 페이지라 목록이 HTML 안에 있어야 한다.
   *    그래서 첫 렌더는 서버가 준 `initialEnv` 그대로 그리고, `?env=` 는 마운트 뒤에 읽어 맞춘다.
   */
  useEffect(() => {
    const q = readEnv(new URLSearchParams(window.location.search).get('env'))
    if (q) setEnv(q)
  }, [])

  /**
   * 주소와 상태를 맞춰 둔다 — `?env=outdoor` 를 그대로 복사해 붙여도 같은 화면이 나오게.
   * `router.replace` 대신 `history.replaceState` 를 쓰는 이유: 알약은 페이지 이동이 아니라
   * 화면 안 필터다. 라우터를 태우면 정적 페이지가 매번 다시 그려지고 스크롤이 튄다.
   */
  useEffect(() => {
    const url = new URL(window.location.href)
    if (env === initialEnv) url.searchParams.delete('env')
    else url.searchParams.set('env', env)
    window.history.replaceState(null, '', url.pathname + url.search)
  }, [env, initialEnv])

  const models = PRODUCT_MODELS.filter((m) => matchesEnvFilter(m, env))

  return (
    <section className="wk-sec bg-wk-night" aria-labelledby="catalog-h">
      <div className="wk-wrap">
        <p className="wk-eyebrow !text-wk-blue">{eyebrow}</p>
        <h2 id="catalog-h" className="wk-h2 text-white">
          {title}
        </h2>

        {/* 필터 알약 — 실내/실외 둘뿐. 렌탈 시리즈는 양쪽에 다 나온다 */}
        <div
          role="group"
          aria-label="설치 환경으로 거르기"
          className="mt-7 flex flex-wrap items-center gap-2"
        >
          {FILTERS.map((f) => {
            const on = f === env
            return (
              <button
                key={f}
                type="button"
                aria-pressed={on}
                onClick={() => setEnv(f)}
                className={`rounded-full px-4 py-2 text-label font-semibold transition-colors duration-150 ${
                  on
                    ? 'bg-white text-wk-ink'
                    : 'bg-white/10 text-white/75 hover:bg-white/20 hover:text-white'
                }`}
              >
                {ENV_FILTER_LABEL[f]}
              </button>
            )
          })}
          <span className="wk-metric ml-1 text-caption text-wk-nightMuted" aria-live="polite">
            {models.length}종
          </span>
        </div>

        <Stagger
          key={env}
          className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
        >
          {models.map((m) => (
            <Link
              key={m.slug}
              href={`/products/models/${m.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-card bg-white ring-1 ring-white/10 transition-transform duration-state ease-state hover:-translate-y-1.5 hover:shadow-wk-3"
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-white">
                <Image
                  src={m.images[0].src}
                  alt={m.images[0].alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                  className="object-contain p-5 transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-[1.06]"
                />
              </span>
              <span className="flex flex-1 flex-col border-t border-wk-line px-5 py-4">
                <span className="wk-metric block text-body-lg font-extrabold tracking-[0.01em] text-wk-ink">
                  {m.series}
                </span>
                <span className="mt-1 block text-label text-wk-ink3">{m.name}</span>
                <span className="wk-metric mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-wk-line pt-3 text-caption text-wk-ink2">
                  <b className="font-semibold text-wk-cta">{pitchRange(m)}</b>
                  <span aria-hidden="true" className="text-wk-line2">
                    ·
                  </span>
                  {FORM_LABEL[m.form]}
                  <span aria-hidden="true" className="text-wk-line2">
                    ·
                  </span>
                  {envText(m)}
                </span>
              </span>
            </Link>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
