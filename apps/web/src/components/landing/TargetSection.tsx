'use client'

import Link from 'next/link'
import { useState } from 'react'

const TARGETS = [
  {
    id: 'food',
    label: '카페·음식점·바',
    icon: '☕',
    pain: '메뉴 바꿀 때마다 현수막 인쇄비 + 디자인 비용',
    solution: '스마트폰으로 즉시 메뉴 교체. 이벤트·계절 메뉴도 클릭 한 번.',
    sku: 'IN-S / IN-M 스탠다드',
    priceRange: '₩160만 ~ ₩280만 + CMS 월 29,000원~',
  },
  {
    id: 'health',
    label: '병원·학원·헬스장',
    icon: '🏥',
    pain: '공지사항·시간표를 매번 출력 — 대기실 안내가 비효율적',
    solution: '대기 화면에 실시간 공지·스케줄 표출. 원격 수정 가능.',
    sku: 'IN-M 스탠다드',
    priceRange: '₩280만~ + CMS 월 49,000원',
  },
  {
    id: 'franchise',
    label: '프랜차이즈·체인',
    icon: '🏪',
    pain: '전국 매장 광고 통일 관리가 불가능. 본사→지점 콘텐츠 전달 지연.',
    solution: '본사 CMS에서 전국 매장 동시 업데이트. 캠페인 시작과 동시에 일괄 적용.',
    sku: 'IN-M × N개 프리미엄',
    priceRange: '수량 협의 (10개+ 할인)',
  },
  {
    id: 'outdoor',
    label: '로드사이드·빌딩',
    icon: '🏙',
    pain: '기존 간판은 교체 비용이 수천만원. 콘텐츠 변경 불가.',
    solution: 'LED로 교체 후 계절·시간대별 콘텐츠 자동 스케줄. 원거리 가시성 확보.',
    sku: 'OUT-M / OUT-L 스탠다드',
    priceRange: '₩470만 ~ ₩850만+',
  },
  {
    id: 'event',
    label: '이벤트·팝업',
    icon: '🎪',
    pain: '임시 설치인데 일반 업체는 최소 발주량·기간 요구',
    solution: '렌탈 플랜으로 설치부터 철거까지. 기간·규모 맞춤 협의.',
    sku: '렌탈 플랜',
    priceRange: '기간·규모별 협의',
  },
]

export function TargetSection() {
  const [active, setActive] = useState('food')
  const current = TARGETS.find((t) => t.id === active) ?? TARGETS[0]

  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            업종별 솔루션
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">
            우리 업종에 맞는 솔루션이 있나요?
          </h2>
        </div>

        {/* 탭 */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {TARGETS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                active === t.id
                  ? 'bg-blue-600 text-white'
                  : 'border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* 콘텐츠 */}
        <div className="glass rounded-2xl p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-red-400">
                현재 문제
              </p>
              <p className="text-zinc-300">{current.pain}</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
                LCD PRO 솔루션
              </p>
              <p className="text-zinc-300">{current.solution}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-start gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-zinc-600">추천 구성</p>
              <p className="font-semibold text-zinc-200">{current.sku}</p>
              <p className="text-sm text-blue-400">{current.priceRange}</p>
            </div>
            <Link
              href={`/quote?type=${current.id}`}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blue-500 active:scale-95"
            >
              {current.label} 견적 받기
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
