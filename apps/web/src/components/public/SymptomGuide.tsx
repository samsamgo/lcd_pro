import { Reveal, Stagger } from '@/components/motion'

/**
 * 자주 있는 증상과 원인.
 *
 * 왜 만들었나 — /support 가 접수 폼 + 처리 순서뿐이라 얇았다.
 * 그런데 담당자가 전화 걸기 직전에 실제로 하는 일은 "이게 고장인지 아닌지"를
 * 스스로 가늠하는 것이다. 전원 플러그가 빠진 걸 A/S로 부르면 서로 시간을 버린다.
 *
 * 그래서 증상 → 흔한 원인 → 먼저 해볼 것 순으로 적는다.
 * 여기서 해결되면 출동이 줄고, 안 되면 접수할 때 증상이 정확해진다. 둘 다 이득이다.
 *
 * ⚠️ "무조건 고쳐드립니다"로 쓰지 않는다. 보증 범위 밖인 것도 그대로 적는다.
 */

type Symptom = {
  sign: string
  causes: string[]
  first: string
}

const SYMPTOMS: Symptom[] = [
  {
    sign: '화면 일부만 까맣게 나옵니다',
    causes: ['모듈 한 장 고장', '모듈 뒤 신호선 접촉 불량'],
    first: '까만 부분이 네모반듯하면 모듈 한 장 문제일 가능성이 큽니다. 그 자리만 갈면 되니 사진을 찍어 보내주십시오.',
  },
  {
    sign: '화면 전체가 안 켜집니다',
    causes: ['전원 차단기 내려감', '제어기 정지', '정전 후 복구 안 됨'],
    first: '분전반에서 해당 차단기가 내려가 있는지 먼저 봐 주십시오. 올렸는데도 안 켜지면 제어기 쪽입니다.',
  },
  {
    sign: '글자는 나오는데 색이 이상합니다',
    causes: ['특정 색 채널 불량', '밝기·색온도 설정 변경'],
    first: '전체가 붉거나 푸르게 치우쳤다면 설정 문제일 수 있어 원격으로 확인해 드립니다.',
  },
  {
    sign: '낮에는 잘 안 보입니다',
    causes: ['자동 밝기 설정이 낮게 잡힘', '실내용 밝기를 옥외에 설치'],
    first: '설치 위치와 시간대를 알려주시면 밝기 설정을 원격으로 조정해 봅니다. 설정으로 안 되면 사양 문제입니다.',
  },
]

export function SymptomGuide() {
  return (
    <section aria-labelledby="symptom-h" className="wk-sec bg-white">
      <div className="wk-wrap">
        <Reveal>
          <p className="wk-eyebrow">전화 걸기 전에</p>
          <h2 id="symptom-h" className="wk-h2 text-wk-ink">
            증상으로 먼저 가늠해 보십시오
          </h2>
          <p className="wk-lead mt-5">
            차단기가 내려간 것뿐인데 출동을 부르면 서로 시간을 버립니다.
            여기서 해결되면 그대로 쓰시면 되고, 안 되면 접수할 때 증상이 정확해집니다.
          </p>
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2" y={12} gap={0.06}>
          {SYMPTOMS.map((s) => (
            <div key={s.sign} className="rounded-card border border-wk-line bg-white p-6">
              <p className="text-body-lg font-semibold text-wk-ink">{s.sign}</p>

              <p className="wk-cap mt-3 !text-wk-ink3">
                흔한 원인 —{' '}
                {s.causes.map((c, n) => (
                  <span key={c}>
                    {n > 0 && ' · '}
                    {c}
                  </span>
                ))}
              </p>

              <p className="mt-4 rounded-card-m bg-wk-bgFaint p-4 text-label leading-relaxed text-wk-ink2">
                <b className="mb-1 block font-semibold text-wk-ink">먼저 해볼 것</b>
                {s.first}
              </p>
            </div>
          ))}
        </Stagger>

        <p className="wk-cap mt-8">
          외부 충격이나 침수, 임의 개조로 생긴 고장은 무상보증 범위 밖입니다.
          그 경우에도 수리는 가능하며 비용은 견적으로 먼저 알려드립니다.
        </p>
      </div>
    </section>
  )
}
