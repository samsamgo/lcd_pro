import Link from 'next/link'
import { SITE } from '@/lib/seo/site'

/**
 * 클로징 문의 블록.
 *
 * 경쟁사 조사: 소형 업체일수록 전화번호를 크게, 여러 번 노출한다.
 * 대표번호와 A/S 번호를 분리하면 "설치 후에도 조직이 남아 있다"는 신호가 된다.
 *
 * ⚠️ SITE.phone 이 비어 있으면 전화 카드 대신 안내 문구를 띄운다.
 *    QR 영업이 주 유입인데 전화번호가 없는 것은 현재 최대 결함이다.
 */
export function ContactBlock() {
  const hasPhone = Boolean(SITE.phone)

  return (
    <section id="contact" className="wk-sec bg-wk-ink text-white">
      <div className="wk-wrap">
        <h2 className="wk-h2 text-white">
          규격서 필요하시면
          <br />
          연락 주십시오
        </h2>
        <p className="wk-lead mt-4 max-w-[34em] text-wk-disabled">
          아직 발주 계획이 없어도 됩니다. 설치할 자리와 대략적인 크기만 알려주시면
          개략 견적과 사양서를 보내드립니다. 비용은 없습니다.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <div className="wk-card bg-[#262E3A]">
            <p className="wk-cap">대표전화</p>
            {hasPhone ? (
              <a
                href={`tel:${SITE.phone.replace(/[^0-9+]/g, '')}`}
                className="mt-2.5 block text-[24px] font-extrabold tracking-[-0.02em] text-white"
              >
                {SITE.phone}
              </a>
            ) : (
              <p className="mt-2.5 text-[15px] text-wk-warn">번호 등록 필요</p>
            )}
            <p className="wk-cap mt-2.5">QR로 들어온 담당자가 가장 먼저 찾습니다.</p>
          </div>

          <div className="wk-card bg-[#262E3A]">
            <p className="wk-cap">이메일</p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-2.5 block break-all text-[17px] font-bold text-white"
            >
              {SITE.email}
            </a>
            <p className="wk-cap mt-2.5">평일 09:00 – 18:00</p>
          </div>

          <div className="wk-card bg-[#262E3A]">
            <p className="wk-cap">현장 실측</p>
            <p className="mt-2.5 text-[17px] font-bold text-white">기관 일정에 맞춰 조정</p>
            <p className="wk-cap mt-2.5">업무에 지장이 없는 시간대로 잡습니다.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/quote" className="wk-btn-p">
            견적·규격서 요청
          </Link>
        </div>
      </div>
    </section>
  )
}
