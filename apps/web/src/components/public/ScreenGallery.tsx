import Image from 'next/image'

/**
 * 설치 화면 갤러리.
 *
 * ⚠️ 이 섹션을 "납품사례"라고 부르지 않는다.
 * 경쟁사 조사에서 "기관명 없이 '관공서 시공'으로만 적힌 사례"가
 * 영세해 보이는 요소 1순위로 꼽혔다. 우강테크는 아직 검증 가능한
 * 기관 실적이 없으므로, 실적으로 위장하는 대신 화면 용도로 설명하고
 * 준공 기록을 어떤 형식으로 공개할지 미리 약속한다.
 *
 * 사진은 실사 컷만 사용한다(렌더로 보이는 case-00/05/06/12/20/21/24/26/27 제외).
 */
const SCREENS = [
  { src: '/cases/opt/case-04.jpg', title: '캠페인 · 행사 안내', meta: '로비 · 이동식 스탠드' },
  { src: '/cases/opt/case-15.jpg', title: '종합안내 · 대기 순번', meta: '로비 대형 · 벽부' },
  { src: '/cases/opt/case-07.jpg', title: '창구 · 접수 안내', meta: '접수대 · 스탠드형' },
  { src: '/cases/opt/case-17.jpg', title: '구역 · 방향 안내', meta: '홀 · 곡면 설치' },
  { src: '/cases/opt/case-14.jpg', title: '옥외 문자 안내', meta: '진입로 · 옥외' },
  { src: '/cases/opt/case-11.jpg', title: '주차 · 동선 안내', meta: '진입로 · 옥외' },
]

export function ScreenGallery() {
  return (
    <section id="screens" className="wk-sec bg-wk-bg">
      <div className="wk-wrap">
        <p className="wk-eyebrow">설치 화면</p>
        <h2 className="wk-h2 text-wk-ink">실제로 띄우는 화면들</h2>
        <p className="wk-lead mt-3.5 max-w-[40em]">
          대기번호, 층별 안내, 운영시간. 매일 바뀌는 정보가 대부분입니다.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {SCREENS.map((s) => (
            <figure key={s.src} className="m-0">
              <div className="wk-card-img relative aspect-[4/3]">
                <Image
                  src={s.src}
                  alt={s.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-1 pt-3">
                <b className="text-base font-semibold text-wk-ink">{s.title}</b>
                <span className="wk-cap mt-0.5 block">{s.meta}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="wk-cap mt-5 max-w-[52em]">
          위 사진은 설치 환경과 화면 구성 예시입니다. 발주처별 준공 기록은 첫 기관 납품이 끝나는 대로
          기관명·설치 장소·준공월·화면 규격·공사 범위를 같은 형식으로 공개합니다.
        </p>
      </div>
    </section>
  )
}
