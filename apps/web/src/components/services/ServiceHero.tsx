'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

import { IMAGES } from '@/lib/imageAssets'
import { Magnetic, Reveal, Stagger } from '@/components/motion'
import { SERVICE_STEPS, TOTAL_DURATION } from '@/lib/serviceProcess'

/**
 * /services 히어로.
 *
 * 2026-09-07 재작성 — COO 실물 판독으로 결함 3건이 잡혔다.
 *
 * ① 리드가 빈 문장이었다.
 *    "설계·시공·컨트롤러·CMS·AS·인허가·공공조달까지 — 모든 영역을 하나의 표준으로 끝냅니다."
 *    이건 경쟁사가 그대로 복사해도 아무 손해가 없는 문장이고(안티패턴 2),
 *    중점 나열 금지 규칙(카피-슬롯규칙 §문체)도 어겼다.
 *    지금은 **아래 표에서 확인되는 사실**만 쓴다 — 공정 수, 표준 소요, 실측 비용.
 *    숫자는 손으로 적지 않고 SERVICE_STEPS 에서 뽑는다. 본문과 어긋날 수가 없다.
 *
 * ② 칩 5개(표준 시공/컨트롤러/CMS/인증·인허가/공공조달)가 본문 6공정과 달랐다.
 *    한 페이지에 목차가 두 개였다. 칩을 6공정 앵커로 바꿨다.
 *
 * ③ 칩 아래로 한 화면 가까이 검은 여백이었다.
 *    min-h-[72svh] + items-center 조합이 원인이다. 다른 히어로(ProductsHero)와 같이
 *    items-end + 콘텐츠가 높이를 정하는 방식으로 바꾸고, 하단에 사실 3줄을 놓아 채웠다.
 */

/** 히어로 하단 사실 띠 — 전부 이 페이지 안에서 확인되는 값만 쓴다 */
const FACTS = [
  { k: '표준 공정 소요', v: TOTAL_DURATION, n: '실측 후 확정' },
  // 🔴 2026-09-07 CEO 지시로 '드리는 서류 N종' 지표를 뺐다. 주지 않을 문서를
  //    종수로 세어 약속하지 않는다. 자리는 공정 수(확인 가능한 사실)로 채운다.
  { k: '공정 수', v: `${SERVICE_STEPS.length}단계`, n: '전 공정 직접 수행' },
  { k: '현장 실측 비용', v: '0원', n: '보고 나서 확정 견적' },
]

export function ServiceHero() {
  return (
    <section
      data-wk-dark-hero
      className="relative isolate flex items-end overflow-hidden bg-wk-night"
    >
      <div className="wk-grain absolute inset-0" aria-hidden="true">
        <Image
          src={IMAGES.servicesHero}
          alt="" aria-hidden="true"
          fill
          priority
          sizes="100vw"
          quality={82}
          className="object-cover object-[62%_50%] lg:object-center"
        />
        <div className="wk-scrim-l absolute inset-0" />
        <div className="wk-scrim-b absolute inset-0" />
      </div>

      <div className="relative z-10 w-full pb-14 pt-32 lg:pb-20 lg:pt-40">
        <div className="wk-wrap">
          <nav aria-label="위치" className="mb-6 flex items-center gap-1.5 text-caption text-white/70">
            <Link href="/" className="hover:text-white">
              홈
            </Link>
            <ChevronRight size={12} aria-hidden="true" className="text-white/40" />
            <span className="font-semibold text-white">설치 과정</span>
          </nav>

          <Reveal immediate y={16}>
            <p className="wk-eyebrow !text-white/70">설치 과정</p>
            <h1 className="wk-h1 max-w-[16ch] text-white">
              실측부터 사후관리까지 여섯 공정
            </h1>
          </Reveal>

          <Reveal immediate delay={0.12} y={16}>
            <p className="wk-lead mt-6 !text-white/85">
              공정마다 누가 며칠 동안 무엇을 하는지 아래 표에 다 적었습니다.
            </p>
            <p className="mt-3 max-w-[34rem] text-body text-wk-nightMuted">
              그대로 과업 범위에 옮겨 쓰셔도 됩니다. 확정 일정은 실측한 뒤 견적서에
              적습니다.
            </p>
          </Reveal>

          <Reveal immediate delay={0.22} y={14}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Magnetic>
                <Link href="/quote" className="wk-btn-p sm:px-8">
                  무상 실측 신청
                </Link>
              </Magnetic>
              <a
                href="#process"
                className="wk-btn-sm w-full justify-center border border-white/25 text-white hover:bg-white/10 sm:w-auto"
              >
                공정 요약표 보기
              </a>
            </div>
          </Reveal>

          {/* 6공정 앵커. 본문 목차와 같은 배열에서 나온다 */}
          <nav aria-label="공정 바로가기">
            <Stagger className="mt-10 flex flex-wrap gap-2" y={10} gap={0.04}>
              {SERVICE_STEPS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="inline-flex items-baseline gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-label font-medium text-wk-nightMuted backdrop-blur transition-colors duration-state ease-state hover:bg-white/10 hover:text-white"
                >
                  <span className="wk-metric text-caption font-semibold text-white/60">
                    {s.no}
                  </span>
                  {s.chip}
                </a>
              ))}
            </Stagger>
          </nav>

          {/* 여백이던 자리 — 결재 문서에 그대로 옮겨 쓸 수 있는 값만 */}
          <Reveal immediate delay={0.3} y={12}>
            <dl className="mt-12 grid gap-px overflow-hidden rounded-card-m border border-white/10 bg-white/10 sm:grid-cols-3">
              {FACTS.map((f) => (
                <div key={f.k} className="bg-wk-night2/90 px-5 py-4 backdrop-blur">
                  <dt className="text-caption text-white/60">{f.k}</dt>
                  <dd className="wk-metric mt-1 text-body-lg font-bold text-white">
                    {f.v}
                    <span className="ml-2 text-caption font-medium text-wk-nightMuted">
                      {f.n}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
