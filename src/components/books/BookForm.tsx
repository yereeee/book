'use client'

import { useState } from 'react'
import { BookWithRelations, Category, Status } from '@/types'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { BookSearch } from './BookSearch'
import { CategoryBadge } from '@/components/categories/CategoryBadge'

interface BookFormProps {
  open: boolean
  onClose: () => void
  onSave: () => void
  statuses: Status[]
  categories: Category[]
  initial?: BookWithRelations
}

export function BookForm({ open, onClose, onSave, statuses, categories, initial }: BookFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [author, setAuthor] = useState(initial?.author ?? '')
  const [coverUrl, setCoverUrl] = useState(initial?.cover_image_url ?? '')
  const [statusId, setStatusId] = useState(initial?.status_id ?? '')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    initial?.categories.map((c) => c.id) ?? []
  )
  const [note, setNote] = useState(initial?.note ?? '')
  const [loading, setLoading] = useState(false)

  function handleGoogleSelect(book: { title: string; authors: string[]; thumbnail: string | null }) {
    setTitle(book.title)
    setAuthor(book.authors.join(', '))
    setCoverUrl(book.thumbnail ?? '')
  }

  function toggleCategory(id: string) {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)

    const body = {
      title: title.trim(),
      author: author.trim() || null,
      cover_image_url: coverUrl.trim() || null,
      status_id: statusId || null,
      category_ids: selectedCategoryIds,
      note: note.trim() || null,
    }

    if (initial) {
      await fetch(`/api/books/${initial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } else {
      await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...body,
          pos_x: Math.floor(Math.random() * 600) + 40,
          pos_y: Math.floor(Math.random() * 400) + 40,
        }),
      })
    }

    setLoading(false)
    onSave()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} title={initial ? '도서 수정' : '도서 추가'} className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {!initial && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Google Books 검색</label>
            <BookSearch onSelect={handleGoogleSelect} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">제목 *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="책 제목" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">저자</label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="저자명" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">상태</label>
            <select
              value={statusId}
              onChange={(e) => setStatusId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">상태 없음</option>
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">표지 이미지 URL</label>
            <Input value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">카테고리</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCategory(c.id)}
                className={`transition-opacity ${selectedCategoryIds.includes(c.id) ? 'opacity-100 ring-2 ring-offset-1 ring-gray-400 rounded-full' : 'opacity-50'}`}
              >
                <CategoryBadge name={c.name} color={c.color} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">메모</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="독서 메모를 입력하세요..."
          />
        </div>

        <div className="flex gap-2 justify-end pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>취소</Button>
          <Button type="submit" disabled={loading}>{initial ? '저장' : '추가'}</Button>
        </div>
      </form>
    </Dialog>
  )
}
