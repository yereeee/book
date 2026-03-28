import { BookWithRelations } from '@/types'
import { BookRow } from './BookRow'

interface BookListViewProps {
  books: BookWithRelations[]
  onBookClick: (book: BookWithRelations) => void
}

export function BookListView({ books, onBookClick }: BookListViewProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
        <span className="text-5xl">📚</span>
        <p className="text-sm">해당하는 도서가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {books.map((book) => (
        <BookRow key={book.id} book={book} onClick={() => onBookClick(book)} />
      ))}
    </div>
  )
}
