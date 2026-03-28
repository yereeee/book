'use client'

import { SidebarSection } from './SidebarSection'
import { SidebarItem } from './SidebarItem'
import { Status, Category } from '@/types'

interface SidebarProps {
  statuses: Status[]
  categories: Category[]
  activeStatusId: string | null
  activeCategoryId: string | null
  onSelectStatus: (id: string | null) => void
  onSelectCategory: (id: string | null) => void
  onAddCategory: () => void
}

export function Sidebar({
  statuses,
  categories,
  activeStatusId,
  activeCategoryId,
  onSelectStatus,
  onSelectCategory,
  onAddCategory,
}: SidebarProps) {
  return (
    <aside className="w-52 flex-shrink-0 bg-gray-50 border-r border-gray-200 p-3 overflow-y-auto">
      <SidebarSection title="즐겨찾기">
        <SidebarItem
          label="전체"
          dot="#9ca3af"
          active={activeStatusId === null && activeCategoryId === null}
          onClick={() => { onSelectStatus(null); onSelectCategory(null) }}
        />
        {statuses.map((s) => (
          <SidebarItem
            key={s.id}
            label={s.name}
            dot={s.color}
            active={activeStatusId === s.id}
            onClick={() => { onSelectStatus(s.id); onSelectCategory(null) }}
          />
        ))}
      </SidebarSection>

      <SidebarSection title="태그">
        {categories.map((c) => (
          <SidebarItem
            key={c.id}
            label={c.name}
            dot={c.color}
            active={activeCategoryId === c.id}
            onClick={() => { onSelectCategory(c.id); onSelectStatus(null) }}
          />
        ))}
        <button
          onClick={onAddCategory}
          className="w-full text-left px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
        >
          + 태그 추가
        </button>
      </SidebarSection>
    </aside>
  )
}
