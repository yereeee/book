interface SidebarSectionProps {
  title: string
  children: React.ReactNode
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="mb-4">
      <p className="px-2.5 mb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}
