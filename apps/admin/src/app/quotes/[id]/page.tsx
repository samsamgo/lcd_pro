import { adminDb } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { QuoteDetailClient } from './QuoteDetailClient'
import { MarginCalculator } from './MarginCalculator'

async function getQuoteDetail(id: string) {
  const { data: quote } = await adminDb
    .from('quotes')
    .select(`
      *,
      customers (*),
      quote_photos (id, storage_path, file_name, sort_order),
      quote_items (
        *,
        products (*),
        packages (*)
      )
    `)
    .eq('id', id)
    .single()

  return quote
}

async function getProducts() {
  const { data } = await adminDb
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return data ?? []
}

export default async function QuoteDetailPage({ params }: { params: { id: string } }) {
  const [quote, products] = await Promise.all([
    getQuoteDetail(params.id),
    getProducts(),
  ])

  if (!quote) notFound()

  return (
    <div>
      <QuoteDetailClient quote={quote} products={products} />
      <div className="px-6 pb-6">
        <MarginCalculator products={products} />
      </div>
    </div>
  )
}
