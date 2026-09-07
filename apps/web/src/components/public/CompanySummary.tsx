import { Reveal, RiseMask, Stagger } from '@/components/motion'
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
 *
 * 2026-09-07 (3차) — CEO *"회사 소개가 좀 별로야."*
 * 🔴 이 섹션이 /about 의 **증빙 중심**이 됐다. 첫 수주 전이라 실적이 없는 회사가
 *    담당 공무원에게 내밀 수 있는 것은 서사가 아니라 조회되는 번호뿐인데,
 *    그 번호들이 페이지에서 **가장 작은 활자**로 적혀 있었다. 위계가 뒤집혀 있었다.
 *    ① 등기 표의 값 활자를 text-label → text-body 로 올렸다(라벨은 그대로 둬서 대비가 생긴다).
 *    ② 섹션 제목에 RiseMask 를 붙였다(설계계약서 §4 — 섹션 제목의 기본 등장, 섹션당 1회).
 *       Reveal 안에 넣지 않고 형제로 뒀다. 두 움직임이 겹치면 어느 쪽도 읽히지 않는다.
 *    ③ 등기 표에 '설립' 행을 신설했다. CompanyHero 사실 띠에서 '법인 설립 2026' 을
 *       뺐기 때문이다 — 숨긴 것이 아니라 **외치는 자리에서 기록하는 자리로 옮긴 것**이다.
 *       🔴 이 행을 지우지 마라. 지우면 설립 연도가 사이트에서 사라져 은폐가 된다.
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

/**
 * 취득 완료 — 번호로 공식 조회가 가능한 것만 올린다.
 * CompanyHero 의 사실 띠가 이 배열에서 KC 건수(TA- 로 시작하는 항목)를 세어 쓴다.
 * 그래서 여기에 인증이 추가되면 히어로 숫자도 자동으로 따라 오른다. 손으로 세지 말 것.
 */
export const HELD_CREDENTIALS: Credential[] = [
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
    { k: '설립', v: SITE.founded ? `${SITE.founded}년` : '' },
    { k: '사업자등록번호', v: SITE.bizRegNo },
    { k: '법인등록번호', v: SITE.corpRegNo },
    { k: '소재지', v: SITE.addressFull },
    { k: '업무시간', v: SITE.openingHours },
    { k: '이메일', v: SITE.email },
  ].filter((r) => r.v)

  return (
    <section id="company" className="wk-sec bg-wk-bgFaint">
      <div className="wk-wrap">
        {/* 섹션 머리는 eyebrow → 제목 → 리드 순으로 0.06 / 0.16 씩 민다(설계계약서 §4).
            RiseMask 는 Reveal 밖 형제로 둔다 — 움직이는 부모 안에 넣으면 둘 다 안 읽힌다. */}
        <Reveal y={10} duration={0.6}>
          <p className="wk-eyebrow">확인 가능한 사실</p>
        </Reveal>
        <h2 className="wk-h2 max-w-[14ch] text-wk-ink">
          <RiseMask delay={0.06}>법인 정보와 인증</RiseMask>
        </h2>
        {/* 2026-09-07 — "숨기지 않고 적습니다"(부정형 방어문)를 선언형으로 교체 */}
        <Reveal y={14} delay={0.16}>
          <p className="wk-lead mt-5">
            결재 문서에 그대로 옮겨 쓰실 수 있게 등기 정보와 인증 번호를 전부 적습니다.
            번호는 발급 기관에서 직접 조회하실 수 있습니다.
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
                  <span className="wk-metric flex-1 text-body font-semibold text-wk-ink">
                    {r.v}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* 인증 */}
          <div className="lg:col-span-7">
            <Stagger className="flex flex-col gap-3" y={14}>
              {HELD_CREDENTIALS.map((c) => (
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
                      {/* 등록번호는 이 페이지에서 가장 검증 가능한 값이다. 활자를 한 단 올린다 */}
                      <dd className="wk-metric text-body font-semibold text-wk-ink">{c.no}</dd>
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
