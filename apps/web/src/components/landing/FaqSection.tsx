'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

import { JsonLd } from '@/components/seo/JsonLd'
import { faqPageLd } from '@/lib/seo/jsonld'
import { Reveal } from '@/components/motion'

/**
 * 자주 묻는 질문.
 *
 * 독자는 관공서·학교 담당 공무원이다. 이 사람이 실제로 막히는 지점은
 * 제품 사양이 아니라 **결재를 통과시키는 방법**이다.
 * 예산 과목, 계약 방법, 전기 인입, 사후 관리 인력 — 그 순서로 묻는다.
 * 그래서 답변마다 "그래서 담당자가 무엇을 하면 되는지" 로 끝난다.
 *
 * 아코디언 높이는 `height: auto` 애니메이션 대신 grid-template-rows 0fr→1fr 로 편다.
 * height 애니메이션은 매 프레임 레이아웃을 다시 계산시킨다(설계계약서 §0.6).
 *
 * ⚠️ 지킬 수 없는 약속(응답 시간 SLA, 실적 건수)을 답변에 넣지 않는다.
 */
type Faq = { q: string; a: string; cat: Cat }
type Cat = '예산·계약' | '설치·시공' | '운영·관리' | '사후관리'

const CATS: Cat[] = ['예산·계약', '설치·시공', '운영·관리', '사후관리']

const FAQS: Faq[] = [
  {
    cat: '예산·계약',
    q: '예산은 어떤 과목으로 잡아야 하나요?',
    a: '전광판은 내용연수가 있는 자산이라 통상 자산취득비 또는 시설비·부대비로 계상합니다. 기관 회계 기준에 따라 과목이 달라지므로, 규격서에 품명·규격·수량·내용연수를 기재해 드립니다. 그 문서를 그대로 예산 요구서에 첨부하실 수 있습니다.',
  },
  {
    cat: '예산·계약',
    q: '왜 확정가가 아니라 범위 견적인가요?',
    a: '같은 크기라도 현장 조건에서 금액이 갈리기 때문입니다. 바닥에서 몇 미터인지, 화면 뒤로 사람이 들어갈 수 있는지, 전기를 어디서 끌어오는지, 기존 벽이나 기둥에 붙일 수 있는지 아니면 지주를 새로 세워야 하는지. 이런 게 제품 단가보다 금액을 더 많이 움직입니다. 실측 전에 확정가를 약속하는 곳은 나중에 추가비용이 붙기 쉽습니다. 저희는 문의 단계에서 예상 범위와 그 산출 근거만 드리고, 현장을 보고 나서 확정 견적과 규격서를 문서로 드립니다.',
  },
  {
    cat: '예산·계약',
    q: '계약은 어떤 방식으로 하나요?',
    a: '금액에서 갈립니다. 추정가격 2천만원 미만이면 수의계약이 가능하고, 이 구간에서는 유사 납품실적 같은 조건도 걸리지 않습니다. 그 위로 올라가면 견적 제출이나 나라장터 입찰이 되고 실적 요건이 붙는 경우가 많습니다. 다만 기관 내부 규정과 전결 기준이 있으니 최종 판단은 계약부서에 확인하십시오. 어느 방식이든 필요한 서류 목록을 알려주시면 그 형식에 맞춰 준비해 보내드립니다.',
  },
  {
    cat: '예산·계약',
    q: '견적을 여러 곳 받았는데 비교가 안 됩니다.',
    a: '업체마다 적는 항목이 달라서 그렇습니다. 금액만 놓고 보면 비교가 안 됩니다. 픽셀 간격, 밝기, 방수 등급, 보증 기간, 설치 범위가 어디까지인지 이 다섯 가지를 같은 기준으로 적어 달라고 요청해 보십시오. 그러면 비교가 됩니다. 저희 규격서는 그 항목들이 처음부터 들어가 있습니다.',
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
    a: '옥외 설치는 지자체 옥외광고물 신고 대상일 수 있습니다. 신고 서류 준비와 접수는 우강테크가 함께 진행합니다. 다만 지역·구조·규격에 따라 신고 수수료나 구조안전 확인서가 추가로 필요할 수 있어, 해당 여부를 실측 단계에서 알려드립니다.',
  },
  {
    cat: '설치·시공',
    q: '시공 기간과 민원·학사 일정 영향은 어떻게 되나요?',
    a: '표준 규격 기준 현장 작업은 보통 1~3일입니다. 소음과 통행 제한이 생기는 구간은 반나절 안쪽으로 몰아서 처리합니다. 방학, 휴일, 업무 시간 외 시공도 가능하니 기관 일정을 먼저 알려주시면 그 일정에 맞춰 계획을 짜서 보내드립니다.',
  },
  {
    cat: '설치·시공',
    q: '비·눈·바람은 견디나요?',
    a: '옥외 제품은 방수·방진 IP65 등급으로 시공합니다. 지주와 브래킷은 그 자리에 바람이 얼마나 부는지를 반영해 설계합니다. 구조 계산과 방수 마감을 어떻게 했는지는 실측 후 규격서에 적어 드립니다.',
  },
  {
    cat: '운영·관리',
    q: '담당자가 직접 화면을 바꿀 수 있나요?',
    a: '가능합니다. 그게 이 설비를 쓰는 이유입니다. 인수 시 담당자 PC에서 문구·일정·이미지를 바꾸는 방법을 교육하고, 화면 캡처를 넣은 조작 안내서를 함께 드립니다. 인사이동으로 담당자가 바뀌어도 그 문서로 인수인계가 됩니다.',
  },
  {
    cat: '운영·관리',
    q: '전기요금이 많이 나오지 않나요?',
    a: '소비전력은 표시 내용과 밝기에 따라 달라집니다. 실내 소형은 일반 사무기기 수준이고 옥외 대형은 그보다 높습니다. 견적서에 예상 소비전력과 권장 전원 회로를 함께 적어 드리며, 주변 밝기에 따라 자동으로 휘도를 낮추는 설정으로 야간 전력을 줄일 수 있습니다.',
  },
  {
    cat: '운영·관리',
    q: '관리 인력이 따로 필요한가요?',
    a: '상주 인력은 필요하지 않습니다. 평소 조작은 문구 교체 수준이고, 전원·신호 이상은 원격으로 먼저 확인합니다. 다만 담당 부서와 연락 창구 한 곳은 지정해 두시는 편이 장애 대응이 빠릅니다.',
  },
  {
    cat: '사후관리',
    q: '고장 나면 어떻게 되나요? 보증 기간은요?',
    a: 'LED는 모듈 단위로 교체할 수 있어 부분 고장 시 화면 전체를 해체하지 않습니다. 접수 → 원격 확인 → 방문 판정 → 해당 모듈 교체 → 결과 보고 순으로 진행하고, 처리 내역은 문서로 제출해 검수·감사 자료로 쓰실 수 있습니다. 하드웨어 무상보증은 스탠다드 1년, 프리미엄 2년이며 프리미엄은 예비부품 보유가 포함됩니다. 이건 제품 보증이고, 계약상 하자보증은 별개입니다. 공공계약은 보통 계약금액의 10%를 하자보증으로 잡고 기간은 3년입니다. 예산 짜실 때 이 항목이 빠져 있으면 계약 단계에서 다시 조정해야 합니다.',
  },
  {
    cat: '사후관리',
    q: '나중에 유지보수 비용이 많이 든다던데요.',
    a: '설치 위치에 따라 크게 갈립니다. 화면이 높이 달려 있고 뒤로 들어갈 통로가 없으면, 모듈 하나 갈 때마다 고소작업차를 불러야 합니다. 한 번 출동에 장비와 인력이 같이 들어가니 몇 해 쌓이면 처음 모듈 단가 차이를 넘어섭니다. 그래서 설계할 때부터 앞에서 정비할 수 있는 구조로 잡거나, 예비 모듈을 몇 장 확보해 두는 편이 낫습니다. 실측 때 어느 쪽이 맞는지 같이 보고 규격서에 적어 드립니다.',
  },
  {
    cat: '사후관리',
    q: '규격서·도면·시험성적서를 받을 수 있나요?',
    a: '받으실 수 있습니다. 제품 규격서와 설치 도면은 견적 단계에서, 시험성적서와 인증 서류는 계약 단계에서 제출합니다. 인증은 어디까지 됐는지 그대로 적어서 드립니다. 지금은 전원공급장치 두 종이 우강테크 이름으로 적합등록을 마친 상태고, 전광판 본체는 진행 중입니다. 견적서에 그냥 "KC"라고만 적힌 걸 받으시면 무엇에 대한 인증인지, 등록번호가 있는지 물어보십시오. 전원장치 인증과 전광판 본체 인증은 다른 얘기입니다.',
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
   * 전체 목록의 정본은 `/faq` 한 곳이다 — 같은 17문항을 세 페이지에 반복하지 않는다.
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
    <section id="faq" aria-labelledby="faq-h" className="wk-sec scroll-mt-20 bg-white">
      <JsonLd id="ld-home-faq" data={faqPageLd(HOME_FAQS)} />

      <div className="wk-wrap grid gap-12 lg:grid-cols-[4fr_8fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          {!hideHeader && (
            <Reveal>
              <div>
                <p className="wk-eyebrow">FAQ</p>
                <h2 id="faq-h" className="wk-h2 text-wk-ink">
                  자주 묻는 것
                </h2>
                <p className="wk-lead mt-5">
                  예산 과목부터 사후 관리까지, 담당자가 실제로 막히는 지점만 모았습니다.
                </p>
              </div>
            </Reveal>
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
                      className="flex w-full items-start justify-between gap-6 py-6 text-left"
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

          <p className="wk-cap mt-8">
            {limit ? (
              <>
                나머지 질문도 정리해 두었습니다.{' '}
                <Link
                  href="/faq"
                  className="font-semibold text-wk-cta underline underline-offset-4"
                >
                  자주 묻는 질문 전체 보기 →
                </Link>
              </>
            ) : (
              <>
                여기 없는 내용은 직접 물어보시는 편이 빠릅니다.{' '}
                <Link
                  href="/quote"
                  className="font-semibold text-wk-cta underline underline-offset-4"
                >
                  설치 조건 남기고 상담 요청하기 →
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
