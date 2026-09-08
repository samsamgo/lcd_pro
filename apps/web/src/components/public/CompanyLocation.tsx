import { Reveal, RiseMask } from '@/components/motion'
import { SITE } from '@/lib/seo/site'

/**
 * 회사 위치.
 *
 * 주소가 없거나 모호하면 실체가 없는 업체로 읽힌다(벤치마크 §8.1-6).
 * 지도는 API 키가 필요 없는 임베드를 lazy 로 붙이고,
 * 컨테이너에 고정 aspect-ratio 를 줘서 로드 전후 레이아웃이 밀리지 않게 한다(CLS 0).
 *
 * 🔴 2026-09-07 접점 정리 — 이 카드에서 '연락처' 행을 뺐다. 바로 다음 섹션인
 *    AboutContact 가 전화·이메일·문의 폼을 전부 갖는다. 같은 페이지에서 전화번호를
 *    두 번 보여 줄 이유가 없다. 이 카드는 '장소 정보'(주소·업무시간·길찾기)만 맡는다.
 */
export function CompanyLocation({ hideHeading = false }: { hideHeading?: boolean } = {}) {
  const q = encodeURIComponent(SITE.addressFull)
  const naver = `https://map.naver.com/p/search/${q}`
  const kakao = `https://map.kakao.com/?q=${q}`
  const embed = `https://maps.google.com/maps?q=${q}&hl=ko&z=16&output=embed`

  return (
    <section id="location" className={`bg-white ${hideHeading ? "wk-sec-sm pt-0 md:pt-0 lg:pt-0" : "wk-sec"}`}>
      <div className="wk-wrap">
        {/* 2026-09-07(4차) 섹션 머리를 계약서 §4 3박자로 맞췄다.
            🔴 RiseMask 를 Reveal 안에 넣지 않는다 — 부모가 움직이는 중에 마스크를 올리면
               둘 다 안 읽힌다(구조정본 §16-D). 제목은 Reveal 밖 형제로 꺼낸다. */}
        {!hideHeading && (
          <>
            <Reveal y={10} duration={0.6}>
              <p className="wk-eyebrow">회사소개</p>
            </Reveal>
            <h2 className="wk-h2 text-wk-ink">
              <RiseMask delay={0.06}>오시는 길</RiseMask>
            </h2>
          </>
        )}

        <div className={`grid gap-5 lg:grid-cols-12 lg:gap-8 ${hideHeading ? '' : 'mt-10'}`}>
          <Reveal className="lg:col-span-7" y={18}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-card-m bg-wk-bg sm:rounded-card">
              <iframe
                src={embed}
                title={`${SITE.legalName} 위치 지도`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5" y={18} delay={0.08}>
            <div className="h-full rounded-card-m bg-wk-bgFaint px-5 shadow-wk-1 sm:rounded-card sm:px-7">
              <div className="wk-row items-start">
                <span className="w-20 shrink-0 pt-0.5 text-label font-medium text-wk-ink3">주소</span>
                <span className="flex-1 text-label font-semibold text-wk-ink">
                  {SITE.addressFull}
                </span>
              </div>
              <div className="wk-row items-start">
                <span className="w-20 shrink-0 pt-0.5 text-label font-medium text-wk-ink3">업무시간</span>
                <span className="flex-1 text-label font-semibold text-wk-ink">
                  {SITE.openingHours}
                </span>
              </div>
              <div className="py-6">
                <p className="wk-cap">길찾기</p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <a href={naver} target="_blank" rel="noreferrer" className="wk-btn-w">
                    네이버 지도
                  </a>
                  <a href={kakao} target="_blank" rel="noreferrer" className="wk-btn-w">
                    카카오맵
                  </a>
                </div>
                <p className="wk-cap mt-4">
                  방문 전 담당자에게 연락 주십시오.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
