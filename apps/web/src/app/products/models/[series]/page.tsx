import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/Footer'
import { CtaSection } from '@/components/landing/CtaSection'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { NavBar } from '@/components/NavBar'
import { JsonLd } from '@/components/seo/JsonLd'
import { ModelInquiryButtons } from '@/components/products/ModelInquiryButtons'
import { ModelSpecTable } from '@/components/products/ModelSpecTable'
import {
  envText,
  FORM_LABEL,
  PRODUCT_MODELS,
  getModel,
  pitchRange,
  viewingHint,
} from '@/lib/productModels'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

type PageProps = { params: { series: string } }

/**
 * 모델(시리즈) 상세 — 좌측 큰 렌더, 우측 이름·요약·문의. 그 아래 **화소 간격별 전체 규격표.**
 *
 * ⚠️ 세그먼트 규칙 — 기존 `/products/[sku]`(견적 SKU 6종)와 같은 층에 동적 세그먼트를 하나 더
 *    두면 Next 가 라우트 충돌로 빌드에 실패한다. 그래서 모델 층은 한 칸 아래
 *    **`/products/models/[series]`** 에 둔다. 카테고리 정적 경로(`/products/indoor` 등)와도 겹치지 않는다.
 */
export function generateStaticParams() {
  return PRODUCT_MODELS.map((m) => ({ series: m.slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const model = getModel(params.series)
  if (!model) notFound()
  return buildMetadata({
    title: `${model.series} ${model.name}`,
    description: `${model.tagline} 화소 간격 ${pitchRange(model)}. 간격별 전체 규격을 표로 공개합니다.`,
    path: `/products/models/${params.series}`,
  })
}

export default function ModelPage({ params }: PageProps) {
  const model = getModel(params.series)
  if (!model) notFound()

  const summary: [string, string][] = [
    ['화소 간격', pitchRange(model)],
    ['간격 종류', `${model.pitches.length}종`],
    ['구성 단위', FORM_LABEL[model.form]],
    ['설치 환경', envText(model)],
    ['보는 거리(어림)', viewingHint(model)],
  ]

  return (
    <>
      <JsonLd
        id={`ld-breadcrumb-model-${model.slug}`}
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '제품', url: absoluteUrl('/products') },
          { name: model.series, url: absoluteUrl(`/products/models/${model.slug}`) },
        ])}
      />
      <NavBar />
      <main id="main">
        {/* 머리 — 다크 띠 하나. 사진은 아래 흰 바탕에서 크게 본다(렌더 배경이 투명이라
            어두운 배경 위에 얹으면 캐비닛 윤곽이 묻힌다) */}
        <section className="bg-wk-night pb-10 pt-28 md:pb-12 md:pt-32">
          <div className="wk-wrap">
            <nav aria-label="현재 위치">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-white/60">
                <li>
                  <Link href="/products" className="underline-offset-4 hover:text-white hover:underline">
                    제품
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  <span className="font-semibold text-white/90">{model.series}</span>
                </li>
              </ol>
            </nav>
            <h1 className="wk-metric mt-4 text-h1 font-extrabold tracking-[0.01em] text-white">{model.series}</h1>
            <p className="mt-2 text-body-lg text-white/85">{model.name}</p>
          </div>
        </section>


        {/* 좌 큰 렌더 · 우 요약 + 문의 */}
        <section className="wk-sec bg-white">
          <div className="wk-wrap grid gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-wk-line bg-white">
              <Image
                src={model.images[0].src}
                alt={model.images[0].alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 680px"
                className="object-contain p-6 md:p-10"
              />
            </div>

            <div>
              <p className="wk-eyebrow">{FORM_LABEL[model.form]}</p>
              <p className="text-lead font-semibold leading-snug text-wk-ink">{model.tagline}</p>

              <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-wk-line bg-wk-line">
                {summary.map(([k, v], i) => (
                  <div
                    key={k}
                    // 항목이 홀수면 마지막 칸이 빈 회색 상자로 남는다. 마지막을 두 칸으로 편다
                    className={`bg-white p-4 ${
                      summary.length % 2 === 1 && i === summary.length - 1 ? 'col-span-2' : ''
                    }`}
                  >
                    <dt className="text-caption text-wk-ink3">{k}</dt>
                    <dd className="wk-metric mt-1 text-label font-semibold text-wk-ink">{v || '-'}</dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-6 space-y-2">
                {model.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-label text-wk-ink2">
                    <span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-wk-cta" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <ModelInquiryButtons series={model.series} />
              </div>
              <p className="wk-cap mt-4">
                화면 크기·수량이 정해지지 않았어도 됩니다. 설치할 자리 사진과 대략의 폭만 알려 주시면 저희가 맞춰
                계산해 드립니다.
              </p>
            </div>
          </div>
        </section>

        {/* 전체 규격표 */}
        <section className="wk-sec-sm bg-wk-bg" aria-labelledby="spec-h">
          <div className="wk-wrap">
            <p className="wk-eyebrow">규격</p>
            <h2 id="spec-h" className="wk-h2 text-wk-ink">
              화소 간격별 전체 규격
            </h2>
            <p className="mt-3 max-w-[46em] text-body text-wk-ink2">
              공급사 규격서 표기를 그대로 옮긴 값입니다. 결재 문서에 그대로 옮겨 적으셔도 됩니다.
            </p>
            <div className="mt-7">
              <ModelSpecTable model={model} />
            </div>
            <p className="wk-cap mt-4">
              값이 &lsquo;-&rsquo; 인 칸은 규격서에서 확인되지 않았거나 표기가 어긋나 비워 둔 항목입니다. 확인되는 대로
              채웁니다. 확정 사양은 현장 실측과 발주 사양 확정 뒤에 정해집니다.
            </p>
          </div>
        </section>

        {/* 🔴 2026-09-09 CEO 지시 "이상한 거 다 지우고" — '같은 자리에 쓰는 다른 시리즈' 목록을 뺐다.
            전 시리즈 12종이 /products 한 페이지에 다 있으므로 상세에서 또 나열할 이유가 없다. */}
        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
