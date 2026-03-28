'use client'

import { useState } from 'react'
import { BookWithRelations, Status, Category } from '@/types'
import { StatusBadge } from '@/components/statuses/StatusBadge'
import { CategoryBadge } from '@/components/categories/CategoryBadge'
import { Button } from '@/components/ui/Button'
import { BookForm } from './BookForm'
import { BookDeleteDialog } from './BookDeleteDialog'
import { X, Pencil, Trash2 } from 'lucide-react'

const COVER_GRADIENTS = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a18cd1', '#fbc2eb'],
  ['#fccb90', '#d57eeb'],
  ['#a1c4fd', '#c2e9fb'],
]

function getCoverGradient(title: string) {
  const idx = title.charCodeAt(0) % COVER_GRADIENTS.length
  return COVER_GRADIENTS[idx]
}

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
      <aside className="w-64 flex-shrink-0 border-l border-[#d0d0d0] bg-[#f5f5f5] flex flex-col overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#d8d8d8] bg-[#ececec]">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Inspector</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 w-5 h-5 flex items-center justify-center rounded hover:bg-black/10 transition-colors"
          >
            <X size={13} />
          </button>
        </div>

        {/* 표지 */}
        <div className="p-4 flex flex-col items-center border-b border-[#d8d8d8]">
          {book.cover_image_url ? (
            <img
              src={book.cover_image_url}
              alt={book.title}
              className="w-32 rounded-lg shadow-lg object-cover"
            />
          ) : (
            <div
              className="w-32 h-44 rounded-lg shadow-lg flex flex-col justify-end p-3"
              style={{ background: `linear-gradient(160deg, ${getCoverGradient(book.title)[0]}, ${getCoverGradient(book.title)[1]})` }}
            >
              <p className="text-white text-[11px] font-semibold leading-tight line-clamp-3 opacity-90">
                {book.title}
              </p>
              {book.author && (
                <p className="text-white/60 text-[9px] mt-1 truncate">{book.author}</p>
              )}
            </div>
          )}
        </div>

        {/* 제목/저자 */}
        <div className="px-4 py-3 border-b border-[#d8d8d8]">
          <h2 className="text-[15px] font-semibold text-gray-900 leading-snug">{book.title}</h2>
          {book.author && <p className="text-[12px] text-gray-500 mt-0.5">{book.author}</p>}
        </div>

        {/* 상태 & 카테고리 */}
        <div className="px-4 py-3 space-y-3 border-b border-[#d8d8d8]">
          {book.status && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">상태</p>
              <StatusBadge name={book.status.name} color={book.status.color} />
            </div>
          )}
          {book.categories.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">카테고리</p>
              <div className="flex flex-wrap gap-1">
                {book.categories.map((c) => (
                  <CategoryBadge key={c.id} name={c.name} color={c.color} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 메모 */}
        <div className="px-4 py-3 flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">메모</p>
            {!editingNote && (
              <button
                onClick={() => setEditingNote(true)}
                className="text-gray-400 hover:text-gray-600 w-5 h-5 flex items-center justify-center rounded hover:bg-black/10 transition-colors"
              >
                <Pencil size={11} />
              </button>
            )}
          </div>
          {editingNote ? (
            <div className="space-y-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
                autoFocus
                className="w-full px-3 py-2 bg-white border border-[#c8c8c8] rounded-lg text-[12px] resize-none focus:outline-none focus:ring-1 focus:ring-[#0064D2] shadow-inner"
              />
              <div className="flex gap-1 justify-end">
                <Button size="sm" variant="secondary" onClick={() => { setNote(book.note ?? ''); setEditingNote(false) }}>취소</Button>
                <Button size="sm" onClick={saveNote}>저장</Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg px-3 py-2.5 shadow-inner min-h-[5rem]">
              <p className="text-[12px] text-gray-600 whitespace-pre-wrap">
                {note || <span className="text-gray-300">메모 없음</span>}
              </p>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="px-4 py-3 border-t border-[#d0d0d0] flex gap-2">
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
