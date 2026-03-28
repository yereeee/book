'use client'

import { cn } from '@/lib/utils'

interface SidebarItemProps {
  label: string
  dot?: string | null
  active?: boolean
  onClick?: () => void
  action?: React.ReactNode
}

export function SidebarItem({ label, dot, active, onClick, action }: SidebarItemProps) {
  return (
    <div
      className={cn(
        'group flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer select-none text-sm',
        active ? 'bg-blue-100 text-blue-800 font-medium' : 'text-gray-700 hover:bg-gray-100'
      )}
      onClick={onClick}
    >
      {dot ? (
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
      ) : (
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-gray-300" />
      )}
      <span className="flex-1 truncate">{label}</span>
      {action && (
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
          {action}
        </span>
      )}
    </div>
  )
}
