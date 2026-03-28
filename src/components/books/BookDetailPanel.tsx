'use client'

import { useState } from 'react'
import { BookWithRelations, Status, Category } from '@/types'
import { StatusBadge } from '@/components/statuses/StatusBadge'
import { CategoryBadge } from '@/components/categories/CategoryBadge'
import { Button } from '@/components/ui/Button'
import { BookForm } from './BookForm'
import { BookDeleteDialog } from './BookDeleteDialog'
import { X, Pencil, Trash2 } from 'lucide-react'

interface BookDetailPanelProps {
  book: BookWithRelations
  statuses: Status[]
  categories: Category[]
  onClose: () => void
  onRefresh: () => void
}

export function BookDetailPanel({ book, statuses, categories, onClose, onRefresh }: BookDetailPanelProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(false)
  const [note, setNote] = useState(book.note ?? '')

  async function handleDelete() {
    await fetch(`/api/books/${book.id}`, { method: 'DELETE' })
    onRefresh()
    onClose()
  }

  async function saveNote() {
    await fetch(`/api/books/${book.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    })
    setEditingNote(false)
    onRefresh()
  }

  return (
    <>
      <aside className="w-64 flex-shrink-0 border-l border-gray-200 bg-white flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">상세</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {book.cover_image_url ? (
            <img src={book.cover_image_url} alt={book.title} className="w-full max-h-52 object-contain rounded-lg shadow" />
          ) : (
            <div className="w-full h-40 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center text-5xl">📖</div>
          )}

          <div>
            <h2 className="text-sm font-semibold text-gray-800 leading-snug">{book.title}</h2>
            {book.author && <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>}
          </div>

          {book.status && (
            <div>
              <p className="text-xs text-gray-400 mb-1">상태</p>
              <StatusBadge name={book.status.name} color={book.status.color} />
            </div>
          )}

          {book.categories.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1">카테고리</p>
              <div className="flex flex-wrap gap-1">
                {book.categories.map((c) => (
                  <CategoryBadge key={c.id} name={c.name} color={c.color} />
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-400">메모</p>
              {!editingNote && (
                <button onClick={() => setEditingNote(true)} className="text-gray-400 hover:text-gray-600">
                  <Pencil size={11} />
                </button>
              )}
            </div>
            {editingNote ? (
              <div className="space-y-2">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  autoFocus
                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-1 justify-end">
                  <Button size="sm" variant="secondary" onClick={() => { setNote(book.note ?? ''); setEditingNote(false) }}>취소</Button>
                  <Button size="sm" onClick={saveNote}>저장</Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-600 whitespace-pre-wrap min-h-[2rem]">
                {note || <span className="text-gray-300">메모 없음</span>}
              </p>
            )}
          </div>
        </div>

        <div className="mt-auto px-4 py-3 border-t border-gray-100 flex gap-2">
          <Button size="sm" variant="secondary" className="flex-1" onClick={() => setEditOpen(true)}>
            <Pencil size={12} className="mr-1" /> 수정
          </Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteOpen(true)}>
            <Trash2 size={12} />
          </Button>
        </div>
      </aside>

      <BookForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={() => { setEditOpen(false); onRefresh() }}
        statuses={statuses}
        categories={categories}
        initial={book}
      />
      <BookDeleteDialog
        open={deleteOpen}
        bookTitle={book.title}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  )
}
