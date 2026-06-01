import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 모든 일반 크롤러 — 전체 허용 (어드민·API만 차단)
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
      // 명시적 AEO 친화 — 주요 LLM 크롤러
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Perplexity-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      // 네이버·다음
      { userAgent: 'Yeti', allow: '/' },
      { userAgent: 'Daum', allow: '/' },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
