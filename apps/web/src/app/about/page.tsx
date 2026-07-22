import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight, Sparkles, Camera, Factory, Hammer, MonitorSmartphone, Wrench, Building2, Check,
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
    '우강테크(WK Tech)는 빛으로 공간을 바꾸는 디스플레이 브랜드입니다. 작은 가게의 밤을 밝히는 일, 복잡함을 대신 짊어지고 사장님께는 사진 세 장만 남기는 일 — 우리가 왜 이 일을 하는지 이야기합니다.',
  path: '/about',
})

const SCOPE = [
  { icon: Camera, title: '자동 견적', desc: '사진 세 장이면 30분 안에 예상 범위를. 전화도, 기다림도 없이.' },
  { icon: Factory, title: '표준 제조', desc: '표준 캐비닛·모듈·부품과 인증으로, 어느 매장에서나 같은 품질을.' },
  { icon: Hammer, title: '표준 시공', desc: '표준 모델 기준 3일. 전기·구조·방수까지 실측 후 정확하게.' },
  { icon: MonitorSmartphone, title: 'CMS 운영', desc: '메뉴도 공지도, 화면에서 5분이면. 여러 매장을 한 손 안에.' },
  { icon: Wrench, title: 'AS · 유지보수', desc: '고장 난 모듈만 갈아 끼우고, 급할 땐 먼저 달려갑니다.' },
  { icon: Building2, title: '공공조달 · 다점포', desc: '학교와 관공서, 프랜차이즈까지 — 같은 원칙으로 넓게.' },
]

const COMPARE = [
  { label: '견적 속도', sign: '2~5일', si: '1~2주', wk: '30분' },
  { label: '가격 투명성', sign: '협상', si: '비쌈', wk: '온라인 공개' },
  { label: '설치 리드타임', sign: '1~3주', si: '2~6주', wk: '3일' },
  { label: '운영 지원', sign: '전화만', si: '별도 계약', wk: 'CMS + 원격' },
  { label: '공공조달', sign: '불가', si: '가능하나 비쌈', wk: '나라장터 대응' },
]

const VALUES = [
  {
    title: '복잡함은, 우리의 몫',
    desc: '표준은 차가운 말처럼 들리지만 우리에겐 배려입니다. 우리가 여섯 단계의 복잡함을 대신 짊어질수록, 사장님의 하루는 그만큼 단순해집니다.',
  },
  {
    title: '기다림 없는, 정직',
    desc: '“전화해야 알 수 있는 가격”의 시대를 끝냈습니다. 사진 세 장이면 30분 안에, 감추는 것 없이. 확정가는 실측 뒤에 정직하게 다시 말씀드립니다.',
  },
  {
    title: '켜진 뒤에도, 곁에',
    desc: '설치는 끝이 아니라 시작입니다. 화면은 매일 켜지고 매일 무언가를 말하고 언젠가는 고장 납니다. 그 매일과 언젠가를, 우리는 함께 있습니다.',
  },
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
        <section className="relative flex min-h-[82svh] items-center overflow-hidden bg-black px-6 pt-28 pb-20">
          <div className="absolute inset-0" aria-hidden="true">
            <Image src="/curated/hero-services.jpg" alt="" fill priority sizes="100vw" className="object-cover object-center opacity-45" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black" />
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
              벽에 화면을 다는 일이 아니라, 누군가의 하루가 조금 더 밝아지도록
              곁에 서는 일. 우강테크가 하는 일을 우리는 그렇게 부릅니다.
            </p>
            <p className="mt-5 text-sm italic text-zinc-500">{SITE.sloganKo} · {SITE.sloganEn}</p>
          </div>
        </section>

        {/* ── 오프닝: 빛에 대하여 (문학적) ── */}
        <section className="bg-black px-6 py-32 sm:py-44">
          <div className="mx-auto max-w-3xl">
            <p className="mb-10 text-center text-sm font-medium uppercase tracking-[0.3em] text-cyan-400/70">Prologue</p>
            <div className="space-y-8 text-center text-[clamp(1.35rem,3vw,2rem)] font-light leading-[1.7] tracking-tight text-zinc-200">
              <p>해가 지면, 거리의 간판들이 하나씩 깨어납니다.</p>
              <p className="text-zinc-400">
                불이 켜진 가게는 말합니다 —<br />
                우리는 여기 있고, 아직 문을 열어 두었다고.
              </p>
              <p>
                빛은 공간이 세상에 건네는 가장 짧은 인사이자,
                가장 오래 남는 문장입니다.
              </p>
              <p className="text-white">
                우리는 그 문장을,<br />
                누구나 쓸 수 있게 만들고 싶었습니다.
              </p>
            </div>
          </div>
        </section>

        {/* ── 왜 존재하는가 ── */}
        <section id="mission" className="bg-white px-6 py-28 sm:py-36">
          <div className="mx-auto max-w-3xl">
            <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Why we exist</p>
            <h2 className="text-[clamp(1.9rem,4.5vw,3rem)] font-bold leading-[1.15] tracking-tight text-zinc-900">
              빛은, 대기업의 것이 아닙니다.
            </h2>
            <div className="mt-9 space-y-7 text-lg leading-[1.9] text-zinc-700">
              <p>
                골목의 작은 카페에도, 오래된 식당의 낡은 간판에도, 동네 끝
                헬스장에도 — 켜질 자격이 있는 빛이 있습니다. 그러나 오랫동안
                그 빛은 너무 비쌌고, 너무 복잡했고, 너무 멀리 있었습니다.
              </p>
              <p>
                가격은 전화를 걸어야만 알 수 있었고, 기술은 알아들을 수 없는
                말로 쓰여 있었으며, 설치가 끝나고 나면 아무도 다시 돌아오지
                않았습니다. 정작 화면이 가장 필요한 사람들이, 가장 높은 벽
                앞에 서 있었습니다.
              </p>
              <p>
                <span className="font-semibold text-zinc-900">우강테크는 그 사이의 거리를, ‘표준’이라는 다리로 좁혔습니다.</span>{' '}
                제품을 표준 모델로, 컨트롤러를 하나의 기준으로, 견적과 시공과
                운영을 예측 가능한 절차로. 복잡함은 우리가 짊어지고, 사장님께는
                <span className="font-semibold text-zinc-900"> 사진 세 장</span>과
                <span className="font-semibold text-zinc-900"> 켜지는 공간</span>만 남깁니다.
              </p>
            </div>
          </div>
        </section>

        {/* ── 우리가 짊어지는 여섯 가지 ── */}
        <section className="bg-zinc-50 px-6 py-24 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">What we carry</p>
              <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight text-zinc-900">
                복잡한 여섯 단계를, 대신 짊어집니다
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-zinc-600">
                우리는 전광판을 파는 회사가 아니라, 견적부터 운영까지를 하나로
                잇는 <strong className="text-zinc-900">디스플레이 브랜드</strong>입니다.
                사장님이 몰라도 되도록, 우리가 전부 압니다.
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

        {/* ── 표준이라는 태도 ── */}
        <CinematicScene
          layout="split"
          theme="dark"
          imageSide="right"
          eyebrow="표준이라는 태도 · Standard"
          title={<>표준은,<br />차가운 말이 아닙니다</>}
          body="우리는 컨트롤러를 하나로 통일하고, 캐비닛을 규격화하고, 절차를 문장처럼 정리했습니다. 화려해 보이려는 것이 아닙니다. 표준이 촘촘할수록 견적은 빨라지고 가격은 정직해지며, 그만큼 누군가의 부담이 가벼워지기 때문입니다. 표준은, 우리가 고른 배려의 방식입니다."
          image="/curated/svc-controller.jpg"
          imageAlt="하나로 통일한 표준 컨트롤러"
          stats={[
            { value: '30분', label: '1차 견적' },
            { value: '3일', label: '표준 시공' },
            { value: '6종', label: '표준 SKU' },
          ]}
        />

        {/* ── 포지셔닝 ── */}
        <section className="bg-white px-6 py-24 sm:py-28" id="why">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Positioning</p>
              <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight text-zinc-900">
                간판집도, 대형 SI도 아닙니다
              </h2>
              <p className="mt-4 text-lg text-zinc-600">
                빠르지만 들쭉날쭉한 쪽과, 정교하지만 느리고 비싼 쪽. 그 사이의
                오래 비어 있던 자리를, 우리는 표준으로 채웁니다.
              </p>
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

        {/* ── 우리는 남습니다 (문학적) ── */}
        <section className="relative overflow-hidden bg-zinc-950 px-6 py-32 sm:py-40">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[150px]" />
          </div>
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="mb-8 text-sm font-medium uppercase tracking-[0.3em] text-cyan-400/70">We stay</p>
            <h2 className="text-[clamp(1.9rem,4.6vw,3rem)] font-bold leading-[1.2] tracking-tight text-white">
              우리는 판매가 끝나는 곳에서<br />멈추지 않습니다
            </h2>
            <p className="mx-auto mt-9 max-w-2xl text-lg font-light leading-[1.9] text-zinc-400">
              화면은 오늘도 켜지고, 내일도 무언가를 말할 것입니다. 계절이 바뀌면
              메뉴가 바뀌고, 시간이 지나면 어딘가 한 칸이 어두워집니다. 우리는
              그 모든 매일과 언젠가의 곁에 남아, 다시 밝히는 일을 반복합니다.
              한 번의 거래가 아니라, <span className="text-zinc-200">공간이 빛나는 매일</span>을
              함께하는 것 — 그것이 우리가 스스로에게 건 약속입니다.
            </p>
          </div>
        </section>

        {/* ── 세 가지 마음 ── */}
        <section id="standard" className="bg-white px-6 py-24 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-14">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Our way</p>
              <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold tracking-tight text-zinc-900">
                우리가 일하는, 세 가지 마음
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {VALUES.map((v, i) => (
                <div key={v.title} className="border-t border-zinc-200 pt-6">
                  <span className="font-mono text-sm font-bold text-blue-600">0{i + 1}</span>
                  <h3 className="mt-3 text-xl font-bold text-zinc-900">{v.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.8] text-zinc-600">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 클로징 ── */}
        <section className="bg-zinc-50 px-6 py-24 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[clamp(1.4rem,3.4vw,2.1rem)] font-semibold leading-[1.5] tracking-tight text-zinc-900">
              빛으로 공간을 짓는 일은,<br />
              결국 누군가의 하루를 밝히는 일입니다.
            </p>
            <p className="mx-auto mt-6 max-w-xl text-zinc-600">
              당신의 공간에도, 그 하루를 함께 짓겠습니다. 사진 세 장이면 충분합니다.
            </p>
            <Link
              href="/quote"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-95 glow"
            >
              사진 세 장으로 시작하기
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
