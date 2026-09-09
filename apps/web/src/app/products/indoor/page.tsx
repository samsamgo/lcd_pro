import type { Metadata } from 'next'

import { ProductsPageBody } from '@/components/products/ProductsPageBody'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '실내용 LED 전광판',
  description:
    '민원실·로비·회의실처럼 가까이서 보는 자리에 들어가는 실내용 LED 전광판 시리즈. 화소 간격별 전체 규격을 공개합니다.',
  path: '/products/indoor',
})

/** /products 와 같은 화면. 실내용 필터가 미리 걸린 주소일 뿐이다(CEO 2026-09-09). */
export default function Page() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-products-indoor"
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '제품', url: absoluteUrl('/products') },
          { name: '실내용', url: absoluteUrl('/products/indoor') },
        ])}
      />
      <ProductsPageBody
        env="indoor"
        title="실내용 LED 전광판"
        lead="민원실·로비·회의실처럼 가까이서 보는 자리. 가까울수록 화소 간격을 좁게 잡습니다."
        current="/products/indoor"
      />
    </>
  )
}
