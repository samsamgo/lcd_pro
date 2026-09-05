import { IMAGES } from '@/lib/imageAssets'
import Image from 'next/image'
import { Reveal } from '@/components/motion'

/**
 * 솔루션(서비스) 요약 섹션.
 *
 * 기존 /services 페이지를 한 페이지 구조로 흡수한 것이다.
 * 원문에는 "3일이면 켜집니다", "비전문가도 5분이면" 같은 소상공인 대상 문구가
 * 있었으나, 검증되지 않은 소요시간 약속이라 관공서 상대로는 위험해 걷어냈다.
 * 공급 범위를 있는 그대로만 적는다.
 */
const SERVICES = [
  {
    title: '현장 실측 · 설계',
    desc: '직접 가서 봅니다. 얼마나 떨어져서 보는 자리인지, 전기는 어디서 끌어오는지, 붙일 면을 보강해야 하는지. 그걸 보고 화면 규격과 설치 방식을 정합니다.',
    image: IMAGES.service[0],
    imageAlt: '한국 공공시설 로비의 빈 벽면을 레이저 측정기와 태블릿으로 실측하는 기술자 두 명',
    generated: true,
  },
  {
    title: '제작 · 조립',
    desc: '검사를 통과한 것만 출고합니다. 모듈을 프레임에 조립한 뒤 화면 전체를 켜서 색과 밝기가 고른지 확인합니다.',
    image: IMAGES.service[1],
    imageAlt: '한국 LED 전광판 제작 작업대에서 모듈과 캐비닛을 조립하는 기술자들',
    generated: true,
  },
  {
    title: '설치 시공',
    desc: '기관 일정에 맞춥니다. 방학이든 휴일이든 업무 시간 외든 상관없습니다. 전기·통신 연결하고 시운전까지 하고 마칩니다.',
    image: IMAGES.service[2],
    imageAlt: '한국 공공시설 로비 벽면의 LED 프레임과 모듈을 설치하는 기술자 두 명',
    generated: true,
  },
  {
    title: '콘텐츠 운영 교육',
    desc: '설치 끝나면 담당자분께 화면 바꾸는 법을 알려드립니다. 따로 전문 인력을 두실 필요 없습니다.',
    image: IMAGES.service[3],
    imageAlt: '한국 사무실에서 노트북으로 안내 콘텐츠를 편성하고 벽면 테스트 화면을 확인하는 담당자',
    generated: true,
  },
  {
    title: '인증 · 인허가 지원',
    desc: '옥외광고물 신고 등 설치에 필요한 행정 절차를 함께 확인하고 필요한 서류를 준비해 드립니다.',
    image: IMAGES.service[4],
    imageAlt: '옥외 전광판 설치 위치와 구조 조건을 검토하는 건축 평면도',
    generated: false,
  },
  {
    title: '유지보수',
    desc: '접수하고, 원격으로 먼저 보고, 필요하면 가서 판정하고, 모듈 갈고, 처리 내역을 문서로 드립니다.',
    image: IMAGES.service[5],
    imageAlt: '한국 공공시설 로비의 LED 화면에서 모듈을 분리하고 전기 상태를 점검하는 기술자',
    generated: true,
  },
]

export function ServiceSummary() {
  return (
    <section id="services" className="wk-sec bg-white">
      <div className="wk-wrap">
        <p className="wk-eyebrow">솔루션</p>
        <h2 className="wk-h2 text-wk-ink">공급 범위</h2>
        <p className="wk-lead mt-3.5 max-w-[42em]">
          설계부터 유지보수까지 한 회사가 담당합니다. 공정별로 업체가 나뉘지 않아
          책임 소재가 분명합니다.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {SERVICES.map((s, n) => (
            <Reveal key={s.title} delay={Math.min(n, 5) * 0.07}>
            <div className="overflow-hidden rounded-card-m bg-wk-bg sm:rounded-card h-full">
              <div className="wk-card-img relative aspect-[16/10] rounded-b-none">
                <Image src={s.image} alt={s.imageAlt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px" className="object-cover" />
              </div>
              <div className="p-5">
                <p className="text-sm font-bold tabular-nums text-wk-cta">
                  {String(n + 1).padStart(2, '0')}
                </p>
                <p className="wk-h3 mt-2 text-wk-ink">{s.title}</p>
                <p className="mt-1.5 text-label text-wk-ink3">{s.desc}</p>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
