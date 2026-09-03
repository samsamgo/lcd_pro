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
    a: '전기 용량, 구조 보강, 옥외광고물 신고, 통신 환경에 따라 실비가 크게 달라집니다. 실측 전에 확정가를 약속하는 곳은 나중에 추가비용이 붙기 쉽습니다. 우강테크는 문의 단계에서는 예상 범위와 그 산출 근거만 드리고, 현장 실측 후 확정 견적과 규격서를 문서로 제출합니다.',
  },
  {
    cat: '예산·계약',
    q: '계약은 어떤 방식으로 하나요?',
    a: '기관 규모와 금액에 따라 수의계약, 견적 제출, 나라장터 입찰 중에서 선택하십니다. 어느 방식이든 필요한 서류(사업자등록증, 규격서, 견적서, 시험성적서 등)를 요청 주시는 형식에 맞춰 제출합니다. 필요한 서류 목록을 먼저 알려주시면 준비해 보내드립니다.',
  },
  {
    cat: '설치·시공',
    q: '전기 인입은 누가 준비하나요?',
    a: '설치 지점까지의 전원 인입은 기관에서, 그 이후 분전·배선·접지는 우강테크가 맡는 것이 일반적입니다. 실측 때 기존 회로 용량을 확인해 증설이 필요한지 먼저 판정하고, 필요하면 그 범위와 비용을 확정 견적에 명시합니다.',
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
    a: '옥외 제품은 방수·방진 IP65 등급으로 시공하고, 지주·브래킷은 설치 지점의 풍압을 반영해 설계합니다. 구조 계산과 방수 마감 방식은 실측 후 규격서에 기재해 제출합니다.',
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
    a: 'LED는 모듈 단위로 교체할 수 있어 부분 고장 시 화면 전체를 해체하지 않습니다. 접수 → 원격 확인 → 방문 판정 → 해당 모듈 교체 → 결과 보고 순으로 진행하고, 처리 내역은 문서로 제출해 검수·감사 자료로 쓰실 수 있습니다. 하드웨어 무상보증은 스탠다드 1년, 프리미엄 2년이며 프리미엄은 예비부품 보유가 포함됩니다.',
  },
  {
    cat: '사후관리',
    q: '규격서·도면·시험성적서를 받을 수 있나요?',
    a: '받으실 수 있습니다. 제품 규격서와 설치 도면은 견적 단계에서, 시험성적서와 인증 서류는 계약 단계에서 제출합니다. 필요한 서류 목록을 알려주시면 기관 양식에 맞춰 정리해 보내드립니다.',
  },
  {
    cat: '사후관리',
    q: '보낸 현장 사진은 어떻게 쓰이나요?',
    a: '설치 위치와 규모를 파악해 개략 견적을 내는 용도로만 씁니다. 동의받은 범위 안에서만 활용하고, 홍보에 쓰지 않습니다. 자세한 내용은 개인정보처리방침에서 확인하실 수 있습니다.',
  },
]

/** JSON-LD 및 외부 참조용 평면 목록 */
export const HOME_FAQS = FAQS.map((f) => ({ question: f.q, answer: f.a }))

export function FaqSection({ hideHeader = false }: { hideHeader?: boolean }) {
  const [cat, setCat] = useState<Cat | '전체'>('전체')
  const [open, setOpen] = useState<string | null>(FAQS[0].q)

  const list = useMemo(() => (cat === '전체' ? FAQS : FAQS.filter((f) => f.cat === cat)), [cat])

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
                  결재 전에
                  <br />
                  가장 많이 묻는 것
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
            여기 없는 내용은 직접 물어보시는 편이 빠릅니다.{' '}
            <Link
              href="/quote"
              className="font-semibold text-wk-cta underline underline-offset-4"
            >
              설치 조건 남기고 상담 요청하기 →
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
