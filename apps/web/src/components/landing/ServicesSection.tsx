import Link from 'next/link'
import {
  Ruler,
  Cpu,
  MonitorSmartphone,
  Wrench,
  ShieldCheck,
  Building2,
  ArrowUpRight,
} from 'lucide-react'
import { CMS_LABEL } from '@/lib/pricing'

const SERVICES = [
  {
    icon: Ruler,
    title: '표준화 시공',
    desc: '실내·옥외 LED를 표준 캐비닛·layout matrix로 시공합니다. 규격이 통일돼 견적·납기·AS가 빨라집니다.',
    points: ['표준 캐비닛 · 프레임', '전기 · 구조 검토', '1~3일 표준 설치'],
  },
  {
    icon: Cpu,
    title: 'NovaStar 컨트롤러 표준',
    desc: 'NovaStar Taurus 글로벌 표준 컨트롤러로 안정적인 송출과 원격 운영 기반을 제공합니다.',
    points: ['Taurus TB30/50/60', 'VNNOX 클라우드', '안정적 송출'],
  },
  {
    icon: MonitorSmartphone,
    title: CMS_LABEL,
    desc: '설치 시 초기 콘텐츠를 세팅하고 화면 교체 방법을 1:1로 교육합니다. 운영 중에도 콘텐츠 제작을 지원합니다.',
    points: ['초기 콘텐츠 세팅', '교체 방법 교육', '제작 지원'],
  },
  {
    icon: Wrench,
    title: 'AS · 유지보수',
    desc: 'LED는 모듈 단위 교체가 가능합니다. 패키지에 따라 정기 점검·예비부품·긴급 우선 처리를 지원합니다.',
    points: ['모듈 단위 교체', '정기 점검', '24h 긴급 AS'],
  },
  {
    icon: ShieldCheck,
    title: '인증 · 인허가 대응',
    desc: 'KC 적합등록·EMC 등 인증 자산을 기반으로, 옥외 광고물 신고 절차까지 함께 처리합니다.',
    points: ['KC · EMC 대응', '옥외광고물 신고', '규격 적합'],
  },
  {
    icon: Building2,
    title: '공공조달 · 다점포',
    desc: '학교·공공기관 조달과 프랜차이즈 다점포 운영까지 표준화된 방식으로 일관되게 대응합니다.',
    points: ['다점포 일관 운영', '수량 단가 조정', '조달 대응'],
  },
]

export function ServicesSection({ hideHeader = false }: { hideHeader?: boolean }) {
  return (
    <section id="services" className="scroll-mt-20 bg-zinc-50 py-24 px-4">
      <div className="mx-auto max-w-6xl">
        {!hideHeader && (
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
              서비스
            </p>
            <h2 className="text-4xl font-bold sm:text-5xl">
              시공부터 운영까지, 한 파트너로
            </h2>
            <p className="mt-4 text-zinc-600">
              LED 사이니지에 필요한 모든 영역을 표준화된 방법으로 제공합니다.
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, desc, points }) => (
            <div
              key={title}
              className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 ring-1 ring-blue-600/15 transition-colors group-hover:bg-blue-600/15">
                <Icon size={22} className="text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-zinc-900">{title}</h3>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-zinc-600">
                {desc}
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {points.map((p) => (
                  <li
                    key={p}
                    className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-95 glow"
          >
            사진 3장으로 견적 받기
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
