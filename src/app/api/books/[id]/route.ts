import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { data, error } = await supabase
    .from('books')
    .select(`*, status:statuses(*), book_categories(category:categories(*))`)
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })

  return NextResponse.json({
    ...data,
    categories: data.book_categories?.map((bc: any) => bc.category) ?? [],
    book_categories: undefined,
  })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params
  const body = await request.json()

  const updateFields: Record<string, any> = {}
  if ('title' in body) updateFields.title = body.title
  if ('author' in body) updateFields.author = body.author
  if ('cover_image_url' in body) updateFields.cover_image_url = body.cover_image_url
  if ('status_id' in body) updateFields.status_id = body.status_id
  if ('note' in body) updateFields.note = body.note
  if ('pos_x' in body) updateFields.pos_x = body.pos_x
  if ('pos_y' in body) updateFields.pos_y = body.pos_y

  const { data, error } = await supabase
    .from('books')
    .update(updateFields)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 카테고리 업데이트
  if ('category_ids' in body) {
    await supabase.from('book_categories').delete().eq('book_id', id)
    if (body.category_ids?.length) {
      const rows = body.category_ids.map((cid: string) => ({ book_id: id, category_id: cid }))
      await supabase.from('book_categories').insert(rows)
    }
  }

  return NextResponse.json(data)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { error } = await supabase.from('books').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
