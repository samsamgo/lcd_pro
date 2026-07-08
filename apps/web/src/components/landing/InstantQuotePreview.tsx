'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Building2, Sun, Sparkles } from 'lucide-react'
import { autoEstimate } from '@/lib/pricing'
import { useSiteModals } from '@/components/modals/SiteModals'

type Env = 'indoor' | 'outdoor'
type SizeKey = 'small' | 'medium' | 'large'

// 대표 치수 (mm) — 실제 확정은 실측. 미리보기용 근사값.
const SIZE_PRESETS: Record<Env, Record<SizeKey, { w: number; h: number; label: string; desc: string }>> = {
  indoor: {
    small: { w: 1200, h: 600, label: '소형', desc: '메뉴판·카운터 (약 1.2×0.6m)' },
    medium: { w: 2000, h: 1000, label: '중형', desc: '벽면 홍보 (약 2×1m)' },
    large: { w: 3000, h: 1500, label: '대형', desc: '쇼룸·로비 (약 3×1.5m)' },
  },
  outdoor: {
    small: { w: 2000, h: 1000, label: '소형', desc: '입구·주차장 (약 2×1m)' },
    medium: { w: 4000, h: 2000, label: '중형', desc: '로드사이드 (약 4×2m)' },
    large: { w: 6000, h: 3000, label: '대형', desc: '빌딩 파사드 (약 6×3m)' },
  },
}

const fmtMan = (won: number) => `${Math.round(won / 10_000).toLocaleString()}만`

export function InstantQuotePreview() {
  const [env, setEnv] = useState<Env>('indoor')
  const [size, setSize] = useState<SizeKey>('medium')
  const { openConsult } = useSiteModals()

  const preset = SIZE_PRESETS[env][size]
  const est = useMemo(
    () => autoEstimate({ environment: env, widthMm: preset.w, heightMm: preset.h }),
    [env, preset.w, preset.h],
  )

  return (
    <section id="instant-quote" className="scroll-mt-20 bg-white py-20 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-blue-600">
            <Sparkles size={15} /> 30초 예상 견적
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">
            설치 환경과 크기만 골라보세요
          </h2>
          <p className="mt-3 text-zinc-600">
            사진·연락처 없이도 대략적인 예상 범위를 바로 확인할 수 있어요.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
          <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-2">
            {/* 입력 */}
            <div className="space-y-6">
              <div>
                <p className="mb-2 text-sm font-semibold text-zinc-700">설치 환경</p>
                <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="설치 환경">
                  {(['indoor', 'outdoor'] as Env[]).map((e) => (
                    <button
                      key={e}
                      type="button"
                      role="radio"
                      aria-checked={env === e}
                      onClick={() => setEnv(e)}
                      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                        env === e
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-zinc-300 text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      {e === 'indoor' ? <Building2 size={16} /> : <Sun size={16} />}
                      {e === 'indoor' ? '실내' : '옥외'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-zinc-700">대략적인 크기</p>
                <div className="space-y-2" role="radiogroup" aria-label="크기">
                  {(['small', 'medium', 'large'] as SizeKey[]).map((s) => {
                    const p = SIZE_PRESETS[env][s]
                    return (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={size === s}
                        onClick={() => setSize(s)}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                          size === s
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-zinc-300 hover:bg-zinc-50'
                        }`}
                      >
                        <span className="text-sm font-semibold text-zinc-800">{p.label}</span>
                        <span className="text-xs text-zinc-500">{p.desc}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 결과 */}
            <div className="flex flex-col rounded-2xl bg-zinc-950 p-6 text-white">
              <p className="text-sm text-zinc-400">예상 설치비 범위</p>
              {est ? (
                <>
                  <p className="mt-1 text-[1.6rem] font-extrabold leading-tight tracking-tight [word-break:keep-all] sm:text-4xl">
                    <span className="text-cyan-400">{fmtMan(est.estimateMin)}</span>
                    <span className="text-zinc-500"> ~ </span>
                    <span className="text-cyan-400">{fmtMan(est.estimateMax)}</span>
                    <span className="ml-1 text-lg font-bold text-zinc-300">원</span>
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">VAT 별도 · 현장 실측 후 확정</p>

                  <dl className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-zinc-400">추천 모델</dt>
                      <dd className="font-semibold text-white">{est.sku}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-400">추천 패키지</dt>
                      <dd className="font-semibold text-white">
                        {{ BASIC: '베이직', STANDARD: '스탠다드', PREMIUM: '프리미엄', RENTAL: '렌탈' }[est.packageTier]}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-400">화면 크기(약)</dt>
                      <dd className="font-medium text-zinc-200">
                        {(preset.w / 1000).toFixed(1)}×{(preset.h / 1000).toFixed(1)}m
                      </dd>
                    </div>
                  </dl>
                </>
              ) : (
                <p className="mt-4 text-zinc-400">크기를 선택해주세요.</p>
              )}

              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href="/quote"
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-blue-500 active:scale-95"
                >
                  사진 3장으로 정확한 견적
                  <ArrowRight size={16} />
                </Link>
                <button
                  type="button"
                  onClick={() => openConsult('instant-quote')}
                  className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  30초 빠른 상담 신청
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500">
          * 위 금액은 대표 치수 기준 <strong>예상 범위</strong>이며, 전기 증설·구조 보강·인허가 등 현장 조건에 따라 달라집니다.
          정확한 금액은 사진 3장 견적 또는 현장 실측 후 안내드립니다.
        </p>
      </div>
    </section>
  )
}
