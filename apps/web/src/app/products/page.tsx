import type { Metadata } from 'next'

import { ProductsPageBody } from '@/components/products/ProductsPageBody'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { SITE, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '제품',
  description:
    'LED 전광판 시리즈 12종 전체. 실내용·실외용으로 걸러 보실 수 있고, 화소 간격별 전체 규격을 표로 공개합니다.',
  path: '/products',
})

/**
 * /products — **전 제품 한 페이지.**
 *
 * 🔴 2026-09-09 CEO 지시 "제품 저렇게 잡다하게 해놓지 말고 그냥 전 제품 다 꺼내 놓고
 *    필터로 실내용/실외용만 구분 가능하게끔만 해줘. 이상한 거 다 지우고."
 *    걷어낸 것 — 실내/실외 입구 타일(ProductEntryTiles) · 카테고리 6장(ProductCategoryGrid) ·
 *    구조 소개(StructureShowcase) · '고르는 기준' · '이 자리에 맞는 모델' · '쓰이는 자리' ·
 *    규격 요약 4칸. 되살리지 마라.
 */
export default function ProductsPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-products"
        data={breadcrumbLd([
          { name: '홈', url: SITE.url + '/' },
          { name: '제품', url: SITE.url + '/products' },
        ])}
      />
      <ProductsPageBody
        env="all"
        title="제품"
        lead="전 시리즈 12종입니다. 실내용·실외용으로 걸러 보시고, 시리즈를 누르면 화소 간격별 전체 규격이 나옵니다."
        current="/products"
      />
    </>
  )
}
