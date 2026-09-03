import Link from 'next/link'
import { Magnetic, Reveal } from '@/components/motion'
import { SITE } from '@/lib/seo/site'

/**
 * 회사 소개 마무리.
 *
 *"지금 바로 시작하세요" 같은 문구는 결재 담당자에게 아무 의미가 없다.
 * 다음 단계에 무엇이 필요한지 예고하는 것이 훨씬 유용하다(벤치마크 §8.2).
 */
export function AboutClose() {
  const tel = SITE.phone.replace(/[^0-9+]/g, '')

  return (
    <section className="wk-sec-sm bg-wk-bg">
      <div className="wk-wrap-read text-center">
        <Reveal y={16}>
          <h2 className="wk-h2 text-wk-ink">검토에 필요한 자료를 드립니다</h2>
          <p className="wk-lead mx-auto mt-5">
            설치 위치 사진과 대략적인 화면 크기만 알려 주시면 실측 일정과
            개략 규격서를 먼저 보내 드립니다. 견적 전 단계입니다.
          </p>
        </Reveal>

        <Reveal delay={0.1} y={14}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic>
              <Link href="/quote" className="wk-btn-p">
                자료 요청하기
              </Link>
            </Magnetic>
            {SITE.phone && (
              <a href={`tel:${tel}`} className="wk-btn-w">
                전화 {SITE.phone}
              </a>
            )}
          </div>
          <p className="wk-cap mt-5">평일 {SITE.openingHours.replace('평일 ', '')} · 접수 후 1영업일 내 회신</p>
        </Reveal>
      </div>
    </section>
  )
}
