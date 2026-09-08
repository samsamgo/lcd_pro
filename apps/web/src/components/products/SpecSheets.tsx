'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { PRODUCTS, MAX_W_PER_M2_BY_PITCH } from '@/lib/products'
import { LedSwap, Reveal, RiseMask } from '@/components/motion'
import { SKU_PRICE_FROM, PRICE_DISCLAIMER } from '@/lib/pricing'

/**
 * 제품별 규격 정의 목록.
 *
 * 규격표는 4열 키/값 격자가 아니라 2열 정의 목록이다(벤치마크 §3.1).
 * 4열로 짜면 라벨과 값의 대응이 눈으로 끊기고, 모바일에서 순서가 무너진다.
 * 모바일에서는 한 열로 접되 라벨과 값을 한 묶음(테두리 하나) 안에 둔다.
 *
 * 탭 선택 상태는 색만으로 전달하지 않는다 — 색 + 2px 밑줄 + 굵기(계약 §7).
 */
const DL = 'grid grid-cols-1 sm:grid-cols-[minmax(140px,.7fr)_1.3fr]'

export function SpecSheets() {
  const [active, setActive] = useState(PRODUCTS[0].sku)
  const p = PRODUCTS.find((x) => x.sku === active) ?? PRODUCTS[0]

  const rows: { k: string; v: React.ReactNode }[] = [
    { k: '설치 환경', v: p.env === 'indoor' ? '건물 안(실내)' : '건물 밖(옥외)' },
    {
      k: '화소 간격',
      v: (
        <span className="wk-metric">
          {p.pitch.slice(1)}
          <small> mm</small> <span className="text-wk-ink3">({p.pitch})</span>
        </span>
      ),
    },
    {
      k: '밝기',
      v: (
        <span className="wk-metric">
          {Number(p.brightness.replace(/[^\d]/g, '')).toLocaleString()}
          <small> nit</small> <span className="text-wk-ink3">최대값</span>
        </span>
      ),
    },
    { k: '권장 시청 거리', v: <span className="wk-metric">{p.viewingDistance}</span> },
    { k: '방수 · 방진', v: p.ingress },
    {
      k: '최대 소비전력',
      v: MAX_W_PER_M2_BY_PITCH[p.pitch] ? (
        <span className="wk-metric">
          {MAX_W_PER_M2_BY_PITCH[p.pitch]}
          <small> W/m²</small>{' '}
          <span className="text-wk-ink3">설계 상한 · 추정</span>
        </span>
      ) : (
        <span className="text-wk-ink3">공급사 사양서 회수 후 기재</span>
      ),
    },
    { k: '화면 치수 · 무게', v: <span className="text-wk-ink3">캐비닛 구성 확정 후 실측 기재</span> },
    { k: '설치비 기준', v: <span className="wk-metric">{SKU_PRICE_FROM[p.sku]} <span className="text-wk-ink3">VAT 별도</span></span> },
    { k: '주로 쓰이는 자리', v: p.bestFor.join(' · ') },
    { k: '내부 관리 코드', v: <span className="wk-metric text-wk-ink3">{p.sku}</span> },
  ]

  return (
    <section className="wk-sec bg-white">
      <div className="wk-wrap">
        {/* 2026-09-07 — 이 섹션에는 등장 모션이 하나도 없었다(구조정본 §16-A 진단 ③).
            섹션 머리 3박자를 붙인다. RiseMask 는 Reveal 밖 형제(§16-D). */}
        <Reveal y={10}>
          <p className="wk-eyebrow">규격서</p>
        </Reveal>
        <RiseMask delay={0.06}>
          <h2 className="wk-h2 max-w-2xl text-wk-ink">
            제품 하나씩, 결재 문서에 옮겨 적는 순서대로
          </h2>
        </RiseMask>
        <Reveal y={14} delay={0.16}>
          <p className="wk-lead mt-5">
            위 비교표에서 후보를 좁혔다면 여기서 한 제품씩 확인하십시오. 항목과 단위를
            결재 문서에 쓰는 그대로 적었고, 확정되지 않은 항목은 지어내지 않고 비워 둔 채
            실측 후 채웁니다.
          </p>
        </Reveal>

        {/* 탭 — 색 + 밑줄 + 굵기 */}
        <div className="mt-10 -mx-5 overflow-x-auto px-5 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12">
          <div role="tablist" aria-label="제품 선택" className="flex min-w-max gap-1 border-b border-wk-line">
            {PRODUCTS.map((item) => {
              const on = item.sku === active
              return (
                <button
                  key={item.sku}
                  role="tab"
                  type="button"
                  id={`spec-tab-${item.sku}`}
                  aria-selected={on}
                  aria-controls="spec-panel"
                  onClick={() => setActive(item.sku)}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-label transition-colors duration-state ease-state ${
                    on
                      ? 'border-wk-cta font-bold text-wk-cta'
                      : 'border-transparent font-medium text-wk-ink3 hover:text-wk-ink'
                  }`}
                >
                  {item.name}
                </button>
              )
            })}
          </div>
        </div>

        <div
          id="spec-panel"
          role="tabpanel"
          aria-labelledby={`spec-tab-${p.sku}`}
          className="mt-8 grid gap-6 lg:grid-cols-12 lg:gap-8"
        >
          {/* 사진 + 요약 */}
          <div className="lg:col-span-5">
            {/* 탭을 바꾸면 사진이 **갈아 끼워진다** — LedSwap 은 밝기를 한 번 떨궜다
                올리는 전환이라 화면이 바뀌는 물건에 맞는다.
                🔴 패널 전체가 아니라 사진에만 건다. AnimatePresence(mode="wait") 는
                   나가는 요소가 빠진 뒤 들어오므로, 글 길이가 다른 패널에 걸면
                   높이가 무너져 아래가 튄다(§14 함정). 사진틀은 aspect 고정이라 안전하다. */}
            <div className="wk-card-img wk-hov-media relative aspect-[4/3]">
              {/* 🔴 자리는 바깥 틀(aspect-[4/3])이 **먼저** 잡는다.
                  LedSwap 은 AnimatePresence(mode="wait") 라 나가는 사진이 빠진 뒤 들어오는데,
                  그 사이 프레임에 내용이 비어 부모 높이가 무너지면 아래 글이 튄다(§14 함정).
                  틀이 높이를 이미 갖고 있고 안쪽은 absolute 라 레이아웃 이동이 0 이다. */}
              <LedSwap index={PRODUCTS.findIndex((x) => x.sku === p.sku)}>
                <div className="absolute inset-0">
                  <Image
                    key={p.sku}
                    src={p.img}
                    alt={p.imgAlt}
                    fill
                    sizes="(min-width:1024px) 42vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </LedSwap>
            </div>
            <p className="wk-body mt-5">{p.summary}</p>

            <ul className="m-0 mt-5 list-none space-y-2 p-0">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-2.5 text-label text-wk-ink2">
                  <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-wk-cta" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* 규격 정의 목록 */}
          <div className="lg:col-span-7">
            <dl className="m-0 overflow-hidden rounded-card border border-wk-line">
              {rows.map((r, i) => (
                <div
                  key={r.k}
                  className={`${DL} ${i > 0 ? 'border-t border-wk-line' : ''}`}
                >
                  <dt className="bg-wk-bgFaint px-5 pb-1 pt-4 text-label font-semibold text-wk-ink2 sm:py-4">
                    {r.k}
                  </dt>
                  <dd className="m-0 px-5 pb-4 pt-1 text-body text-wk-ink sm:py-4">{r.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 rounded-card-m border border-wk-line bg-wk-bgFaint p-5">
              <p className="text-label font-semibold text-wk-ink">
                가격에 포함되는 것과 별도인 것
              </p>
              <p className="mt-2 text-label leading-relaxed text-wk-ink2">
                <b className="font-semibold text-wk-ink">포함</b> — LED 패널 · 컨트롤러 · 전원 ·
                프레임 · 표준 설치 노무
              </p>
              <p className="mt-1.5 text-label leading-relaxed text-wk-ink2">
                <b className="font-semibold text-wk-ink">별도</b> — 전기 증설 · 구조 보강 ·
                옥외광고물 신고 · 고소작업 · 야간 시공 · VAT
              </p>
              <p className="wk-cap mt-3">{PRICE_DISCLAIMER}</p>
            </div>

            {/* 🔴 2026-09-07 접점 정리 — 옆에 있던 '규격서 요청·문의' → /support 버튼을 없앴다.
                두 가지가 겹쳐 있었다. ① 목적지가 틀렸다(규격 문의를 A/S 창구로 보냈다)
                ② 문서 제공 약속이었다(CEO 지시로 사이트 전체에서 걷어냈다).
                이 페이지의 견적 경로는 히어로 · 이 버튼 · 하단 CtaSection **세 곳**이 남고,
                /support 는 상단 메뉴와 푸터에 그대로 있다.
                (2026-09-07 갱신 — PackagesSection 이 CEO 지시로 철수해 네 곳에서 세 곳이 됐다.
                 이 버튼은 제품별 규격서 옆에 붙는 유일한 견적 진입점이라 지우면 안 된다.) */}
            <div className="mt-5">
              <Link
                href={`/quote?type=${p.env === 'indoor' ? 'institution' : 'outdoor'}`}
                className="wk-btn-p"
              >
                이 조건으로 견적 문의
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
