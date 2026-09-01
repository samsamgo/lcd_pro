'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { JsonLd } from '@/components/seo/JsonLd'
import { faqPageLd } from '@/lib/seo/jsonld'

// 홈 인라인 FAQ — 최종 CTA 직전. 가격변동·인허가·AS·CMS·설치기간·사진 개인정보.
export const HOME_FAQS = [
  {
    question: '왜 확정가가 아니라 범위 견적인가요?',
    answer:
      '전기 용량·구조 보강·인허가·통신 환경에 따라 실비가 크게 달라집니다. 현장 실측 전에 확정가를 약속하는 업체는 추후 추가비용이 붙기 쉽습니다. 우강테크는 "예상 범위 + 면책 문구" 형식만 사용하고, 확정가는 실측 후 안내합니다.',
  },
  {
    question: '옥외 광고물 인허가도 처리되나요?',
    answer:
      '옥외 설치는 방수·방진·구조 요건과 함께 옥외 광고물 신고가 필요합니다. 신고 절차는 우강테크가 함께 처리하며, 지역·구조에 따라 별도 비용이 발생할 수 있습니다.',
  },
  {
    question: 'AS는 어떻게 받나요? 보증 기간은요?',
    answer:
      'LED는 모듈 단위 교체가 가능해 부분 고장 시 해당 모듈만 빠르게 교체합니다. 하드웨어 보증은 스탠다드 1년, 프리미엄 2년이며, 프리미엄은 예비부품 보유와 24시간 긴급 우선 처리가 포함됩니다. 고장 접수는 견적/문의 채널로 받고, 무상 범위(초기 불량·보증 내 하드웨어)와 유상 범위(외부 충격·소비자 과실)를 사전에 안내드립니다.',
  },
  {
    question: '전기요금이 많이 나오지 않나요?',
    answer:
      'LED는 표시 내용과 밝기에 따라 소비전력이 달라지며, 실내 소형 메뉴판은 일반 가전 수준, 옥외 대형은 그보다 높습니다. 견적 시 예상 소비전력과 권장 전원 회로를 함께 안내하고, 자동 밝기 조절로 전력을 절감할 수 있습니다.',
  },
  {
    question: '비·눈이 와도 괜찮나요? (옥외)',
    answer:
      '옥외 제품은 방수·방진(IP65 등) 규격으로 시공하며, 구조·전기·방수 마감을 현장 실측 후 확정합니다. 옥외 설치는 옥외 광고물 신고 절차를 함께 처리합니다.',
  },
  {
    question: '설치 기간은 얼마나 걸리나요?',
    answer:
      '표준 모델 기준 보통 1~3일입니다. 확정 견적 합의 후 자재 발주와 시공 일정을 협의하며, 영업 시간 외 시공 옵션도 가능합니다.',
  },
  {
    question: '보낸 매장 사진은 어떻게 쓰이나요?',
    answer:
      '사진은 설치 위치·규모를 파악해 범위 견적을 산출하는 용도로만 사용합니다. 개인정보 수집·이용 동의를 받은 범위 안에서만 활용하며, 자세한 내용은 개인정보처리방침에서 확인할 수 있습니다.',
  },
]

export function FaqSection({ hideHeader = false }: { hideHeader?: boolean }) {
  const [open, setOpen] = useState<number | null>(0)
  const reduce = useReducedMotion()

  return (
    <section id="faq" className="scroll-mt-20 bg-white py-24 px-4">
      <JsonLd id="ld-home-faq" data={faqPageLd(HOME_FAQS)} />
      <div className="mx-auto max-w-3xl">
        {!hideHeader && (
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">FAQ</p>
            <h2 className="text-3xl font-bold sm:text-4xl">자주 묻는 질문</h2>
          </div>
        )}

        <div className="space-y-3">
          {HOME_FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={item.question}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen ? 'border-blue-500/50 bg-blue-50/30' : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-zinc-900"
                >
                  <span>{item.question}</span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all ${
                      isOpen ? 'rotate-180 bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    <ChevronDown size={16} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-700">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        <p className="mt-8 text-center text-sm text-zinc-600">
          더 궁금한 점이 있으신가요?{' '}
          <Link href="/quote" className="font-semibold text-blue-600 underline-offset-4 hover:underline">
            설치 조건 남기고 상담 요청하기 →
          </Link>
        </p>
      </div>
    </section>
  )
}
