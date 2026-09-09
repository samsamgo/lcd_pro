import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo/site'
import { PRODUCT_MODELS } from '@/lib/productModels'

export const dynamic = 'force-static'
export const revalidate = 3600

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`,         lastModified: now, changeFrequency: 'weekly',  priority: 1 },



    /* 🔴 2026-09-09 — 제품은 /products 한 페이지로 합쳤다. indoor·outdoor 는 필터가 미리 걸린
       같은 화면이라 색인 가치가 있고, banner/facade/sports/traffic 은 라우트째 삭제해
       next.config.mjs 에서 /products 로 301 한다(사이트맵에 넣지 마라). */
    { url: `${base}/products`,          lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/products/indoor`,   lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/products/outdoor`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/products/specs`,    lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/industries`,lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`,     lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/about/certification`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/support`,           lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/support/notice`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: `${base}/support/faq`,       lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/support/downloads`, lastModified: now, changeFrequency: 'weekly',  priority: 0.5 },

    { url: `${base}/quote`,    lastModified: now, changeFrequency: 'monthly', priority: 0.9 },

    { url: `${base}/privacy`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]

  // 시리즈 상세 12종 — 규격표가 실린 실제 콘텐츠 페이지다
  const modelEntries: MetadataRoute.Sitemap = PRODUCT_MODELS.map((m) => ({
    url: `${base}/products/models/${m.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // 업종 상세는 별도 라우트 없이 /industries 모달로 표시한다
  return [...staticEntries, ...modelEntries]
}
