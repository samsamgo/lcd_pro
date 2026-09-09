import Image from 'next/image'
import Link from 'next/link'

import { Stagger } from '@/components/motion'
import { FORM_LABEL, envText, pitchRange, type ProductModel } from '@/lib/productModels'

/**
 * 모델 카드 격자 — **검정 배경 위 흰 카드.**
 *
 * 국내 사이니지 업체(온빛전자) 제품 목록의 형태를 그대로 가져왔다. 이유가 있다:
 * 캐비닛 렌더는 대부분 어두운 회색 사출물이라 흰 배경 위에 두면 카드 경계가 사라지고,
 * 검정 배경 위 흰 카드에 얹으면 제품 윤곽이 가장 또렷하게 떨어진다.
 *
 * 카드에 적는 것은 넷뿐 — 시리즈 이름 / 한글 이름 / 화소 간격 범위 / 구성 단위.
 * 밝기는 여기 쓰지 않는다(CEO 2026-09-09 "밝기로 쓰지 말고 크기로"). 규격표에서 본다.
 */
export function ModelGrid({
  models,
  title,
  eyebrow,
  note,
}: {
  models: ProductModel[]
  title: string
  eyebrow?: string
  note?: string
}) {
  if (models.length === 0) return null

  return (
    <section className="wk-sec bg-wk-night" aria-labelledby="models-h">
      <div className="wk-wrap">
        {eyebrow && <p className="wk-eyebrow !text-wk-blue">{eyebrow}</p>}
        <h2 id="models-h" className="wk-h2 text-white">
          {title}
        </h2>
        {note && <p className="mt-3 max-w-[46em] text-body text-wk-nightMuted">{note}</p>}

        <Stagger className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
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
