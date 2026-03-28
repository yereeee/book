interface SidebarSectionProps {
  title: string
  children: React.ReactNode
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="mb-4">
      <p className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}
