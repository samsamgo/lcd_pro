import Image from 'next/image'
import { IMAGES } from '@/lib/imageAssets'
import { Reveal, RevealImage, ScrollScale } from '@/components/motion'

/**
 * 구조 쇼케이스.
 *
 * 사진을 예쁘라고 넣지 않는다. 각 장이 무엇을 증명하는지 캡션에 적는다.
 * 증명할 수 없는 것(우리 현장 실적)은 여기서 주장하지 않는다 —
 * 첫 시공 전이므로 이 장면들은 구조 설명용 예시임을 섹션에 명시한다.
 */
const [EXPLODED, WIRING, LOUVRE, FLATLAY] = IMAGES.showcase

const DETAILS = [
  {
    src: WIRING,
    alt: '작업장에서 LED 캐비닛 후면을 열어 전원 분기와 신호 케이블을 정리한 상태',
    title: '후면 배선과 전원 분기',
    body: '점검 통로를 확보할 수 있는지에 따라 정비 방식이 전면형과 후면형으로 갈립니다. 실측 때 벽과 화면 사이 여유를 확인합니다.',
  },
  {
    src: LOUVRE,
    alt: '옥외 LED 캐비닛 측면의 방열 루버 구조 근접',
    title: '측면 방열 구조',
    body: '옥외 화면은 여름 직사광선 아래에서 스스로 발열합니다. 열이 빠져나가는 경로가 수명과 밝기 유지에 직접 영향을 줍니다.',
  },
  {
    src: FLATLAY,
    alt: 'LED 모듈·전원장치·수신카드·프레임 부품을 펼쳐 놓은 구성',
    title: '견적서에 적히는 품목 그대로',
    body: '모듈, 전원장치, 수신카드, 프레임. 견적서의 항목과 실제 들어가는 부품이 같은 이름으로 대응됩니다.',
  },
]

export function StructureShowcase() {
  return (
    <section className="wk-sec-lg bg-white">
      <div className="wk-wrap">
        <Reveal>
          <p className="wk-eyebrow">구조</p>
          <h2 className="wk-h2 max-w-xl text-wk-ink">
            정비 방식
          </h2>
          <p className="wk-lead mt-5">
            화면은 한 덩어리가 아닙니다. 모듈 단위로 분리되기 때문에 고장 난 부분만
            교체할 수 있고, 그래서 유지보수 비용을 예측할 수 있습니다.
          </p>
        </Reveal>
      </div>

      {/* 리드 장면 — 분해도 */}
      <div className="wk-wrap-wide mt-12 lg:mt-16">
        <ScrollScale>
          <figure className="m-0">
            <div className="wk-grain relative aspect-[16/9] overflow-hidden bg-wk-bg">
              <Image
                src={EXPLODED}
                alt="LED 화면의 모듈·프레임·전원부를 층별로 분리해 보여주는 분해 구성도"
                fill
                sizes="(min-width:1440px) 1440px, 100vw"
                className="object-cover"
              />
            </div>
          </figure>
        </ScrollScale>
        <p className="wk-cap mt-4 max-w-xl">
          층별 분해 구성 — 앞면 모듈, 프레임, 전원·제어부가 분리됩니다. 한 모듈이 꺼져도
          화면 전체를 해체하지 않습니다.
        </p>
      </div>

      {/* 상세 3장 */}
      <div className="wk-wrap mt-14 grid gap-6 md:grid-cols-3 lg:mt-20">
        {DETAILS.map((d, n) => (
          <RevealImage key={d.title} delay={n * 0.08}>
            <figure className="m-0">
              <div className="wk-card-img relative aspect-[4/3]">
                <Image
                  src={d.src}
                  alt={d.alt}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4">
                <b className="block text-body-lg font-semibold text-wk-ink">{d.title}</b>
                <span className="mt-1.5 block text-label leading-relaxed text-wk-ink2">
                  {d.body}
                </span>
              </figcaption>
            </figure>
          </RevealImage>
        ))}
      </div>

      <div className="wk-wrap mt-10">
        <p className="wk-cap max-w-xl">
          이 페이지의 구조 이미지는 설명을 위한 예시입니다. 실제 납품 현장 사진은 첫 시공
          검수가 끝난 뒤 현장명 공개 범위를 협의해 게시합니다.
        </p>
      </div>
    </section>
  )
}
