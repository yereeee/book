import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const [{ data: statuses }, { data: categories }, { data: books }] = await Promise.all([
    supabase.from('statuses').select('*').order('created_at'),
    supabase.from('categories').select('*').order('created_at'),
    supabase.from('books').select('*, book_categories(category:categories(*))').order('created_at'),
  ])

  const payload = {
    exported_at: new Date().toISOString(),
    statuses: statuses ?? [],
    categories: categories ?? [],
    books: (books ?? []).map((b: any) => ({
      ...b,
      categories: b.book_categories?.map((bc: any) => bc.category) ?? [],
      book_categories: undefined,
    })),
  }

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="books-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  })
}
