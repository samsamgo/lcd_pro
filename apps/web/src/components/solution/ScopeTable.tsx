import { Reveal } from '@/components/motion'

/**
 * 공급 범위 표.
 *
 * 담당자가 결재를 올릴 때 가장 먼저 막히는 지점은 "무엇까지 우리 예산인가" 다.
 * 그래서 "턴키로 다 해드립니다" 대신 **경계선을 먼저 긋는다.**
 * 이 표는 그대로 사업계획서의 과업 범위 항목으로 옮겨 쓸 수 있어야 한다.
 *
 * ⚠️ 여기 적힌 경계는 표준안이다. 현장 조건에 따라 달라지므로
 *    확정 범위는 실측 후 규격서에 명시한다고 화면에서도 밝힌다.
 *
 * 데스크톱은 3열 표, 모바일은 항목별 카드로 접는다.
 * 열이 3개인 표를 모바일에서 가로 스크롤로 밀면 비교가 성립하지 않는다.
 */
type Row = { item: string; wk: string; owner: string; note?: string }

const ROWS: Row[] = [
  {
    item: '현장 실측 · 기본설계',
    wk: '방문 실측, 실측 조서와 설치 위치 도면 작성',
    owner: '설치 예정 위치 출입 협조, 기존 도면 제공(있는 경우)',
  },
  {
    item: '제품 제작',
    wk: '모듈 발주, 캐비닛 조립, 출고 전 작동 검사',
    owner: '없음',
  },
  {
    item: '구조물 · 취부 철물',
    wk: '취부 철물 제작 및 설치, 취부 상세도 제출',
    owner: '기존 구조물의 안전성 확인 자료(보유 시)',
    note: '구조 보강이 필요하면 별도 협의',
  },
  {
    item: '전기 인입',
    wk: '분전반 이후 배선 · 접지 · 결선',
    owner: '설치 지점까지의 전원 인입, 회로 용량 확보',
    note: '용량 증설이 필요하면 별도 협의',
  },
  {
    item: '통신 · 네트워크',
    wk: '제어기 설치와 네트워크 설정',
    owner: '유선 인터넷 또는 내부망 포트 제공',
    note: '전용 회선 신설은 별도 협의',
  },
  {
    item: '옥외광고물 신고',
    wk: '신고 서류 작성 및 접수 대행',
    owner: '기관 명의 위임 서류',
    note: '신고 수수료 · 구조안전 확인서는 별도',
  },
  {
    item: '시공 · 정렬',
    wk: '설치, 화면 정렬, 색상 · 밝기 보정',
    owner: '작업 구간 통제 협조, 작업 가능 시간대 지정',
    note: '야간 · 휴일 시공 가능',
  },
  {
    item: '인수 · 교육',
    wk: '담당자 조작 교육, 조작 안내서 제출',
    owner: '담당자 지정',
  },
  {
    item: '사후관리',
    wk: '장애 접수 · 원격 확인 · 모듈 교체 · 결과 보고서 제출',
    owner: '연락 창구 지정',
    note: '무상보증 범위는 계약 시 규격서에 명시',
  },
]

export function ScopeTable() {
  return (
    <section id="scope" aria-labelledby="scope-h" className="wk-sec bg-wk-bgFaint">
      <div className="wk-wrap">
        <Reveal>
          <p className="wk-eyebrow">공급 범위</p>
          <h2 id="scope-h" className="wk-h2 text-wk-ink">
            어디까지가 우리 몫인지
            <br className="hidden sm:block" /> 먼저 긋습니다
          </h2>
          <p className="wk-lead mt-5">
            결재를 올릴 때 가장 먼저 막히는 것은 예산 범위입니다. 그대로 과업 범위 항목으로
            옮겨 쓰실 수 있도록 경계선을 적었습니다.
          </p>
        </Reveal>

        {/* 데스크톱 — 3열 비교 */}
        <div className="mt-14 hidden overflow-hidden rounded-card border border-wk-line bg-white shadow-wk-1 lg:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">공정별 우강테크 수행 범위와 발주처 준비 사항</caption>
            <thead>
              <tr className="border-b border-wk-line bg-white">
                <th scope="col" className="w-[22%] px-6 py-5 text-label font-bold text-wk-ink">
                  항목
                </th>
                <th scope="col" className="w-[34%] border-l border-wk-line px-6 py-5 text-label font-bold text-wk-cta">
                  우강테크가 합니다
                </th>
                <th scope="col" className="w-[28%] border-l border-wk-line px-6 py-5 text-label font-bold text-wk-ink">
                  발주처가 준비하십니다
                </th>
                <th scope="col" className="border-l border-wk-line px-6 py-5 text-label font-bold text-wk-ink3">
                  별도 협의
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.item} className="border-b border-wk-line last:border-b-0">
                  <th scope="row" className="px-6 py-5 align-top text-body font-semibold text-wk-ink">
                    {r.item}
                  </th>
                  <td className="border-l border-wk-line bg-wk-blueWeak/40 px-6 py-5 align-top text-body text-wk-ink2">
                    {r.wk}
                  </td>
                  <td className="border-l border-wk-line px-6 py-5 align-top text-body text-wk-ink2">
                    {r.owner}
                  </td>
                  <td className="border-l border-wk-line px-6 py-5 align-top text-label text-wk-ink3">
                    {r.note ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 모바일 — 항목별 카드. 3열 표를 가로로 밀게 하면 비교가 성립하지 않는다 */}
        <div className="mt-12 space-y-4 lg:hidden">
          {ROWS.map((r) => (
            <div key={r.item} className="rounded-card-m border border-wk-line bg-white p-5 shadow-wk-1">
              <b className="block text-body-lg font-semibold text-wk-ink">{r.item}</b>
              <dl className="mt-4 space-y-3">
                <div>
                  <dt className="text-caption font-bold uppercase tracking-[0.1em] text-wk-cta">
                    우강테크
                  </dt>
                  <dd className="mt-1 text-body text-wk-ink2">{r.wk}</dd>
                </div>
                <div>
                  <dt className="text-caption font-bold uppercase tracking-[0.1em] text-wk-ink3">
                    발주처 준비
                  </dt>
                  <dd className="mt-1 text-body text-wk-ink2">{r.owner}</dd>
                </div>
                {r.note && (
                  <div>
                    <dt className="text-caption font-bold uppercase tracking-[0.1em] text-wk-ink3">
                      별도 협의
                    </dt>
                    <dd className="mt-1 text-label text-wk-ink3">{r.note}</dd>
                  </div>
                )}
              </dl>
            </div>
          ))}
        </div>

        <p className="wk-cap mt-8">
          위 경계는 표준안입니다. 현장 조건에 따라 달라지므로 확정 범위는 실측 후 규격서에
          명시해 제출합니다.
        </p>
      </div>
    </section>
  )
}
