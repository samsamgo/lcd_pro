/**
 * 조달 담당자의 3분 검토용 증빙 3칸.
 *
 * 경쟁사 12곳 조사 결과, 공공 구매자는 "예쁘게 설치될까"보다
 * "감사·검수·장애 대응 때 문제없을 업체인가"를 먼저 본다.
 * 그래서 히어로 바로 다음에 검증 가능한 사실만 배치한다.
 *
 * ⚠️ 지어낸 실적·인증을 넣지 않는다. 진행 중인 것은 진행 중이라고 쓴다.
 *    (관공서 상대로 허위 표기는 부정당업자 제재로 돌아온다)
 */
const PROOFS = [
  {
    value: '직접',
    title: '설계 · 제작 · 시공',
    desc: '모듈 조립과 작동 검사를 국내 자사 공정에서 합니다. 수입 완제품을 되파는 구조가 아닙니다.',
  },
  {
    value: '2건',
    title: 'KC 적합등록 완료',
    // 근거: TA-2607130(LH-200-5P), TA-2607131(LPH300S5U8F) 적합등록 완료
    desc: '전원공급장치 2종 등록을 마쳤습니다. 전광판 완제품 등록은 진행 중입니다.',
  },
  {
    value: '모듈 단위',
    title: '교체 A/S',
    desc: '화면 일부가 죽어도 전체를 뜯지 않습니다. 문제 모듈만 바꿔 예산과 중단 시간을 줄입니다.',
  },
]

export function ProofRow() {
  return (
    <section className="wk-sec">
      <div className="wk-wrap grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {PROOFS.map((p) => (
          <div key={p.title} className="wk-card bg-wk-bg">
            <p className="text-[32px] font-extrabold leading-[38px] tracking-[-0.03em] text-wk-ink md:text-[40px] md:leading-[46px]">
              {p.value}
            </p>
            <p className="wk-h3 mt-2 text-wk-ink">{p.title}</p>
            <p className="mt-1.5 text-[15px] leading-[23px] text-wk-ink3">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
