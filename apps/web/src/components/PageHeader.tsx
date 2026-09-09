import Image from 'next/image'

/**
 * 하위 페이지 공통 머리 — 사이트의 모든 하위 페이지가 **이 하나**를 쓴다. 홈만 예외(HeroSlider).
 *
 * 🔴 2026-09-08 CEO 지시 "다른 모든 페이지·네비 방식 통일. 하나만 다른 걸로 하지 마라."
 *    전에는 페이지마다 머리가 달랐다 — 사진 히어로에 버튼·통계·칩이 붙은 것, 흰 바탕에 제목만
 *    있는 것, 높이도 문구 위치도 제각각. 국내 사이니지 업체 사이트의 서브 비주얼 관행대로
 *    **같은 높이의 사진 배너 + 메뉴 그룹 + 페이지 이름 + 한 줄**로 고정한다.
 *
 * 규칙
 *  - `group` = 네비바 상단 메뉴 이름(회사소개 / 제품 / 시공사례 / 고객지원)
 *  - `title` = 네비바 하위 메뉴 이름 그대로. 문장형 카피는 `lead` 로 내린다
 *  - 버튼·통계·칩을 여기 넣지 않는다. 그건 본문 첫 섹션의 일이다
 *  - 애니메이션 없음. 첫 화면은 JS 와 무관하게 즉시 보여야 한다
 *  - 사진은 캡션 없는 배경 층이다. 실적·장소를 주장하지 않는다
 */
export function PageHeader({
  group,
  title,
  lead,
  image,
  imageAlt = '',
}: {
  group: string
  title: string
  lead?: string
  image: string
  imageAlt?: string
}) {
  return (
    <section data-wk-dark-hero className="relative flex min-h-[44svh] items-end overflow-hidden bg-wk-night pt-16 md:min-h-[48svh]">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          quality={80}
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wk-night via-wk-night/60 to-wk-night/25" />
      </div>
      <div className="relative z-10 w-full pb-10 md:pb-14">
        <div className="wk-wrap">
          <p className="wk-eyebrow !text-white/70">{group}</p>
          <h1 className="wk-h1 wk-emit-text text-white">{title}</h1>
          {lead && <p className="wk-lead mt-4 max-w-[34em] !text-white/85">{lead}</p>}
        </div>
      </div>
    </section>
  )
}
