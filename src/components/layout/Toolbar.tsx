'use client'

import { LayoutGrid, List, Plus, Search } from 'lucide-react'

interface ToolbarProps {
  search: string
  onSearchChange: (v: string) => void
  view: 'freeform' | 'list'
  onViewChange: (v: 'freeform' | 'list') => void
  onAddBook: () => void
}

export function Toolbar({ search, onSearchChange, view, onViewChange, onAddBook }: ToolbarProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[#c8c8c8] bg-[#ececec]/90 backdrop-blur flex-shrink-0">
      {/* 세그먼트 뷰 전환 */}
      <div className="flex items-center bg-[#d8d8d8] rounded-md p-0.5 gap-0.5">
        <button
          onClick={() => onViewChange('freeform')}
          className={`p-1.5 rounded transition-all ${
            view === 'freeform'
              ? 'bg-white shadow-sm text-[#0064D2]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          title="자유 배치"
        >
          <LayoutGrid size={15} />
        </button>
        <button
          onClick={() => onViewChange('list')}
          className={`p-1.5 rounded transition-all ${
            view === 'list'
              ? 'bg-white shadow-sm text-[#0064D2]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          title="목록 보기"
        >
          <List size={15} />
        </button>
      </div>

      {/* 스포트라이트 스타일 검색창 */}
      <div className="relative flex-1 max-w-xs">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="제목, 저자 검색..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-7 pr-3 py-1 text-[13px] bg-white/70 border border-[#c8c8c8] rounded-full placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0064D2] focus:bg-white transition-colors"
        />
      </div>

      <div className="ml-auto">
        <button
          onClick={onAddBook}
          className="flex items-center gap-1 px-3 py-1 text-[13px] font-medium text-white bg-[#0064D2] hover:bg-[#0058c0] rounded-full transition-colors shadow-sm"
        >
          <Plus size={14} />
          추가
        </button>
      </div>
    </div>
  )
}
