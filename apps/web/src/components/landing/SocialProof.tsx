import Image from 'next/image'

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
    img: '/curated/case-adamchicken.jpg',
    desc: '메뉴 교체를 현수막 대신 화면에서 즉시. 이벤트·계절 메뉴까지 손쉽게 반영.',
  },
  {
    type: '근린 상가·생활업종',
    spec: '실내 IN-M · P3',
    img: '/curated/case-godeok-emc.jpg',
    desc: '공지·홍보·스케줄을 한 화면으로 통합. 콘텐츠 변경에 추가 인쇄비가 들지 않습니다.',
  },
  {
    type: '옥외·로드사이드',
    spec: '옥외 OUT-M · P5',
    img: '/curated/case-namyangju.jpg',
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
            시공 사례
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">업종별 설치 사례</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {CASES.map((c) => (
            <div
              key={c.type}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:led-frame"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                <Image
                  src={c.img}
                  alt={`${c.type} LED 사이니지 설치 예시`}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover img-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-950/10 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-base font-bold text-white">{c.type}</p>
                  <p className="text-xs font-medium text-cyan-300">{c.spec}</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-relaxed text-zinc-700">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">
          * 이미지는 설치 예시이며, 실제 시공 현장 사진·고객 사례는 동의 절차 후 게재됩니다.
        </p>
      </div>
    </section>
  )
}
