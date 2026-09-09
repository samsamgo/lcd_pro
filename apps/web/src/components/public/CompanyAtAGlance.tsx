import Link from 'next/link'
import { Reveal, RiseMask, Stagger } from '@/components/motion'
import { SITE } from '@/lib/seo/site'
import { INDUSTRIES, INDUSTRY_GROUPS } from '@/lib/industries'

/**
 * 회사 소개 요약표 — 히어로 바로 아래. **이 페이지의 목차이자 답변지다.**
 *
 * 2026-09-07 (4차) 신설. CEO 지시 *"한눈에 보기도 좀 더 보기 쉽게."*
 *
 * 🔴 진단 — 3차까지 /about 은 담당자가 10초 안에 얻어야 하는 네 가지 중
 *    하나(실재하는가 = 히어로 사실 띠)만 첫 화면에 있었다.
 *      · 무슨 회사인가      → h1 이 고객군을 말하고 있어 **답이 아예 없었다**
 *      · 무엇을 하는가      → 공정 3장 산문 4화면에 흩어져 있었다
 *      · 어떻게 연락하나    → 페이지 맨 끝(5화면 아래)
 *    5섹션짜리 긴 페이지인데 무엇이 어디 있는지 알려 주는 장치가 0이었다.
 *
 * 🔴 그래서 부품을 "얹은" 것이 아니라 **답변지를 앞으로 당겼다.** 네 행이 네 질문이다.
 *    각 행은 아래 어느 섹션이 그 질문의 원본인지 링크로 가리킨다 — 요약이면서 목차다.
 *    (1·2차 개정이 반려된 이유는 새 서사를 얹었기 때문이다. 여기엔 새 정보가 0이다.
 *     전부 아래에 이미 있는 값을 위로 올린 것뿐이고, 그래서 중복 읽기가 생기지 않는다.)
 *
 * 🔴 손으로 적은 값 0 —
 *    설치 분야  `INDUSTRY_GROUPS` 4군 라벨 + `INDUSTRIES.length`
 *    법인 정보  `SITE.bizRegNo` · `SITE.corpRegNo`
 *    연락       `SITE.phone` · `SITE.openingHours`
 *    카탈로그가 늘면 이 표도 같이 는다. 실적 성격 수치(건수·연차·매출)는 여기 만들지 않는다.
 *
 * ⚠️ 전화번호가 `#location` 과 이 표 두 곳에 뜬다. 이전 규칙(연락처는 한 곳)의
 *    **의도적 예외**다. "어떻게 연락하나" 는 10초 안에 답해야 하는 질문인데
 *    그 답이 여러 화면 아래에만 있으면 답이 없는 것과 같다. 대신 여기서는 `tel:` 링크를
 *    걸지 않는다 — 누르는 접점은 `#location` 과 `MobileCtaBar` 로 유지한다.
 *
 * 🔴 2026-09-08 QA — '실재 확인'(사업자·법인등록번호) 행을 뺐다. 바로 아래 회사 개요 표
 *    (`#company`)가 같은 번호를 보여 주므로 한 화면 안 중복이었다. 표가 정본, 여기는 세 행.
 *    옛 링크 `#company`·`#contact` 중 `#contact` 는 이 페이지에 없어 `#location` 으로 고쳤다.
 *
 * 면 — `bg-wk-night2`(#111218). 앞뒤가 전부 `bg-wk-night`(#0B0B0F) 라
 *      한 단 밝은 보조면으로 띄워야 "끼워 넣은 표" 로 읽힌다. 다리는 쓰지 않는다
 *      (다크→다크라 전환이 아니다. `.wk-bridge-*` 는 명암이 뒤집힐 때만 쓴다).
 *
 * 모션 — `RiseMask` 1(섹션 제목, 설계계약서 §4) + `Stagger` 1.
 *        🔴 구조정본 §15 — `Stagger` 자식에 `first:`/`last:` 를 쓰지 않는다.
 *        구분선은 컨테이너의 `divide-y` 로 건다.
 *        행 호버는 `transform` 없이 배경색만 바꾼다 — 전역 reduced-motion 블록이
 *        `transition-duration` 만 줄이므로 transform 을 쓰면 튀어오른다(§16-D).
 */
type Row = {
  /** 담당자가 던지는 질문 */
  q: string
  /** 그 질문의 답 */
  a: string
  /** 답을 한 단 좁히는 보조 값 */
  sub: string
  /** 답의 원본이 있는 곳 */
  href: string
  cta: string
}

export function CompanyAtAGlance() {
  const rows: Row[] = [
    {
      q: '무슨 회사',
      a: 'LED 전광판·전자현수막을 만드는 사이니지 업체',
      sub: '설계 · 제작 · 시공 · 유지보수',
      href: '#why',
      cta: '왜 우강테크인가',
    },
    {
      q: '설치 분야',
      a: INDUSTRY_GROUPS.map((g) => g.label).join(' · '),
      sub: `${INDUSTRIES.length}개 시설 유형`,
      href: '/industries',
      cta: '시공사례 보기',
    },
    {
      q: '연락',
      a: SITE.phone,
      sub: `${SITE.openingHours} · ${SITE.email}`,
      href: '#location',
      cta: '오시는 길 보기',
    },
  ]

  return (
    <section aria-labelledby="glance-h" className="wk-sec-sm bg-wk-night2">
      <div className="wk-wrap">
        <Reveal y={10} duration={0.6}>
          <p className="text-label font-semibold uppercase tracking-widest text-wk-blue">
            한눈에 보기
          </p>
        </Reveal>
        {/* RiseMask 는 Reveal 밖 형제로 둔다 — 움직이는 부모 안에 넣으면 둘 다 안 읽힌다(§16-D) */}
        <h2 id="glance-h" className="wk-h2 mt-5 max-w-[16ch] text-wk-nightInk">
          <RiseMask delay={0.06}>먼저 확인하실 세 가지</RiseMask>
        </h2>

        <Stagger
          className="mt-10 divide-y divide-white/10 border-y border-white/10 md:mt-12"
          y={12}
        >
          {rows.map((r) => (
            <div
              key={r.q}
              className="grid items-baseline gap-x-8 gap-y-2 px-2 py-6 transition-colors hover:bg-white/5 md:grid-cols-12 md:py-7"
            >
              <p className="text-caption font-medium uppercase tracking-widest text-wk-nightMuted md:col-span-3">
                {r.q}
              </p>
              <div className="md:col-span-6">
                <p className="wk-metric break-keep text-lead font-semibold text-wk-nightInk">{r.a}</p>
                <p className="mt-1.5 break-keep text-label text-wk-nightMuted">{r.sub}</p>
              </div>
              <p className="md:col-span-3 md:text-right">
                <Link
                  href={r.href}
                  className="text-label font-semibold text-wk-blue underline-offset-4 hover:underline"
                >
                  {r.cta}
                  <span aria-hidden="true"> →</span>
                </Link>
              </p>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
