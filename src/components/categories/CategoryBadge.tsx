interface CategoryBadgeProps {
  name: string
  color: string | null
}

export function CategoryBadge({ name, color }: CategoryBadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: color ?? '#9ca3af' }}
    >
      {name}
    </span>
  )
}
