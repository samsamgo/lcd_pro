import Image from 'next/image'
import Link from 'next/link'

import { IMAGES } from '@/lib/imageAssets'
import { Reveal, RiseMask, Stagger } from '@/components/motion'

/**
 * 홈 — "우강테크를 선택해야 하는 이유" 4장.
 *
 * 🔴 2026-09-09 신설. 온빛전자 홈의 'PERFECT SYSTEM' 블록 구조를 그대로 가져왔다
 *    (재설계 브리프 §1): 두 톤 영문 대제목 2줄(둘째 줄 주황) + 한글 부제 + 사진 4장 가로 +
 *    사진마다 굵은 한 줄 + 작은 한 줄. 온빛도 로고가 주황이라 팔레트가 그대로 맞는다.
 *
 * 🔴 네 항목은 전부 **우리가 실제로 들고 있는 서류**에 근거한다(브리프 §4).
 *    시공 건수·연차·특허 수 같은 없는 숫자는 한 개도 쓰지 않았다.
 *      1 공장등록증명서   제조시설 81.27㎡ · 대전산업단지관리공단 (2026-08-19)
 *      2 정보통신공사업등록증  대전광역시 제420573호 (2026-08-25)
 *      3 방송통신기자재 적합등록  국립전파연구원 R-R-WKTC-LH-200-5P (2026-08-10)
 *      4 원격 진단 · 모듈 단위 교체 — 우리 제품 구조(전면 유지보수)에서 나오는 사실
 *    등록번호 전문과 스캔본은 /about/certification 이 정본이다. 여기서는 근거만 짧게 적는다.
 *
 * 🔴 사진 4장은 `IMAGES.spare` 에서 **한 장씩 열어 눈으로 확인한 뒤** 배정했다(2026-09-09).
 *    · J3  작업장 콘크리트 벽에 걸어 점등 시험 중인 패널 — 문자·인물·국적 단서 0
 *    · H4  흡착판으로 프레임에 모듈을 붙이는 기술자(뒷모습, 동아시아) — 상호·문자 0
 *    · G4  장갑 낀 손의 LED 실장 기판 — 문자·인물 얼굴 0
 *    · I2  함체 안 LAN 물린 컨트롤러 보드, 상태 LED 점등 — 문자·얼굴·국적 단서 0
 *    반려한 컷: H3(사다리차 시공) — 목주 배전주·미국식 번호판으로 §13 국적 판정 탈락.
 *
 * ⚠️ 사진은 `imageAssets` 를 거쳐서만 참조한다(§0-3). 여기서 '/wk/...' 를 직접 적지 마라.
 *    `spare` 배열은 순서가 바뀔 수 있으므로 **인덱스가 아니라 파일명으로** 집는다.
 * ⚠️ 전부 AI 연출컷·자료컷이다. 캡션에 기관명·시공 실적·납품처를 붙이면 그 순간 날조가 된다
 *    (`company-vs-reference`). 아래 문구는 전부 '우리가 무엇을 갖췄나' 만 말한다.
 */
const fromSpare = (name: string): string => {
  const hit = IMAGES.spare.find((p) => p.includes(name))
  if (!hit) throw new Error(`[WhyWookang] spare 에서 ${name} 을 찾지 못했다`)
  return hit
}

type Reason = {
  img: string
  alt: string
  /** 굵은 한 줄 */
  title: string
  /** 작은 한 줄 — 근거가 되는 서류·사실 */
  note: string
}

const REASONS: Reason[] = [
  {
    img: fromSpare('J3_floating-module-studio'),
    alt: '작업장 벽에 걸어 시험 점등한 LED 패널',
    title: '설계부터 직접',
    note: '도면 한 장에서 시작해 우리가 만든 화면을 우리가 답니다.',
  },
  {
    img: fromSpare('H4_indoor-module-mount'),
    alt: '흡착 공구로 프레임에 LED 모듈을 붙이는 기술자',
    title: '등록된 시공',
    note: '정보통신공사업 등록업체가 직접 시공합니다.',
  },
  {
    img: fromSpare('G4_gloved-hands-pcb'),
    alt: '장갑 낀 손으로 살펴보는 LED 실장 기판',
    title: '검증된 부품',
    note: '전원장치는 KC 적합등록을 받은 것만 씁니다.',
  },
  {
    img: fromSpare('I2_iot-controller-board'),
    alt: '함체 안에 설치된 제어 보드와 연결된 통신 케이블, 켜진 상태 표시등',
    // 2026-09-09 CEO: "그냥 빠른 A/S 라고 하고, 원격 확인 · 고장 시 빠르게 조치"
    title: '빠른 A/S',
    note: '상태를 원격으로 확인하고, 고장이 나면 빠르게 조치합니다.',
  },
]

export function WhyWookang() {
  return (
    <section aria-labelledby="why-h" className="wk-sec bg-white">
      <div className="wk-wrap">
        {/* 두 톤 대제목 — 첫 줄 먹, 둘째 줄 주황. 온빛 홈의 대제목 규칙 그대로다. */}
        <h2 id="why-h" className="wk-display leading-[0.95] tracking-[-0.03em]">
          <RiseMask className="text-wk-ink">PERFECT</RiseMask>
          <RiseMask delay={0.08} className="text-wk-cta">
            SYSTEM
          </RiseMask>
        </h2>

        <Reveal y={12} delay={0.16}>
          <p className="wk-lead mt-6">
            LED 전광판, 우강테크를 선택해야 하는 이유 네 가지.
          </p>
        </Reveal>

        <Stagger
          className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4"
          y={16}
          gap={0.08}
        >
          {/* 호버 — 카드가 살짝 떠오르고 사진만 확대된다.
              transform 만 건드린다(설계계약서 §0-6). 곡선은 ease-state 로 통일한다. */}
          {REASONS.map((r) => (
            <article
              key={r.title}
              className="group transition-transform duration-300 ease-state hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-surface bg-wk-bgFaint shadow-none transition-shadow duration-300 ease-state group-hover:shadow-[0_18px_40px_-18px_rgba(15,23,42,0.35)]">
                <Image
                  src={r.img}
                  alt={r.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  quality={78}
                  className="object-cover transition-transform duration-500 ease-state will-change-transform group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
              <p className="mt-5 text-h3 font-bold leading-tight tracking-[-0.01em] text-wk-ink">
                {r.title}
              </p>
              <p className="mt-2.5 text-label leading-relaxed text-wk-ink3">{r.note}</p>
            </article>
          ))}
        </Stagger>

        <Reveal y={10} delay={0.1}>
          <p className="mt-12 border-t border-wk-line pt-6 text-label text-wk-ink3">
            등록번호와 발급기관은{' '}
            <Link
              href="/about/certification"
              className="font-semibold text-wk-cta underline-offset-4 hover:underline"
            >
              보유 서류 페이지
            </Link>
            에서 원본 스캔과 함께 확인하실 수 있습니다.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
