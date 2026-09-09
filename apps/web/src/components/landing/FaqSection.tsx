'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

import { JsonLd } from '@/components/seo/JsonLd'
import { faqPageLd } from '@/lib/seo/jsonld'
import { Reveal, RiseMask } from '@/components/motion'

/**
 * 자주 묻는 질문.
 *
 * 우리는 LED 사이니지 업체다. 이 목록의 독자는 그중 결재를 올려야 하는 쪽 —
 * 관공서·학교·병원·공동주택 담당자다. 이 사람이 막히는 지점은 제품 사양이 아니라
 * **결재를 통과시키는 방법**이라 예산 과목, 계약 방법, 전기 인입, 사후 관리 순으로 묻는다.
 * 그래서 답변마다 "그래서 담당자가 무엇을 하면 되는지" 로 끝난다.
 *
 * 🔴 2026-09-07 — "규격서·안내서·성적서를 드립니다" 형태의 별도 문서 제공 약속을 전부 걷었다.
 *   견적서는 준다. 그 밖의 서류를 따로 만들어 준다는 말은 하지 않는다(CEO 지시).
 * 🔴 2026-09-08 — '나라장터 종합쇼핑몰에서 바로 구매할 수 있나요?' 문답을 뺐다. 답이 "등록돼 있지
 *   않다"를 돌려 말한 신생 자기고백이었다. 계약 방식은 바로 위 '계약은 어떤 방식으로 하나요?' 가 다룬다.
 *
 * 아코디언 높이는 `height: auto` 애니메이션 대신 grid-template-rows 0fr→1fr 로 편다.
 * height 애니메이션은 매 프레임 레이아웃을 다시 계산시킨다(설계계약서 §0.6).
 *
 * ⚠️ 지킬 수 없는 약속(실적 건수, 처리 시간 보장)을 답변에 넣지 않는다.
 * 2026-09-07 예외 1건 — "영업일 기준 1일 안에 연락"은 CEO 가 지킬 수 있다고 판단해 넣었다.
 *   접수 후 아무 말도 없으면 담당자는 다른 곳을 알아본다. 이 문장은 견적 완료 화면과 같은 값이어야 한다.
 */
type Faq = { q: string; a: string; cat: Cat }
type Cat = '예산·계약' | '설치·시공' | '운영·관리' | '사후관리'

const CATS: Cat[] = ['예산·계약', '설치·시공', '운영·관리', '사후관리']

const FAQS: Faq[] = [
  {
    cat: '예산·계약',
    q: '예산은 어떤 과목으로 잡아야 하나요?',
    a: '전광판은 내용연수가 있는 자산이라 통상 자산취득비 또는 시설비·부대비로 계상합니다. 다만 기관 회계 기준에 따라 과목이 갈리니 최종 판단은 회계부서 몫입니다. 견적서에 품명·규격·수량·내용연수를 적어 두니 그 값을 그대로 예산 요구서에 옮기시면 됩니다.',
  },
  {
    cat: '예산·계약',
    q: '왜 확정가가 아니라 범위 견적인가요?',
    a: '설치 높이, 전기 인입, 붙일 면의 구조가 제품 단가보다 금액을 더 크게 움직입니다. 문의 단계에서 예상 범위를 드리고, 현장 실측 후 확정 견적을 냅니다.',
  },
  {
    cat: '예산·계약',
    q: '계약은 어떤 방식으로 하나요?',
    a: '금액에서 갈립니다. 추정가격 2천만원 미만이면 수의계약이 되고, 이 구간에서는 유사 납품실적 같은 조건도 걸리지 않습니다. 그 위로 올라가면 견적 제출이나 나라장터 입찰이 되고 실적 요건이 붙는 경우가 많습니다. 다만 기관마다 내부 규정과 전결 기준이 달라서, 어느 구간인지는 계약부서에 먼저 확인하시는 게 빠릅니다.',
  },
  {
    cat: '예산·계약',
    q: 'KC 인증은 어디까지 되어 있습니까?',
    a: 'KC 인증 제품만 공급합니다. 인증받지 않은 제품은 취급하지 않습니다. 납품 서류에 필요한 등록번호는 견적 단계에서 함께 드립니다.',
  },
  {
    cat: '예산·계약',
    q: '견적을 요청하면 언제 연락이 오나요?',
    a: '영업일 기준 1일 안에 남겨주신 연락처로 연락드립니다. 첫 통화에서 확인하는 건 셋입니다. 어디에 다는지, 몇 미터 떨어져서 보는지, 전기를 어디서 끌어올 수 있는지. 이것만으로 개략 범위가 잡히는 건도 있고, 현장을 봐야 하면 실측 일정을 그 자리에서 잡습니다. 사진을 미리 보내주시면 통화가 짧아집니다.',
  },
  {
    cat: '예산·계약',
    q: '견적을 여러 곳 받았는데 비교가 안 됩니다.',
    a: '업체마다 적는 항목이 달라서 그렇습니다. 화소 간격, 밝기, 방수 등급, 보증 기간, 설치 범위가 어디까지인지. 이 다섯 개를 같은 형식으로 적어 달라고 각 업체에 요청해 보십시오. 그러고 나면 금액 차이가 어디서 나는지 보입니다. 특히 설치 범위가 문제입니다. 기초·지주·전기 증설을 견적에 넣은 곳과 뺀 곳이 섞이면 싼 쪽이 나중에 비싸집니다.',
  },
  {
    cat: '예산·계약',
    q: '연말에 예산을 써야 하는데 언제 문의해야 하나요?',
    a: '9월에서 10월 사이에 한 번 보시는 걸 권합니다. 집행 시점에 알아보기 시작하면 대체로 늦습니다. 현장 조건을 확인하고 견적을 뽑는 데 시간이 걸리고, 전기 증설이나 구조 보강이 걸리면 더 걸립니다. 미리 현장 한 번 보고 개략 금액만 잡아두시면 집행할 때 바로 진행됩니다.',
  },
  {
    cat: '설치·시공',
    q: '전기 인입은 누가 준비하나요?',
    a: '설치 지점까지의 전원 인입은 기관에서, 그 이후 분전·배선·접지는 우강테크가 맡는 것이 일반적입니다. 실측 때 기존 회로 용량을 확인해 증설이 필요한지 먼저 판정하고, 필요하면 그 범위와 비용을 확정 견적에 명시합니다. 한 가지 미리 확인하시면 좋은 게 있습니다. 전기설비 공사는 전기공사업 등록업체가 해야 합니다. 계약하려는 업체가 그 면허를 가지고 있는지, 없으면 어느 협력업체가 하는지 계약 전에 물어보십시오. 계약하고 나서 알게 되면 일정이 밀립니다.',
  },
  {
    cat: '설치·시공',
    q: '옥외광고물 신고는 누가 처리하나요?',
    a: '옥외에 다는 경우 지자체 옥외광고물 신고 대상일 수 있습니다. 신고 서류 준비와 접수는 저희가 같이 합니다. 다만 지역·구조·규격에 따라 수수료가 붙거나 구조안전 확인서를 따로 받아야 하는 자리가 있습니다. 그 자리인지 아닌지는 실측 때 판정해서 알려드립니다.',
  },
  {
    cat: '설치·시공',
    q: '시공 기간과 민원·학사 일정 영향은 어떻게 되나요?',
    a: '표준 규격 기준 현장 작업은 보통 1~3일입니다. 소음과 통행 제한이 생기는 구간은 반나절 안쪽으로 몰아서 끝냅니다. 방학이나 휴일, 업무 시간 외 작업도 됩니다. 피해야 하는 날짜를 먼저 알려주시면 그 날짜를 빼고 짭니다.',
  },
  {
    cat: '설치·시공',
    q: '비·눈·바람은 견디나요?',
    a: '옥외 제품은 방수·방진 IP65로 갑니다. 지주와 브래킷은 그 자리에 바람이 얼마나 부는지를 넣어 설계합니다. 눈은 무게 문제고 바람은 면적 문제라 계산이 서로 다릅니다. 어느 쪽이 더 걸리는 자리인지는 실측하면 나옵니다.',
  },
  {
    cat: '운영·관리',
    q: '담당자가 직접 화면을 바꿀 수 있나요?',
    a: '가능합니다. 그게 이 설비를 쓰는 이유입니다. 인계할 때 담당자분 PC에서 문구·일정·이미지를 바꾸는 걸 직접 해 보시게 합니다. 보통 30분이면 됩니다. 인사이동이 잦은 자리면 인계받을 분까지 같이 앉히시는 편이 낫습니다.',
  },
  {
    cat: '운영·관리',
    q: '전기요금이 많이 나오지 않나요?',
    a: '화면에 무엇을 띄우느냐와 밝기에 따라 달라집니다. 흰 바탕에 검은 글씨가 가장 많이 먹습니다. 실내 소형은 사무기기 정도이고 옥외 대형은 그보다 한참 높습니다. 견적서에 예상 소비전력과 권장 전원 회로를 같이 적으니 그 값으로 잡으시면 됩니다. 야간에는 주변이 어두워지면 밝기를 자동으로 낮추는 설정을 기본으로 넣습니다.',
  },
  {
    cat: '운영·관리',
    q: '관리 인력이 따로 필요한가요?',
    a: '상주 인력은 필요하지 않습니다. 평소 조작은 문구 교체 수준이고, 전원·신호 이상은 원격으로 먼저 확인합니다. 다만 담당 부서와 연락 창구 한 곳은 지정해 두시는 편이 장애 대응이 빠릅니다.',
  },
  {
    cat: '사후관리',
    q: '고장 나면 어떻게 되나요? 보증 기간은요?',
    a: '접수 → 원격 확인 → 방문 판정 → 해당 모듈 교체 순으로 진행합니다. 부분 고장에 화면 전체를 해체하지 않습니다. 무상보증 기간은 견적 단계에서 안내드립니다.',
  },
  {
    cat: '사후관리',
    q: '나중에 유지보수 비용이 많이 든다던데요.',
    a: '설치 위치에 따라 크게 갈립니다. 화면이 높이 달려 있고 뒤로 들어갈 통로가 없으면 모듈 하나 갈 때마다 고소작업차를 불러야 합니다. 한 번 출동에 장비와 인력이 같이 들어가니 몇 해 쌓이면 처음 모듈 단가 차이를 넘어섭니다. 그래서 설계할 때부터 앞에서 정비되는 구조로 잡거나, 예비 모듈을 몇 장 확보해 두는 편이 낫습니다. 어느 쪽이 맞는지는 실측 때 같이 봅니다.',
  },
  {
    cat: '사후관리',
    q: '보낸 현장 사진은 어떻게 쓰이나요?',
    a: '어디에 얼마만 한 걸 놓는지 보고 개략 견적을 내는 데만 씁니다. 동의하신 범위를 벗어나지 않고, 홍보에는 쓰지 않습니다. 자세한 건 개인정보처리방침에 적어 뒀습니다.',
  },
]

/** JSON-LD 및 외부 참조용 평면 목록 */
export const HOME_FAQS = FAQS.map((f) => ({ question: f.q, answer: f.a }))

export function FaqSection({
  hideHeader = false,
  limit,
}: {
  hideHeader?: boolean
  /**
   * 보여줄 문항 수. 홈처럼 요약만 필요한 자리에서 쓴다.
   * 전체 목록의 정본은 `/faq` 한 곳이다 — 같은 문항을 세 페이지에 반복하지 않는다.
   */
  limit?: number
}) {
  const [cat, setCat] = useState<Cat | '전체'>('전체')
  const [open, setOpen] = useState<string | null>(FAQS[0].q)

  const list = useMemo(() => {
    const byCat = cat === '전체' ? FAQS : FAQS.filter((f) => f.cat === cat)
    return limit ? byCat.slice(0, limit) : byCat
  }, [cat, limit])

  return (
    <section id="faq" aria-labelledby="faq-h" className="wk-sec scroll-mt-32 bg-white">
      <JsonLd id="ld-home-faq" data={faqPageLd(HOME_FAQS)} />

      <div className="wk-wrap grid gap-12 lg:grid-cols-[4fr_8fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          {!hideHeader && (
            <div>
              <Reveal y={10} duration={0.6}>
                <p className="wk-eyebrow">자주 묻는 질문</p>
              </Reveal>
              <h2 id="faq-h" className="wk-h2 text-wk-ink">
                <RiseMask delay={0.06}>자주 묻는 것</RiseMask>
              </h2>
              <Reveal y={14} delay={0.16}>
                <p className="wk-lead mt-5">
                  예산 과목부터 사후 관리까지, 담당자가 실제로 막히는 지점만 모았습니다.
                </p>
              </Reveal>
            </div>
          )}
        </div>

        <div>
          {/* 분류 — 선택 상태를 색만으로 알리지 않는다(색 + 굵기 + 밑줄) */}
          <div role="tablist" aria-label="질문 분류" className="mb-8 flex flex-wrap gap-x-6 gap-y-3">
            {(['전체', ...CATS] as const).map((c) => {
              const on = cat === c
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={on}
                  type="button"
                  onClick={() => setCat(c)}
                  className={`border-b-2 pb-1.5 text-label transition-colors duration-state ease-state ${
                    on
                      ? 'border-wk-cta font-bold text-wk-cta'
                      : 'border-transparent font-medium text-wk-ink3 hover:text-wk-ink'
                  }`}
                >
                  {c}
                </button>
              )
            })}
          </div>

          <div className="border-t border-wk-line">
            {list.map((item) => {
              const isOpen = open === item.q
              return (
                <div key={item.q} className="border-b border-wk-line">
                  <h3 className="m-0">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : item.q)}
                      aria-expanded={isOpen}
                      className="-mx-3 flex w-full items-start justify-between gap-6 rounded-btn px-3 py-6 text-left transition-colors duration-state ease-state hover:bg-wk-bgFaint"
                    >
                      <span className="text-body-lg font-semibold text-wk-ink">{item.q}</span>
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full
                          transition-all duration-state ease-state ${
                            isOpen ? 'rotate-180 bg-wk-cta text-white' : 'bg-wk-bg text-wk-ink3'
                          }`}
                      >
                        <ChevronDown size={16} strokeWidth={2.4} />
                      </span>
                    </button>
                  </h3>

                  {/* 0fr → 1fr. height 애니메이션과 달리 매 프레임 레이아웃을 다시 재지 않는다 */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-enter ease-entrance ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="wk-body max-w-[42rem] pb-7 !text-wk-ink3">{item.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 🔴 2026-09-07 접점 정리 — limit 이 없는 전체 목록(/faq)에서는 아무것도 붙이지 않는다.
              이전에는 "여기 없는 내용은 직접 물어보시는 편이 빠릅니다 → /quote" 를 달았는데,
              /faq 는 이 섹션 바로 아래가 CtaSection("여기 없는 것은 / 직접 답하겠습니다" → /quote)라
              같은 말과 같은 목적지가 한 화면에 두 번 나왔다. 리드 경로는 그대로 남는다. */}
          {limit && (
            <p className="wk-cap mt-8">
              나머지 질문도 정리해 두었습니다.{' '}
              <Link
                href="/support/faq"
                className="font-semibold text-wk-cta underline underline-offset-4"
              >
                자주 묻는 질문 전체 보기 →
              </Link>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
