import Link from 'next/link'
import {
  Ruler,
  Cpu,
  MonitorSmartphone,
  Wrench,
  ShieldCheck,
  Building2,
} from 'lucide-react'
import { CMS_LABEL } from '@/lib/pricing'

const SERVICES = [
  {
    icon: Ruler,
    title: '표준화 시공',
    desc: '실내·옥외 LED를 표준 캐비닛·layout matrix로 시공. 견적·납기·AS가 빨라집니다.',
  },
  {
    icon: Cpu,
    title: 'NovaStar 컨트롤러 표준',
    desc: 'NovaStar Taurus 글로벌 표준 컨트롤러로 안정적 송출과 원격 운영 기반을 제공합니다.',
  },
  {
    icon: MonitorSmartphone,
    title: CMS_LABEL,
    desc: '스마트폰·웹에서 콘텐츠를 올리고 스케줄링하는 원격 관리 기능을 준비하고 있습니다.',
  },
  {
    icon: Wrench,
    title: 'AS · 유지보수',
    desc: '모듈 단위 교체로 빠른 AS. 패키지에 따라 정기 점검·예비부품·우선 처리를 지원합니다.',
  },
  {
    icon: ShieldCheck,
    title: '인증 · 인허가 대응',
    desc: 'KC 적합등록·EMC 등 인증 자산을 기반으로, 옥외 광고물 신고 절차를 함께 처리합니다.',
  },
  {
    icon: Building2,
    title: '공공조달 · 다점포',
    desc: '학교·공공기관 조달과 프랜차이즈 다점포 운영까지 표준화된 방식으로 대응합니다.',
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-20 bg-zinc-50 py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
            서비스
          </p>
          <h2 className="text-4xl font-bold sm:text-5xl">
            시공부터 운영까지, 한 파트너로
          </h2>
          <p className="mt-4 text-zinc-600">
            LED 사이니지에 필요한 영역을 표준화된 방법으로 제공합니다.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass rounded-2xl p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10">
                <Icon size={22} className="text-blue-600" />
              </div>
              <h3 className="mb-2 font-bold text-zinc-900">{title}</h3>
              <p className="text-sm leading-relaxed text-zinc-600">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-95 glow"
          >
            사진 3장으로 견적 받기 →
          </Link>
        </div>
      </div>
    </section>
  )
}
