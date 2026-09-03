import { Stagger } from '@/components/motion'

/**
 * 규격 요약 밴드.
 *
 * ⚠️ 근거 없는 카운트업을 넣지 않는다(벤치마크 §6 안티패턴 15).
 *"누적 327개소" 같은 검증 불가능한 실적 숫자를 쓰지 않는다.
 *    동시에 실적이 없다는 사실을 굳이 화면에 적지도 않는다 — 묻지 않은 약점을 먼저 꺼내면
 *    읽는 사람은 그것만 기억한다. 제품 구성·공정·보증·사양처럼 문서로 셀 수 있는 값만 둔다.
 *
 * 숫자를 0부터 굴리지도 않는다. 최종값을 HTML 에 그대로 두고 각 항목에 근거를 붙인다
 * (벤치마크 §5 패턴 9 — 카운트업은 로딩 순간 거짓 정보를 보여준다).
 * 그래서 이 섹션은 서버 컴포넌트다. 홈의 초기 JS 예산도 그만큼 아낀다.
 */
const STATS: { v: string; u?: string; k: string; src: string }[] = [
  {
    v: '4',
    u: '종',
    k: '사용 환경별 제품 구성',
    src: '실내 고해상도 · 실내 대형 · 옥외 고휘도 · 옥외 대형',
  },
  {
    v: '6',
    u: '단계',
    k: '문의부터 유지보수까지 자사 수행',
    src: '문의 · 실측 · 제작 · 시공 · 인수 · 유지보수',
  },
  {
    v: '1 / 2',
    u: '년',
    k: '하드웨어 무상보증',
    src: '스탠다드 1년 · 프리미엄 2년(예비부품 보유 포함)',
  },
  {
    v: 'IP65',
    k: '옥외 방진 · 방수 등급',
    src: '옥외 캐비닛 기준 사양',
  },
]

export function StatsBand() {
  return (
    <section aria-labelledby="stats-h" className="wk-sec-sm bg-wk-bgFaint">
      <div className="wk-wrap">
        <p className="wk-eyebrow">숫자로 확인</p>
        <h2 id="stats-h" className="wk-h2 text-wk-ink">
          규격으로 말합니다
        </h2>

        <Stagger
          className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
          y={12}
          gap={0.07}
        >
          {STATS.map((s) => (
            <div key={s.k} className="border-t border-wk-line2 pt-5">
              <p className="wk-metric text-h1 font-bold text-wk-ink">
                {s.v}
                {s.u && <small className="ml-1 text-wk-ink3">{s.u}</small>}
              </p>
              <p className="mt-2.5 text-body-lg font-semibold text-wk-ink2">{s.k}</p>
              <p className="wk-cap mt-1.5 !text-wk-ink3">{s.src}</p>
            </div>
          ))}
        </Stagger>

      </div>
    </section>
  )
}
