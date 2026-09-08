import type { Metadata } from 'next'
import { ProductCategoryPage } from '@/components/products/ProductCategoryPage'
import { getCategory } from '@/lib/productCategories'
import { buildMetadata } from '@/lib/seo/site'

export const dynamic = 'force-static'
const category = getCategory('banner')!

export const metadata: Metadata = buildMetadata({
  title: category.name,
  description: category.lead,
  path: '/products/banner',
})

export default function Page() {
  return <ProductCategoryPage category={category} />
}
