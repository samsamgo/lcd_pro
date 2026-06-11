import Link from 'next/link'
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
    question: 'AS는 어떻게 받나요?',
    answer:
      'LED는 모듈 단위 교체가 가능해 부분 고장 시 빠르게 대응합니다. 패키지에 따라 하드웨어 보증, 정기 점검, 예비부품, 우선 처리 범위가 달라집니다.',
  },
  {
    question: '설치 기간은 얼마나 걸리나요?',
    answer:
      '표준 SKU 기준 보통 1~3일입니다. 확정 견적 합의 후 자재 발주와 시공 일정을 협의하며, 영업 시간 외 시공 옵션도 가능합니다.',
  },
  {
    question: '보낸 매장 사진은 어떻게 쓰이나요?',
    answer:
      '사진은 설치 위치·규모를 파악해 범위 견적을 산출하는 용도로만 사용합니다. 개인정보 수집·이용 동의를 받은 범위 안에서만 활용하며, 자세한 내용은 개인정보처리방침에서 확인할 수 있습니다.',
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-20 bg-white py-24 px-4">
      <JsonLd id="ld-home-faq" data={faqPageLd(HOME_FAQS)} />
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
            FAQ
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">자주 묻는 질문</h2>
        </div>

        <div className="space-y-3">
          {HOME_FAQS.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 open:border-blue-500/40"
            >
              <summary className="cursor-pointer list-none text-base font-semibold text-zinc-900">
                {item.question}
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-zinc-700">
                {item.answer}
              </div>
            </details>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-zinc-600">
          더 궁금한 점이 있으신가요?{' '}
          <Link
            href="/blog"
            className="font-semibold text-blue-600 underline-offset-4 hover:underline"
          >
            블로그 가이드 보기 →
          </Link>
        </p>
      </div>
    </section>
  )
}
