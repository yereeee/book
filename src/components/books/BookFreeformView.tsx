'use client'

import { BookWithRelations } from '@/types'
import { BookIcon } from './BookIcon'

interface BookFreeformViewProps {
  books: BookWithRelations[]
  onBookClick: (book: BookWithRelations) => void
  onRefresh: () => void
}

export function BookFreeformView({ books, onBookClick, onRefresh }: BookFreeformViewProps) {
  async function handlePositionChange(id: string, x: number, y: number) {
    await fetch(`/api/books/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pos_x: x, pos_y: y }),
    })
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
        <span className="text-5xl">📚</span>
        <p className="text-sm">도서 추가 버튼으로 첫 번째 책을 기록해보세요.</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full min-h-[600px]">
      {books.map((book) => (
        <BookIcon
          key={book.id}
          book={book}
          onClick={() => onBookClick(book)}
          onPositionChange={handlePositionChange}
        />
      ))}
    </div>
  )
}
