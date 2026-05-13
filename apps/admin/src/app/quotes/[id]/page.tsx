import { adminDb } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { QuoteDetailClient } from './QuoteDetailClient'
import { MarginCalculator } from './MarginCalculator'

// 사진 미리보기 signed URL 유효 시간 (초). 페이지 새로고침으로 갱신.
const PHOTO_SIGNED_URL_TTL = 60 * 60

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

async function signQuotePhotos(quote: any) {
  const photos: Array<{ id: string; storage_path: string; file_name: string; sort_order: number }> =
    quote?.quote_photos ?? []
  if (photos.length === 0) return quote

  const paths = photos.map((p) => p.storage_path)
  const { data: signed } = await adminDb.storage
    .from('quote-photos')
    .createSignedUrls(paths, PHOTO_SIGNED_URL_TTL)

  const urlByPath = new Map<string, string>()
  signed?.forEach((entry) => {
    if (entry.path && entry.signedUrl) urlByPath.set(entry.path, entry.signedUrl)
  })

  return {
    ...quote,
    quote_photos: photos.map((p) => ({ ...p, signed_url: urlByPath.get(p.storage_path) ?? null })),
  }
}

export default async function QuoteDetailPage({ params }: { params: { id: string } }) {
  const [rawQuote, products] = await Promise.all([
    getQuoteDetail(params.id),
    getProducts(),
  ])

  if (!rawQuote) notFound()

  const quote = await signQuotePhotos(rawQuote)

  return (
    <div>
      <QuoteDetailClient quote={quote} products={products} />
      <div className="px-6 pb-6">
        <MarginCalculator products={products} />
      </div>
    </div>
  )
}
