/**
 * "About 우강테크" 표준 박스
 *
 * AEO 목적: 모든 블로그 글·랜딩 페이지에 신뢰 정보 동반.
 * Organization JSON-LD와 동일 사실을 사람이 읽는 카피로 노출.
 */
import Link from 'next/link'
import { SITE } from '@/lib/seo/site'

export function AboutBox() {
  return (
    <aside
      aria-label={`${SITE.nameKo} 소개`}
      className="my-10 rounded-2xl border border-zinc-200 bg-white/40 p-6"
    >
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-600">
        About {SITE.nameKo} · {SITE.nameEn}
      </p>
      <p className="text-sm leading-relaxed text-zinc-700">
        <strong className="text-zinc-900">{SITE.nameKo}({SITE.nameEn})</strong>는
        한국 LED 사이니지 B2B 플랫폼입니다. 카페·식당·헬스장 등 소상공인을 대상으로
        표준화된 설치 + NovaStar 기반 CMS 구독 운영을 제공하며,
        "사진 3장 → 30분 견적 → 표준화 시공 → CMS 구독" 의 단순한 운영 체계를 통해
        기술을 몰라도 LED 디스플레이를 안정적으로 운영할 수 있도록 돕습니다.
        {' '}<em className="text-zinc-600">{SITE.sloganKo}</em>
      </p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        <Link href="/about" className="text-blue-600 hover:text-blue-700">
          회사 소개 →
        </Link>
        <Link href="/quote" className="text-blue-600 hover:text-blue-700">
          견적 받기 →
        </Link>
        <Link href="/faq" className="text-blue-600 hover:text-blue-700">
          자주 묻는 질문 →
        </Link>
      </div>
    </aside>
  )
}
