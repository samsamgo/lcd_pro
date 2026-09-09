import type { Metadata } from 'next'

import { ProductsPageBody } from '@/components/products/ProductsPageBody'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbLd } from '@/lib/seo/jsonld'
import { absoluteUrl, buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: '실외용 LED 전광판 — 정문·도로변·외벽 설치',
  description:
    '정문·도로변·건물 외벽처럼 밖에서 보는 자리에 들어가는 실외용 LED 전광판 시리즈입니다. 화소 간격별 전체 규격과 방수·방진 등급을 표로 공개하고, 현장 조건에 맞춰 규격을 잡아 드립니다.',
  path: '/products/outdoor',
})

/** /products 와 같은 화면. 실외용 필터가 미리 걸린 주소일 뿐이다(CEO 2026-09-09). */
export default function Page() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-products-outdoor"
        data={breadcrumbLd([
          { name: '홈', url: absoluteUrl('/') },
          { name: '제품', url: absoluteUrl('/products') },
          { name: '실외용', url: absoluteUrl('/products/outdoor') },
        ])}
      />
      <ProductsPageBody
        env="outdoor"
        title="실외용 LED 전광판"
        lead="정문·도로변·건물 외벽처럼 밖에서 보는 자리. 멀리서 읽을수록 화면을 키우고 간격을 넓힙니다."
      />
    </>
  )
}
