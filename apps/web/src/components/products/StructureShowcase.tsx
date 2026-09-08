import Image from 'next/image'
import { IMAGES } from '@/lib/imageAssets'
import { Reveal, RevealImage, RiseMask, ScrollScale } from '@/components/motion'

/**
 * 구조 쇼케이스.
 *
 * 사진을 예쁘라고 넣지 않는다. 각 장이 무엇을 증명하는지 캡션에 적는다.
 * 증명할 수 없는 것(우리 현장 실적)은 여기서 주장하지 않는다 —
 * 첫 시공 전이므로 이 장면들은 구조 설명용 예시임을 섹션에 명시한다.
 *
 * 2026-09-07 사진 전수 육안 판독으로 두 가지를 고쳤다.
 *   ① 방열 루버 컷(A8)은 배경이 미국이었다(목주 배전주·배럴 변압기·미국식 주차장).
 *      국적 단서가 없는 캐비닛 스튜디오 컷으로 교체했다.
 *   ② 캡션이 사진과 어긋나 있었다. 리드 컷은 '층별 분해도'가 아니라 부품을
 *      나란히 늘어놓은 컷이고, 마지막 컷에는 전원장치·수신카드가 없다.
 *      사진에 실제로 있는 것만 적는다.
 */
// 2026-09-09 showcase[1](G3 후면 배선)은 배경이 해외(미국식 배전주·차량)라 쓰지 않는다
const [PARTS, , CABINET, MODULE] = IMAGES.showcase

const DETAILS = [
  {
    src: CABINET,
    alt: '표준 LED 캐비닛의 후면 프레임 — 모듈 고정부와 잠금 장치, 운반용 손잡이가 보인다',
    title: '캐비닛 한 장이 기준 단위',
    body: '화면 크기는 캐비닛을 몇 장 어떻게 짜느냐로 정해집니다. 잠금과 손잡이가 규격화돼 있어 한 장만 떼어 내고 다시 맞출 수 있고, 그래서 화면 전체를 세우지 않고 정비합니다.',
  },
  {
    src: MODULE,
    alt: 'LED 모듈 한 장과 고정 브래킷, 전원 커넥터, 드라이버·렌치·멀티미터를 펼쳐 놓은 구성',
    title: '고장 나면 이 한 장만 바꿉니다',
    body: '교체 단위는 화면이 아니라 모듈 한 장입니다. 공구도 드라이버와 렌치 수준이라 유지보수 비용을 미리 계산할 수 있습니다.',
  },
]


export function StructureShowcase() {
  return (
    <section className="wk-sec bg-white">
      <div className="wk-wrap">
        {/* 섹션 머리 3박자(§16-C). RiseMask 는 Reveal 밖 형제로 둔다(§16-D) */}
        <Reveal y={10}>
          <p className="wk-eyebrow">구조</p>
        </Reveal>
        <RiseMask delay={0.06}>
          <h2 className="wk-h2 max-w-2xl text-wk-ink">
            고장 나면 화면 전체가 아니라 모듈 한 장을 바꿉니다
          </h2>
        </RiseMask>
        <Reveal y={14} delay={0.16}>
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
            <div className="wk-grain relative aspect-[2/1] overflow-hidden bg-wk-bg">
              <Image
                src={PARTS}
                alt="작업대 위에 LED 모듈, 구동 기판, 전원장치(SMPS), 캐비닛 프레임을 분해해 나란히 늘어놓은 상태"
                fill
                sizes="(min-width:1440px) 1440px, 100vw"
                className="object-cover"
              />
            </div>
          </figure>
        </ScrollScale>
        <p className="wk-cap mt-4 max-w-2xl">
          캐비닛 한 장을 분해하면 나오는 전부 — 앞면 LED 모듈, 구동 기판, 전원장치(SMPS),
          프레임. 견적서에 적히는 품목과 실제로 들어가는 부품이 같은 이름으로 대응됩니다.
        </p>
      </div>

      {/* 상세 3장 */}
      <div className="wk-wrap mt-14 grid gap-6 md:grid-cols-2 lg:mt-20">
        {DETAILS.map((d, n) => (
          <RevealImage key={d.title} delay={n * 0.08}>
            <figure className="m-0">
              <div className="wk-card-img wk-hov-media relative aspect-[4/3]">
                <Image
                  src={d.src}
                  alt={d.alt}
                  fill
                  sizes="(min-width:1024px) 50vw, 100vw"
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

      {/* 2026-09-09 CEO "불리한 말은 전부 빼라" — '실적을 주장하는 사진이 아닙니다' 각주 제거 */}
    </section>
  )
}
