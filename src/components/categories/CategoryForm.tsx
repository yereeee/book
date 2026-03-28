'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { Category } from '@/types'

interface CategoryFormProps {
  initial?: Category
  onSubmit: (name: string, color: string) => Promise<void>
  onCancel: () => void
}

export function CategoryForm({ initial, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [color, setColor] = useState(initial?.color ?? '#22c55e')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    await onSubmit(name.trim(), color)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        placeholder="카테고리 이름 (예: 소설)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <ColorPicker value={color} onChange={setColor} />
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>취소</Button>
        <Button type="submit" size="sm" disabled={loading}>
          {initial ? '수정' : '추가'}
        </Button>
      </div>
    </form>
  )
}
