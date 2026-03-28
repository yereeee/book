interface CategoryDotProps {
  name: string
  color: string | null
}

export function CategoryDot({ name, color }: CategoryDotProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color ?? '#9ca3af' }} />
      {name}
    </span>
  )
}
