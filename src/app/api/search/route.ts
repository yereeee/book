import { searchGoogleBooks } from '@/lib/google-books'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q) return NextResponse.json({ error: 'q 파라미터가 필요합니다.' }, { status: 400 })

  const results = await searchGoogleBooks(q)
  return NextResponse.json(results)
}
