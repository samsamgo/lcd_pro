/**
 * 블로그 글 스키마
 * 추후 MDX(content/blog/*.mdx) 마이그레이션 시 동일 인터페이스 유지.
 */

export interface FaqItem {
  question: string
  answer: string
}

export interface BlogPost {
  /** URL slug (kebab-case) */
  slug: string
  title: string
  description: string
  /** 본문 — 단일 문자열 markdown. MDX 마이그레이션 전 임시 */
  body: string
  category: string
  tags: string[]
  /** ISO 8601 */
  publishedAt: string
  updatedAt?: string
  author: string
  ogImage?: string
  faq?: FaqItem[]
  /** 첫 문단 정의문 (AEO) */
  definition?: string
  /** TL;DR 포인트 */
  tldr?: string[]
}
