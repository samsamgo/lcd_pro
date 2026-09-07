import Image from 'next/image'

import { IMAGES } from '@/lib/imageAssets'
import { Reveal, RiseMask, ScrollBridge, Stagger } from '@/components/motion'

/**
 * 설치 자리별 실제 화면 예시.
 *
 * 왜 만들었나 — /industries 에 "무엇을 띄우게 되는가"가 없었다.
 * 사례 카드는 우리가 무엇을 파는지 말하지만, 담당자가 궁금한 건
 * "우리 기관에 걸면 저기 뭐가 뜨지?" 다. 그건 글보다 사진이 빠르다.
 *
 * 사진 선정 기준(CEO 2026-09-06) — 화면에 **한국어 문구**가 떠 있을 것.
 * 추상 그라데이션이 뜬 사진은 딱 봐도 AI라 쓰지 않는다.
 */

type Scene = {
  src: string
  where: string
  /** 그 화면에 실제로 떠 있는 문구 */
  showing: string
  alt: string
}

const SCENES: Scene[] = [
  {
    src: IMAGES.industryShowing[0],
    where: '학교 정문',
    showing: '안전한 등굣길 서로 배려해요',
    alt: '학교 정문 아치에 설치된 가로형 전광판이 등굣길 안전 문구를 표시하고 있고 학생들이 걸어 들어가고 있다',
  },
  {
    src: IMAGES.industryShowing[1],
    where: '민원실 로비',
    showing: '층별 안내 · 민원실 2층 · 복지 3층',
    alt: '관공서 민원실 로비에 세워진 세로형 안내 화면이 층별 안내를 표시하고 있다',
  },
  {
    src: IMAGES.industryShowing[2],
    where: '학교 운동장',
    showing: '체육 행사 안내 · 행사 시작 14:00',
    alt: '학교 운동장 건너편에 설치된 대형 화면이 체육 행사 안내와 시작 시각을 표시하고 있다',
  },
  {
    src: IMAGES.industryShowing[3],
    where: '어린이집 현관',
    showing: '오늘의 활동 · 그림책 읽기',
    alt: '어린이집 현관에 설치된 소형 화면이 그날의 활동 안내를 표시하고 있다',
  },
]

export function IndustryScenes() {
  return (
    <>
      {/* 🔴 2026-09-07 명암 재설계.
          /industries 는 다크 히어로 뒤로 **연속 라이트 네 섹션**이었다(카드→비교표→화면예시→검토사항).
          홈에서 이미 같은 진단을 했고(구조정본 §17-A ①), 답도 같다 — 전부 뒤집지 않고 **한 섹션만**.
          그 한 섹션이 여기인 이유는 취향이 아니라 내용이다: 이 섹션의 사진 4장은
          전부 '켜져 있는 화면' 이고, 발광체는 어두운 면 위에서만 발광체로 보인다.
          비교표(근거)와 검토사항(서류)은 라이트가 맞다.
          다리 높이는 h-24/32 — 페이지 최대 전환인 히어로보다 낮게 둔다(위계). */}
      <ScrollBridge
        direction="down"
        className="h-24 bg-gradient-to-b from-wk-bgFaint to-wk-night md:h-32"
        cell={16}
      />
      <section
        aria-labelledby="ind-scenes-h"
        className="wk-night wk-sec-lg wk-pixelgrid wk-pixelgrid-top wk-pixelgrid-coarse relative overflow-hidden"
      >
        <div className="wk-wrap-wide relative">
          <Reveal y={10}>
            <p className="wk-eyebrow !text-wk-nightMuted">화면 예시</p>
          </Reveal>
          <RiseMask delay={0.06}>
            <h2 id="ind-scenes-h" className="wk-display wk-emit-text text-wk-nightInk">
              걸면 무엇이 뜨나
            </h2>
          </RiseMask>
          <Reveal y={14} delay={0.16}>
            <p className="wk-lead mt-5 !text-wk-nightMuted">
              기관마다 띄우는 내용이 다릅니다. 학교는 급식과 행사, 청사는 민원 안내,
              도로변은 재난 문구입니다. 화면 내용은 담당자가 직접 바꿉니다.
            </p>
          </Reveal>

          <Stagger
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
            y={14}
            gap={0.06}
          >
            {SCENES.map((s) => (
              <figure key={s.where} className="m-0">
                {/* .wk-emit(베젤+스페큘러) + .wk-emit-spill(새어 나오는 빛) +
                    .wk-hov-emit-media(누를 수 없으므로 뜨지 않는 호버) — §17-B */}
                <div className="wk-emit wk-emit-spill wk-hov-emit-media relative aspect-[4/3] overflow-hidden rounded-card bg-wk-night2">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    sizes="(min-width:1024px) 24vw, (min-width:640px) 48vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-4">
                  <p className="text-caption font-semibold uppercase tracking-widest text-wk-nightMuted">
                    {s.where}
                  </p>
                  <p className="mt-1.5 text-body-lg font-semibold text-wk-nightInk">{s.showing}</p>
                </figcaption>
              </figure>
            ))}
          </Stagger>

          <p className="mt-8 text-caption leading-relaxed text-wk-nightMuted">
            화면에 띄우는 문구와 이미지는 인수 시 담당자분께 바꾸는 방법을 알려드립니다.
          </p>
        </div>
      </section>
      <ScrollBridge
        direction="up"
        className="h-24 bg-gradient-to-b from-wk-night to-wk-bgFaint md:h-32"
        cell={16}
      />
    </>
  )
}
