import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, Layers, ShieldCheck, Gauge, HeartHandshake, Cpu, Sparkles,
  Ruler, Factory, MonitorSmartphone, Wrench, Building2, Check, Camera, Timer, Hammer, RadioTower,
} from 'lucide-react'
import { buildMetadata, SITE } from '@/lib/seo/site'
import { organizationLd, breadcrumbLd } from '@/lib/seo/jsonld'
import { JsonLd } from '@/components/seo/JsonLd'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { CinematicScene } from '@/components/brand/CinematicScene'
import { CtaSection } from '@/components/landing/CtaSection'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '회사 소개',
  description:
    '우강테크(WK Tech)는 빛으로 공간을 바꾸는 디스플레이 브랜드입니다. LED 디스플레이의 설계·제조·시공·운영을 하나의 표준으로 잇습니다. 사진 3장, 30분 견적, 3일 시공 — 복잡했던 전광판을 누구나 가질 수 있게 만듭니다.',
  path: '/about',
})

const SCOPE = [
  { icon: Camera, title: '자동 견적', desc: '사진 3장이면 30분 안에 예상 범위 견적. 전화 없이, 화면에서 바로.' },
  { icon: Factory, title: '표준 제조', desc: '표준 캐비닛·모듈·부품과 KC 인증 기반의 자체 표준 SKU로 품질을 통일합니다.' },
  { icon: Hammer, title: '표준 시공', desc: '표준 모델 기준 3일. 전기·구조·방수까지 현장 실측 후 정확하게.' },
  { icon: MonitorSmartphone, title: 'CMS 운영', desc: 'NovaStar·VNNOX 클라우드로 콘텐츠를 원격에서 교체·스케줄·관리.' },
  { icon: Wrench, title: 'AS · 유지보수', desc: '모듈 단위 교체, 정기 점검, 긴급 우선 처리로 설치 이후를 책임집니다.' },
  { icon: Building2, title: '공공조달 · 다점포', desc: '나라장터·KONEPS 대응과 프랜차이즈 다점포 일괄 운영.' },
]

const COMPARE = [
  { label: '견적 속도', sign: '2~5일', si: '1~2주', wk: '30분' },
  { label: '가격 투명성', sign: '협상', si: '비쌈', wk: '온라인 공개' },
  { label: '설치 리드타임', sign: '1~3주', si: '2~6주', wk: '3일' },
  { label: '운영 지원', sign: '전화만', si: '별도 계약', wk: 'CMS + 원격' },
  { label: '공공조달', sign: '불가', si: '가능하나 비쌈', wk: '나라장터 대응' },
]

const NORTHSTAR = [
  { icon: Camera, step: '사진 3장', desc: '설치 공간 사진만 올리면 시작' },
  { icon: Timer, step: '30분 견적', desc: '표준 SKU 기준 예상 범위 즉시' },
  { icon: Hammer, step: '3일 시공', desc: '실측 후 표준 설치' },
  { icon: RadioTower, step: 'CMS 운영', desc: '원격 콘텐츠 · AS 구독' },
]

const VALUES = [
  { icon: Layers, title: '표준으로 단순하게', desc: '동네 간판집의 들쭉날쭉함과 대형 SI의 느린 일정, 그 사이의 빈자리를 표준으로 채웁니다. 캐비닛·컨트롤러·절차를 통일해 견적·납기·AS를 예측 가능하게.' },
  { icon: Gauge, title: '속도로 정직하게', desc: '"전화해야 알 수 있는 가격"의 시대를 끝냅니다. 사진 3장이면 30분 안에 예상 범위를 화면에서 — 기다림도, 부담도 없이.' },
  { icon: ShieldCheck, title: '끝까지 책임지게', desc: '설치는 시작일 뿐입니다. 모듈 교체, 정기 점검, 긴급 우선 처리, 원격 운영까지 — 공간이 빛나는 매일을 함께합니다.' },
]

const PROMISES = [
  '확정가가 아닌 "예상 범위"로 정직하게 시작하고, 현장 실측 후 확정 견적을 드립니다.',
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
        <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-black px-6 pt-28 pb-20">
          <div className="absolute inset-0" aria-hidden="true">
            <Image src="/curated/hero-services.jpg" alt="" fill priority sizes="100vw" className="object-cover object-center opacity-45" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />
            <div className="absolute left-1/4 top-1/3 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-[150px]" />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-sm font-medium text-cyan-200">
              <Sparkles size={14} className="text-cyan-300" />
              About · {SITE.nameKo} {SITE.nameEn}
            </div>
            <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[1.02] tracking-tight text-white">
              빛으로 공간을
              <br />
              <span className="bg-gradient-to-r from-cyan-200 via-cyan-400 to-blue-400 bg-clip-text text-transparent">짓습니다</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-zinc-300 sm:text-xl">
              우강테크는 빛으로 공간을 바꾸는 디스플레이 브랜드입니다.
              LED 디스플레이의 <strong className="font-medium text-white">설계·제조·시공·운영</strong>을
              하나의 표준으로 잇습니다.
            </p>
            <p className="mt-4 text-sm italic text-zinc-500">{SITE.sloganKo} · {SITE.sloganEn}</p>
          </div>
        </section>

        {/* ── 시작한 이유 ── */}
        <section id="mission" className="bg-black px-6 py-28 sm:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400/80">Why we exist</p>
            <h2 className="text-[clamp(1.9rem,4.8vw,3.2rem)] font-bold leading-[1.15] tracking-tight text-white">
              빛은, 대기업의 것이 아니다.
            </h2>
            <div className="mx-auto mt-10 max-w-2xl space-y-6 text-lg font-light leading-[1.9] text-zinc-400">
              <p>
                LED 전광판 시장은 오랫동안 불투명했습니다. 업체마다 다른 가격, 전화해야만 받는 견적,
                알 수 없는 기술 용어, 설치 업체가 사라지면 끝나는 AS. 정작 화면이 가장 필요한
                작은 매장의 사장님들이 가장 큰 벽 앞에 서 있었습니다.
              </p>
              <p>
                <span className="text-zinc-200">우강테크는 이 시장을 표준으로 다시 씁니다.</span> 제품을 표준 모델로,
                컨트롤러를 글로벌 표준으로, 견적과 시공과 운영을 예측 가능한 절차로 정리했습니다.
                복잡함은 우리가 감당하고, 사장님께는 <span className="text-zinc-200">사진 3장</span>과
                <span className="text-zinc-200"> 살아나는 공간</span>만 남기는 것 — 그것이 우리가 하는 일입니다.
              </p>
            </div>
          </div>
        </section>

        {/* ── 우리가 하는 일 (사업 범위) ── */}
        <section className="bg-white px-6 py-24 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">What we do</p>
              <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight text-zinc-900">
                우리는 전광판을 파는 회사가 아닙니다
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-zinc-600">
                견적·제조·시공·운영을 하나로 잇는 <strong className="text-zinc-900">디스플레이 플랫폼</strong>입니다.
                복잡한 여섯 단계를 우강테크 한 곳에서 끝냅니다.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SCOPE.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="group rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-md">
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

        {/* ── 시네마틱: 표준 ── */}
        <CinematicScene
          layout="split"
          theme="dark"
          imageSide="right"
          eyebrow="기술 표준 · Standard"
          title={<>표준이,<br />속도를 만든다</>}
          body="우강테크는 컨트롤러를 NovaStar Taurus + VNNOX 클라우드로 통일했습니다. 시장의 단편화를 피하고, 하나의 운영 도구로 모든 고객을 안정적으로 관리하기 위해서입니다. 표준이 곧 속도이고, 속도가 곧 가격입니다."
          image="/curated/svc-controller.jpg"
          imageAlt="NovaStar 표준 LED 컨트롤러"
          stats={[
            { value: '30분', label: '1차 견적' },
            { value: '3일', label: '표준 시공' },
            { value: '6종', label: '표준 SKU' },
          ]}
        />

        {/* ── 포지셔닝 비교 ── */}
        <section className="bg-zinc-50 px-6 py-24 sm:py-28" id="why">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Positioning</p>
              <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight text-zinc-900">
                간판집도, 대형 SI도 아닙니다
              </h2>
              <p className="mt-4 text-lg text-zinc-600">그 사이의 빈자리를, 표준으로 채웁니다.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-separate border-spacing-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white text-sm">
                <caption className="sr-only">지역 간판집, 대형 SI, 우강테크 비교</caption>
                <thead>
                  <tr>
                    <th className="bg-white px-5 py-4 text-left font-semibold text-zinc-500">항목</th>
                    <th className="bg-white px-5 py-4 text-left font-semibold text-zinc-600">지역 간판집</th>
                    <th className="bg-white px-5 py-4 text-left font-semibold text-zinc-600">대형 SI</th>
                    <th className="bg-blue-600/5 px-5 py-4 text-left font-bold text-blue-700">우강테크</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((r, i) => (
                    <tr key={r.label} className={i % 2 ? 'bg-zinc-50/60' : 'bg-white'}>
                      <th scope="row" className="px-5 py-4 text-left font-semibold text-zinc-800">{r.label}</th>
                      <td className="px-5 py-4 text-zinc-500">{r.sign}</td>
                      <td className="px-5 py-4 text-zinc-500">{r.si}</td>
                      <td className="bg-blue-600/[0.04] px-5 py-4 font-semibold text-blue-700">
                        <span className="flex items-center gap-1.5"><Check size={15} className="text-blue-600" />{r.wk}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── North Star (일하는 흐름) ── */}
        <section className="bg-white px-6 py-24 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">How it works</p>
              <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight text-zinc-900">사진 3장에서 시작합니다</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {NORTHSTAR.map(({ icon: Icon, step, desc }, i) => (
                <div key={step} className="relative rounded-2xl border border-zinc-200 bg-white p-6">
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 ring-1 ring-blue-600/15">
                    <Icon size={20} />
                  </span>
                  <p className="text-xs font-bold text-blue-600">STEP {i + 1}</p>
                  <p className="mt-0.5 text-lg font-bold text-zinc-900">{step}</p>
                  <p className="mt-1 text-sm text-zinc-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 일하는 방식 (VALUES) ── */}
        <section id="standard" className="surface-dark relative overflow-hidden px-6 py-24 sm:py-28">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute right-1/4 top-0 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[130px]" />
          </div>
          <div className="relative mx-auto max-w-5xl">
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Our way</p>
              <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight text-white">우리가 다르게 하는 세 가지</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {VALUES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-cyan-400/40">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-cyan-400/20">
                    <Icon size={22} className="text-cyan-300" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 약속 ── */}
        <section className="bg-white px-6 py-24 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 ring-1 ring-blue-600/15">
                <HeartHandshake size={22} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Our promise</p>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">정직이 가장 좋은 영업입니다</h2>
              </div>
            </div>
            <ul className="space-y-4">
              {PROMISES.map((p) => (
                <li key={p} className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 p-5 text-base leading-relaxed text-zinc-700">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">✓</span>
                  {p}
                </li>
              ))}
            </ul>

            <div className="mt-14 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-50 to-white p-10 text-center">
              <p className="text-2xl font-bold leading-relaxed text-zinc-900">"{SITE.sloganKo}"</p>
              <p className="mt-2 text-zinc-600">우강테크는 한 번의 판매가 아니라, 공간이 빛나는 매일을 함께합니다.</p>
              <Link href="/quote" className="mt-7 inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-95 glow">
                사진 3장으로 견적 받기
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
