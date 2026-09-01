import type { Metadata } from 'next'
import { PublicHero } from '@/components/public/PublicHero'
import { ProofRow } from '@/components/public/ProofRow'
import { LightStatement } from '@/components/public/LightStatement'
import { UseCaseBlock } from '@/components/public/UseCaseBlock'
import { ScreenGallery } from '@/components/public/ScreenGallery'
import { AfterService } from '@/components/public/AfterService'
import { DocumentList } from '@/components/public/DocumentList'
import { SecondaryMarkets } from '@/components/public/SecondaryMarkets'
import { ContactBlock } from '@/components/public/ContactBlock'
import { FaqSection } from '@/components/landing/FaqSection'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { MobileCtaBar } from '@/components/MobileCtaBar'
import { JsonLd } from '@/components/seo/JsonLd'
import { serviceLd, howToLd, breadcrumbLd } from '@/lib/seo/jsonld'
import { SITE, absoluteUrl, buildMetadata } from '@/lib/seo/site'
import { PRICE_RANGE_SCHEMA } from '@/lib/pricing'

export const metadata: Metadata = buildMetadata({
  title: `${SITE.nameKo} | 관공서·학교 LED 전광판 · 전자현수막`,
  description:
    '우강테크(WK Tech)는 관공서·공공기관·학교에 LED 전광판과 전자현수막을 공급합니다. 설계·제작·시공·A/S를 직접 수행합니다. 규격서와 개략 견적을 무상으로 보내드립니다.',
  path: '/',
})

export default function Home() {
  return (
    <>
      <JsonLd
        id="ld-home-service"
        data={serviceLd({
          name: 'LED 전광판·전자현수막 설계·제작·시공·유지보수',
          description:
            '관공서·공공기관·학교를 위한 LED 전광판과 전자현수막. 설계·제작·시공·A/S를 하나의 절차로 제공합니다.',
          serviceType: 'LED 전광판 · 전자현수막',
          priceRange: PRICE_RANGE_SCHEMA,
          url: absoluteUrl('/'),
        })}
      />
      <JsonLd
        id="ld-home-howto"
        data={howToLd({
          name: '관공서·학교 LED 전광판 도입 절차',
          description:
            '설치 장소와 규모 확인부터 현장 실측, 제작·시공, 담당자 교육과 A/S까지의 절차.',
          totalTime: 'P30D',
          steps: [
            { name: '문의·상담', text: '설치 장소와 용도를 알려주시면 개략 견적과 사양서를 보내드립니다.' },
            { name: '현장 실측', text: '전기 인입과 구조를 확인해 확정 견적과 규격서를 작성합니다.' },
            { name: '제작·시공', text: '자사에서 조립·검사한 뒤 기관 일정에 맞춰 설치합니다.' },
            { name: '교육·A/S', text: '화면 교체 방법을 담당자에게 안내하고, 이후 고장은 모듈 단위로 대응합니다.' },
          ],
        })}
      />
      <JsonLd id="ld-home-breadcrumb" data={breadcrumbLd([{ name: '홈', url: absoluteUrl('/') }])} />

      <NavBar />
      <main id="main">
        {/* 관공서 담당자가 확인하는 순서대로 배치한다.
            ① 무엇을 하는 회사인가 → ② 믿을 만한가 → ③ 우리 같은 데 쓰나
            → ④ 설치 후는 어떻게 되나 → ⑤ 서류는 있나 → ⑥ 어떻게 연락하나 */}
        <PublicHero />
        <ProofRow />
        <LightStatement />

        <UseCaseBlock
          id="public-office"
          grey
          eyebrow="관공서 · 민원실"
          title={<>대기번호부터<br />부서 안내까지</>}
          body="창구 번호를 실시간으로 띄우고, 비는 시간에는 시정 공지를 내보냅니다. 조직 개편으로 부서 이름이 바뀌어도 안내판을 새로 제작할 일이 없습니다."
          image="/cases/opt/case-04.jpg"
          imageAlt="공공기관 로비에 설치된 캠페인 안내 LED 스탠드와 접수 창구"
          tags={['실내 설치', '가까이서도 또렷한 글자', '담당자가 직접 수정']}
          href="/industries/public-office"
          cta="관공서 사례 보기"
          imageRight
        />

        <UseCaseBlock
          id="school"
          eyebrow="학교 · 강당 · 전자현수막"
          title={<>행사 때마다 새로<br />걸지 않아도 됩니다</>}
          body="급식표, 행사 안내, 귀가 시간을 같은 화면에서 바꿉니다. 강당은 뒷자리에서도 읽혀야 하니 시청거리를 먼저 재고, 기존 현수막 걸이와 부딪히지 않는지도 확인합니다."
          image="/cases/opt/case-17.jpg"
          imageAlt="학교·기관 홀에 곡면으로 설치된 구역 안내 LED"
          tags={['실내·옥외 모두', '밤에는 자동으로 어둡게', '옥외광고물 신고 지원']}
          href="/industries/school"
          cta="학교 사례 보기"
          imageRight={false}
        />

        <ScreenGallery />
        <AfterService />
        <DocumentList />

        {/* 민간·소상공인은 제외하지 않고 2차 영역으로 남긴다 (요청자 지시) */}
        <SecondaryMarkets />

        <FaqSection />
        <ContactBlock />
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  )
}
