import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { buildMetadata, SITE } from '@/lib/seo/site'
import { breadcrumbLd, faqPageLd } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'

export const dynamic = 'force-static'

const FAQS = [
  {
    question: 'LED 사이니지 견적은 얼마나 걸리나요?',
    answer:
      '우강테크는 매장 사진 3장과 기본 정보(상호·연락처·지역)만 있으면 즉석 범위 견적을 화면에서 바로 확인할 수 있습니다. 확정 견적은 현장 실측 후 1~3일 이내 안내합니다.',
  },
  {
    question: '왜 확정 가격이 아닌 범위 가격인가요?',
    answer:
      '한국 LED 사이니지 시장은 전기 용량·구조물 보강·인허가·통신 환경에 따라 실비가 크게 달라집니다. 현장 실측 전에 확정 가격을 약속하는 업체는 추후 추가비용을 부과할 가능성이 높으며, 우강테크는 표준화·투명성 원칙에 따라 "예상 범위 + 면책 문구" 형식만 사용합니다.',
  },
  {
    question: '소상공인에게 추천하는 사양은 무엇인가요?',
    answer:
      'NovaStar Taurus TB30(보급형) 또는 TB50(표준형)을 권장합니다. TB50은 약 1.3M 픽셀까지 지원하며, 카페·식당·헬스장 대부분의 실내 사이니지에 적합합니다. 화면 면적과 시야 거리에 따라 P2.5~P4 사이의 픽셀 피치를 선택합니다.',
  },
  {
    question: '설치 후 콘텐츠는 어떻게 바꾸나요?',
    answer:
      '설치 시점에는 콘텐츠 초기 설정을 지원합니다. 스마트폰·웹에서 콘텐츠를 업로드·스케줄링하는 원격 콘텐츠 관리(CMS) 구독 기능은 현재 준비 중이며, 정식 출시 일정은 별도 안내드립니다.',
  },
  {
    question: 'AS는 어떻게 받나요?',
    answer:
      'LED는 모듈 단위 교체가 가능해 부분 고장 시 빠르게 대응합니다. 패키지에 따라 하드웨어 보증, 정기 점검, 예비부품, 긴급 AS 우선 처리 범위가 달라집니다.',
  },
  {
    question: '시공 기간은 얼마나 걸리나요?',
    answer:
      '표준 SKU 기준 1~3일입니다. 자재 발주 후 시공 일정을 협의하며, 영업 시간 외 시공 옵션도 가능합니다.',
  },
  {
    question: '계약금은 언제 결제하나요?',
    answer:
      '현장 실측 후 확정 견적에 합의하면 자재 발주 전 계약금 50%를 청구합니다. 시공 완료 후 잔금 50% 정산합니다.',
  },
  {
    question: '옥외 간판도 가능한가요?',
    answer:
      '네. 옥외 설치는 방수·방진·인허가 요건이 추가되며, NovaStar Taurus TB60 프리미엄 라인 또는 멀티 패널 구성으로 진행합니다. 옥외 광고물 신고는 우강테크가 함께 처리합니다.',
  },
]

export const metadata: Metadata = buildMetadata({
  title: '자주 묻는 질문 (FAQ)',
  description:
    'LED 사이니지 견적·시공·운영·AS·CMS 구독·계약 절차 등 우강테크(WK Tech)에 자주 묻는 질문을 한 곳에 정리했습니다.',
  path: '/faq',
})

export default function FaqPage() {
  return (
    <>
      <NavBar />
      <main className="pt-16">
        <JsonLd id="ld-faq-page" data={faqPageLd(FAQS)} />
        <JsonLd
          id="ld-breadcrumb-faq"
          data={breadcrumbLd([
            { name: '홈', url: SITE.url + '/' },
            { name: '자주 묻는 질문', url: SITE.url + '/faq' },
          ])}
        />

        <section className="relative border-b border-zinc-200 bg-white">
          <div className="absolute inset-0 opacity-25">
            <Image
              src="/curated/hero-faq.jpg"
              alt=""
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent" />
          </div>
          <div className="relative mx-auto max-w-5xl px-4 py-20 sm:py-28">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">
              FAQ
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              자주 묻는 질문
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-700">
              {SITE.nameKo}({SITE.nameEn})에 자주 들어오는 질문과 답변입니다.
              더 자세한 가이드는 <Link href="/blog" className="text-blue-600 underline-offset-4 hover:underline">블로그</Link>를 확인하세요.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16">
          <div className="space-y-3">
            {FAQS.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-zinc-200 bg-white/40 p-5 open:border-blue-500/40"
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

          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              사진 3장으로 견적 받기 →
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-800 hover:border-blue-500/40"
            >
              블로그 가이드 보기 →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
