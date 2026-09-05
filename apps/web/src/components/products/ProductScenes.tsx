import Image from 'next/image'
import { IMAGES } from '@/lib/imageAssets'
import { Reveal } from '@/components/motion'

/**
 * 환경별 장면.
 *
 * 같은 화면도 놓이는 자리에 따라 요구가 완전히 달라진다.
 * 광장은 시야각, 곡면 벽은 프레임 가공, 메뉴판은 근거리 가독성,
 * 쇼룸은 색 재현이 먼저다. 사진마다 그 초점을 한 줄로 적는다.
 */
const SCENES = [
  {
    src: IMAGES.productScenes[0],
    alt: '청사 외벽에 벽부형으로 설치된 가로형 LED 안내 화면',
    label: '청사 외벽 · 벽부형',
    body: '햇빛이 직접 닿는 면입니다. 밝기와 방수 등급을 먼저 정하고 취부 철물을 설계합니다.',
  },
  {
    src: IMAGES.productScenes[1],
    alt: '건물 로비 안내데스크 위 벽면을 채운 대형 실내 LED 화면',
    label: '로비 · 대형 벽부',
    body: '오가며 스치듯 봅니다. 멀리서도 한눈에 읽히도록 글자 크기부터 역산합니다.',
  },
  {
    src: IMAGES.productScenes[2],
    alt: '공원 산책로 옆에 세워진 주민 안내용 LED 키오스크',
    label: '옥외 스탠드형',
    body: '사람이 걸어와 바로 앞에서 봅니다. 화소는 촘촘하게, 높이는 눈높이에 맞춥니다.',
  },
  {
    src: IMAGES.productScenes[3],
    alt: '도로변에 지주로 세워진 옥외 정보 표시용 LED 화면',
    label: '도로변 · 지주형',
    body: '달리는 차에서 읽어야 합니다. 시청 거리가 멀어 화소는 넓게, 밝기는 높게 잡습니다.',
  },
]

export function ProductScenes() {
  return (
    <>
      <div className="wk-bridge-down h-24 md:h-32" aria-hidden="true" />
      <section className="wk-night wk-sec">
        <div className="wk-wrap">
          <Reveal>
            <p className="wk-eyebrow !text-wk-nightMuted">설치 환경</p>
            <h2 className="wk-h2 max-w-xl text-wk-nightInk">
              놓이는 자리
            </h2>
            <p className="wk-lead mt-5 !text-wk-nightMuted">
              아래 네 자리는 우리가 견적 단계에서 서로 다른 항목을 확인하는 대표적인
              경우입니다.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {SCENES.map((s, n) => (
              <Reveal key={s.label} y={16} delay={Math.min(n, 4) * 0.07}>
                <figure className="m-0">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-card-m bg-wk-night2 sm:rounded-card">
                    <Image
                      src={s.src}
                      alt={s.alt}
                      fill
                      sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-4">
                    <b className="block text-body-lg font-semibold text-wk-nightInk">
                      {s.label}
                    </b>
                    <span className="mt-1.5 block text-label leading-relaxed text-wk-nightMuted">
                      {s.body}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <div className="wk-bridge-up h-24 md:h-32" aria-hidden="true" />
    </>
  )
}
