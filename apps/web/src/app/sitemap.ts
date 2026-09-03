import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo/site'

export const dynamic = 'force-static'
export const revalidate = 3600

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`,         lastModified: now, changeFrequency: 'weekly',  priority: 1 },



    { url: `${base}/products`,  lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/services`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/industries`,lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`,     lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/faq`,      lastModified: now, changeFrequency: 'monthly', priority: 0.6 },

    { url: `${base}/quote`,    lastModified: now, changeFrequency: 'monthly', priority: 0.9 },

    { url: `${base}/privacy`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]

  // 업종 상세는 별도 라우트 없이 /industries 모달로 표시한다
  return staticEntries
}
