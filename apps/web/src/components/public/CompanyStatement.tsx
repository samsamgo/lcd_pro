import Image from 'next/image'

import { IMAGES } from '@/lib/imageAssets'
import { RiseMask, Reveal, Stagger } from '@/components/motion'
import { PITCH_RANGE, NIT_RANGE, CABINET_SIZE, OUTDOOR_INGRESS } from '@/lib/companyScope'
import { SERVICE_STEPS } from '@/lib/serviceProcess'
import { PRODUCT_CATEGORIES } from '@/lib/productCategories'

/**
 * 회사소개 여는 장 — 다크 풀블리드 선언 + 취급 범위 수치.
 *
 * 🔴 2026-09-08 CEO 지시 "회사 소개 좀 더 멋있게".
 *    이 페이지는 머리 다음이 곧바로 요약표라 도입부가 없었다. 여기서 회사를 한 문장으로 세우고,
 *    바로 아래에서 **취급 범위를 숫자로** 보여준다.
 *
 * ⚠️ 숫자는 전부 `lib/companyScope`·`serviceProcess`·`productCategories` 에서 계산된 값이다.
 *    납품 건수·고객사 수·연차 같은 **실적 수치는 넣지 않는다**(첫 수주 전). 여기 있는 것은
 *    "우리가 다루는 범위"이지 "우리가 해낸 양"이 아니다. 이 구분을 무너뜨리지 마라.
 */
const FACTS: { k: string; v: string; unit?: string }[] = [
  { k: '취급 화소 간격', v: PITCH_RANGE },
  { k: '밝기 범위', v: NIT_RANGE, unit: 'nit' },
  { k: '표준 캐비닛', v: CABINET_SIZE, unit: 'mm' },
  { k: '옥외 방진·방수', v: OUTDOOR_INGRESS },
  { k: '제품 카테고리', v: String(PRODUCT_CATEGORIES.length), unit: '종' },
  { k: '설치 공정', v: String(SERVICE_STEPS.length), unit: '단계' },
]

export function CompanyStatement() {
  return (
    <section aria-labelledby="stmt-h" className="relative isolate overflow-hidden bg-wk-night">
      {/* 배경 — 켜져 있는 화면 한 장. 캡션 없는 순수 배경 층이라 실적 주장이 아니다 */}
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src={IMAGES.company.opening}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          quality={55}
          className="object-cover opacity-[0.22]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, #0B0B0F 0%, rgba(11,11,15,.72) 40%, rgba(11,11,15,.86) 78%, #0B0B0F 100%)',
          }}
        />
      </div>

      <div className="wk-wrap relative py-24 md:py-32">
        <Reveal immediate y={10}>
          <p className="wk-eyebrow !text-wk-blue">우강테크</p>
        </Reveal>
        <h2 id="stmt-h" className="wk-display wk-emit-text max-w-[15ch] text-wk-nightInk">
          <RiseMask immediate>화면 하나를</RiseMask>
          <RiseMask immediate delay={0.08}>
            끝까지 책임집니다
          </RiseMask>
        </h2>
        <Reveal immediate y={14} delay={0.28}>
          <p className="wk-lead mt-6 max-w-[30em] !text-wk-nightMuted">
            도면 한 장부터 마지막 모듈 교체까지, 맡는 사람이 바뀌지 않습니다.
          </p>
        </Reveal>

        {/* 취급 범위 — 2026-09-09 CEO "회사소개는 멋있는 말과 애니메이션 다 넣어라".
            정의만 돼 있고 그리지 않던 FACTS 를 렌더한다. 실적이 아니라 카탈로그 범위라 지어낸 숫자가 없다.
            여섯 칸이 순서대로 켜진다(Stagger) — 전광판 화소가 점등되는 순서와 같다. */}
        <Stagger
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-white/10 bg-white/10 sm:grid-cols-3 lg:mt-16 lg:grid-cols-6"
          y={14}
          gap={0.08}
          delay={0.4}
        >
          {FACTS.map((f) => (
            <div key={f.k} className="bg-wk-night/90 px-5 py-6 backdrop-blur-sm">
              <p className="text-caption text-white/55">{f.k}</p>
              <p className="wk-metric wk-emit-text mt-2 text-h3 font-semibold leading-tight text-wk-nightInk">
                {f.v}
                {f.unit && <small className="ml-1 text-white/60">{f.unit}</small>}
              </p>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
