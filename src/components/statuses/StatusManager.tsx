'use client'

import { useState } from 'react'
import { Status } from '@/types'
import { StatusBadge } from './StatusBadge'
import { StatusForm } from './StatusForm'
import { Button } from '@/components/ui/Button'
import { Pencil, Trash2 } from 'lucide-react'

interface StatusManagerProps {
  statuses: Status[]
  onChange: () => void
}

export function StatusManager({ statuses, onChange }: StatusManagerProps) {
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  async function handleAdd(name: string, color: string) {
    await fetch('/api/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    })
    setAdding(false)
    onChange()
  }

  async function handleEdit(id: string, name: string, color: string) {
    await fetch(`/api/statuses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    })
    setEditingId(null)
    onChange()
  }

  async function handleDelete(id: string) {
    if (!confirm('이 상태를 삭제하면 해당 상태가 지정된 도서에서 제거됩니다. 계속할까요?')) return
    await fetch(`/api/statuses/${id}`, { method: 'DELETE' })
    onChange()
  }

  return (
    <div className="space-y-2">
      {statuses.map((s) =>
        editingId === s.id ? (
          <StatusForm
            key={s.id}
            initial={s}
            onSubmit={(name, color) => handleEdit(s.id, name, color)}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div key={s.id} className="flex items-center gap-2 py-1">
            <StatusBadge name={s.name} color={s.color} />
            <div className="ml-auto flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setEditingId(s.id)}>
                <Pencil size={13} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}>
                <Trash2 size={13} className="text-red-400" />
              </Button>
            </div>
          </div>
        )
      )}

      {adding ? (
        <StatusForm onSubmit={handleAdd} onCancel={() => setAdding(false)} />
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setAdding(true)}>
          + 상태 추가
        </Button>
      )}
    </div>
  )
}
