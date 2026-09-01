/**
 * 설치 후 A/S 절차.
 *
 * 경쟁사 12곳 조사에서 A/S를 전화번호 수준으로만 다루는 곳이 대부분이었다.
 * 공공 구매자가 실제로 두려워하는 건 설치 실패가 아니라
 * 감사·검수 시점의 장애다. 실적이 없는 우강테크가 이길 수 있는 축이 여기다.
 */
const STEPS = [
  { n: '01', title: '접수', desc: '증상과 화면 사진만 있으면 됩니다.' },
  { n: '02', title: '원격 확인', desc: '전원·신호·모듈 중 어디 문제인지 먼저 판정합니다.' },
  { n: '03', title: '방문 판정', desc: '방문 전에 예상 원인과 소요 시간을 알려드립니다.' },
  { n: '04', title: '모듈 교체', desc: '화면 전체를 뜯지 않고 문제 모듈만 바꿉니다.' },
  { n: '05', title: '결과 보고', desc: '처리 내역을 문서로. 검수·감사 자료로 그대로 씁니다.' },
]

export function AfterService() {
  return (
    <section id="after" className="wk-sec bg-white">
      <div className="wk-wrap grid items-start gap-5 lg:grid-cols-2 lg:gap-8">
        <div>
          <p className="wk-eyebrow">설치 후</p>
          <h2 className="wk-h2 text-wk-ink">
            고장 접수하면
            <br />
            이렇게 처리합니다
          </h2>
          <p className="wk-lead mt-4">
            기관에서 곤란한 건 설치가 아니라 감사 앞두고 화면이 죽는 상황입니다.
            그래서 누가 언제 무엇을 하는지 미리 적어둡니다.
          </p>
        </div>

        <ol className="m-0 list-none p-0">
          {STEPS.map((s) => (
            <li key={s.n} className="wk-row">
              <span className="w-7 shrink-0 self-start pt-1 text-[15px] font-bold tabular-nums text-wk-blue">
                {s.n}
              </span>
              <span className="flex-1">
                <b className="block text-[17px] font-semibold text-wk-ink">{s.title}</b>
                <span className="mt-0.5 block text-[15px] leading-[23px] text-wk-ink3">{s.desc}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
