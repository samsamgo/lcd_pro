import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, Clock } from 'lucide-react'

import { IMAGES } from '@/lib/imageAssets'
import { SITE } from '@/lib/seo/site'
import { Reveal } from '@/components/motion'

/**
 * 고객센터 히어로.
 *
 * 고친 것 — 이 페이지에는 h1 이 아예 없었다. 문서 구조상 최상위 제목이 없으면
 * 스크린리더 사용자는 페이지가 무엇에 대한 것인지 알 수 없고, 검색엔진도 주제를 못 잡는다.
 *
 * 이 페이지에 오는 사람은 두 부류다.
 *   ① 화면이 안 나와서 급한 담당자  ② 도입 전에 사후관리를 확인하려는 담당자
 * ①이 먼저 눈에 들어와야 한다. 그래서 연락 수단을 제목 바로 아래에 둔다.
 */
export function SupportHero() {
  const contacts = [
    SITE.phone
      ? { icon: Phone, label: '전화', value: SITE.phone, href: `tel:${SITE.phone.replace(/[^0-9+]/g, '')}` }
      : null,
    SITE.email
      ? { icon: Mail, label: '이메일', value: SITE.email, href: `mailto:${SITE.email}` }
      : null,
    SITE.openingHours ? { icon: Clock, label: '업무시간', value: SITE.openingHours, href: null } : null,
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href: string | null }[]

  return (
    <section
      data-wk-dark-hero
      aria-labelledby="support-h"
      className="relative isolate flex min-h-[58svh] items-end overflow-hidden bg-wk-night"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={IMAGES.support}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={80}
          className="object-cover object-[60%_50%]"
        />
        <div className="wk-scrim-l-deep absolute inset-0" />
        <div className="wk-grain absolute inset-0" />
      </div>

      <div className="relative z-10 w-full pb-14 pt-32 md:pb-20">
        <div className="wk-wrap">
          <Reveal immediate y={0} duration={0.6}>
            <p className="wk-eyebrow !text-white/70">고객센터</p>
          </Reveal>

          <Reveal immediate y={18} delay={0.08}>
            <h1 id="support-h" className="wk-h1 max-w-[16em] text-white">
              화면이 안 나오면 바로 연락 주십시오
            </h1>
          </Reveal>

          <Reveal immediate y={16} delay={0.18}>
            <p className="wk-lead mt-6 !text-white/85">
              전화를 주셔도 되고, 아래 접수 폼에 증상만 적어 주셔도 됩니다.
              화면을 찍은 사진이 한 장 있으면 원인 찾는 시간이 크게 줄어듭니다.
              먼저 원격으로 들여다보고, 모듈을 갈아야 하는 건이면 부품을 챙겨 나갑니다.
            </p>
          </Reveal>

          {contacts.length > 0 && (
            <Reveal immediate y={14} delay={0.28}>
              <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
                {contacts.map((c) => (
                  <div key={c.label}>
                    <dt className="flex items-center gap-2 text-caption text-white/60">
                      <c.icon size={15} className="shrink-0" aria-hidden="true" />
                      {c.label}
                    </dt>
                    <dd className="mt-1 text-body font-semibold text-white">
                      {c.href ? (
                        <Link href={c.href} className="underline-offset-4 hover:underline">
                          {c.value}
                        </Link>
                      ) : (
                        c.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
