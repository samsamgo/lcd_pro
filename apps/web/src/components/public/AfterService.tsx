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
    desc: '증상이랑 화면 사진만 보내주시면 됩니다. 양식 같은 건 없습니다.',
    who: '담당자 → 우강테크',
  },
  {
    n: '02',
    title: '원격 확인',
    desc: '전원인지 신호인지 모듈인지부터 가려냅니다.',
    who: '우강테크',
  },
  {
    n: '03',
    title: '방문 판정',
    desc: '가기 전에 무엇이 문제고 얼마나 걸릴지 먼저 말씀드립니다.',
    who: '우강테크',
  },
  {
    n: '04',
    title: '부품 교체',
    desc: '화면을 통째로 뜯지 않습니다. 문제 있는 모듈만 앞에서 빼서 갈아 끼웁니다.',
    who: '우강테크',
  },
  {
    n: '05',
    title: '결과 보고',
    desc: '처리 내역을 문서로 드립니다. 필요하시면 그대로 제출하셔도 됩니다.',
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
              고장 났을 때 처리 순서
            </h2>
            <p className="wk-lead mt-5">
              누가 무엇을 하는지 미리 적어 둡니다. 설치는 한 번이지만
              고장은 언제 날지 모르고, 급할 때 절차부터 찾으면 늦습니다.
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

        <Stagger className="m-0 list-none p-0" y={14} gap={0.06}>
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex gap-5 border-b border-wk-line py-6 last:border-b-0 first:pt-0"
            >
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
