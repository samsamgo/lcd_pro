import { SITE } from '@/lib/seo/site'
import { PITCH_RANGE } from '@/lib/companyScope'
import { Reveal, RiseMask } from '@/components/motion'

/**
 * 회사 개요 표.
 *
 * 🔴 2026-09-09 회사소개 전면 재설계(CEO "회사 소개 페이지부터 다 마음에 안 든다").
 *    이 컴포넌트가 갖고 있던 **'하는 일' 사진 4장은 여기서 뺐다** —
 *    같은 얘기를 `components/about/AboutWhy.tsx`(선택해야 하는 이유 6장)가 더 크게 한다.
 *    이 파일은 이제 **개요 표 하나만** 맡는다. 케이시스 인사말 하단의 회사 기본정보처럼,
 *    담당자가 결재 서류에 그대로 옮겨 적는 항목만 정돈해서 둔다.
 *
 * 🔴 **법인등록번호는 넣지 않는다** (CEO 지시 2026-09-08). 사업자등록번호까지만이다.
 * 🔴 섹션 `id` 를 여기 달지 않는다. 앵커는 `app/about/page.tsx` 래퍼가 소유한다
 *    (하위 컴포넌트가 같은 id 를 또 달면 앵커가 둘로 갈라진다 — 2026-09-08 QA 실측).
 * ⚠️ 표는 **완결돼야 한다.** 소재지·전화가 '오시는 길' 에도 나오지만, 표에서 빼면
 *    표가 반쪽이 된다(중복 제거 원칙의 의도적 예외 — 2026-09-08 COO 판정).
 */
export function CompanyOverview() {
  const rows: [string, string][] = [
    ['회사명', SITE.legalName],
    ['대표이사', SITE.ceoName],
    ['설립', SITE.founded ? `${SITE.founded}년` : ''],
    ['사업자등록번호', SITE.bizRegNo],
    ['소재지', SITE.addressFull],
    ['대표전화', SITE.fax ? `${SITE.phone} (팩스 ${SITE.fax})` : SITE.phone],
    ['이메일', SITE.email],
    ['업무시간', SITE.openingHours],
    ['사업 분야', 'LED 전광판 · 전자현수막 설계 · 제작 · 시공 · 유지보수'],
    ['취급 제품', `실내·실외 LED 전광판, 전자현수막 (화소 간격 ${PITCH_RANGE})`],
    ['등록 · 인정', '정보통신공사업 등록 · 공장등록 · 연구개발전담부서 · 소프트웨어사업자'],
    ['제어 시스템', SITE.controllerStandard],
  ].filter((r): r is [string, string] => Boolean(r[1]))

  return (
    <section aria-labelledby="overview-h" className="wk-sec bg-white">
      <div className="wk-wrap">
        <Reveal y={10}>
          <p className="wk-eyebrow">회사 개요</p>
        </Reveal>
        <h2 id="overview-h" className="wk-h2 text-wk-ink">
          <RiseMask delay={0.06}>{SITE.legalName}</RiseMask>
        </h2>

        <Reveal y={16} delay={0.12}>
          {/* 얇은 격자 — 칸 사이 1px 은 배경색(wk-line)이 비쳐 만든다.
              칸마다 border 를 주면 2열에서 선이 두 겹으로 겹친다. */}
          <dl className="mt-10 grid gap-px overflow-hidden rounded-card border border-wk-line bg-wk-line md:grid-cols-2">
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[minmax(104px,1fr)_2.4fr] bg-white">
                <dt className="bg-wk-bgFaint px-5 py-4 text-label font-semibold text-wk-ink2">
                  {k}
                </dt>
                <dd className="wk-metric px-5 py-4 text-body leading-relaxed text-wk-ink">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
