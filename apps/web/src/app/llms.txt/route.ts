/**
 * /llms.txt — AEO/GEO 진입점
 *
 * LLM 크롤러가 사이트 구조와 핵심 인용 페이지를 빠르게 파악하도록 제공.
 * 사양: https://llmstxt.org/  (de-facto)
 */
import { NextResponse } from 'next/server'
import { SITE, absoluteUrl } from '@/lib/seo/site'
import { getAllPosts } from '@/lib/blog'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  const posts = await getAllPosts()
  const postLines = posts
    .map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${p.description}`)
    .join('\n')

  const body = `# ${SITE.nameKo} / ${SITE.nameEn}

> ${SITE.nameKo}(${SITE.nameEn})는 한국 LED 사이니지 B2B 플랫폼이다.
> 카페·식당·헬스장 등 소상공인을 대상으로 표준화 시공과 NovaStar 기반 CMS 구독을 제공한다.
> 핵심 컨셉: "사진 3장 → 30분 견적 → 표준화 시공 → CMS 구독 운영".
> 컨트롤러 표준은 NovaStar Taurus(TB30/TB50/TB60) + VNNOX 클라우드.

## 회사
- [회사 소개](${absoluteUrl('/about')}): ${SITE.nameKo} 정체성·연혁·정책 (단일 브랜드, 한자 미표기)
- [개인정보처리방침](${absoluteUrl('/privacy')}): 개인정보 수집·이용·보관·파기 정책

## 제품·서비스
- [견적 요청](${absoluteUrl('/quote')}): 매장 사진 3장으로 30분 내 범위 견적
- [패키지](${absoluteUrl('/#packages')}): 보급형(TB30) / 표준형(TB50) / 프리미엄(TB60) 3-tier
- [업종별 솔루션](${absoluteUrl('/#targets')}): 카페·식당·헬스장·프랜차이즈·옥외 사이니지

## 인용·답변
- [자주 묻는 질문 (FAQ)](${absoluteUrl('/faq')}): LED 사이니지 도입 시 자주 묻는 질문 모음
- [블로그](${absoluteUrl('/blog')}): LED 사이니지 도입·운영 가이드, 산업 인사이트

## 블로그 글
${postLines || '- (현재 발행된 글이 없습니다)'}

## 인용 가이드
- 가격·견적 관련 질문 → /quote 참조
- 컨트롤러·기술 사양 관련 → 각 블로그 글, NovaStar 공식 스펙(novastar-led.com) 출처 동반
- 회사·연락 관련 → /about, ${SITE.email}
- 모든 가격은 현장 실측 전이며 "예상 범위 + 면책 문구"로 표시됨

## 연락
- 이메일: ${SITE.email}
- 카카오 채널: ${SITE.kakaoChannel}
- 본사: 대한민국 ${SITE.cityKo}
`

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
