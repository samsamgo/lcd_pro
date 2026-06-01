import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/seo/JsonLd'
import { serviceLd } from '@/lib/seo/jsonld'
import { SITE, absoluteUrl, buildMetadata } from '@/lib/seo/site'
import { SERVICES, TRUST_MARKS, CAPABILITY_AREAS, FIELD_CASES } from './services-data'

export const metadata: Metadata = buildMetadata({
  title: `서비스 | ${SITE.nameKo} — LED 사이니지 시공부터 운영까지`,
  description:
    '우강테크는 실내·실외 LED 시공, NovaStar 컨트롤러 표준, CMS 콘텐츠 운영, 원격 모니터링, AS, 조달 납품, 인증 대응까지 LED 사이니지에 필요한 전 영역을 제공합니다.',
  path: '/services',
})

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        id="ld-services"
        data={serviceLd({
          name: 'LED 사이니지 종합 서비스',
          description:
            '실내·실외 LED 시공, NovaStar 컨트롤러 표준, CMS 운영, 원격 모니터링, AS, 조달 납품, 인증 대응까지 LED 사이니지에 필요한 모든 영역을 한 곳에서.',
          serviceType: 'LED 사이니지 종합 서비스',
          url: absoluteUrl('/services'),
        })}
      />
      <NavBar />
      <main id="main" className="pt-16">
        <section className="relative border-b border-white/[0.06] bg-[#080808]">
          <div className="absolute inset-0 opacity-35">
            <Image
              src="/curated/hero-services.jpg"
              alt=""
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/85 to-[#080808]/40" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="text-gradient">LED 전광판, 시공부터 운영까지</span>
              <br />
              <span className="text-white">우강테크가 다 합니다.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-zinc-300">
              실내·실외 시공, NovaStar 컨트롤러 표준, CMS 콘텐츠 운영, 원격 모니터링, AS, 조달 납품, 인증 대응까지.
              한 파트너로 LED 사이니지의 전 영역을 해결합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/quote"
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-95 glow"
              >
                견적 요청하기
              </Link>
              <Link
                href="/#how-it-works"
                className="rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/5"
              >
                진행 방식 보기
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#0a0a0a]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">제공 영역</h2>
            <p className="mt-3 max-w-2xl text-zinc-400">
              LED 사이니지에 필요한 12개 영역을 표준화된 방법으로 제공합니다.
            </p>

            <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((s) => (
                <li
                  key={s.id}
                  className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:bg-white/[0.04]"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-800">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm text-zinc-400">{s.summary}</p>
                    <ul className="mt-4 space-y-1.5">
                      {s.bullets.map((b) => (
                        <li key={b} className="text-sm text-zinc-300">
                          · {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-white/[0.06] bg-[#080808]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">표준화로 견적·시공 속도를 보장합니다</h2>
            <p className="mt-3 max-w-3xl text-zinc-400">
              3개 family (F-IN-P3 · F-IN-P2.5 · F-OUT-P5) × layout matrix (A-2x1 ~ A-10x5) × ZONE 단위 확장.
              표준 캐비닛은 견적을 빠르게, AS는 모듈 단위 교체로 신속하게 만듭니다.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST_MARKS.map((t) => (
                <div
                  key={t.label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
                >
                  <div className="text-sm font-semibold text-white">{t.label}</div>
                  <div className="mt-1 text-sm text-zinc-400">{t.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] bg-[#0a0a0a]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">시공 가능 영역</h2>
            <p className="mt-3 max-w-3xl text-zinc-400">
              실내·옥외·공공·소상공인 — 환경별 시공 역량과 실측 데이터를 갖추고 있습니다.
              어떤 매장·시설이든 사진 3장으로 견적을 받아보세요.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {CAPABILITY_AREAS.map((c) => (
                <div
                  key={c.env}
                  className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-800">
                    <Image
                      src={c.image}
                      alt={c.env}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-sm font-semibold text-white">{c.env}</div>
                    <div className="mt-1 text-sm text-zinc-400">{c.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] bg-[#080808]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">실증 시공 케이스</h2>
            <p className="mt-3 max-w-3xl text-zinc-400">
              실측 데이터와 함께 검증된 시공 사례입니다. 견적·설계의 기준선이 됩니다.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {FIELD_CASES.map((c) => (
                <div
                  key={c.title}
                  className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-800">
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-xs uppercase tracking-wide text-blue-400">{c.location}</div>
                    <div className="mt-1 text-lg font-semibold text-white">{c.title}</div>
                    <div className="mt-2 text-sm text-zinc-300">{c.spec}</div>
                    <p className="mt-3 text-sm text-zinc-400">{c.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.06] bg-[#0a0a0a]">
          <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">어떤 환경이든 먼저 검토해 드립니다</h2>
            <p className="mt-3 text-zinc-400">사진 3장과 위치만 보내주시면 1차 견적을 드립니다.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/quote"
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-95 glow"
              >
                견적 요청하기
              </Link>
              <Link
                href="/faq"
                className="rounded-lg border border-white/10 px-6 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:bg-white/5"
              >
                자주 묻는 질문
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
