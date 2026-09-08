import Image from 'next/image'

import { IMAGES } from '@/lib/imageAssets'
import { RiseMask, Reveal } from '@/components/motion'
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
          src={IMAGES.company.statement}
          alt=""
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
        <Reveal immediate y={16} delay={0.2}>
          <p className="wk-lead mt-8 max-w-[34em] !text-wk-nightMuted">
            실측한 사람이 도면을 그리고, 도면을 그린 사람이 설치하고, 설치한 사람이 A/S를 맡습니다.
            중간에 업체가 바뀌지 않습니다.
          </p>
        </Reveal>

        {/* 취급 범위 — 실적이 아니라 범위다 */}
        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/15 pt-10 md:grid-cols-3 lg:mt-16">
          {FACTS.map((f) => (
            <div key={f.k}>
              <dt className="text-caption font-medium text-white/55">{f.k}</dt>
              <dd className="wk-metric mt-2 text-h3 font-bold tracking-[-0.02em] text-wk-nightInk">
                {f.v}
                {f.unit && <small className="ml-1 font-medium text-white/60">{f.unit}</small>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
