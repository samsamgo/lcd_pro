const STATS = [
  { value: '즉시', label: '사진 3장 범위 견적' },
  { value: '1~3일', label: '표준 시공 기간' },
  { value: '6종', label: '표준화 SKU' },
  { value: '24h', label: '프리미엄 긴급 AS' },
]

const CASES = [
  {
    type: '카페',
    location: '서울 성수',
    sku: 'IN-M 스탠다드',
    review:
      '메뉴 바꿀 때마다 현수막 뽑던 게 이제 스마트폰 터치 하나로 해결됐어요. 손님들도 훨씬 좋아해요.',
    name: '이○○ 대표',
  },
  {
    type: '헬스장',
    location: '부산 해운대',
    sku: 'OUT-S 스탠다드',
    review:
      '간판 교체 비용이 무서웠는데 LED로 바꾸고 나서 콘텐츠를 마음대로 바꿔도 추가 비용이 없어요.',
    name: '김○○ 원장',
  },
  {
    type: '프랜차이즈 본사',
    location: '경기 성남',
    sku: 'IN-M × 12개 프리미엄',
    review:
      '12개 매장 전광판을 본사에서 한 번에 관리해요. 캠페인 시작하면 전국 매장이 동시에 바뀝니다.',
    name: '박○○ 마케팅 팀장',
  },
]

export function SocialProof() {
  return (
    <section id="cases" className="py-24 px-4 bg-zinc-50">
      <div className="mx-auto max-w-5xl">
        {/* 숫자 */}
        <div className="mb-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center bg-zinc-50 p-8 text-center"
            >
              <span className="text-4xl font-extrabold text-gradient">{s.value}</span>
              <span className="mt-2 text-sm text-zinc-600">{s.label}</span>
            </div>
          ))}
        </div>

        {/* 후기 */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
            시공 사례
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">고객 후기</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {CASES.map((c) => (
            <div key={c.name} className="glass rounded-2xl p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/10 text-sm font-bold text-blue-600">
                  {c.type[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{c.type}</p>
                  <p className="text-xs text-zinc-600">{c.location} · {c.sku}</p>
                </div>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-zinc-700">
                &ldquo;{c.review}&rdquo;
              </p>
              <p className="text-xs font-medium text-zinc-600">— {c.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
