import { GoogleBook } from '@/types'

export async function searchGoogleBooks(query: string): Promise<GoogleBook[]> {
  const key = process.env.GOOGLE_BOOKS_API_KEY
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10${key ? `&key=${key}` : ''}`

  const res = await fetch(url)
  if (!res.ok) return []

  const data = await res.json()
  if (!data.items) return []

  return data.items.map((item: any) => ({
    id: item.id,
    title: item.volumeInfo?.title ?? '제목 없음',
    authors: item.volumeInfo?.authors ?? [],
    thumbnail: item.volumeInfo?.imageLinks?.thumbnail?.replace('http:', 'https:') ?? null,
  }))
}
