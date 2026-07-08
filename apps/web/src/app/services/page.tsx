import type { Metadata } from 'next'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { CinematicScene } from '@/components/brand/CinematicScene'
import { ServiceHero } from '@/components/services/ServiceHero'
import { ServiceBlock } from '@/components/services/ServiceBlock'
import { CtaSection } from '@/components/landing/CtaSection'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd, serviceLd } from '@/lib/seo/jsonld'
import { PRICE_RANGE_SCHEMA } from '@/lib/pricing'
import { SITE, absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '서비스',
  description:
    '표준 시공, NovaStar 컨트롤러 표준, CMS 콘텐츠 운영, AS·유지보수, 인증·인허가 대응, 공공조달·다점포까지 — LED 디스플레이에 필요한 모든 영역을 하나의 표준으로 제공합니다.',
  path: '/services',
})

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        id="ld-services"
        data={serviceLd({
          name: 'LED 디스플레이 설계·시공·운영 서비스',
          description: '표준 시공, 컨트롤러 표준, CMS 운영, AS, 인허가 대응, 공공조달·다점포.',
          serviceType: 'LED 디스플레이 시공·운영',
          priceRange: PRICE_RANGE_SCHEMA,
          url: absoluteUrl('/services'),
        })}
      />
      <JsonLd
        id="ld-breadcrumb-services"
        data={breadcrumbLd([
          { name: '홈', url: SITE.url + '/' },
          { name: '서비스', url: SITE.url + '/services' },
        ])}
      />
      <NavBar />
      <main id="main">
        <ServiceHero />

        <ServiceBlock
          id="install"
          index="01"
          eyebrow="표준 시공"
          title="설계부터 설치까지, 3일이면 켜집니다"
          body="실내·옥외 LED를 표준 캐비닛과 layout matrix로 시공합니다. 규격이 통일돼 견적·납기·AS가 빨라지고, 전기·구조·방수까지 현장 실측 후 정확하게 마감합니다."
          points={['표준 캐비닛·프레임', '전기·구조·방수 검토', '표준 모델 D+3 설치', '무상 초기 설정']}
          image="/curated/svc-cabinet.jpg"
          imageAlt="표준 캐비닛 LED 시공"
        />

        <ServiceBlock
          id="controller"
          index="02"
          eyebrow="NovaStar 컨트롤러 표준"
          title="하나의 표준이, 모든 화면을 안정적으로"
          body="컨트롤러를 NovaStar Taurus + VNNOX 클라우드로 통일했습니다. 시장의 단편화를 피하고, 하나의 운영 도구로 모든 고객의 화면을 안정적으로 송출·관리합니다."
          points={['Taurus TB30 / TB50 / TB60', 'VNNOX 클라우드', '안정적 송출', '원격 상태 점검']}
          image="/curated/svc-controller.jpg"
          imageAlt="NovaStar 표준 컨트롤러"
          reverse
          dark
        />

        <ServiceBlock
          id="cms"
          index="03"
          eyebrow="CMS 콘텐츠 운영"
          title="비전문가도 5분이면, 화면을 바꿉니다"
          body="설치 시 초기 콘텐츠를 세팅하고 교체 방법을 1:1로 교육합니다. 원격 CMS로 메뉴·공지·프로모션을 언제든 교체·스케줄하고, 여러 매장을 한 화면에서 운영할 수 있습니다."
          points={['초기 콘텐츠 세팅', '교체 방법 1:1 교육', '원격 스케줄·배포', '다점포 통합 운영']}
          image="/curated/svc-cms.jpg"
          imageAlt="CMS 콘텐츠 운영 화면"
        />

        {/* AS — 시네마틱 강조 */}
        <div id="care" className="scroll-mt-16" />
        <CinematicScene
          layout="fullbleed"
          align="left"
          eyebrow="AS · 유지보수"
          title={<>설치는,<br />시작일 뿐입니다</>}
          body="LED는 모듈 단위 교체가 가능합니다. 부분 고장 시 해당 모듈만 빠르게 교체하고, 패키지에 따라 정기 점검·예비부품·24시간 긴급 우선 처리를 제공합니다. 하드웨어 보증은 스탠다드 1년, 프리미엄 2년."
          image="/curated/svc-replacement.jpg"
          imageAlt="LED 모듈 단위 교체 AS"
          href="/packages"
          cta="패키지별 AS 보기"
        />

        <ServiceBlock
          id="cert"
          index="04"
          eyebrow="인증 · 인허가"
          title="복잡한 인증·신고, 우리가 함께 처리합니다"
          body="KC 적합등록·EMC 등 인증 자산을 기반으로 규격 적합성을 확보하고, 옥외 설치에 필요한 옥외 광고물 신고 절차까지 함께 진행합니다. 지역·구조에 따른 요건을 사전에 안내합니다."
          points={['KC · EMC 대응', '옥외광고물 신고', '규격 적합성', 'Day0 전기·허가 체크']}
          image="/curated/svc-consulting.jpg"
          imageAlt="인증·인허가 대응"
          reverse
        />

        <ServiceBlock
          id="b2b"
          index="05"
          eyebrow="공공조달 · 다점포"
          title="학교·공공기관·프랜차이즈까지, 표준으로"
          body="나라장터·조달 대응과 프랜차이즈 다점포 운영을 표준화된 방식으로 일관되게 처리합니다. 수량에 따른 단가 조정과 전 매장 동일 사양·품질을 보장합니다."
          points={['나라장터 대응', '다점포 일관 운영', '수량 단가 조정', '동일 사양·품질']}
          image="/curated/svc-monitoring.jpg"
          imageAlt="공공조달·다점포 운영"
          dark
        />

        <CtaSection />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
