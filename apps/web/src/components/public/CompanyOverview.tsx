import Image from 'next/image'

import { IMAGES } from '@/lib/imageAssets'
import { SITE } from '@/lib/seo/site'
import { PITCH_RANGE } from '@/lib/companyScope'

/**
 * 회사 소개 — 하는 일 4장(사진) + 회사 개요 표.
 *
 * 🔴 2026-09-08 CEO 지시 "회사 소개 내용 더 추가, 더 멋있게. 지금 너무 멋이 없다".
 *    국내 업체 회사소개의 표준 구성 두 가지를 넣었다.
 *    ① 하는 일을 **사진 4장**으로 — 설계·제작·시공·유지보수. 글이 아니라 장면으로.
 *    ② **회사 개요 표** — 담당자가 결재 서류에 옮겨 적는 항목 그대로. 회사명·대표·소재지·
 *       사업 분야·취급 제품·인증·제어 시스템. 값은 전부 SITE(단일 정본)에서 온다.
 *    실적·고객사·설립연도는 넣지 않는다(첫 수주 전, [[company-vs-reference]]).
 */
const WORKS = [
  { k: '설계', t: '현장 실측 후 규격 확정', img: IMAGES.process[0], alt: '설치 예정 지점의 지주와 주변 조건을 확인하는 현장 실측 장면' },
  { k: '제작', t: '출하 전 전수 점등 검사', img: IMAGES.process[2], alt: '창고에 적재된 LED 캐비닛과 포장된 모듈 상자' },
  { k: '시공', t: '전기·통신 연결과 시운전', img: IMAGES.process[1], alt: '강당 벽면 프레임에 LED 모듈을 한 장씩 붙여 나가는 작업 장면' },
  { k: '유지보수', t: '원격 확인 후 모듈 단위 교체', img: IMAGES.process[5], alt: '점등된 대형 전광판 앞에 선 엔지니어의 실루엣' },
]

export function CompanyOverview() {
  const rows: [string, string][] = [
    ['회사명', SITE.legalName],
    ['대표', SITE.ceoName],
    ['소재지', SITE.addressFull],
    ['사업 분야', 'LED 전광판 · 전자현수막 설계 · 제작 · 시공 · 유지보수'],
    ['취급 제품', `실내·실외 LED 전광판, 전자현수막 (화소 간격 ${PITCH_RANGE})`],
    ['인증', 'KC 인증 제품만 공급'],
    ['제어 시스템', SITE.controllerStandard],
    ['사업자등록번호', SITE.bizRegNo],
    ['대표번호', `${SITE.phone} · ${SITE.openingHours}`],
  ]

  return (
    <>
      {/* 하는 일 — 사진 4장 */}
      <section aria-labelledby="works-h" className="wk-sec bg-white">
        <div className="wk-wrap">
          <p className="wk-eyebrow">하는 일</p>
          <h2 id="works-h" className="wk-h2 text-wk-ink">
            설계부터 유지보수까지 직접
          </h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {WORKS.map((w, i) => (
              <figure key={w.k} className="group relative aspect-[3/4] overflow-hidden rounded-card bg-wk-ink">
                <Image
                  src={w.img}
                  alt={w.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                  className="object-cover transition-transform duration-cine ease-entrance motion-safe:group-hover:scale-105"
                />
                <div className="wk-scrim-card absolute inset-0" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5">
                  <span className="wk-metric block text-caption font-semibold text-white/70">0{i + 1}</span>
                  <span className="mt-1 block text-h3 font-bold tracking-[-0.02em] text-white">{w.k}</span>
                  <span className="mt-1 block text-label text-white/85">{w.t}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 회사 개요 표 */}
      <section aria-labelledby="overview-h" className="wk-sec-sm bg-wk-bg">
        <div className="wk-wrap">
          <p className="wk-eyebrow">회사 개요</p>
          <h2 id="overview-h" className="wk-h2 text-wk-ink">
            {SITE.nameKo}
          </h2>
          <dl className="mt-8 overflow-hidden rounded-card border border-wk-line bg-white">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[minmax(120px,1fr)_3fr] border-b border-wk-line last:border-b-0">
                <dt className="bg-wk-bgFaint px-5 py-4 text-label font-semibold text-wk-ink2">{k}</dt>
                <dd className="px-5 py-4 text-body text-wk-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
