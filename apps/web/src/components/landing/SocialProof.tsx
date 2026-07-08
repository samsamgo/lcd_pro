import { CaseGallery } from './CaseGallery'

const STATS = [
  { value: '즉시', label: '사진 3장 범위 견적' },
  { value: '1~3일', label: '표준 시공 기간' },
  { value: '6종', label: '표준화 SKU' },
  { value: '24h', label: '프리미엄 긴급 AS' },
]

const CASES = [
  {
    type: '카페·외식 매장',
    spec: '실내 IN-M · P3',
    img: '/curated/gal-restaurant-menu.jpg',
    desc: '메뉴 교체를 현수막 대신 화면에서 즉시. 이벤트·계절 메뉴까지 손쉽게 반영.',
  },
  {
    type: '리테일·뷰티 매장',
    spec: '실내 IN-M · P3',
    img: '/curated/gal-beauty-storefront.jpg',
    desc: '공지·홍보·스케줄을 한 화면으로 통합. 콘텐츠 변경에 추가 인쇄비가 들지 않습니다.',
  },
  {
    type: '옥외·로드사이드',
    spec: '옥외 OUT-M · P5',
    img: '/curated/svc-outdoor-p5.jpg',
    desc: '직사광선에도 선명한 고밝기 옥외 시공. 원거리 가시성과 내구성을 확보합니다.',
  },
]

export function SocialProof() {
  return (
    <section id="cases" className="py-24 px-4 bg-zinc-50">
      <div className="mx-auto max-w-5xl">
        {/* 숫자 */}
        <div className="mb-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center bg-white p-8 text-center"
            >
              <span className="text-4xl font-extrabold text-gradient">{s.value}</span>
              <span className="mt-2 text-sm text-zinc-600">{s.label}</span>
            </div>
          ))}
        </div>

        {/* 시공 사례 */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
            활용 예시
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">업종별 활용 예시</h2>
        </div>

        <CaseGallery cases={CASES} />

        <p className="mt-6 text-center text-xs text-zinc-500">
          * 위 이미지는 실제 시공 현장 사진이 아니라 업종별 활용을 돕기 위한 예시입니다.
          실제 시공 사례는 고객 동의 절차 후 순차 게재됩니다. (이미지를 누르면 크게 볼 수 있습니다)
        </p>
      </div>
    </section>
  )
}
