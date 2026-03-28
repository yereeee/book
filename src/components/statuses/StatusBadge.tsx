interface StatusBadgeProps {
  name: string
  color: string | null
}

export function StatusBadge({ name, color }: StatusBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color ?? '#9ca3af' }}
      />
      {name}
    </span>
  )
}
