import { BookWithRelations } from '@/types'
import { StatusBadge } from '@/components/statuses/StatusBadge'
import { CategoryBadge } from '@/components/categories/CategoryBadge'

interface BookRowProps {
  book: BookWithRelations
  onClick: () => void
}

export function BookRow({ book, onClick }: BookRowProps) {
  return (
    <div
      className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
      onClick={onClick}
    >
      {book.cover_image_url ? (
        <img src={book.cover_image_url} alt="" className="w-8 h-11 object-cover rounded flex-shrink-0 shadow-sm" />
      ) : (
        <div className="w-8 h-11 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center text-gray-400">📖</div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{book.title}</p>
        {book.author && <p className="text-xs text-gray-500 truncate">{book.author}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {book.status && <StatusBadge name={book.status.name} color={book.status.color} />}
        <div className="flex gap-1">
          {book.categories.map((c) => (
            <CategoryBadge key={c.id} name={c.name} color={c.color} />
          ))}
        </div>
      </div>
    </div>
  )
}
