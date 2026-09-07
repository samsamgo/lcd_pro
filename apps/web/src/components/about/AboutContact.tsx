import Link from 'next/link'
import { Magnetic, Reveal, Stagger } from '@/components/motion'
import { SITE } from '@/lib/seo/site'

/**
 * 회사 소개 마무리 — 연락처만.
 *
 * 2026-09-07 신설. 이전 `AboutClose`("드리는 자료" h2 + "자료 요청하기" 버튼 +
 * 안내 문단)를 CEO 지시로 폐기했다. 견적 요청 앞에 '자료 요청'이라는 중간 단계를
 * 하나 더 두면 리드 경로가 한 번 더 갈라진다. 실제로 이 페이지에서 갈 곳은
 * 전화 · 메일 · 견적 셋뿐이므로 그 셋만 남기고 설명 문단은 전부 뺐다.
 *
 * 🔴 전화번호는 반드시 SITE.phone 만 참조한다. 하드코딩 금지.
 *    현재 값은 대표번호가 아니라 개인 휴대폰이며 CEO 확인 대기 중이다.
 *    값이 비면 전화 행 자체가 사라지고 메일·견적만 남는다.
 */
export function AboutContact() {
  const tel = SITE.phone.replace(/[^0-9+]/g, '')

  const rows: { k: string; v: string; href: string }[] = [
    ...(SITE.phone ? [{ k: '전화', v: SITE.phone, href: `tel:${tel}` }] : []),
    ...(SITE.email ? [{ k: '이메일', v: SITE.email, href: `mailto:${SITE.email}` }] : []),
  ]

  return (
    <>
      <div className="wk-bridge-down h-20 md:h-28" aria-hidden="true" />

      <section id="contact" className="wk-sec wk-night">
        <div className="wk-wrap grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
          <Reveal className="lg:col-span-5" y={16}>
            <p className="text-label font-semibold uppercase tracking-widest text-wk-blue">
              Contact
            </p>
            <h2 className="wk-h2 mt-5 text-wk-nightInk">연락처</h2>
          </Reveal>

          <div className="lg:col-span-7">
            <Stagger className="flex flex-col" y={12}>
              {rows.map((r) => (
                <a
                  key={r.k}
                  href={r.href}
                  className="flex items-baseline gap-4 border-t border-white/10 py-5 transition-colors hover:bg-white/5 sm:gap-6"
                >
                  <span className="w-16 shrink-0 text-label font-medium text-wk-nightMuted">
                    {r.k}
                  </span>
                  {/* 360px 에서 메일 주소가 넘치지 않게 — 줄바꿈 허용 + 데스크톱에서만 h3 */}
                  <span className="wk-metric min-w-0 break-all text-lead font-semibold text-wk-nightInk sm:text-h3">
                    {r.v}
                  </span>
                </a>
              ))}
            </Stagger>

            <Reveal delay={0.12} y={14}>
              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Magnetic>
                  <Link href="/quote" className="wk-btn-p">
                    견적 요청
                  </Link>
                </Magnetic>
                <p className="text-caption text-wk-nightMuted">{SITE.openingHours}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="wk-bridge-up h-20 md:h-28" aria-hidden="true" />
    </>
  )
}
