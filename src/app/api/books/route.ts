import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const statusId = searchParams.get('status_id')
  const categoryIds = searchParams.getAll('category_ids')

  let query = supabase
    .from('books')
    .select(`
      *,
      status:statuses(*),
      book_categories(category:categories(*))
    `)
    .order('created_at')

  if (q) {
    query = query.or(`title.ilike.%${q}%,author.ilike.%${q}%`)
  }
  if (statusId) {
    query = query.eq('status_id', statusId)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const books = data.map((book: any) => ({
    ...book,
    categories: book.book_categories?.map((bc: any) => bc.category) ?? [],
    book_categories: undefined,
  }))

  // 카테고리 필터는 클라이언트에서 받은 후 메모리에서 처리
  const filtered = categoryIds.length > 0
    ? books.filter((b: any) => categoryIds.every((cid) => b.categories.some((c: any) => c.id === cid)))
    : books

  return NextResponse.json(filtered)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { data: book, error } = await supabase
    .from('books')
    .insert({
      title: body.title,
      author: body.author ?? null,
      cover_image_url: body.cover_image_url ?? null,
      status_id: body.status_id ?? null,
      note: body.note ?? null,
      pos_x: body.pos_x ?? null,
      pos_y: body.pos_y ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (body.category_ids?.length) {
    const rows = body.category_ids.map((cid: string) => ({ book_id: book.id, category_id: cid }))
    await supabase.from('book_categories').insert(rows)
  }

  return NextResponse.json(book, { status: 201 })
}
