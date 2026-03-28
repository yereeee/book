'use client'

import { useState } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

interface BookDeleteDialogProps {
  open: boolean
  bookTitle: string
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function BookDeleteDialog({ open, bookTitle, onClose, onConfirm }: BookDeleteDialogProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await onConfirm()
    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} title="도서 삭제">
      <p className="text-sm text-gray-600 mb-6">
        <span className="font-medium text-gray-800">"{bookTitle}"</span>을(를) 삭제할까요?<br />
        이 작업은 되돌릴 수 없습니다.
      </p>
      <div className="flex gap-2 justify-end">
        <Button variant="secondary" onClick={onClose}>취소</Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? '삭제 중...' : '삭제'}
        </Button>
      </div>
    </Dialog>
  )
}
