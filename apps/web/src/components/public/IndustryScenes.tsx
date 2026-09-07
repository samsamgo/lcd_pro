import Image from 'next/image'

import { IMAGES } from '@/lib/imageAssets'
import { Reveal, Stagger } from '@/components/motion'

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
    <section aria-labelledby="ind-scenes-h" className="wk-sec-lg bg-white">
      <div className="wk-wrap-wide">
        <Reveal>
          <p className="wk-eyebrow">화면 예시</p>
          <h2 id="ind-scenes-h" className="wk-h2 text-wk-ink">
            걸면 무엇이 뜨나
          </h2>
          <p className="wk-lead mt-5">
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
              <div className="relative aspect-[4/3] overflow-hidden rounded-card">
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width:1024px) 24vw, (min-width:640px) 48vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4">
                <p className="text-caption font-semibold uppercase tracking-widest text-wk-ink3">
                  {s.where}
                </p>
                <p className="mt-1.5 text-body-lg font-semibold text-wk-ink">{s.showing}</p>
              </figcaption>
            </figure>
          ))}
        </Stagger>

        <p className="wk-cap mt-8">
          화면에 띄우는 문구와 이미지는 인수 시 담당자분께 바꾸는 방법을 알려드립니다.
        </p>
      </div>
    </section>
  )
}
