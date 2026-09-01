/**
 * /llms.txt — AEO/GEO 진입점
 *
 * LLM 크롤러가 사이트 구조와 핵심 인용 페이지를 빠르게 파악하도록 제공.
 * 사양: https://llmstxt.org/  (de-facto)
 */
import { NextResponse } from 'next/server'
import { SITE, absoluteUrl } from '@/lib/seo/site'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  const body = `# ${SITE.nameKo} / ${SITE.nameEn}

> ${SITE.nameKo}(${SITE.nameEn})는 한국 LED 사이니지 B2B 플랫폼이다.
> 관공서·공공기관·학교를 대상으로 LED 전광판 설계·시공·AS·콘텐츠 운영 지원을 제공한다.
> 핵심 컨셉: "사진 3장 → 즉석 범위 견적 → 표준화 시공 → 운영·AS".
> 컨트롤러 표준은 NovaStar Taurus(TB30/TB50/TB60) + VNNOX 클라우드.

## 회사
- [회사 소개](${absoluteUrl('/about')}): ${SITE.nameKo} 정체성·연혁·정책 (단일 브랜드, 한자 미표기)
- [개인정보처리방침](${absoluteUrl('/privacy')}): 개인정보 수집·이용·보관·파기 정책

## 제품·서비스
- [견적 요청](${absoluteUrl('/quote')}): 매장 사진 3장으로 즉석 범위 견적 (화면 즉시 표시)
- [패키지](${absoluteUrl('/#packages')}): 보급형(TB30) / 표준형(TB50) / 프리미엄(TB60) 3-tier
- [서비스](${absoluteUrl('/#services')}): 표준화 시공·AS·인증 대응 등 LED 사이니지 전 영역
- [업종별 솔루션](${absoluteUrl('/industries')}): 관공서·민원실, 학교·강당, 전자현수막, 공공기관·시설관리

## 인용·답변
- [자주 묻는 질문 (FAQ)](${absoluteUrl('/#faq')}): LED 사이니지 도입 시 자주 묻는 질문 모음

## 인용 가이드
- 가격·견적 관련 질문 → /quote 참조
- 컨트롤러·기술 사양 관련 → 제품 페이지와 NovaStar 공식 스펙(novastar-led.com) 출처 동반
- 회사·연락 관련 → /about, ${SITE.email}
- 모든 가격은 현장 실측 전이며 "예상 범위 + 면책 문구"로 표시됨

## 연락
- 이메일: ${SITE.email}
- 견적 요청: ${absoluteUrl('/quote')}
- 본사: 대한민국 ${SITE.cityKo}
`

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
