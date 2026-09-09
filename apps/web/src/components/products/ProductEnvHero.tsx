import Image from 'next/image'
import Link from 'next/link'

/**
 * 제품 카테고리 다크 배너.
 *
 * 왜 PageHeader 를 쓰지 않는가 — 제품 목록만은 영문 한 단어(INDOOR / OUTDOOR)를 크게 얹는다.
 * 국내 사이니지 업체(온빛전자)의 제품 목록이 그 형태고, 담당자가 "실내인지 실외인지"를
 * 스크롤 없이 한 번에 알아보게 하는 것이 이 배너의 유일한 일이다.
 * 대신 **높이·여백·다크 처리·본문 폭은 PageHeader 와 같은 값**을 쓴다 — 페이지마다 머리가
 * 달라 보이면 안 된다(2026-09-08 CEO 지시).
 *
 * 애니메이션 없음. 첫 화면은 JS 와 무관하게 즉시 보여야 한다.
 */
export function ProductEnvHero({
  display,
  title,
  lead,
  image,
  imageAlt = '',
  trail,
}: {
  /** 크게 얹는 영문 한 단어 */
  display: string
  title: string
  lead?: string
  image: string
  imageAlt?: string
  /** 빵부스러기 — 마지막 항목은 링크 없이 */
  trail: { label: string; href?: string }[]
}) {
  return (
    <section className="relative flex min-h-[44svh] items-end overflow-hidden bg-wk-night pt-16 md:min-h-[48svh]">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          quality={80}
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wk-night via-wk-night/70 to-wk-night/35" />
      </div>

      <div className="relative z-10 w-full pb-10 md:pb-14">
        <div className="wk-wrap">
          <p
            aria-hidden="true"
            className="text-display-xl font-extrabold uppercase leading-none tracking-[0.02em] text-white"
          >
            {display}
          </p>
          <h1 className="mt-3 text-h3 font-bold text-white">{title}</h1>
          {lead && <p className="mt-3 max-w-[38em] text-body text-white/80">{lead}</p>}

          <nav aria-label="현재 위치" className="mt-6">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-white/60">
              {trail.map((t, i) => (
                <li key={t.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {t.href ? (
                    <Link href={t.href} className="underline-offset-4 hover:text-white hover:underline">
                      {t.label}
                    </Link>
                  ) : (
                    <span className="font-semibold text-white/90">{t.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  )
}
