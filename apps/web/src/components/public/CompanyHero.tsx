import Image from 'next/image'
import { IMAGES } from '@/lib/imageAssets'
import { Reveal, SplitText } from '@/components/motion'

/**
 * 회사 소개 첫 화면.
 *
 * 큰소리를 치지 않는다. 우리가 아직 실적이 없다는 것을 아는 독자 앞에서
 *"최고의 기술력" 을 말하면 즉시 신뢰를 잃는다.
 * 대신 우리가 서 있는 "자리" 를 말한다 — 읍·면 소재지의 사거리, 그 앞의 안내판.
 *
 * 사진(A6 지방 소도시 중심가) 위 문구는 좌측 스크림(.wk-scrim-l)으로 대비를 만들고,
 * 생성 이미지의 매끈함은 .wk-grain 으로 눌러 준다.
 * 이 페이지에서 priority 이미지는 이 한 장뿐이다.
 */
export function CompanyHero() {
  return (
    <section
      data-wk-dark-hero className="relative flex min-h-[78svh] items-end overflow-hidden bg-wk-night lg:min-h-[86svh]">
      <div className="wk-grain absolute inset-0" aria-hidden="true">
        <Image
          src={IMAGES.company.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[60%_50%] lg:object-center"
        />
        <div className="wk-scrim-l absolute inset-0" />
      </div>

      <div className="relative z-10 w-full pb-16 pt-32 md:pb-24 lg:pb-28">
        <div className="wk-wrap">
          <Reveal y={0} duration={0.7}>
            <p className="text-label font-semibold uppercase tracking-widest text-wk-nightMuted">
              회사 소개
            </p>
          </Reveal>

          <SplitText
            as="h1"
            text="LED 사이니지 한 가지만 합니다"
            className="wk-h1 mt-5 max-w-[11ch] text-wk-nightInk"
            delay={0.1}
          />

          <Reveal delay={0.34} y={18}>
            <p className="wk-lead mt-7 text-wk-nightMuted">
              군청 앞 사거리, 학교 정문, 읍사무소 민원실.
              현수막과 안내판이 있던 자리에 화면을 답니다.
              품목을 늘리지 않고 이것만 합니다.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
