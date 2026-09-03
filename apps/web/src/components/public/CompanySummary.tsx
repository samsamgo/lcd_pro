import { Reveal, Stagger } from '@/components/motion'
import { SITE } from '@/lib/seo/site'

/**
 * 법인 정보 + 검증 자료.
 *
 * 관공서 담당자가 회사 소개에서 확인하는 것은 서사가 아니라
 *"이 업체를 결재 문서에 안전하게 넣을 수 있는가" 다(벤치마크 §8.1).
 * 그래서 등기 정보를 표로 그대로 노출하고, 인증은 원색 PNG 배지가 아니라
 * 인증명 · 번호 · 유효기간 · 확인 방법 텍스트로 적는다(안티패턴 7).
 *
 * ⚠️ 여기 적힌 인증은 전부 실제 취득분이다.
 *    SMPS 2건 KC 적합등록 = 2026-08-10 (주)지씨엘 회신으로 확인(COO/projects/WK-KC-SMPS.md).
 *    미취득 항목은 '준비 중' 상태로 분리해 표기한다. 상태를 색으로만 구분하지 않는다.
 */
const RRA_SEARCH = 'https://www.rra.go.kr/ko/license/S_c_search.do'

type Credential = {
  title: string
  detail: string
  no: string
  issuer: string
  valid: string
  verify?: { label: string; href: string }
}

/** 취득 완료 — 번호로 공식 조회가 가능한 것만 올린다 */
const HELD: Credential[] = [
  {
    title: 'KC 적합등록 · 전원공급장치',
    detail: '모델 LH-200-5P',
    no: 'TA-2607130',
    issuer: '국립전파연구원',
    valid: '만료일 없음 · 사양 변경 시 재등록',
    verify: { label: '적합성평가 현황에서 조회', href: RRA_SEARCH },
  },
  {
    title: 'KC 적합등록 · 전원공급장치',
    detail: '모델 LPH300S5U8F',
    no: 'TA-2607131',
    issuer: '국립전파연구원',
    valid: '만료일 없음 · 사양 변경 시 재등록',
    verify: { label: '적합성평가 현황에서 조회', href: RRA_SEARCH },
  },
  {
    title: '업체식별부호',
    detail: '적합성평가 신청인 부호',
    no: 'WKTC',
    issuer: '국립전파연구원',
    valid: '유효',
  },
]


export function CompanySummary() {
  const rows: { k: string; v: string }[] = [
    { k: '상호', v: SITE.legalName },
    { k: '대표자', v: SITE.ceoName },
    { k: '사업자등록번호', v: SITE.bizRegNo },
    { k: '법인등록번호', v: SITE.corpRegNo },
    { k: '소재지', v: SITE.addressFull },
    { k: '업무시간', v: SITE.openingHours },
    { k: '이메일', v: SITE.email },
  ].filter((r) => r.v)

  return (
    <section id="company" className="wk-sec bg-wk-bgFaint">
      <div className="wk-wrap">
        <Reveal y={16}>
          <p className="wk-eyebrow">확인 가능한 사실</p>
          <h2 className="wk-h2 max-w-[14ch] text-wk-ink">법인 정보와 인증</h2>
          <p className="wk-lead mt-5">
            결재 문서에 그대로 옮겨 쓸 수 있도록 등기 정보와 인증 번호를
            숨기지 않고 적습니다. 번호는 발급 기관에서 직접 조회하실 수 있습니다.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-12 lg:gap-8">
          {/* 등기 정보 */}
          <Reveal className="lg:col-span-5" y={18}>
            <div className="h-full rounded-card-m bg-white px-5 shadow-wk-1 sm:rounded-card sm:px-7">
              <p className="wk-row text-label font-semibold uppercase tracking-widest text-wk-ink3">
                사업자 등록 사항
              </p>
              {rows.map((r) => (
                <div key={r.k} className="wk-row items-start">
                  <span className="w-28 shrink-0 pt-0.5 text-label font-medium text-wk-ink3">
                    {r.k}
                  </span>
                  <span className="wk-metric flex-1 text-label font-semibold text-wk-ink">
                    {r.v}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* 인증 */}
          <div className="lg:col-span-7">
            <Stagger className="flex flex-col gap-3" y={14}>
              {HELD.map((c) => (
                <div
                  key={c.no}
                  className="rounded-card-m border border-wk-line bg-white p-5 shadow-wk-1 sm:p-6"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="wk-h3 text-wk-ink">{c.title}</p>
                    <span className="wk-tag">취득 완료</span>
                  </div>
                  <p className="mt-1 text-label text-wk-ink3">{c.detail}</p>

                  <dl className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-label text-wk-ink3">등록번호</dt>
                      <dd className="wk-metric text-label font-semibold text-wk-ink">{c.no}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-label text-wk-ink3">발급기관</dt>
                      <dd className="text-label font-medium text-wk-ink2">{c.issuer}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-label text-wk-ink3">유효기간</dt>
                      <dd className="text-label font-medium text-wk-ink2">{c.valid}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-label text-wk-ink3">확인 방법</dt>
                      <dd className="text-label font-medium">
                        {c.verify ? (
                          <a
                            href={c.verify.href}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-wk-cta underline underline-offset-4"
                          >
                            {c.verify.label}
                            <span className="sr-only"> (새 창)</span>
                          </a>
                        ) : (
                          <span className="text-wk-ink2">신청 서류로 확인</span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
            </Stagger>

          </div>
        </div>
      </div>
    </section>
  )
}
