import Link from 'next/link'
import Image from 'next/image'

/**
 * 공공 히어로.
 *
 * 토스 문법을 따른다 — 이미지 위에 긴 텍스트를 올리지 않고,
 * 설명 블록과 이미지 블록을 분리한다.
 * (근거: COO/reports/codex/토스-UI-분석.md §10)
 *
 * 사진은 실사만 쓴다. 렌더/합성으로 보이는 컷은 AI 이미지로 읽혀
 * 오히려 신뢰를 깎는다. (근거: 자료 사진 31장 감별)
 */
export function PublicHero() {
  return (
    <section className="wk-sec pb-0">
      <div className="wk-wrap">
        <p className="wk-eyebrow">관공서 · 학교 · 공공기관</p>
        <h1 className="wk-hero text-wk-ink">
          관공서·학교 전광판,
          <br />
          설치부터 A/S까지
        </h1>
        <p className="wk-lead mt-5 max-w-[38em]">
          민원실 대기번호, 학교 급식 안내, 지자체 재난 문구.
          <br className="hidden md:block" />
          우강테크가 직접 만들고, 설치하고, 고칩니다.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/quote" className="wk-btn-p">
            견적·규격서 요청
          </Link>
          <Link href="#screens" className="wk-btn-w">
            설치 화면 보기
          </Link>
        </div>
      </div>

      <div className="wk-wrap mt-10">
        <div className="wk-card-img relative aspect-[16/9]">
          <Image
            src="/cases/opt/case-15.jpg"
            alt="공공시설 로비에 설치된 대형 LED 종합안내 화면"
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
