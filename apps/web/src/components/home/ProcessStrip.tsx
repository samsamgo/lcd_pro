import { RiseMask, Stagger } from '@/components/motion'

/**
 * 홈 — 진행 순서 4단어 띠. 제품·시공사례 다음, 푸터 앞.
 *
 * 🔴 2026-09-09 CEO 지시로 **전면 축소**했다.
 *    "설치 과정 잡다한 설명 없애고, 소요기간 없애라."
 *    전에는 단계마다 두 줄짜리 설명 + '공정별 기간' 링크 + 전화번호 한 줄이 붙어 있었다.
 *    홈에서 공정을 읽는 사람은 없다 — 홈은 '이 회사가 처음부터 끝까지 한다' 만 보여주면 되고,
 *    그건 네 단어로 충분하다.
 *    2026-09-09 후속 지시로 '진행 절차 자세히' 링크까지 뺐다. 이 띠는 네 단어가 전부다.
 *
 * 🔴 소요기간(기간·일수·주차)은 이 띠에 **다시 넣지 않는다.**
 *    현장마다 다른 값을 홈에 박아 두면 그게 곧 약속이 되고, 지연 시 분쟁 사유가 된다.
 *    page.tsx 의 HowTo JSON-LD 에서도 같은 이유로 totalTime 을 뺐다.
 *
 * ⚠️ 이 배열은 화면과 JSON-LD 양쪽의 단일 원본이다(page.tsx 가 같은 배열을 읽는다).
 *    `text` 는 화면에 그리지 않는다 — 구조화 데이터의 HowToStep 이 설명을 요구하기 때문에
 *    **한 줄만** 남겨 둔 것이다. 화면에 다시 꺼내지 마라.
 */
export const HOME_STEPS: { name: string; text: string }[] = [
  { name: '문의', text: '설치 장소와 용도를 알려주시면 개략 견적 범위를 잡아 연락드립니다.' },
  { name: '실측', text: '보는 거리와 붙일 면을 현장에서 직접 재고 규격을 확정합니다.' },
  { name: '시공', text: '제작해서 전부 켜 본 뒤 현장에 설치합니다.' },
  { name: 'A/S', text: '고장은 모듈 한 장 단위로 교체합니다.' },
]

export function ProcessStrip() {
  return (
    <section aria-labelledby="steps-h" className="wk-sec-sm border-t border-wk-line bg-wk-bgFaint">
      <div className="wk-wrap">
        {/* 🔴 2026-09-09 CEO "'진행 절차 자세히' 필요 없어" — 링크를 뺐다.
            `/about#process` 는 받는 앵커가 없는 죽은 링크이기도 했다.
            다시 넣으려면 먼저 그 페이지에 id="process" 를 만들어라. */}
        <h2 id="steps-h" className="wk-h2 text-wk-ink">
          <RiseMask>문의부터 A/S까지 우강테크가 합니다</RiseMask>
        </h2>

        {/* 네 단어 띠. 단어와 단어 사이는 화살표 하나로만 잇는다 — 부연을 붙이지 않는다. */}
        <Stagger
          className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-4 border-t-2 border-wk-ink pt-8 md:gap-x-8"
          y={12}
          gap={0.07}
        >
          {HOME_STEPS.map((s, i) => (
            <div key={s.name} className="flex items-center gap-5 md:gap-8">
              {i > 0 && (
                <span aria-hidden="true" className="text-h3 font-light text-wk-line">
                  →
                </span>
              )}
              <span className="flex items-baseline gap-2.5">
                <span className="wk-metric text-caption font-semibold text-wk-cta">
                  0{i + 1}
                </span>
                <span className="text-h2 font-bold leading-none tracking-[-0.02em] text-wk-ink">
                  {s.name}
                </span>
              </span>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
