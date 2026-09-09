import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo/site'

/**
 * 비공개 경로 — 어느 크롤러에도 열지 않는다.
 *
 * 🔴 2026-09-09 정정 — 예전에는 `*` 규칙에만 disallow 가 있고 GPTBot·ClaudeBot 등
 *    명시 규칙에는 `allow: '/'` 만 있었다. robots.txt 는 **가장 구체적인 User-agent 블록 하나만**
 *    적용되므로, 이름이 적힌 LLM 크롤러들은 `*` 의 disallow 를 물려받지 않고 /api/ 와 /admin/ 까지
 *    긁어도 되는 상태였다. 명시 크롤러에도 같은 차단 목록을 붙인다.
 */
const DISALLOW = [
  '/api/',        // 리드 저장·조회 엔드포인트. 색인 대상이 아니다
  '/admin/',      // 미배포지만 열어둘 이유가 없다
  '/quote/status', // 견적 조회(개인 문의 내용). 라우트가 생기기 전에 미리 막아 둔다
]

const LLM_AGENTS = [
  'GPTBot', 'ChatGPT-User', 'OAI-SearchBot',
  'PerplexityBot', 'Perplexity-User',
  'ClaudeBot', 'Claude-Web',
  'Google-Extended', 'Applebot-Extended',
  'CCBot',
]

// 네이버(Yeti)·다음(Daum) — 국내 검색 유입의 대부분이 여기서 온다
const KR_AGENTS = ['Yeti', 'Daum']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 모든 일반 크롤러 — 비공개 경로만 차단
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      // 명시적 AEO 친화 — 주요 LLM 크롤러. 차단 목록은 동일하게 적용한다
      ...LLM_AGENTS.map((userAgent) => ({ userAgent, allow: '/', disallow: DISALLOW })),
      ...KR_AGENTS.map((userAgent) => ({ userAgent, allow: '/', disallow: DISALLOW })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
