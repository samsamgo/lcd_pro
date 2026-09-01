/**
 * 브랜드 선언 — 페이지 전체에서 딱 한 번 쓰는 시적 문장.
 *
 * 기존 Manifesto("빛은, 대기업의 것이 아니다 / 작은 카페의 창가에도…")는
 * 소상공인 대상 문구라 관공서 타겟과 맞지 않아 교체했다.
 *
 * ⚠️ 규칙: 추상적 문장은 이 섹션 하나로 끝낸다.
 *    경쟁사 조사에서 "빛으로 미래를 혁신합니다" 류가 AI 티·무의미로 지목됐다.
 *    시적인 문장은 한 번만 쓰고, 곧바로 구체적인 말이 이어져야 힘을 갖는다.
 *    다른 섹션에는 이런 톤을 반복하지 말 것.
 */
export function LightStatement() {
  return (
    <section className="bg-wk-ink px-5 py-[88px] text-white md:px-8 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-7 text-[15px] font-bold text-wk-blue">우강테크</p>

        <h2 className="text-[30px] font-extrabold leading-[1.24] tracking-[-0.03em] md:text-[46px] md:leading-[1.18]">
          빛이 없다면
          <br />
          공간도 존재하지 않는다
        </h2>

        <div className="mx-auto mt-10 max-w-[36em] space-y-5 text-[17px] leading-[1.85] font-light text-wk-disabled md:text-[19px] md:leading-[1.9]">
          <p>
            불 꺼진 민원실을 떠올려 보십시오. 벽도 창구도 그대로 있지만,
            아무에게도 아무것도 알려주지 못합니다.
          </p>
          <p>
            공공의 공간은 사람을 맞이하고, 길을 알려주고,
            지금 무엇을 해야 하는지 말해 주어야 합니다.
            <span className="font-medium text-white"> 그 말을 하는 것이 화면입니다.</span>
          </p>
          <p>
            우강테크는 그 화면을 만들고, 설치하고,
            <span className="font-medium text-white"> 꺼지지 않게 지킵니다.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
