'use client'

import { LayoutGrid, List, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface ToolbarProps {
  search: string
  onSearchChange: (v: string) => void
  view: 'freeform' | 'list'
  onViewChange: (v: 'freeform' | 'list') => void
  onAddBook: () => void
}

export function Toolbar({ search, onSearchChange, view, onViewChange, onAddBook }: ToolbarProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50">
      <Input
        placeholder="제목, 저자 검색..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />

      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden ml-1">
        <button
          onClick={() => onViewChange('freeform')}
          className={`p-1.5 ${view === 'freeform' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          title="자유 배치"
        >
          <LayoutGrid size={16} />
        </button>
        <button
          onClick={() => onViewChange('list')}
          className={`p-1.5 ${view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          title="목록 보기"
        >
          <List size={16} />
        </button>
      </div>

      <div className="ml-auto">
        <Button size="sm" onClick={onAddBook}>
          <Plus size={14} className="mr-1" />
          도서 추가
        </Button>
      </div>
    </div>
  )
}
