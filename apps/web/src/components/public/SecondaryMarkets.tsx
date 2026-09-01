import Link from 'next/link'
import Image from 'next/image'

/**
 * 민간·소상공인 — 2차 영역.
 *
 * 요청자(이서윤) 원문: "소상공인이나 일반 매장 쪽을 아예 제외하자는 건 아니고,
 * 관공서·공공기관·학교를 메인으로 두고 민간·소상공인을 그다음 영역으로."
 *
 * 그래서 지우지 않고 페이지 하단에 압축해서 남긴다.
 * 기존 5개 업종(카페·식당·헬스장·프랜차이즈·옥외)을 2개로 묶었다.
 */
const MARKETS = [
  {
    href: '/industries/retail',
    title: '매장 · 상업공간',
    desc: '카페, 식당, 헬스장, 리테일. 메뉴와 가격, 이벤트 안내를 화면에서 바로 바꿉니다.',
    image: '/curated/gal-restaurant-menu.jpg',
    imageAlt: '카페 매장 실내에 설치된 LED 메뉴 디스플레이',
  },
  {
    href: '/industries/outdoor-ad',
    title: '옥외 광고',
    desc: '건물 외벽과 도로변 대형 화면. 밝기와 방수 등급, 옥외광고물 신고까지 함께 처리합니다.',
    image: '/curated/gal-roadside-billboard.jpg',
    imageAlt: '도로변에 설치된 대형 옥외 LED 전광판',
  },
]

export function SecondaryMarkets() {
  return (
    <section className="wk-sec bg-white">
      <div className="wk-wrap">
        <p className="wk-eyebrow">민간 · 상업공간</p>
        <h2 className="wk-h2 text-wk-ink">공공기관만 하는 것은 아닙니다</h2>
        <p className="wk-lead mt-3.5 max-w-[40em]">
          같은 장비, 같은 시공 절차, 같은 A/S 기준으로 민간 현장도 진행합니다.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:gap-5">
          {MARKETS.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="group block rounded-card-m bg-wk-bg p-4 transition-colors hover:bg-wk-line sm:rounded-card sm:p-5"
            >
              <div className="wk-card-img relative aspect-[16/10] bg-white">
                <Image
                  src={m.image}
                  alt={m.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, 560px"
                  className="object-cover"
                />
              </div>
              <div className="flex items-end justify-between gap-4 px-1 pt-4">
                <div>
                  <b className="wk-h3 block text-wk-ink">{m.title}</b>
                  <span className="mt-1 block text-[15px] leading-[23px] text-wk-ink3">{m.desc}</span>
                </div>
                <span className="shrink-0 pb-1 text-sm font-semibold text-wk-ink4 transition-colors group-hover:text-wk-blue">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
