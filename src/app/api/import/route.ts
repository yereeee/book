import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { statuses = [], categories = [], books = [] } = body

  // statuses 삽입 (중복 id는 skip)
  if (statuses.length) {
    await supabase.from('statuses').upsert(
      statuses.map(({ id, name, color, created_at }: any) => ({ id, name, color, created_at })),
      { onConflict: 'id', ignoreDuplicates: true }
    )
  }

  // categories 삽입
  if (categories.length) {
    await supabase.from('categories').upsert(
      categories.map(({ id, name, color, created_at }: any) => ({ id, name, color, created_at })),
      { onConflict: 'id', ignoreDuplicates: true }
    )
  }

  // books 삽입
  for (const book of books) {
    const { categories: bookCategories, book_categories, ...bookFields } = book

    const { error } = await supabase
      .from('books')
      .upsert(bookFields, { onConflict: 'id', ignoreDuplicates: true })

    if (!error && bookCategories?.length) {
      const rows = bookCategories.map((c: any) => ({ book_id: book.id, category_id: c.id }))
      await supabase.from('book_categories').upsert(rows, { onConflict: 'book_id,category_id', ignoreDuplicates: true })
    }
  }

  return NextResponse.json({ message: '가져오기 완료' })
}
