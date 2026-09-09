'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

import { buildSpecRows, type Industry } from '@/lib/industries'

/**
 * 설치사례 사진 갤러리 + 구축정보 표.
 *
 * 케이시스(ksys.co.kr) 설치사례 상세의 형식을 그대로 가져왔다 —
 *   큰 사진 1장(16:9) → 아래 썸네일 → "구축정보" 2열 표.
 * 모달(`IndustryModal`)과 정적 상세 페이지(`/industries/[slug]`)가 같은 것을 쓴다.
 * 같은 자리를 두 경로로 보여주면서 내용이 갈리는 사고가 전에 있었기 때문이다.
 *
 * 🔴 표에 기관명·연도·구축 수량 행은 없다. 우리에게 그 실적이 없다.
 *    케이시스 표에는 그 세 줄이 있지만, 없는 것을 흉내 내면 그게 날조다.
 *    값을 비운 행을 두는 것도 하지 않는다 — 행 자체를 만들지 않는다(`buildSpecRows`).
 */
export function IndustryGallery({
  industry,
  /** 큰 사진에 priority 를 준다(정적 상세 페이지처럼 첫 화면에 오는 경우) */
  priority = false,
}: {
  industry: Industry
  priority?: boolean
}) {
  const [active, setActive] = useState(0)
  const shots = industry.gallery.length > 0 ? industry.gallery : [{ src: industry.heroImage, alt: industry.heroImageAlt }]

  // 자리를 옮기면(모달에서 이전/다음) 첫 사진부터 다시 본다
  useEffect(() => setActive(0), [industry.slug])

  const shown = shots[Math.min(active, shots.length - 1)]
  const rows = buildSpecRows(industry)

  return (
    <div className="space-y-5">
      <div className="wk-card-img relative aspect-[16/9] bg-wk-ink">
        <Image
          key={shown.src}
          src={shown.src}
          alt={shown.alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 860px"
          className="object-cover"
        />
      </div>

      {/* 사진이 1장이면 썸네일 줄 자체를 그리지 않는다.
          2026-09-09 CEO 지시로 갤러리가 최대 3장(대표 1 + 설치 장면 2)으로 줄었다.
          칸 수를 사진 수에 맞춘다 — 고정 4열이면 오른쪽에 빈 칸이 남는다. */}
      {shots.length > 1 && (
        <div className={`grid gap-2 sm:gap-3 ${shots.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {shots.map((shot, n) => (
            <button
              key={shot.src}
              type="button"
              onClick={() => setActive(n)}
              aria-label={`사진 ${n + 1} 보기 — ${shot.alt}`}
              aria-current={n === active}
              className={`relative aspect-[4/3] overflow-hidden rounded-card-m bg-wk-ink ring-offset-2 transition-opacity duration-state ease-state ${
                n === active ? 'ring-2 ring-wk-cta' : 'opacity-70 ring-1 ring-black/10 hover:opacity-100'
              }`}
            >
              <Image src={shot.src} alt="" aria-hidden="true" fill sizes="200px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div>
        <p className="wk-eyebrow mb-3">구축정보</p>
        <dl className="grid grid-cols-1 overflow-hidden rounded-card-m border border-wk-line sm:grid-cols-2">
          {/* 라벨 칸에만 회색을 깐다. 케이시스 구축정보 표와 같은 형식이고,
              줄 단위 얼룩(odd:) 은 2열로 접힐 때 좌우가 어긋나 보인다. */}
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[7.5rem_minmax(0,1fr)] border-b border-wk-line last:border-b-0 sm:even:border-l sm:[&:nth-last-child(2)]:border-b-0"
            >
              <dt className="bg-wk-bg px-4 py-3 text-label font-semibold text-wk-ink3">{row.label}</dt>
              <dd className="wk-metric m-0 min-w-0 px-4 py-3 text-label font-semibold text-wk-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
        {/* 🔴 각주를 달지 않는다 (CEO 2026-09-09 "불리한 말은 전부 빼라").
            "실적이 아닙니다" 류 문장은 스스로 깎아내리는 말이다. 대신 행 이름을
            `화면 크기 예시` · `해상도 예시` 로 두어 주장 자체를 하지 않는다.
            계산 근거(640×480 캐비닛 배열)는 `lib/industries.ts` 주석에 남겼다. */}
      </div>
    </div>
  )
}
