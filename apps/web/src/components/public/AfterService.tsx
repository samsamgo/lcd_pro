import Image from 'next/image'

import { IMAGES } from '@/lib/imageAssets'
import { Reveal, Stagger } from '@/components/motion'

/**
 * 설치 후 A/S 절차.
 *
 * 경쟁사 조사에서 A/S를 전화번호 한 줄로만 다루는 곳이 대부분이었다.
 * 공공 구매자가 실제로 두려워하는 건 설치 실패가 아니라
 * 감사·검수를 앞둔 시점의 장애다. 실적이 없는 우강테크가 이길 수 있는 축이 여기다.
 *
 * 그래서 "빠르게 대응합니다" 같은 말 대신 **누가 무엇을 하는지**를 단계로 공개한다.
 * ⚠️ 응답 시간·출동 시간 같은 SLA 숫자는 적지 않는다. 아직 지킬 조직이 없는 약속이다.
 */
const STEPS: { n: string; title: string; desc: string; who: string }[] = [
  {
    n: '01',
    title: '접수',
    desc: '전화 또는 접수 폼. 증상 한 줄이면 됩니다.',
    who: '담당자 → 우강테크',
  },
  {
    n: '02',
    title: '원격 확인',
    desc: '전원·신호·모듈 중 어디인지 원격으로 가립니다.',
    who: '우강테크',
  },
  {
    n: '03',
    title: '방문 판정',
    desc: '출발 전에 원인과 소요 시간을 알려드립니다.',
    who: '우강테크',
  },
  {
    n: '04',
    title: '부품 교체',
    desc: '전면에서 해당 모듈만 교체합니다.',
    who: '우강테크',
  },
  {
    n: '05',
    title: '마무리 확인',
    desc: '무엇이 고장이었고 어디를 갈았는지 담당자께 확인받고 마칩니다.',
    who: '우강테크 → 담당자',
  },
]

export function AfterService() {
  return (
    <section id="after" aria-labelledby="after-h" className="wk-sec-sm bg-wk-bgFaint">
      <div className="wk-wrap grid items-start gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div>
            <p className="wk-eyebrow">설치 후</p>
            <h2 id="after-h" className="wk-h2 text-wk-ink">
              고장 나면 이렇게 진행됩니다
            </h2>
            <p className="wk-lead mt-5">
              설치는 하루면 끝나지만 쓰는 기간은 몇 년입니다. 그동안 한 번은 연락하실 일이 생깁니다.
              그때 절차부터 찾지 않으시도록 누가 무엇을 하는지 미리 적어 둡니다.
            </p>
            {/* "모듈만 갈아 끼운다"를 글로 설명하는 대신 보여준다 */}
            <div className="relative mt-7 aspect-[4/3] overflow-hidden rounded-card-m">
              <Image
                src={IMAGES.afterService}
                alt="장갑을 낀 손이 전광판 앞면에서 모듈 한 장을 빼내고 있다"
                fill
                sizes="(min-width:1024px) 34vw, 100vw"
                className="object-cover"
              />
            </div>

            <p className="wk-cap mt-6">
              하드웨어 무상보증 기간과 예비부품 보유 조건은 계약 시 규격서에 명시합니다.
            </p>
          </div>
        </Reveal>

        {/* 🔴 구분선은 Stagger 의 직접 자식(래퍼)에 divide-y 로 건다.
            Stagger 는 자식을 하나씩 <motion.div> 로 감싸므로 항목 div 에 붙인
            first:/last: 는 전 항목에서 참이 된다 — 이전 코드는 그 탓에 구분선이
            전부 지워지고 첫 항목 패딩도 잘못 먹었다. (2026-09-07 MountTypes 와 동일 수리) */}
        <Stagger className="m-0 list-none divide-y divide-wk-line p-0" y={14} gap={0.06}>
          {STEPS.map((s) => (
            <div key={s.n} className="flex gap-5 py-6">
              <span className="wk-metric w-8 shrink-0 pt-1 text-label font-bold text-wk-cta">
                {s.n}
              </span>
              <div className="flex-1">
                <b className="block text-body-lg font-semibold text-wk-ink">{s.title}</b>
                <p className="wk-body mt-1.5 !text-wk-ink3">{s.desc}</p>
                <p className="wk-cap mt-2.5">{s.who}</p>
              </div>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
