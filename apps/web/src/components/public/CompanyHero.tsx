import Image from 'next/image'
import { IMAGES } from '@/lib/imageAssets'
import { Reveal, SplitText } from '@/components/motion'
import { SITE } from '@/lib/seo/site'
import { PITCH_RANGE } from '@/lib/companyScope'
import { HELD_CREDENTIALS } from './CompanySummary'

/**
 * 회사 소개 첫 화면 — 전면 다크, 사진 한 장 위 선언 한 줄 + 사실 띠 3칸.
 *
 * 2026-09-07 (3차) CEO 반려 *"회사 소개가 좀 별로야."* 반영.
 *
 * 🔴 사실 띠 3칸을 **카탈로그 값에서 신원 값으로 바꿨다.**
 *    이전: 법인 설립 / 취급 화소 간격 / KC 적합등록 n건.
 *    지금: 사업자등록번호 / KC 적합등록 · 전원공급장치 n종 / 취급 화소 간격.
 *
 *    왜 —
 *    ① 이 회사가 담당 공무원에게 내밀 수 있는 가장 센 것은 서사가 아니라 **조회되는 번호**다.
 *       그런데 그 번호들이 페이지 60% 지점에 가장 작은 활자로 묻혀 있었다.
 *       첫 화면에 사업자등록번호를 거는 회사 소개는 흔하지 않다. 그게 이 페이지의 주장이다.
 *    ② 이전의 'KC 적합등록 2건' 은 **범위가 빠져 있어 완제품 등록으로 오독될 수 있었다.**
 *       적합등록은 전원공급장치(SMPS) 2종뿐이고 전광판 완제품은 미등록이다.
 *       관공서 상대 허위표기는 부정당업자 제재 사유다. 라벨에 범위를 박았다.
 *    ③ '법인 설립 2026' 은 뺐다 — **숨긴 것이 아니라 자리를 옮겼다.**
 *       CompanySummary 등기 표에 '설립' 행을 새로 만들어 그대로 적는다.
 *       첫 화면 3칸 중 하나를 신생이라는 사실에 쓰는 것은 묻지도 않은 답이다.
 *
 * 값의 출처 (전부 코드·등기. 손으로 적은 수치 0) —
 *   사업자등록번호  SITE.bizRegNo
 *   KC 적합등록     CompanySummary 의 HELD_CREDENTIALS 중 'TA-' 로 시작하는 항목 수.
 *                  인증이 늘면 숫자도 같이 는다. 손으로 세지 말 것
 *   취급 화소 간격  lib/companyScope.ts 가 견적엔진 ∪ 제품 카탈로그에서 계산
 * 실적·수상·고객사 같은 미확보 수치는 자리를 만들지 않는다.
 *
 * 유지 — 기관 문서식 표제 줄(회사 소개 / WOOKANG TECH + 괘선), 사실 띠 괘선의 전폭 관통,
 * 사진 위 하단 스크림(전면 검정 오버레이 금지, 설계계약서 §3).
 *
 * ─────────────────────────────────────────────────────────────
 * 2026-09-07 (4차) CEO 지시 *"회사 소개에 우리 사이니지 업체라고. 왜 이렇게 관공서하고 학교에 집착해."*
 *
 * 🔴 h1 을 **고객군에서 정체성으로** 바꿨다.
 *    before `관공서와 학교의 화면을 짓습니다`  ← 누구에게 파는가
 *    after  `LED 전광판을 만들고, 달고, 고칩니다` ← 무엇을 만드는가
 *    회사를 소개하는 자리(h1 · 메타 · JSON-LD)는 무엇을 만드는가로 말한다.
 *    누구에게 파는가는 요약표의 '설치 분야' 행과 `/industries` 가 맡는다.
 *    🔴 관공서·학교를 **없앤 것이 아니라 위계를 바로잡은 것**이다. 다시 h1 으로 올리지 마라.
 *
 * 🔴 세 동사(만들고 · 달고 · 고칩니다)는 장식이 아니라 **페이지의 뼈대**다.
 *    바로 아래 `CompanyChapters` 세 장의 제목이 그 세 동사를 차례로 받는다
 *    (01 직접 만듭니다 / 02 현장에서 재고 답니다 / 03 모듈만 갈아 고칩니다).
 *    제목만 훑어도 페이지가 파악되게 하려는 구조다. 한쪽만 고치면 그 대응이 깨진다.
 *
 * `.wk-hero` → `.wk-h1` 로 내렸다. 설계계약서 §1 은 `.wk-hero` 를 **홈 히어로 한 곳**으로
 * 제한한다(/about 은 페이지 H1 = `.wk-h1`). 겸사겸사 첫 화면이 짧아져
 * 사실 띠 3칸이 스크롤 없이 더 잘 들어온다 — "한눈에" 지시에 그대로 기여한다.
 * `.wk-emit-text` 는 다크 면 위 큰 활자 전용 발광이다. 글자색을 바꾸지 않으므로
 * 대비비(#F5F7FA on #0B0B0F = 18.3:1)가 그대로다.
 */
export function CompanyHero() {
  const kcCount = HELD_CREDENTIALS.filter((c) => c.no.startsWith('TA-')).length

  const facts = [
    { k: '사업자등록번호', v: SITE.bizRegNo },
    { k: 'KC 적합등록 · 전원공급장치', v: `${kcCount}종` },
    { k: '취급 화소 간격', v: PITCH_RANGE },
  ]

  return (
    <section
      data-wk-dark-hero
      className="relative flex min-h-[86svh] items-end overflow-hidden bg-wk-night lg:min-h-[92svh]"
    >
      <div className="wk-grain absolute inset-0" aria-hidden="true">
        <Image
          src={IMAGES.company.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_50%] lg:object-center"
        />
        {/* 문구가 하단 전폭에 깔리므로 하단 스크림을 쓴다. 전면 검정 오버레이 금지(설계계약서 §3) */}
        <div className="wk-scrim-b absolute inset-0" />
      </div>

      <div className="relative z-10 w-full pt-28 md:pt-32">
        <div className="wk-wrap">
          <Reveal y={0} duration={0.7}>
            <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-4">
              <p className="text-label font-semibold uppercase tracking-widest text-wk-blue">
                회사 소개
              </p>
              <p className="text-caption font-medium uppercase tracking-widest text-wk-nightMuted">
                {SITE.nameEn}
              </p>
            </div>
          </Reveal>

          <SplitText
            as="h1"
            text="LED 전광판을 만들고, 달고, 고칩니다"
            className="wk-h1 wk-emit-text mt-9 max-w-[15ch] text-wk-nightInk md:mt-12"
            delay={0.1}
          />

          <Reveal delay={0.34} y={18}>
            <p className="wk-lead mt-7 !text-wk-nightMuted">
              LED 전광판과 전자현수막을 만드는 사이니지 업체입니다. 설계·제작·시공·유지보수를 한
              회사가 맡고, 아래 등록번호는 발급 기관에서 그대로 조회하실 수 있습니다.
            </p>
          </Reveal>
        </div>

        {/* 사실 띠 — 괘선이 화면 폭을 가로지른다. 안쪽 내용만 wk-wrap 을 따른다 */}
        <Reveal delay={0.46} y={14}>
          <div className="mt-14 border-t border-white/20 md:mt-20">
            <div className="wk-wrap">
              <dl className="grid gap-5 py-7 sm:grid-cols-3 sm:gap-8 md:py-9">
                {facts.map((f) => (
                  <div key={f.k}>
                    <dt className="text-caption font-medium uppercase tracking-widest text-wk-nightMuted">
                      {f.k}
                    </dt>
                    <dd className="wk-metric mt-2 text-h3 font-semibold text-wk-nightInk">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
