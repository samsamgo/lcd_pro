import { Reveal, RiseMask, Stagger } from '@/components/motion'
import {
  CABINET_SIZE,
  CONTROLLER_MAX_PX,
  CONTROLLER_MODEL,
  LAYOUT_COUNT,
  MODULES_PER_CAB,
  NIT_RANGE,
  OUTDOOR_INGRESS,
  PITCH_RANGE,
} from '@/lib/companyScope'

/**
 * 🔴 2026-09-07 (3차) — **이 컴포넌트는 /about 에서 배선 해제됐다. 현재 참조 0건.**
 *
 * 왜 뺐나 — 수치가 틀려서가 아니다(여섯 값 전부 `lib/companyScope.ts` 파생값이고 지금도 맞다).
 * **형식과 내용이 어긋나서**다. 그룹사 소개의 큰 활자 지표 밴드는 "이 회사가 얼마나 큰가"를
 * 묻는 형식인데, 우리가 채운 값은 화소 간격·밝기·IP 등급, 즉 **제품 스펙시트**였다.
 * 형식이 던진 질문에 내용이 답하지 않으면 그게 정확히 '템플릿 흉내'로 읽힌다.
 * 스펙은 /products 의 일이다. CEO 반려 3회 중 2차 개정에서 신설한 부품이다.
 *
 * `lib/companyScope.ts` 는 살아 있다 — CompanyHero 사실 띠가 PITCH_RANGE 를 계속 쓴다.
 * 되돌릴 수 있게 파일만 남긴다(`LedBoard.tsx` 선례). 참조 0이라 번들에 들어가지 않는다.
 * 🔴 다시 쓰려면 이 자리에 맞는 값(회사 규모·능력)을 먼저 확보하라. 스펙을 다시 넣지 마라.
 */
/**
 * 취급 범위 — 큰 활자 지표 밴드. 공정 3장(다크) 끝, 법인 정보(라이트) 앞.
 *
 * 2026-09-07 신설. CEO 지시 "LED 사이니지 그룹처럼 멋있게".
 * 그런 회사의 소개 페이지에는 반드시 큰 숫자 밴드가 있다. 문제는 그 자리에 보통
 * **납품 건수·시공 연차·고객사 수**가 들어간다는 것이다. 우리는 첫 수주 전이라
 * 그 숫자가 하나도 없고, 지어내면 관공서 상대 허위표기가 된다.
 *
 * 🔴 그래서 자리는 만들되 **채우는 값을 바꿨다.** 실적이 아니라 카탈로그 사실이다.
 *    여기 걸린 여섯 숫자는 전부 `lib/companyScope.ts` 가 견적엔진(`standardBlock.ts`)과
 *    제품 규격(`products.ts`)에서 계산해 온 것이다. 이 파일에는 손으로 적은 수치가 없다.
 *    카탈로그가 바뀌면 이 화면도 같이 바뀐다. 사람이 갱신을 잊을 수 없는 구조다.
 *
 * ⚠️ 여기에 "실적" 성격의 항목(건수·연차·매출·직원수)을 추가하지 말 것.
 *    추가하려면 근거 문서를 먼저 만들고 `companyScope.ts` 에 파생값으로 넣는다.
 *
 * 이 컴포넌트가 다크 구간의 끝이라 라이트로 넘어가는 그라디언트 다리를 여기서 소유한다
 * (설계계약서 §3). 이전에는 CompanyChapters 가 갖고 있었다.
 */
type Metric = { k: string; v: string; u?: string; note: string }

const METRICS: Metric[] = [
  { k: '화소 간격', v: PITCH_RANGE, note: '실내 근거리부터 도로변까지' },
  { k: '화면 밝기', v: NIT_RANGE, u: 'nit', note: '실내 최저 · 옥외 최고' },
  { k: '표준 캐비닛', v: CABINET_SIZE, u: 'mm', note: `모듈 ${MODULES_PER_CAB}장이 한 캐비닛` },
  { k: '표준 배치', v: String(LAYOUT_COUNT), u: '종', note: '견적엔진 등록 기준' },
  { k: '옥외 방수', v: OUTDOOR_INGRESS, note: '전면·후면 같은 등급' },
  { k: '제어 최대 화소', v: CONTROLLER_MAX_PX, u: 'px', note: `컨트롤러 1대 · ${CONTROLLER_MODEL}` },
]

export function CompanyScope() {
  return (
    <>
      <section className="wk-sec-lg wk-night" aria-labelledby="scope-h">
        <div className="wk-wrap-wide">
          <Reveal y={10} duration={0.6}>
            <p className="text-label font-semibold uppercase tracking-widest text-wk-blue">
              취급 범위
            </p>
          </Reveal>
          <h2 id="scope-h" className="wk-h2 mt-5 max-w-[14ch] text-wk-nightInk">
            <RiseMask delay={0.06}>다루는 규격</RiseMask>
          </h2>
          <Reveal y={14} delay={0.16}>
            <p className="wk-lead mt-6 !text-wk-nightMuted">
              규격서에 그대로 옮겨 쓰실 수 있게, 우리가 다루는 범위를 숫자로 적습니다.
            </p>
          </Reveal>

          <Stagger className="mt-14 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3" y={14}>
            {METRICS.map((m) => (
              <div key={m.k} className="border-t border-white/15 py-7 md:py-9">
                <p className="text-caption font-medium uppercase tracking-widest text-wk-nightMuted">
                  {m.k}
                </p>
                <p className="wk-metric mt-3 text-h1 font-bold leading-none text-wk-nightInk">
                  {m.v}
                  {m.u && (
                    <small className="ml-1.5 text-h3 font-semibold text-wk-nightMuted">{m.u}</small>
                  )}
                </p>
                <p className="mt-3.5 text-label text-wk-nightMuted">{m.note}</p>
              </div>
            ))}
          </Stagger>

          <Reveal delay={0.1} y={12}>
            <p className="wk-cap mt-10 max-w-[46rem] !text-wk-nightMuted">
              위 수치는 견적엔진의 제품군 정의와 제품 규격에서 그대로 계산한 값입니다. 현장 조건에
              따라 달라지는 부분은 실측 후 규격서에 확정해 적습니다.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 다크 구간 끝 → 법인 정보(라이트)로 넘어가는 다리 */}
      <div className="wk-bridge-up h-20 md:h-28" aria-hidden="true" />
    </>
  )
}
