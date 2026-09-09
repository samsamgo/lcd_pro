import Image from 'next/image'

import { Stagger } from '@/components/motion'
import { CREDENTIALS, certThumb } from '@/lib/credentials'

/**
 * 인증·서류 갤러리 — `/about/certification`.
 *
 * 🔴 2026-09-09 CEO 지시 "KC 인증서 PDF 있으니 다른 회사처럼 보여줘라."
 *    온빛전자 인증서 페이지(스캔 이미지 격자 + 캡션)를 그대로 따랐다. 원색 배지·아이콘이 아니라
 *    **스캔본 그 자체**를 건다. 담당자가 확인하는 것은 로고가 아니라 도장 찍힌 종이다.
 *
 * 동작 — 썸네일을 격자에 깔기만 한다. 🔴 2026-09-09 CEO "마우스 올리면 효과는 있어도 인증서 크게
 *        보이는 효과는 없애라" — 라이트박스(클릭 확대)를 걷어냈다. 되살리지 마라.
 *        PDF 게시도 하지 않는다(CEO 2026-09-09 "민감한 정보 올리지 마라").
 *
 * 🔴 2026-09-09 CEO "설명들 다 지우고 제목만 남겨 — '방송통신기자재등의 적합등록증' 여기까지만."
 *    카드·라이트박스 모두 **스캔 이미지 + title 한 줄**이 전부다.
 *
 * ⚠️ 서류가 아닌 것을 이 격자에 섞지 마라. 여기 걸린 것은 전부 발급기관 직인이 있는 원본이다.
 * ⚠️ 개수를 세어 자랑하지 않는다("8종" 금지). 세는 순간 숫자가 작다는 사실만 남는다.
 */
export function CertGallery() {
  return (
      <Stagger
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        y={18}
        gap={0.06}
      >
        {CREDENTIALS.map((c) => (
          <article
            key={c.key}
            className="wk-hov-card flex h-full flex-col overflow-hidden rounded-card border border-wk-line bg-white"
          >
            <div className="group relative block aspect-[1/1.414] w-full overflow-hidden bg-wk-bgFaint">
              <Image
                src={certThumb(c.key)}
                alt={`${c.title} 스캔본`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 300px"
                className="object-contain p-2"
              />
            </div>

            {/* 🔴 2026-09-09 CEO "설명들 다 지우고 제목만 남겨."
                subject·번호·발급기관·날짜·유효기간은 화면에서 뺐다. 데이터(`lib/credentials.ts`)는
                다른 곳에서 사실 근거로 쓰므로 유지한다. 여기 다시 붙이지 마라. */}
            <div className="flex flex-1 flex-col border-t border-wk-line px-5 py-5">
              <h3 className="text-body font-semibold leading-snug text-wk-ink">{c.title}</h3>
            </div>
          </article>
        ))}
      </Stagger>
  )
}
