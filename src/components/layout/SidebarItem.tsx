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
        'group flex items-center gap-2 px-2.5 py-1 rounded-md cursor-pointer select-none text-[13px]',
        active
          ? 'bg-[#0064D2] text-white font-medium'
          : 'text-[#3a3a3a] hover:bg-black/[0.07]'
      )}
      onClick={onClick}
    >
      {dot ? (
        <span className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" style={{ backgroundColor: dot }} />
      ) : (
        <span className="w-3 h-3 rounded-full flex-shrink-0 bg-gray-300" />
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
