import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/seo/site'
import { getAllPosts } from '@/lib/blog'

export const dynamic = 'force-static'
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`,         lastModified: now, changeFrequency: 'weekly',  priority: 1 },
    { url: `${base}/about`,    lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/quote`,    lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/faq`,      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog`,     lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${base}/privacy`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]

  const posts = await getAllPosts()
  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticEntries, ...blogEntries]
}
