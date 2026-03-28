'use client'

import { useState } from 'react'
import { Category } from '@/types'
import { CategoryBadge } from './CategoryBadge'
import { CategoryForm } from './CategoryForm'
import { Button } from '@/components/ui/Button'
import { Pencil, Trash2 } from 'lucide-react'

interface CategoryManagerProps {
  categories: Category[]
  onChange: () => void
}

export function CategoryManager({ categories, onChange }: CategoryManagerProps) {
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function handleAdd(name: string, color: string) {
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    })
    setAdding(false)
    onChange()
  }

  async function handleEdit(id: string, name: string, color: string) {
    await fetch(`/api/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    })
    setEditingId(null)
    onChange()
  }

  async function handleDelete(id: string) {
    if (!confirm('이 카테고리를 삭제하면 해당 카테고리가 지정된 도서에서 제거됩니다. 계속할까요?')) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    onChange()
  }

  return (
    <div className="space-y-2">
      {categories.map((c) =>
        editingId === c.id ? (
          <CategoryForm
            key={c.id}
            initial={c}
            onSubmit={(name, color) => handleEdit(c.id, name, color)}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div key={c.id} className="flex items-center gap-2 py-1">
            <CategoryBadge name={c.name} color={c.color} />
            <div className="ml-auto flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setEditingId(c.id)}>
                <Pencil size={13} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(c.id)}>
                <Trash2 size={13} className="text-red-400" />
              </Button>
            </div>
          </div>
        )
      )}

      {adding ? (
        <CategoryForm onSubmit={handleAdd} onCancel={() => setAdding(false)} />
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setAdding(true)}>
          + 카테고리 추가
        </Button>
      )}
    </div>
  )
}
