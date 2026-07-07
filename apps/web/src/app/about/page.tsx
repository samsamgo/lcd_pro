import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Layers, ShieldCheck, Gauge, HeartHandshake, Cpu, Sparkles } from 'lucide-react'
import { buildMetadata, SITE } from '@/lib/seo/site'
import { organizationLd, breadcrumbLd } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { CtaSection } from '@/components/landing/CtaSection'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '회사 소개',
  description:
    '우강테크(WK Tech)는 소상공인의 매장을 빛으로 바꾸는 LED 사이니지 B2B 플랫폼입니다. NovaStar 표준 시공·AS·즉석 범위 견적으로, 기술을 몰라도 누구나 전광판을 안정적으로 운영하도록 돕습니다.',
  path: '/about',
})

const VALUES = [
  {
    icon: Layers,
    title: '표준으로 단순하게',
    desc: '동네 간판집의 들쭉날쭉함과 대형 SI의 느린 일정, 그 사이의 빈자리를 채웁니다. 표준 캐비닛·표준 컨트롤러·표준 절차로 견적·납기·AS를 예측 가능하게 만듭니다.',
  },
  {
    icon: Gauge,
    title: '속도로 정직하게',
    desc: '“전화해야 알 수 있는 가격”의 시대를 끝냅니다. 매장 사진 3장이면 예상 범위 견적을 화면에서 바로 — 기다림도, 부담도 없이 시작할 수 있게.',
  },
  {
    icon: ShieldCheck,
    title: '끝까지 책임지게',
    desc: '설치는 시작일 뿐입니다. 모듈 단위 교체, 정기 점검, 긴급 우선 처리까지 — 설치 그 이후의 운영을 파트너로서 함께합니다.',
  },
]

const PROMISES = [
  '확정가가 아닌 “예상 범위”로 정직하게 시작하고, 현장 실측 후 확정 견적을 드립니다.',
  '광고성 표현이 아니라 검증 가능한 사실로만 소통합니다.',
  '가격에 무엇이 포함되고 무엇이 별도인지 먼저 밝힙니다.',
  '보유하지 않은 인증·실적은 표기하지 않습니다.',
]

export default function AboutPage() {
  return (
    <>
      <JsonLd id="ld-org-about" data={organizationLd()} />
      <JsonLd
        id="ld-breadcrumb-about"
        data={breadcrumbLd([
          { name: '홈', url: SITE.url + '/' },
          { name: '회사 소개', url: SITE.url + '/about' },
        ])}
      />
      <NavBar />

      <main id="main">
        {/* ── HERO ── */}
        <section className="surface-dark relative overflow-hidden px-4 pt-32 pb-24">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <Image
              src="/curated/hero-services.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/85 to-zinc-950" />
            <div className="absolute left-1/4 top-1/4 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-[140px]" />
            <div className="absolute bottom-0 right-10 h-[380px] w-[380px] rounded-full bg-blue-600/20 blur-[130px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-sm font-medium text-cyan-200">
              <Sparkles size={14} className="text-cyan-300" />
              About {SITE.nameKo} · {SITE.nameEn}
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl">
              작은 매장의 밤을
              <br />
              <span className="text-cyan-400">가장 밝게</span> 만드는 일
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
              골목의 카페, 동네 헬스장, 오래된 식당. 큰 예산도 기술 지식도 없는
              사장님들이 대기업 매장 못지않은 화면을 갖도록 —
              우강테크는 LED 전광판을 <strong className="text-white">표준화</strong>했습니다.
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-sm italic text-zinc-400">
              {SITE.sloganKo}
            </p>
          </div>
        </section>

        {/* ── MISSION 서사 ── */}
        <section className="bg-white px-4 py-24">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-600">
              우리의 미션
            </p>
            <h2 className="text-3xl font-bold leading-snug tracking-tight text-zinc-900 sm:text-4xl">
              전광판은 대기업의 전유물이 아닙니다.
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-[1.85] text-zinc-700">
              <p>
                LED 전광판 시장은 오랫동안 불투명했습니다. 업체마다 다른 가격,
                전화해야만 받을 수 있는 견적, 알 수 없는 기술 용어, 설치 업체가
                사라지면 끝나버리는 AS. 정작 화면이 가장 필요한 작은 매장의
                사장님들이 가장 큰 벽 앞에 서 있었습니다.
              </p>
              <p>
                <strong className="text-zinc-900">우강테크는 이 시장을 표준으로 다시 씁니다.</strong>{' '}
                제품을 표준 모델로, 컨트롤러를 글로벌 표준으로, 견적과 시공과
                AS를 예측 가능한 절차로 정리했습니다. 복잡함은 우리가 감당하고,
                사장님께는 <strong className="text-zinc-900">사진 3장</strong>과{' '}
                <strong className="text-zinc-900">밝게 켜진 매장</strong>만 남기는 것 —
                그것이 우리가 하는 일입니다.
              </p>
            </div>
          </div>
        </section>

        {/* ── VALUES ── */}
        <section className="bg-zinc-50 px-4 py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
                일하는 방식
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                우리가 다르게 하는 세 가지
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {VALUES.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-md"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 ring-1 ring-blue-600/15">
                    <Icon size={22} className="text-blue-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-zinc-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 표준의 힘 (다크 하이라이트) ── */}
        <section className="surface-dark relative overflow-hidden px-4 py-24">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute right-1/4 top-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[130px]" />
          </div>
          <div className="relative mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
                기술 표준
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                하나의 표준이 모든 것을 빠르게 합니다
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
                우강테크는 컨트롤러를 <strong className="text-cyan-300">NovaStar Taurus + VNNOX</strong>{' '}
                클라우드로 통일했습니다. 시장의 단편화를 피하고, 한 가지 운영
                도구로 모든 고객을 안정적으로 관리하기 위해서입니다.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { code: 'TB30', tier: '보급형', desc: '소형 메뉴보드·카운터 사이니지' },
                { code: 'TB50', tier: '표준형', desc: '카페·식당·헬스장 실내 디스플레이' },
                { code: 'TB60', tier: '프리미엄', desc: '옥외 간판·대형 매장·멀티 패널' },
              ].map((c) => (
                <div
                  key={c.code}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-cyan-400/40"
                >
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Cpu size={16} />
                    <span className="font-mono text-sm font-bold">{c.code}</span>
                  </div>
                  <p className="mt-3 text-lg font-bold text-white">{c.tier}</p>
                  <p className="mt-1 text-sm text-zinc-400">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 우리의 약속 ── */}
        <section className="bg-white px-4 py-24">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 ring-1 ring-blue-600/15">
                <HeartHandshake size={22} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                  우리의 약속
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  정직이 가장 좋은 영업입니다
                </h2>
              </div>
            </div>
            <ul className="space-y-4">
              {PROMISES.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 p-5 text-base leading-relaxed text-zinc-700"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    ✓
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-14 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-50 to-white p-8 text-center">
              <p className="text-xl font-semibold leading-relaxed text-zinc-900">
                “함께 가는 길, 더 나은 내일.”
              </p>
              <p className="mt-2 text-zinc-600">
                우강테크는 한 번의 판매가 아니라, 매장이 빛나는 매일을 함께합니다.
              </p>
              <Link
                href="/quote"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-95 glow"
              >
                사진 3장으로 견적 받기
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
